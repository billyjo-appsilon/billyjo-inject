import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('/Users/appsilon/repos/jaden/billyjo-inject/deploy/node_modules/playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('home product cards render normalized cutouts and truthful review states', async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [320, 390, 430, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 1200 } });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.route(/billyjo-inject@[^/]+\/inject(?:\.min)?\.js/, async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: fs.readFileSync(path.join(root, 'inject.js')) });
      });
      await page.route(/billyjo-inject@[^/]+\/images\//, async (route) => {
        const decoded = decodeURIComponent(new URL(route.request().url()).pathname);
        const relative = decoded.slice(decoded.indexOf('/images/') + 1);
        const local = path.join(root, relative);
        if (!fs.existsSync(local)) return route.continue();
        await route.fulfill({ status: 200, contentType: 'image/png', body: fs.readFileSync(local) });
      });
      await page.goto('https://billyjo.co.kr/', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForSelector('#bj-home-gift-promos .bj-hgp-card', { timeout: 60000 });
      await page.waitForFunction(() => !Array.from(document.querySelectorAll('#bj-home-gift-promos [data-bj-review-model]')).some((node) => /확인중/.test(node.textContent || '')), null, { timeout: 20000 });
      const result = await page.evaluate(() => {
        const section = document.querySelector('#bj-home-gift-promos');
        const cards = Array.from(section.querySelectorAll('.bj-hgp-card'));
        const images = cards.map((card) => card.querySelector('.bj-hgp-image img'));
        const reviews = Array.from(section.querySelectorAll('[data-bj-review-model]'));
        const byModel = Object.fromEntries(reviews.map((node) => [node.dataset.bjReviewModel, node.textContent.trim()]));
        const imageRects = Object.fromEntries(cards.map((card) => {
          const model = card.querySelector('[data-bj-review-model]')?.dataset.bjReviewModel;
          const rect = card.querySelector('.bj-hgp-image img')?.getBoundingClientRect();
          return [model, rect && { left: rect.left, top: rect.top, width: rect.width, height: rect.height }];
        }));
        return {
          count: cards.length,
          uniqueModels: new Set(reviews.map((node) => node.dataset.bjReviewModel)).size,
          broken: images.filter((image) => !image || !image.complete || !image.naturalWidth).length,
          nonNormalized: images.filter((image) => !/-normalized-v2\.png(?:[?#]|$)/.test(image.currentSrc || image.src)).map((image) => image.currentSrc || image.src),
          badReviewText: reviews.filter((node) => /후기 보기|확인중/.test(node.textContent || '')).map((node) => node.textContent),
          offCenterImages: images.filter((image) => getComputedStyle(image).objectPosition !== '50% 50%').map((image) => getComputedStyle(image).objectPosition),
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
          byModel,
          imageRects,
        };
      });
      assert.equal(result.count, 26, `${width}px card instances`);
      assert.equal(result.uniqueModels, 24, `${width}px unique models`);
      assert.equal(result.broken, 0, `${width}px broken images`);
      assert.deepEqual(result.nonNormalized, [], `${width}px non-normalized image`);
      assert.deepEqual(result.badReviewText, [], `${width}px stale review state`);
      assert.deepEqual(result.offCenterImages, [], `${width}px off-center image`);
      assert.equal(result.overflow, false, `${width}px horizontal overflow`);
      assert.match(result.byModel['WI-37C90720N'], /후기 173/);
      assert.match(result.byModel['WP-50C90621N'], /후기 149/);
      assert.equal(result.imageRects['WI-37C90720N'].height, result.imageRects['WP-50C90621N'].height);
      assert.equal(result.imageRects['WI-37C90720N'].width, result.imageRects['WP-50C90621N'].width);
      assert.deepEqual(errors, [], `${width}px page errors`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}, { timeout: 180000 });
