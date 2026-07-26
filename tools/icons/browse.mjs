#!/usr/bin/env node
// browse — 사용자가 직접 로그인해 둔 Chrome 에 CDP 로 붙어 조작하는 최소 드라이버.
// 쿠키를 꺼내거나 비밀번호를 다루지 않는다. 사람이 로그인한 세션을 그대로 이어 쓴다.
//
// 사전에 별도 프로필 Chrome 을 띄워야 한다 (Chrome 136+ 는 기본 프로필에서 원격 디버깅을 막는다):
//   open -na "Google Chrome" --args --remote-debugging-port=9222 --user-data-dir="$HOME/.chrome-bjicon"
import fs from 'node:fs';
import path from 'node:path';
import { attach, openPage, goto, evaluate, shoot, setDownloadDir, sleep } from './lib/chrome.mjs';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const REPO = path.resolve(HERE, '..', '..');

const argv = process.argv.slice(2);
const cmd = argv.shift();
const flags = {};
const pos = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) {
    const k = argv[i].slice(2), n = argv[i + 1];
    if (n === undefined || n.startsWith('--')) flags[k] = true; else { flags[k] = n; i++; }
  } else pos.push(argv[i]);
}
const PORT = Number(flags.port || 9222);

const show = (v) => console.log(typeof v === 'string' ? v : JSON.stringify(v, null, 2));

const COMMANDS = {
  async status(conn, page) {
    show(await evaluate(page, `({url: location.href, title: document.title,
      text: document.body ? document.body.innerText.slice(0, 600) : ''})`));
  },

  async open(conn, page) {
    const url = pos[0];
    if (!url) throw new Error('사용법: browse open <url>');
    await goto(page, url, { waitMs: Number(flags.wait || 3000) });
    show(await evaluate(page, `({url: location.href, title: document.title})`));
  },

  async eval(conn, page) {
    const src = pos.join(' ');
    if (!src) throw new Error("사용법: browse eval '<자바스크립트>'");
    show(await evaluate(page, src));
  },

  async shot(conn, page) {
    const out = pos[0] || path.join(HERE, '.cache', 'shot.png');
    await shoot(page, out, { fullPage: !!flags.full });
    console.log(out);
  },

  async dl(conn) {
    const dir = path.resolve(pos[0] || path.join(REPO, 'icons', 'library', '_downloads'));
    await setDownloadDir(conn, dir);
    console.log(`다운로드 경로 설정: ${dir}`);
  },

  /** 다운로드가 끝날 때까지 폴더 크기가 안정되기를 기다린다 (.crdownload 소멸 기준) */
  async wait(conn) {
    const dir = path.resolve(pos[0] || path.join(REPO, 'icons', 'library', '_downloads'));
    const limitMs = Number(flags.timeout || 300) * 1000;
    const deadline = Date.now() + limitMs;
    let stable = 0, prev = -1;
    while (Date.now() < deadline) {
      await sleep(2000);
      const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
      const pending = files.filter((f) => f.endsWith('.crdownload')).length;
      const total = files.filter((f) => !f.endsWith('.crdownload')).length;
      if (pending === 0 && total === prev) stable++; else stable = 0;
      prev = total;
      process.stdout.write(`\r  완료 ${total}개 / 진행중 ${pending}개  `);
      if (pending === 0 && stable >= 2 && total > 0) break;
    }
    console.log(`\n다운로드 정지: ${prev}개 — ${dir}`);
  },
};

const run = COMMANDS[cmd];
if (!run) {
  console.log(`browse — 로그인된 Chrome 에 붙어 조작하는 CDP 드라이버

  사전: open -na "Google Chrome" --args --remote-debugging-port=9222 --user-data-dir="$HOME/.chrome-bjicon"

  status                     현재 탭의 URL/제목/본문 앞부분
  open   <url> [--wait ms]   이동
  eval   '<js>'              페이지에서 JS 실행 (await 가능)
  shot   [out] [--full]      스크린샷
  dl     [dir]               다운로드 저장 폴더 지정
  wait   [dir] [--timeout s] 다운로드 완료 대기
  --port 9222                디버깅 포트`);
  process.exit(cmd ? 1 : 0);
}

try {
  const conn = await attach(PORT);
  const page = await openPage(conn);
  await run(conn, page);
  conn.close();
} catch (e) {
  console.error(`\n✗ ${e.message}`);
  process.exit(1);
}
