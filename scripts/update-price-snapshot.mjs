#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const injectPath = path.join(root, 'inject.js');
const sheetBase = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub';
const pubHtml = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pubhtml';

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

function findHeader(rows) {
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i] || [];
    const normalized = row.map((cell) => String(cell || '').replace(/\s+/g, ''));
    const modelIdx = normalized.findIndex((cell) => cell === '제품명');
    const rewardIdx = normalized.findIndex((cell) => cell === '타사보상렌탈료');
    if (modelIdx !== -1 && rewardIdx !== -1) {
      return {
        rowIndex: i,
        nameIdx: normalized.findIndex((cell) => cell === '마케팅네임'),
        modelIdx,
        termIdx: normalized.findIndex((cell) => cell === '약정기간'),
        rewardIdx,
      };
    }
  }
  return null;
}

function addModel(entryMap, key, reward, name) {
  if (!key || reward <= 0 || !/[0-9]/.test(key)) return;
  if (!entryMap[key] || reward < entryMap[key].reward) {
    entryMap[key] = { reward, name };
  }
}

function aliasKeys(key) {
  const out = [];
  const compact = key.replace(/\s+/g, '');
  if (compact !== key) out.push(compact);
  const oneLetterSuffix = compact.match(/^(.+[0-9])[A-Z]$/);
  if (oneLetterSuffix && oneLetterSuffix[1].length >= 5) out.push(oneLetterSuffix[1]);
  return Array.from(new Set(out)).filter((alias) => alias && alias !== key);
}

async function discoverGids() {
  const res = await fetch(pubHtml, { cache: 'no-store' });
  if (!res.ok) throw new Error(`published sheet html HTTP ${res.status}`);
  const html = await res.text();
  return Array.from(new Set(Array.from(html.matchAll(/gid=(\d+)/g)).map((m) => Number(m[1]))));
}

const byModel = {};
const gids = await discoverGids();
let parsedSheets = 0;
let parsedRows = 0;

for (const gid of gids) {
  const url = `${sheetBase}?gid=${gid}&single=true&output=csv`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`price sheet ${gid} HTTP ${res.status}`);
  const rows = parseCsv(await res.text());
  const header = findHeader(rows);
  if (!header) continue;
  parsedSheets += 1;
  let model = '';
  let marketingName = '';

  for (let rowIndex = header.rowIndex + 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];
    if (!row) continue;
    if (row[header.modelIdx]) model = row[header.modelIdx];
    if (header.nameIdx !== -1 && row[header.nameIdx]) marketingName = row[header.nameIdx];
    if (!model || (header.termIdx !== -1 && !row[header.termIdx])) continue;

    const warrantyTransfer = num(row[header.rewardIdx]);
    if (!warrantyTransfer) continue;

    const key = modelKey(model);
    const reward = Math.max(warrantyTransfer - 10000, 0);
    const name = marketingName || model;
    addModel(byModel, key, reward, name);
    aliasKeys(key).forEach((alias) => addModel(byModel, alias, reward, name));
    parsedRows += 1;
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
console.log(`gids=${gids.length} parsed_sheets=${parsedSheets} rows=${parsedRows} models=${Object.keys(byModel).length} bytes=${compact.length}`);
