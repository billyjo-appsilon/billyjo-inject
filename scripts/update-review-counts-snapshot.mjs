#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const injectPath = path.join(root, 'inject.js');
const api = 'https://admin2-api.billyjo.co.kr/v1/reviews/counts';

function kstDate() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

const res = await fetch(api, { cache: 'no-store' });
if (!res.ok) throw new Error(`review counts HTTP ${res.status}`);
const json = await res.json();
if (!json || !json.by_model || !json.by_cat) throw new Error('invalid review counts payload');

const compact = JSON.stringify(json);
let src = fs.readFileSync(injectPath, 'utf8');
src = src.replace(
  /var PRELOADED_COUNTS_DATE = '[^']*';/,
  `var PRELOADED_COUNTS_DATE = '${kstDate()}';`
);
src = src.replace(
  /var PRELOADED_COUNTS = (?:null|\{[\s\S]*?\}); \/\/ scripts\/update-review-counts-snapshot\.mjs가 매일 최신값으로 채운다\./,
  `var PRELOADED_COUNTS = ${compact}; // scripts/update-review-counts-snapshot.mjs가 매일 최신값으로 채운다.`
);
fs.writeFileSync(injectPath, src);

console.log(`updated ${injectPath}`);
console.log(`models=${Object.keys(json.by_model).length} categories=${Object.keys(json.by_cat).length} bytes=${compact.length}`);
