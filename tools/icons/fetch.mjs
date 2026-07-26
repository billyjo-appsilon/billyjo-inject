#!/usr/bin/env node
// fetch — 로그인된 Lordicon 세션에서 지정 아이콘의 Lottie JSON 을 받아 icons/library/ 에 넣는다.
// 정식 Export UI 만 사용한다 (.li 우회 없음).
//
//   사전: open -na "Google Chrome" --args --remote-debugging-port=9222 --user-data-dir="$HOME/.chrome-bjicon"
//         그 창에서 lordicon.com 에 PRO 계정으로 로그인되어 있어야 한다.
//
//   node tools/icons/fetch.mjs wired/outline/463-headset-customer-support wired/outline/412-gift
//   node tools/icons/fetch.mjs --from picks.txt [--raw]
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { attach, openPage, evaluate, sleep } from './lib/chrome.mjs';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const REPO = path.resolve(HERE, '..', '..');
const LIB = path.join(REPO, 'icons', 'library');
const SYS_DOWNLOADS = path.join(os.homedir(), 'Downloads');

const BOOL_FLAGS = new Set(['raw', 'force']);   // 값을 받지 않는 플래그 — 뒤 인자를 삼키면 안 된다
const argv = process.argv.slice(2);
const flags = {};
const ids = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) {
    const k = argv[i].slice(2), n = argv[i + 1];
    if (BOOL_FLAGS.has(k) || n === undefined || n.startsWith('--')) flags[k] = true;
    else { flags[k] = n; i++; }
  } else ids.push(argv[i]);
}
if (flags.from) {
  ids.push(...fs.readFileSync(flags.from, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')));
}
if (!ids.length) {
  console.log(`사용법: node tools/icons/fetch.mjs <family/style/index-name> ...  [--from list.txt] [--raw]
  예: node tools/icons/fetch.mjs wired/outline/463-headset-customer-support`);
  process.exit(1);
}

/** shadow DOM 관통 deep 쿼리 후 실제 마우스 클릭 (커스텀 엘리먼트는 합성 click 이 안 먹는 경우가 있다) */
async function clickDeep(page, matcher, label) {
  const rect = await evaluate(page, `(() => {
    const match = ${matcher};
    const walk = (root, d) => {
      if (d > 10) return null;
      for (const el of root.querySelectorAll('*')) {
        if (match(el)) return el;
        if (el.shadowRoot) { const r = walk(el.shadowRoot, d + 1); if (r) return r; }
      }
      return null;
    };
    const el = walk(document, 0);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    return JSON.stringify({ x: r.x + r.width / 2, y: r.y + r.height / 2 });
  })()`);
  if (!rect) throw new Error(`${label} 요소를 찾지 못했습니다`);
  const { x, y } = JSON.parse(rect);
  for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) {
    await page.cmd('Input.dispatchMouseEvent', {
      type, x, y, button: 'left',
      clickCount: type === 'mouseMoved' ? 0 : 1,
      buttons: type === 'mousePressed' ? 1 : 0,
    });
    await sleep(120);
  }
}

/** SPA 라 요소가 늦게 붙는다. 몇 번 다시 시도한다. */
async function retry(fn, attempts = 4, waitMs = 1800) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); } catch (e) { last = e; await sleep(waitMs); }
  }
  throw last;
}

const snapshot = (dir) => new Set(fs.existsSync(dir) ? fs.readdirSync(dir) : []);

/** 다운로드 폴더 두 곳(지정 폴더 + 시스템 기본)에서 새 .json 이 나타나길 기다린다 */
async function waitForNew(dirs, before, timeoutMs = 45000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await sleep(700);
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) continue;
      for (const f of fs.readdirSync(dir)) {
        if (before[dir]?.has(f) || !f.endsWith('.json')) continue;
        const full = path.join(dir, f);
        if (fs.statSync(full).size > 0) { await sleep(400); return full; }
      }
    }
  }
  return null;
}

const conn = await attach(9222);
const page = await openPage(conn);

// 로그인 확인 — 미로그인 상태로 돌리면 무료 아이콘만 받히거나 워터마크가 박힌다
const authed = await evaluate(page, `!document.querySelector('a[href*="/login"]')`);
if (!authed) {
  console.error('✗ lordicon.com 에 로그인되어 있지 않습니다. 브라우저에서 로그인 후 다시 실행하세요.');
  conn.close(); process.exit(1);
}

fs.mkdirSync(LIB, { recursive: true });
await conn.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: LIB, eventsEnabled: true });

const results = [];
for (const id of ids) {
  const m = id.match(/^([^/]+)\/([^/]+)\/(.+)$/);
  if (!m) { results.push({ id, ok: false, why: 'id 형식 오류 (family/style/index-name)' }); continue; }
  const [, family, style, slug] = m;
  const dest = path.join(LIB, `${family}-${style}-${slug}.json`);

  if (fs.existsSync(dest) && !flags.force) {
    results.push({ id, ok: true, why: '이미 있음(건너뜀)', file: dest });
    console.log(`· ${id} — 이미 있음`);
    continue;
  }

  try {
    const dirs = [LIB, SYS_DOWNLOADS];
    const before = Object.fromEntries(dirs.map((d) => [d, snapshot(d)]));

    await page.cmd('Page.navigate', { url: `https://lordicon.com/icons/${family}/${style}/${slug}` });
    await sleep(5000);

    // 이전 아이콘에서 열린 다이얼로그가 남아 있으면 Export 를 가린다
    for (const type of ['keyDown', 'keyUp']) {
      await page.cmd('Input.dispatchKeyEvent', { type, key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    }
    await sleep(600);

    // 로그인 상태에 따라 버튼 라벨이 "Export Lottie"(로그인) / "Export"(비로그인)로 갈린다.
    await retry(() => clickDeep(page,
      `(el => /^Export( Lottie)?$/.test((el.innerText||'').trim()) && el.children.length <= 2)`, 'Export'));
    await sleep(1500);

    // "Export" 였다면 포맷 선택 모달이 뜬다. "Export Lottie" 면 이 단계가 없다.
    try { await clickDeep(page, `(el => (el.innerText||'').trim() === 'Lottie' && el.children.length === 0)`, 'Lottie'); await sleep(1500); }
    catch { /* 포맷 모달 없음 — 정상 */ }

    if (flags.raw) {
      try { await clickDeep(page, `(el => (el.innerText||'').trim() === 'Raw' && el.children.length === 0)`, 'Raw'); await sleep(800); }
      catch { console.warn(`  ⚠ ${id}: Raw 선택 실패 — Default 로 진행`); }
    }
    await retry(() => clickDeep(page,
      `(el => el.tagName.toLowerCase() === 'li-button' && /^download$/i.test((el.innerText||'').trim()))`, 'Download'), 3, 1200);

    const got = await waitForNew(dirs, before);
    if (!got) throw new Error('다운로드 파일이 나타나지 않음(권한/한도 확인)');

    fs.renameSync(got, dest);
    const j = JSON.parse(fs.readFileSync(dest, 'utf8'));
    const wm = (j.layers || []).some((l) => /watermark|lordicon\.com/i.test(l.nm || ''));
    results.push({ id, ok: true, file: dest, size: fs.statSync(dest).size, watermark: wm });
    console.log(`✓ ${id}  ${(fs.statSync(dest).size / 1024).toFixed(0)}KB${wm ? '  ⚠ watermark!' : ''}`);
  } catch (e) {
    results.push({ id, ok: false, why: e.message });
    console.log(`✗ ${id} — ${e.message}`);
  }
}

conn.close();
const ok = results.filter((r) => r.ok).length;
console.log(`\n완료: ${ok}/${ids.length}  → ${path.relative(REPO, LIB)}`);
if (results.some((r) => r.watermark)) console.log('⚠ watermark 가 박힌 파일이 있습니다 — 로그인 상태를 확인하고 재수급하세요.');
if (ok) console.log('다음: node tools/icons/bjicon.mjs index');
