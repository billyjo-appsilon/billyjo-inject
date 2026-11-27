import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root, 'inject.js'), 'utf8');
const block = source.match(/var PRODUCTS = \[([\s\S]*?)\n  \];\n  var TIERS/);

test('all home card products use normalized versioned PNG cutouts', () => {
  assert.ok(block, 'home PRODUCTS block exists');
  const images = [...block[1].matchAll(/image:\s*'([^']+)'/g)].map((match) => match[1]);
  assert.equal(images.length, 24);
  assert.equal(new Set(images).size, 24);
  for (const image of images) {
    assert.match(image, /-normalized-v2\.png$/);
    assert.ok(fs.existsSync(path.join(root, image)), image);
  }
});

test('home cards expose model keys for live review hydration', () => {
  assert.match(source, /data-bj-review-model/);
  assert.match(source, /\/v1\/reviews\/counts/);
  assert.doesNotMatch(source, /:\s*'후기 보기'/);
});
