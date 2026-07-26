// 헤드리스 Chrome 스크린샷 — CDP(DevTools Protocol) 직결.
// Chrome 150 에서 `--screenshot` 숏컷 플래그가 응답하지 않아 CDP 로 붙는다.
// Node 24 내장 WebSocket/fetch 만 사용 → npm 의존성 0.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
];

export const findChrome = () => CANDIDATES.find((p) => fs.existsSync(p));

function launch(profileDir) {
  const bin = findChrome();
  if (!bin) throw new Error(`Chrome/Chromium 을 찾지 못했습니다. 래스터 출력에는 브라우저가 필요합니다.\n확인 경로:\n  ${CANDIDATES.join('\n  ')}`);

  const proc = spawn(bin, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
    '--no-default-browser-check', '--disable-extensions', '--disable-crash-reporter',
    '--disable-background-networking', '--use-mock-keychain', '--password-store=basic',
    '--force-device-scale-factor=1', '--hide-scrollbars',
    `--user-data-dir=${profileDir}`, '--remote-debugging-port=0', 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  return new Promise((resolve, reject) => {
    let buf = '';
    const timer = setTimeout(() => reject(new Error('Chrome 기동 타임아웃(30s)')), 30000);
    proc.stderr.on('data', (d) => {
      buf += d.toString();
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) { clearTimeout(timer); resolve({ proc, browserWs: m[1] }); }
    });
    proc.on('exit', (code) => { clearTimeout(timer); reject(new Error(`Chrome 종료(code ${code})\n${buf.slice(0, 500)}`)); });
  });
}

export function connect(url) {
  const ws = new WebSocket(url);
  const pending = new Map();
  let nextId = 0;

  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    const p = pending.get(msg.id);
    if (!p) return;
    pending.delete(msg.id);
    msg.error ? p.reject(new Error(`CDP ${msg.error.message}`)) : p.resolve(msg.result);
  });

  const ready = new Promise((res, rej) => {
    ws.addEventListener('open', res, { once: true });
    ws.addEventListener('error', () => rej(new Error('CDP 연결 실패')), { once: true });
  });

  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });

  return { ready, send, close: () => ws.close() };
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * 이미 떠 있는 Chrome(--remote-debugging-port)에 붙는다.
 * 사용자가 직접 로그인한 세션을 그대로 조작하기 위한 경로 — 쿠키를 꺼내오지 않는다.
 */
export async function attach(port = 9222) {
  const res = await fetch(`http://127.0.0.1:${port}/json/version`).catch(() => null);
  if (!res?.ok) {
    throw new Error(
      `127.0.0.1:${port} 에서 Chrome 을 찾지 못했습니다.\n` +
      `  아래 명령으로 별도 프로필 Chrome 을 띄운 뒤 다시 실행하세요:\n` +
      `  open -na "Google Chrome" --args --remote-debugging-port=${port} --user-data-dir="$HOME/.chrome-bjicon"`
    );
  }
  const { webSocketDebuggerUrl } = await res.json();
  const conn = connect(webSocketDebuggerUrl);
  await conn.ready;
  return conn;
}

/** 붙은 브라우저에서 페이지 세션 하나를 연다 (기존 탭 재사용 또는 신규 생성) */
export async function openPage(conn, { reuse = true } = {}) {
  let targetId;
  if (reuse) {
    const { targetInfos } = await conn.send('Target.getTargets');
    targetId = targetInfos.find((t) => t.type === 'page' && !t.url.startsWith('devtools://'))?.targetId;
  }
  if (!targetId) ({ targetId } = await conn.send('Target.createTarget', { url: 'about:blank' }));
  const { sessionId } = await conn.send('Target.attachToTarget', { targetId, flatten: true });
  const cmd = (m, p) => conn.send(m, p, sessionId);
  await cmd('Page.enable');
  await cmd('Runtime.enable');
  return { targetId, sessionId, cmd };
}

/** 페이지 이동 + 네트워크가 잠잠해질 때까지 대기 */
export async function goto(page, url, { waitMs = 2500 } = {}) {
  await page.cmd('Page.navigate', { url });
  await sleep(waitMs);
  return evaluate(page, 'location.href');
}

/** 페이지 컨텍스트에서 JS 실행 (await 지원) */
export async function evaluate(page, expression) {
  const r = await page.cmd('Runtime.evaluate', {
    expression, returnByValue: true, awaitPromise: true, allowUnsafeEvalBlockedByCSP: true,
  });
  if (r.exceptionDetails) throw new Error(`페이지 JS 오류: ${r.exceptionDetails.text} ${r.exceptionDetails.exception?.description || ''}`);
  return r.result?.value;
}

/** 현재 뷰포트 스크린샷 (에이전트가 눈으로 확인하기 위한 용도) */
export async function shoot(page, out, { fullPage = false } = {}) {
  const params = { format: 'png' };
  if (fullPage) {
    const m = await page.cmd('Page.getLayoutMetrics');
    const { width, height } = m.cssContentSize || m.contentSize;
    Object.assign(params, { captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: Math.min(height, 8000), scale: 1 } });
  }
  const { data } = await page.cmd('Page.captureScreenshot', params);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(data, 'base64'));
  return out;
}

/** 이 브라우저의 다운로드를 지정 폴더로 받도록 설정 */
export async function setDownloadDir(conn, dir) {
  fs.mkdirSync(dir, { recursive: true });
  await conn.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: dir, eventsEnabled: true });
  return dir;
}

/**
 * HTML 문자열을 렌더해 PNG 로 저장한다.
 * 페이지가 document.title 을 waitForTitle 로 바꾸면 렌더 완료로 간주한다.
 */
export async function screenshot({ html, out, width, height, waitForTitle = 'READY', timeoutMs = 60000 }) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bjicon-chrome-'));
  const page = path.join(dir, 'page.html');
  fs.writeFileSync(page, html);

  let proc, cdp;
  try {
    ({ proc, browserWs: cdp } = await launch(path.join(dir, 'profile')));
    const conn = connect(cdp);
    await conn.ready;

    const { targetId } = await conn.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await conn.send('Target.attachToTarget', { targetId, flatten: true });
    const cmd = (m, p) => conn.send(m, p, sessionId);

    await cmd('Page.enable');
    await cmd('Runtime.enable');
    await cmd('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    await cmd('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
    await cmd('Page.navigate', { url: `file://${page}` });

    const deadline = Date.now() + timeoutMs;
    let title = '';
    while (Date.now() < deadline) {
      await sleep(200);
      const r = await cmd('Runtime.evaluate', { expression: 'document.title', returnByValue: true });
      title = r?.result?.value || '';
      if (title === waitForTitle) break;
      if (title.startsWith('ERROR:')) throw new Error(`렌더 페이지 오류: ${title.slice(6)}`);
    }
    if (title !== waitForTitle) throw new Error(`렌더 완료 신호(${waitForTitle}) 대기 타임아웃 — 마지막 title="${title}"`);

    const { data } = await cmd('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      clip: { x: 0, y: 0, width, height, scale: 1 },
    });
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, Buffer.from(data, 'base64'));

    conn.close();
    return out;
  } finally {
    // Chrome 이 프로필 디렉터리에 쓰는 중에 지우면 ENOTEMPTY 로 실패한다.
    // 종료를 기다린 뒤 재시도하고, 정리 실패가 성공한 스크린샷을 가리지 않게 한다.
    if (proc) {
      const exited = new Promise((r) => proc.once('exit', r));
      proc.kill('SIGKILL');
      await Promise.race([exited, sleep(3000)]);
    }
    try {
      fs.rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 150 });
    } catch { /* 임시 디렉터리 잔여물은 OS 가 정리한다 */ }
  }
}
