// 로컬 Lordicon 라이브러리 — 웹 PRO 구독으로 배치 다운로드한 Lottie JSON 더미를 색인하고 검색한다.
// API 를 거치지 않으므로 레이트리밋·다운로드 과금·검증 절차가 전부 무관해진다.
import fs from 'node:fs';
import path from 'node:path';

const HERE = path.dirname(new URL(import.meta.url).pathname);
export const INDEX_FILE = path.join(HERE, '..', '.cache', 'library-index.json');

/** 라이브러리 위치: $LORDICON_LIBRARY > icons/library/ */
export function libraryPath(repoRoot) {
  return process.env.LORDICON_LIBRARY || path.join(repoRoot, 'icons', 'library');
}

function* walk(dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile() && e.name.toLowerCase().endsWith('.json')) yield p;
  }
}

const tokenize = (s) => String(s).toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 1);

/**
 * 라이브러리를 훑어 색인을 만든다.
 * Lordicon 배치 다운로드의 파일명/폴더 규칙이 플랜·시점마다 달라서, 경로와 JSON 의 nm 필드를
 * 둘 다 긁어 키워드로 합친다. 전량 JSON.parse 는 느리므로 앞부분만 정규식으로 읽는다.
 */
export function buildIndex(libDir) {
  const items = [];
  for (const file of walk(libDir)) {
    const rel = path.relative(libDir, file);
    const slug = path.basename(file, '.json').toLowerCase();
    const head = fs.readFileSync(file, 'utf8').slice(0, 4096);

    const nm = head.match(/"nm"\s*:\s*"([^"]{1,80})"/)?.[1] || '';
    const w = Number(head.match(/"w"\s*:\s*(\d+)/)?.[1] || 0);
    const h = Number(head.match(/"h"\s*:\s*(\d+)/)?.[1] || 0);
    const segs = path.dirname(rel).split(path.sep).filter((s) => s && s !== '.');

    // slug 는 스타일별로 중복된다(wired/outline/bar-chart 와 wired/flat/bar-chart).
    // 폴더 경로를 붙여 유일한 id 를 만든다.
    items.push({
      id: [...segs, slug].join('/'),
      slug,
      title: nm || slug.replace(/[-_]+/g, ' '),
      file,
      rel,
      groups: segs,
      size: [w, h],
      keywords: [...new Set([...tokenize(slug), ...tokenize(nm), ...segs.flatMap(tokenize)])],
    });
  }
  fs.mkdirSync(path.dirname(INDEX_FILE), { recursive: true });
  fs.writeFileSync(INDEX_FILE, JSON.stringify({ libDir, builtAt: new Date().toISOString(), items }));
  return items;
}

export function loadIndex() {
  if (!fs.existsSync(INDEX_FILE)) return null;
  try { return JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8')); } catch { return null; }
}

/** 색인 검색. 정확 slug > 토큰 일치 > 부분 문자열 순으로 점수를 준다. */
export function search(index, query, limit = 20) {
  const q = String(query).toLowerCase().trim();
  const qTokens = tokenize(q);
  if (!qTokens.length) return index.items.slice(0, limit);

  const scored = index.items.map((it) => {
    let score = 0;
    if (it.id === q) score += 200;
    if (it.slug === q) score += 100;
    if (it.slug.replace(/[-_]/g, ' ') === q) score += 90;
    for (const t of qTokens) {
      if (it.keywords.includes(t)) score += 20;
      else if (it.keywords.some((k) => k.startsWith(t))) score += 10;
      else if (it.slug.includes(t) || it.title.toLowerCase().includes(t)) score += 5;
    }
    // 검색어 토큰을 모두 담은 항목을 위로
    if (qTokens.every((t) => it.keywords.some((k) => k.startsWith(t)))) score += 25;
    return { ...it, score };
  });

  return scored.filter((i) => i.score > 0).sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug)).slice(0, limit);
}
