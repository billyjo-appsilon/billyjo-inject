#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const injectPath = path.join(root, 'inject.js');
const sheetBase = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub';
const gids = [
  644793625, 872567753, 940661926, 713090459, 1642392826, 72673581, 1353739758,
];

function kstDate() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (c === ',' && !quoted) {
      row.push(field.trim());
      field = '';
    } else if (c === '\n' && !quoted) {
      row.push(field.trim());
      rows.push(row);
      row = [];
      field = '';
    } else if (c !== '\r') {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field.trim());
    rows.push(row);
  }
  return rows;
}

function num(value) {
  return parseInt(String(value || '').replace(/[^0-9]/g, ''), 10) || 0;
}

function modelKey(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/["']/g, '')
    .replace(/_[^ ]*$/g, '')
    .replace(/[(/].*$/g, '')
    .trim();
}

const byModel = {};

for (const gid of gids) {
  const url = `${sheetBase}?gid=${gid}&single=true&output=csv`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`price sheet ${gid} HTTP ${res.status}`);
  const rows = parseCsv(await res.text());
  let model = '';
  let marketingName = '';

  for (const row of rows) {
    if (!row || row[0] === '제품군') continue;
    if (row[2]) model = row[2];
    if (row[1]) marketingName = row[1];
    if (!model || !row[3]) continue;

    const promo = (row[4] || '').trim();
    const warrantyTransfer = num(row[9]);
    if (!warrantyTransfer || promo.indexOf('타사보상') === -1) continue;

    const key = modelKey(model);
    const reward = Math.max(warrantyTransfer - 10000, 0);
    if (!key || reward <= 0) continue;

    if (!byModel[key] || reward < byModel[key].reward) {
      byModel[key] = { reward, name: marketingName || model };
    }
  }
}

const payload = { ok: true, by_model: byModel };
const compact = JSON.stringify(payload);
let src = fs.readFileSync(injectPath, 'utf8');
src = src.replace(
  /var PRELOADED_PRICE_SNAPSHOT_DATE = '[^']*';/,
  `var PRELOADED_PRICE_SNAPSHOT_DATE = '${kstDate()}';`,
);
src = src.replace(
  /var PRELOADED_PRICE_SNAPSHOT = (?:null|\{[\s\S]*?\}); \/\/ scripts\/update-price-snapshot\.mjs가 매일 최신값으로 채운다\./,
  `var PRELOADED_PRICE_SNAPSHOT = ${compact}; // scripts/update-price-snapshot.mjs가 매일 최신값으로 채운다.`,
);
fs.writeFileSync(injectPath, src);

console.log(`updated ${injectPath}`);
console.log(`models=${Object.keys(byModel).length} bytes=${compact.length}`);
