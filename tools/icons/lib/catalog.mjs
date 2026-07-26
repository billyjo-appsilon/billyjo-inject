// Lordicon 카탈로그 — 사이트가 자기 라이브러리 UI 를 그릴 때 쓰는 공개 엔드포인트를 그대로 쓴다.
// 인증도 API 토큰도 필요 없고, 프리뷰 SVG 도 공개다. 즉 "무엇이 있는지 찾고 눈으로 고르는" 단계는
// 로그인 없이 전부 가능하다. 로그인이 필요한 건 채택한 아이콘의 Lottie JSON 을 받을 때뿐이다.
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://lordicon.com';
const MEDIA = 'https://media.lordicon.com';

const HERE = path.dirname(new URL(import.meta.url).pathname);
export const CATALOG_FILE = path.join(HERE, '..', 'catalog.json');

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json();
}

/** 아이콘의 공개 프리뷰 SVG (정지 이미지). 컨택트시트용. */
export const previewUrl = (i) => `${MEDIA}/icons/${i.family}/${i.style}/${i.index}-${i.name}.svg`;

/** 아이콘 상세 페이지 (사람이 확인할 때) */
export const pageUrl = (i) => `${SITE}/icons/${i.family}/${i.style}/${i.index}-${i.name}`;

export const iconKey = (i) => `${i.family}/${i.style}/${i.index}-${i.name}`;

export const categories = (family, style) =>
  getJson(`${SITE}/api/library/sidebar?family=${family}&style=${style}`).then((j) => j.categories || []);

export const categoryIcons = (family, style, categoryId) =>
  getJson(`${SITE}/api/library/icons?family=${family}&style=${style}&categoryId=${categoryId}`);

/** 라이브 검색 (사이트 검색과 동일). 다중 단어는 잘 안 먹으니 단어 하나씩 쓰는 게 낫다. */
export const searchLive = (query, { family = 'wired', style = 'outline' } = {}) =>
  getJson(`${SITE}/api/library/search?query=${encodeURIComponent(query)}&family=${family}&style=${style}`);

/**
 * family/style 의 전 카테고리를 훑어 카탈로그를 만든다.
 * 같은 아이콘이 여러 카테고리에 걸치므로 id 로 합치고, 어느 카테고리에 속했는지 누적한다.
 */
export async function build(variants, { onProgress } = {}) {
  const byId = new Map();
  for (const { family, style } of variants) {
    const cats = await categories(family, style);
    for (const cat of cats) {
      let icons;
      try { icons = await categoryIcons(family, style, cat.id); }
      catch (e) { onProgress?.(`  ⚠ ${family}/${style} "${cat.title}" 실패: ${e.message}`); continue; }
      for (const ic of icons) {
        const key = `${ic.family}/${ic.style}/${ic.id}`;
        const prev = byId.get(key);
        if (prev) { if (!prev.categories.includes(cat.title)) prev.categories.push(cat.title); continue; }
        byId.set(key, {
          id: ic.id, family: ic.family, style: ic.style, index: ic.index,
          name: ic.name, title: ic.title, description: ic.description || '',
          premium: !!ic.premium, states: ic.states || 1, categories: [cat.title],
        });
      }
      onProgress?.(`  ${family}/${style} · ${cat.title.padEnd(22)} ${String(icons.length).padStart(4)}개  (누적 ${byId.size})`);
    }
  }
  const items = [...byId.values()].sort((a, b) => a.family.localeCompare(b.family)
    || a.style.localeCompare(b.style) || a.index - b.index);
  fs.writeFileSync(CATALOG_FILE, JSON.stringify({ builtAt: new Date().toISOString(), variants, items }, null, 0) + '\n');
  return items;
}

export function load() {
  if (!fs.existsSync(CATALOG_FILE)) return null;
  try { return JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8')); } catch { return null; }
}

const tokenize = (s) => String(s).toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 1);

/** 카탈로그 오프라인 검색. name/title/description/categories 를 모두 본다. */
export function search(catalog, query, { limit = 20, family, style, premium } = {}) {
  const qTokens = tokenize(query);
  const pool = catalog.items.filter((i) =>
    (!family || i.family === family) && (!style || i.style === style)
    && (premium === undefined || i.premium === premium));
  if (!qTokens.length) return pool.slice(0, limit);

  const scored = pool.map((i) => {
    const name = tokenize(i.name), title = tokenize(i.title);
    const cats = i.categories.flatMap(tokenize);
    const desc = tokenize(i.description);
    let score = 0;
    for (const t of qTokens) {
      if (name.includes(t)) score += 30;
      else if (name.some((n) => n.startsWith(t))) score += 18;
      if (title.includes(t)) score += 22;
      if (cats.includes(t)) score += 8;
      if (desc.includes(t)) score += 4;
    }
    if (i.name === qTokens.join('-')) score += 60;
    // 검색어를 전부 담은 항목 우대
    if (qTokens.every((t) => [...name, ...title, ...cats, ...desc].some((w) => w.startsWith(t)))) score += 20;
    return { ...i, score };
  });

  return scored.filter((i) => i.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit);
}

/** 프리뷰 SVG 를 받아 캐시에 저장 */
export async function fetchPreview(icon, cacheDir) {
  const file = path.join(cacheDir, `preview-${icon.family}-${icon.style}-${icon.index}-${icon.name}.svg`);
  if (fs.existsSync(file)) return file;
  const res = await fetch(previewUrl(icon));
  if (!res.ok) throw new Error(`프리뷰 실패 ${res.status}: ${previewUrl(icon)}`);
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}
