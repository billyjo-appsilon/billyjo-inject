const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..');
const injectSource = fs.readFileSync(path.join(root, 'inject.js'), 'utf8');
const logoDir = path.join(root, 'images', 'brands');
const productDir = path.join(root, 'images', 'products', 'cutout-20261121');
const screenshotDir = String(process.env.BILLYJO_LOGO_SCREENSHOT_DIR || '').trim();
const expectedBrands = [
  'LG전자',
  '루헨스',
  '삼성',
  '세스코',
  '웰스',
  '청호나이스',
  '코웨이',
  '쿠쿠',
  '현대렌탈케어',
].sort((a, b) => a.localeCompare(b, 'ko'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function routeLocalAssets(page) {
  await page.route(/cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject(?:@[^/]+)?\/inject(?:\.min)?\.js/, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: injectSource });
  });
  await page.route('**/images/brands/*.png', async (route) => {
    const file = path.basename(new URL(route.request().url()).pathname);
    const local = path.join(logoDir, file);
    if (!fs.existsSync(local)) return route.continue();
    await route.fulfill({ status: 200, contentType: 'image/png', body: fs.readFileSync(local) });
  });
  await page.route('**/images/products/cutout-20261121/*', async (route) => {
    const file = path.basename(new URL(route.request().url()).pathname);
    const local = path.join(productDir, file);
    if (!fs.existsSync(local)) return route.continue();
    await route.fulfill({
      status: 200,
      contentType: path.extname(file).toLowerCase() === '.webp' ? 'image/webp' : 'image/png',
      body: fs.readFileSync(local),
    });
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const width of [320, 390, 430, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      await routeLocalAssets(page);
      await page.goto('https://billyjo.co.kr/', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForSelector('#bj-home-gift-promos .bj-hgp-brand-logo', { timeout: 30000 });
      for (const band of await page.locator('#bj-home-gift-promos .bj-hgp-band').all()) {
        await band.scrollIntoViewIfNeeded();
      }
      await page.waitForFunction(() => {
        const logos = [...document.querySelectorAll('#bj-home-gift-promos .bj-hgp-brand-logo')];
        return logos.length === 26 && logos.every((logo) => logo.complete && logo.naturalWidth > 0 && logo.naturalHeight > 0);
      }, null, { timeout: 30000 });

      const result = await page.evaluate(() => {
        const logos = [...document.querySelectorAll('#bj-home-gift-promos .bj-hgp-brand-logo')];
        return {
          brands: [...new Set(logos.map((logo) => logo.alt.replace(/ 로고$/, '')))].sort((a, b) => a.localeCompare(b, 'ko')),
          failures: logos.map((logo) => {
            const imageStyle = getComputedStyle(logo);
            const wrapperStyle = getComputedStyle(logo.closest('.bj-hgp-brandmark'));
            return {
              alt: logo.alt,
              src: logo.src,
              loaded: logo.complete && logo.naturalWidth > 0 && logo.naturalHeight > 0,
              blend: imageStyle.mixBlendMode,
              imageBackground: imageStyle.backgroundColor,
              wrapperBackground: wrapperStyle.backgroundColor,
              wrapperShadow: wrapperStyle.boxShadow,
              clipped: logo.getBoundingClientRect().right > logo.closest('.bj-hgp-card').getBoundingClientRect().right + 1,
            };
          }).filter((item) => !item.loaded || item.blend !== 'normal' || item.imageBackground !== 'rgba(0, 0, 0, 0)' ||
            item.wrapperBackground !== 'rgba(0, 0, 0, 0)' || item.wrapperShadow !== 'none' || item.clipped),
          horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        };
      });

      assert(result.brands.join('|') === expectedBrands.join('|'), `${width}: active brand set mismatch (${result.brands.join('|')})`);
      assert(result.failures.length === 0, `${width}: logo rendering contract failed (${JSON.stringify(result.failures)})`);
      assert(!result.horizontalOverflow, `${width}: horizontal overflow`);

      if (screenshotDir) {
        fs.mkdirSync(screenshotDir, { recursive: true });
        await page.locator('#bj-home-gift-promos').screenshot({ path: path.join(screenshotDir, `brand-logos-${width}.png`) });
      }
      await page.close();
      console.log(`${width}: 9 brands, 26 loaded logos, transparent wrappers, overflow 0`);
    }
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
