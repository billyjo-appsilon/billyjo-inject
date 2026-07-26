#!/usr/bin/env node
// bjicon — 빌리조 Lordicon 파이프라인.
// 에이전트(Claude/Codex)가 사람 개입 없이 아이콘을 고르고, 테마를 입히고, 코드에 넣기 위한 CLI.
// 사용법은 tools/icons/AGENT.md 참고.
import fs from 'node:fs';
import path from 'node:path';
import * as api from './lib/api.mjs';
import { recolor, collectColors, findWatermark, scaleStroke } from './lib/color.mjs';
import { renderSheet, sheetToGif, sheetToApng, sheetToPoster, contactSheet, lottieContactSheet } from './lib/raster.mjs';
import * as lib from './lib/library.mjs';
import * as cat from './lib/catalog.mjs';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const REPO = path.resolve(HERE, '..', '..');
const DIR = {
  src: path.join(REPO, 'icons', 'src'),
  lottie: path.join(REPO, 'icons', 'lottie'),
  raster: path.join(REPO, 'icons', 'raster'),
  cache: path.join(HERE, '.cache'),
};
const MANIFEST = path.join(REPO, 'icons', 'manifest.json');
const PALETTE = JSON.parse(fs.readFileSync(path.join(HERE, 'palette.json'), 'utf8'));
const ALL_THEMES = Object.keys(PALETTE.themes);

for (const d of Object.values(DIR)) fs.mkdirSync(d, { recursive: true });

const readManifest = () =>
  fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : { icons: {} };
const writeManifest = (m) => fs.writeFileSync(MANIFEST, JSON.stringify(m, null, 2) + '\n');
const today = () => new Date().toISOString().slice(0, 10);

// ── 인자 파싱 ────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const cmd = argv.shift();
const flags = {};
const positional = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) {
    const key = argv[i].slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) flags[key] = true;
    else { flags[key] = next; i++; }
  } else positional.push(argv[i]);
}
const themesFromFlag = () =>
  flags.themes === undefined ? ALL_THEMES
    : String(flags.themes).split(',').map((t) => t.trim()).filter(Boolean);

// ── 명령 ─────────────────────────────────────────────────────────────────────

async function cmdVariants() {
  const rows = await api.variants();
  console.log('family/style               free   premium');
  for (const v of rows) {
    console.log(`${(v.family + '/' + v.style).padEnd(26)} ${String(v.free).padStart(5)}  ${String(v.premium).padStart(8)}`);
  }
}

/** 미검증(Demo) 앱은 34개 안팎의 샌드박스만 노출한다. 조용히 넘어가면 오진하기 쉬우니 경고한다. */
async function warnIfDemo() {
  const inv = await api.inventory();
  if (!inv.verified) {
    console.warn(`  ⚠ 이 API 앱은 미검증(Demo) 상태입니다 — 접근 가능한 아이콘 ${inv.items.length}개(PRO ${inv.premium}개)뿐이고`);
    console.warn(`    search 도 동작하지 않습니다. 전체 라이브러리는 로컬 라이브러리 모드를 쓰세요 (AGENT.md 참고).\n`);
  }
  return inv;
}

async function cmdSearch() {
  const q = positional.join(' ');
  const inv = await warnIfDemo();
  if (!q) {
    console.log(`접근 가능한 아이콘 ${inv.items.length}건\n`);
    for (const it of inv.items) console.log(`${api.iconId(it).padEnd(24)} ${it.premium ? 'PRO ' : 'FREE'}  ${it.title}`);
    return;
  }
  const { items, total } = await api.icons({
    search: q,
    family: flags.family,
    style: flags.style,
    per_page: Number(flags.limit || 30),
  });
  console.log(`"${q}" — ${items.length}건 표시 / 전체 ${total}건\n`);
  for (const it of items) {
    console.log(`${api.iconId(it).padEnd(24)} ${it.premium ? 'PRO ' : 'FREE'}  ${it.title}`);
  }
  console.log(`\n→ 눈으로 고르려면: bjicon pick "${q}"${flags.family ? ` --family ${flags.family}` : ''}`);
}

/** 검색 → 프리뷰 다운로드 → 라벨 격자 PNG. 에이전트가 이 PNG 를 Read 해서 고른다. */
async function cmdPick() {
  const q = positional.join(' ');
  const limit = Number(flags.limit || 20);

  // 카탈로그(공개 메타 + 공개 프리뷰 SVG)가 있으면 그게 1순위 — 로그인·토큰 모두 불필요.
  const c = flags.api || flags.library ? null : cat.load();
  if (c?.items?.length) {
    const hits = cat.search(c, q, { limit, family: flags.family, style: flags.style });
    if (!hits.length) return console.log(`"${q}" 카탈로그 검색 결과 없음. (bjicon find --live "${q}" 로 재확인)`);
    const cards = [];
    for (const h of hits) {
      try { cards.push({ label: `${h.index}-${h.name}${h.premium ? ' · PRO' : ''}`, file: await cat.fetchPreview(h, DIR.cache) }); }
      catch (e) { console.warn(`  ⚠ ${cat.iconKey(h)} 프리뷰 실패: ${e.message}`); }
    }
    const out = path.join(DIR.cache, `pick-${(q || 'all').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`);
    await contactSheet(cards, out, { cols: Number(flags.cols || 5) });
    console.log(`후보 ${cards.length}개 (카탈로그 ${c.items.length}개 중)\n`);
    hits.forEach((h, i) => console.log(`  ${String(i + 1).padStart(2)}. ${cat.iconKey(h).padEnd(42)} ${h.title}`));
    console.log(`\n컨택트시트: ${out}`);
    console.log(`→ 이 PNG 를 Read 로 열어보고 고른 뒤: bjicon add <family/style/index-name> --as <이름>`);
    return;
  }

  // 로컬 라이브러리(배치 다운로드본)가 색인되어 있으면 차선.
  const idx = flags.api ? null : lib.loadIndex();
  if (idx?.items?.length) {
    const hits = lib.search(idx, q, limit);
    if (!hits.length) return console.log(`"${q}" 라이브러리 검색 결과 없음. (bjicon find 로 확인)`);
    const cards = hits.map((h) => ({ label: `${h.id}`, json: JSON.parse(fs.readFileSync(h.file, 'utf8')) }));
    const out = path.join(DIR.cache, `pick-${(q || 'all').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`);
    await lottieContactSheet(cards, out, { cols: Number(flags.cols || 5) });
    console.log(`후보 ${hits.length}개 (로컬 라이브러리 ${idx.items.length}개 중)\n`);
    hits.forEach((h, i) => console.log(`  ${String(i + 1).padStart(2)}. ${h.id.padEnd(38)} ${h.title}`));
    console.log(`\n컨택트시트: ${out}`);
    console.log(`→ 이 PNG 를 Read 로 열어보고 고른 뒤: bjicon add <slug> --as <이름>`);
    return;
  }

  let items, total;
  if (q) {
    ({ items, total } = await api.icons({ search: q, family: flags.family, style: flags.style, per_page: limit }));
  } else {
    const inv = await warnIfDemo();
    items = inv.items.filter((i) =>
      (!flags.family || i.family === flags.family) && (!flags.style || i.style === flags.style)).slice(0, limit);
    total = items.length;
  }
  if (!items.length) return console.log(`"${q}" 검색 결과 없음.`);

  const files = [];
  for (const it of items) {
    const url = it.files?.preview || it.files?.svg;
    if (!url) continue;
    const ext = url.includes('.svg') ? 'svg' : url.includes('.gif') ? 'gif' : 'png';
    const f = path.join(DIR.cache, `preview-${it.family}-${it.style}-${it.index}.${ext}`);
    fs.writeFileSync(f, await api.fetchFile(url));
    files.push({ label: `${api.iconId(it)}\n${it.title}`, file: f });
  }

  const out = path.join(DIR.cache, `pick-${q.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`);
  await contactSheet(files, out, { cols: Number(flags.cols || 5) });
  console.log(`후보 ${files.length}개 / 전체 ${total}건`);
  console.log(`\n컨택트시트: ${out}`);
  console.log(`→ 이 PNG 를 Read 로 열어보고 고른 뒤: bjicon add <family/style/index> --as <이름>`);
}

async function cmdAdd() {
  const id = positional[0];
  const name = flags.as;
  if (!id || !name) throw new Error('사용법: bjicon add <slug | family/style/index> --as <이름> [--themes brand,admin-light]');
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error('이름은 소문자·숫자·하이픈만 (예: consult-call)');

  // 로컬 라이브러리를 먼저 본다. 못 찾고 family/style/<숫자> 꼴이면 API 로 간다.
  const isApiId = /^[^/]+\/[^/]+\/\d+$/.test(id);
  const idx = lib.loadIndex();
  const hit = idx?.items?.length
    ? (idx.items.find((i) => i.id === id.toLowerCase())
      || (() => {
        const bySlug = idx.items.filter((i) => i.slug === id.toLowerCase());
        if (bySlug.length > 1) {
          throw new Error(`slug "${id}" 가 ${bySlug.length}건 중복됩니다. 전체 id 로 지정하세요:\n  ` +
            bySlug.map((i) => i.id).join('\n  '));
        }
        return bySlug[0];
      })())
    : null;

  let raw, source;
  if (hit) {
    raw = JSON.parse(fs.readFileSync(hit.file, 'utf8'));
    source = { origin: 'library', id: hit.id, title: hit.title, rel: hit.rel };
    console.log(`라이브러리에서: ${hit.id} — ${hit.title}`);
  } else if (!isApiId) {
    throw new Error(`라이브러리에서 찾을 수 없습니다: ${id}\n  bjicon find "<검색어>" 로 정확한 id 를 확인하세요.`);
  } else {
    const { family, style, index } = api.parseIconId(id);
    const { items } = await api.icons({ family, style, index, per_page: 5 });
    const icon = items.find((i) => i.index === index);
    if (!icon) throw new Error(`아이콘을 찾을 수 없습니다: ${id}`);
    if (!icon.files?.json) {
      throw new Error(`이 아이콘의 json 링크가 없습니다 — 현재 플랜에 포함되지 않은 아이콘입니다: ${id} (${icon.title})`);
    }
    raw = JSON.parse((await api.fetchFile(icon.files.json)).toString('utf8'));
    source = { origin: 'api', family, style, index, name: icon.name, title: icon.title, premium: !!icon.premium };
  }
  const wm = findWatermark(raw);
  if (wm.length) console.warn(`  ⚠ watermark 레이어 감지: ${wm.join(', ')} — PRO 경로로 받은 파일이 맞는지 확인하세요.`);

  fs.writeFileSync(path.join(DIR.src, `${name}.json`), JSON.stringify(raw));
  console.log(`원본 저장: icons/src/${name}.json  (${raw.w}×${raw.h}, ${Math.round(raw.op)}f @${raw.fr}fps)`);

  const themes = themesFromFlag();
  const unmappedAll = new Map();
  for (const theme of themes) {
    if (!PALETTE.themes[theme]) throw new Error(`알 수 없는 테마 "${theme}" (가능: ${ALL_THEMES.join(', ')})`);
    const { json, applied, unmapped } = recolor(raw, PALETTE.roles, PALETTE.themes[theme]);
    // 테마가 _stroke 배율을 지정하면 스트로크 두께까지 맞춘다 (기존 아이콘과 시각적 무게 정합)
    const sf = Number(flags.stroke) || PALETTE.themes[theme]._stroke || 1;
    const { json: finalJson, changed } = scaleStroke(json, sf);
    fs.writeFileSync(path.join(DIR.lottie, `${name}.${theme}.json`), JSON.stringify(finalJson));
    for (const [k, v] of unmapped) unmappedAll.set(k, v);
    console.log(`  ${theme.padEnd(12)} ${[...applied.keys()].join(', ') || '(치환 없음)'}${sf !== 1 ? `  · stroke ×${sf} (${changed}곳)` : ''}`);
  }
  if (unmappedAll.size) {
    console.warn(`\n  ⚠ 팔레트에 없는 색: ${[...unmappedAll.entries()].map(([h, c]) => `${h}×${c}`).join(', ')}`);
    console.warn(`    원본 색 그대로 남았습니다. tools/icons/palette.json 의 roles 에 추가하고 다시 add 하세요.`);
  }

  // 라이선스 의무: API 로 받은 건 embed 시점에 다운로드를 보고해야 한다.
  // 라이브러리(웹 PRO 배치 다운로드)본은 이미 웹에서 집계되었으므로 보고 대상이 아니다.
  if (source.origin === 'api') {
    try {
      await api.trackDownload({ family: source.family, style: source.style, index: source.index });
    } catch (e) {
      console.warn(`  ⚠ 다운로드 트래킹 실패(라이선스 의무): ${e.message}`);
    }
  }

  const m = readManifest();
  m.icons[name] = {
    source,
    themes,
    addedAt: today(),
    usedIn: m.icons[name]?.usedIn || [],
  };
  writeManifest(m);
  console.log(`\n등록 완료: "${name}" → icons/manifest.json`);
  console.log(`→ 래스터가 필요하면: bjicon render ${name} --gif --poster`);
}

// ── 카탈로그 (공개 엔드포인트 · 로그인 불필요) ───────────────────────────────

const DEFAULT_VARIANTS = [{ family: 'wired', style: 'outline' }];

function variantsFromFlags() {
  if (!flags.family && !flags.style) return DEFAULT_VARIANTS;
  return [{ family: flags.family || 'wired', style: flags.style || 'outline' }];
}

async function cmdCatalog() {
  const variants = flags.all
    ? [['wired', 'outline'], ['wired', 'flat'], ['wired', 'lineal'], ['wired', 'gradient'],
       ['system', 'regular'], ['system', 'solid']].map(([family, style]) => ({ family, style }))
    : variantsFromFlags();
  console.log(`카탈로그 수집: ${variants.map((v) => v.family + '/' + v.style).join(', ')}\n`);
  const items = await cat.build(variants, { onProgress: (m) => console.log(m) });
  const pro = items.filter((i) => i.premium).length;
  console.log(`\n완료: ${items.length}개 (PRO ${pro} / FREE ${items.length - pro}) → ${path.relative(REPO, cat.CATALOG_FILE)}`);
}

function requireCatalog() {
  const c = cat.load();
  if (!c?.items?.length) throw new Error('카탈로그가 없습니다. 먼저 `bjicon catalog` 를 실행하세요.');
  return c;
}

// ── 로컬 라이브러리 (웹 PRO 배치 다운로드본, 선택 사항) ──────────────────────

function cmdIndex() {
  const dir = flags.library || lib.libraryPath(REPO);
  if (!fs.existsSync(dir)) {
    throw new Error(
      `라이브러리 폴더가 없습니다: ${dir}\n` +
      `  lordicon.com(웹 PRO)에서 Lottie JSON 을 배치 다운로드해 이 경로에 풀거나,\n` +
      `  다른 위치를 쓰려면 --library <경로> 또는 $LORDICON_LIBRARY 로 지정하세요.`
    );
  }
  const items = lib.buildIndex(dir);
  console.log(`색인 완료: ${items.length}개  ← ${dir}`);
  const groups = new Map();
  for (const it of items) groups.set(it.groups.join('/') || '(루트)', (groups.get(it.groups.join('/') || '(루트)') || 0) + 1);
  for (const [g, n] of [...groups].sort((a, b) => b[1] - a[1]).slice(0, 15)) console.log(`  ${g.padEnd(30)} ${n}`);
  if (!items.length) console.warn('  ⚠ JSON 을 하나도 찾지 못했습니다. 폴더 구조를 확인하세요.');
}

function requireIndex() {
  const idx = lib.loadIndex();
  if (!idx?.items?.length) throw new Error('로컬 라이브러리 색인이 없습니다. 먼저 `bjicon index` 를 실행하세요.');
  return idx;
}

async function cmdFind() {
  const q = positional.join(' ');
  // --live 는 사이트 검색을 그대로 친다 (카탈로그가 아직 없거나 최신 아이콘을 볼 때).
  if (flags.live) {
    const hits = await cat.searchLive(q, { family: flags.family || 'wired', style: flags.style || 'outline' });
    console.log(`"${q}" (라이브) — ${hits.length}건\n`);
    for (const h of hits.slice(0, Number(flags.limit || 25))) {
      console.log(`${cat.iconKey(h).padEnd(42)} ${h.premium ? 'PRO ' : 'FREE'}  ${h.title}`);
    }
    return;
  }
  const c = requireCatalog();
  const hits = cat.search(c, q, {
    limit: Number(flags.limit || 25), family: flags.family, style: flags.style,
  });
  console.log(`"${q}" — ${hits.length}건 / 카탈로그 ${c.items.length}개\n`);
  for (const h of hits) {
    console.log(`${cat.iconKey(h).padEnd(42)} ${h.premium ? 'PRO ' : 'FREE'} ${String(h.score).padStart(3)}  ${h.title}`);
    if (flags.desc && h.description) console.log(`${''.padEnd(42)}      ${h.description.slice(0, 90)}`);
  }
  if (hits.length) console.log(`\n→ 눈으로 고르려면: bjicon pick "${q}"`);
}

function loadThemed(name, theme) {
  const f = path.join(DIR.lottie, `${name}.${theme}.json`);
  if (!fs.existsSync(f)) throw new Error(`없는 아이콘/테마: ${name}.${theme} — bjicon list 로 확인`);
  return JSON.parse(fs.readFileSync(f, 'utf8'));
}

async function cmdRender() {
  const name = positional[0];
  if (!name) throw new Error('사용법: bjicon render <이름> [--theme brand] [--gif] [--apng] [--poster] [--size 200] [--fps 25]');
  const theme = flags.theme || 'brand';
  const size = Number(flags.size || 200);
  const fps = Number(flags.fps || 25);
  const wantAll = !flags.gif && !flags.apng && !flags.poster;

  const json = loadThemed(name, theme);
  console.log(`렌더 중 (${theme}, ${size}px, ${fps}fps)…`);
  const sheet = await renderSheet(json, {
    cell: Math.max(size, 200), fps,
    bg: typeof flags.bg === 'string' ? flags.bg : null,
    state: typeof flags.state === 'string' ? flags.state : null,
  });
  const seg = sheet.segment;
  console.log(`  구간 "${seg.name || '(마커 없음)'}" ${seg.from}–${seg.to}f → ${sheet.count}장, ${sheet.cols}×${sheet.rows} 스프라이트`);
  if (seg.states.length > 1) console.log(`  다른 state: ${seg.states.filter((s) => s !== seg.name).join(', ')}  (--state 로 지정)`);

  const base = path.join(DIR.raster, `${name}.${theme}`);
  const made = [];
  if (flags.gif || wantAll) made.push(sheetToGif(sheet, `${base}.gif`, { size, transparent: !flags.bg }));
  if (flags.apng || wantAll) made.push(sheetToApng(sheet, `${base}.apng.png`, { size }));
  if (flags.poster || wantAll) made.push(sheetToPoster(sheet, `${base}.poster.png`, { size, at: flags.at || 'last' }));

  for (const f of made) console.log(`  ${path.relative(REPO, f)}  ${(fs.statSync(f).size / 1024).toFixed(0)}KB`);
}

function cmdList() {
  const m = readManifest();
  const names = Object.keys(m.icons);
  if (!names.length) return console.log('등록된 아이콘이 없습니다. bjicon pick "<검색어>" 부터 시작하세요.');
  console.log(`등록 아이콘 ${names.length}개\n`);
  for (const n of names) {
    const i = m.icons[n];
    const src = i.source.origin === 'library' ? i.source.id : `${i.source.family}/${i.source.style}/${i.source.index}`;
    console.log(`${n.padEnd(20)} ${String(src).padEnd(30)} [${i.themes.join(',')}]`);
    console.log(`${''.padEnd(20)} ${i.source.title}${i.usedIn.length ? ' — 사용처: ' + i.usedIn.join(', ') : ' — 미사용'}`);
  }
}

function cmdColors() {
  const name = positional[0];
  if (!name) throw new Error('사용법: bjicon colors <이름>');
  const f = path.join(DIR.src, `${name}.json`);
  if (!fs.existsSync(f)) throw new Error(`원본이 없습니다: icons/src/${name}.json`);
  const counts = collectColors(JSON.parse(fs.readFileSync(f, 'utf8')));
  console.log(`${name} 원본 색상:`);
  for (const [hex, n] of [...counts].sort((a, b) => b[1] - a[1])) {
    const role = PALETTE.roles[hex];
    console.log(`  ${hex} ×${String(n).padStart(3)}  ${role ? '→ ' + role : hex === '#000000' ? '(검정: 마스크 가능성, 미변경)' : '⚠ 미매핑'}`);
  }
}

function cmdUse() {
  const [name, where] = positional;
  if (!name || !where) throw new Error('사용법: bjicon use <이름> "<사용처 설명>"');
  const m = readManifest();
  if (!m.icons[name]) throw new Error(`등록되지 않은 아이콘: ${name}`);
  if (!m.icons[name].usedIn.includes(where)) m.icons[name].usedIn.push(where);
  writeManifest(m);
  console.log(`${name} 사용처 기록: ${where}`);
}

const COMMANDS = {
  catalog: cmdCatalog, index: cmdIndex, find: cmdFind,
  variants: cmdVariants, search: cmdSearch, pick: cmdPick, add: cmdAdd,
  render: cmdRender, list: cmdList, colors: cmdColors, use: cmdUse,
};

const run = COMMANDS[cmd];
if (!run) {
  console.log(`bjicon — 빌리조 Lordicon 파이프라인

 [로컬 라이브러리]  웹 PRO 배치 다운로드본. 전량 접근·오프라인·과금 무관 → 기본 경로.
  index  [--library <경로>]                   라이브러리 색인 (최초 1회, 갱신 시 재실행)
  find   <검색어> [--limit 25]                오프라인 검색
  pick   <검색어> [--limit 20] [--cols 5]     후보 컨택트시트 PNG (눈으로 고르기)
  add    <slug> --as <이름> [--themes ...]    원본+테마본 저장, 매니페스트 등록

 [Lordicon API]  미검증 앱은 34개 데모만 보인다. --api 로 강제.
  variants                                   family/style 목록
  search <검색어> [--family] [--style]        API 검색
  add    <family/style/index> --as <이름>     API 경유 등록 (+ 다운로드 트래킹)

 [공통]
  render <이름> [--theme] [--gif|--apng|--poster]   래스터 출력
  colors <이름>                               원본 색 인벤토리 (팔레트 확장용)
  list                                        등록 아이콘
  use    <이름> "<사용처>"                     사용처 기록

자세한 워크플로: tools/icons/AGENT.md`);
  process.exit(cmd ? 1 : 0);
}

const fail = (e) => { console.error(`\n✗ ${e.message}`); process.exit(1); };
try {
  const result = run();
  if (result && typeof result.catch === 'function') result.catch(fail);
} catch (e) { fail(e); }
