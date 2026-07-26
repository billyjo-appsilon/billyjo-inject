// Lordicon 공식 API 클라이언트 (https://lordicon.com/docs/api/documentation)
// 토큰: 환경변수 LORDICON_TOKEN, 또는 ~/.config/billyjo/lordicon.token
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const BASE = 'https://api.lordicon.com';
const TOKEN_FILE = path.join(os.homedir(), '.config', 'billyjo', 'lordicon.token');

export function getToken() {
  if (process.env.LORDICON_TOKEN) return process.env.LORDICON_TOKEN.trim();
  if (fs.existsSync(TOKEN_FILE)) return fs.readFileSync(TOKEN_FILE, 'utf8').trim();
  throw new Error(
    `Lordicon API 토큰이 없습니다.\n` +
    `  1) https://lordicon.com/account/api 에서 프로젝트 생성 후 토큰 발급\n` +
    `  2) mkdir -p ~/.config/billyjo && echo '<TOKEN>' > ${TOKEN_FILE} && chmod 600 ${TOKEN_FILE}`
  );
}

async function req(pathname, { method = 'GET', query, body } = {}) {
  const url = new URL(BASE + pathname);
  for (const [k, v] of Object.entries(query || {})) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const remaining = res.headers.get('x-ratelimit-remaining');
  if (remaining !== null && Number(remaining) < 20) {
    console.warn(`  ⚠ Lordicon API 잔여 요청 ${remaining}회 (reset ${res.headers.get('x-ratelimit-reset')}s)`);
  }
  if (res.status === 429) throw new Error('Lordicon API 레이트리밋(429). 잠시 후 재시도.');
  if (!res.ok) throw new Error(`Lordicon API ${res.status} ${res.statusText} — ${pathname}\n${await res.text()}`);

  return {
    data: res.status === 201 ? null : await res.json(),
    total: Number(res.headers.get('x-total-count') || 0),
  };
}

/** 사용 가능한 family/style 목록 + 무료/프리미엄 개수 */
export const variants = () => req('/v1/variants').then((r) => r.data);

/** 아이콘 검색. { family, style, search, premium, page, per_page(<=100) } */
export async function icons(params = {}) {
  const { data, total } = await req('/v1/icons', { query: { per_page: 40, ...params } });
  return { items: data, total };
}

/**
 * 앱이 실제로 접근 가능한 아이콘 전량.
 * 미검증 앱은 샌드박스 샘플만 보이므로, 카탈로그 규모로 검증 여부를 판별한다.
 */
export async function inventory() {
  const all = [];
  for (let page = 1; page <= 50; page++) {
    const { items } = await icons({ page, per_page: 100 });
    all.push(...items);
    if (items.length < 100) break;
  }
  return { items: all, verified: all.length > 200, premium: all.filter((i) => i.premium).length };
}

/** 라이선스 의무: 프로젝트에 실제로 embed 할 때 다운로드를 보고해야 한다. */
export const trackDownload = ({ family, style, index }) =>
  req('/v1/download/track', { method: 'POST', body: { family, style, index } });

/** API 가 주는 임시 링크로 실제 파일을 받는다 (json / svg / preview) */
export async function fetchFile(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`파일 다운로드 실패 ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

export const iconId = (i) => `${i.family}/${i.style}/${i.index}`;

export function parseIconId(id) {
  const [family, style, index] = String(id).split('/');
  if (!family || !style || !index) throw new Error(`잘못된 아이콘 ID: "${id}" (형식: family/style/index)`);
  return { family, style, index: Number(index) };
}
