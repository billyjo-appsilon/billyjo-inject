const { chromium } = require('playwright');

const ADMIN_USER = process.env.BILLYJO_ADMIN_USER || process.env.ADMIN1_USERNAME;
const ADMIN_PASS = process.env.BILLYJO_ADMIN_PASS || process.env.ADMIN1_PASSWORD;
const releaseHash = String(process.env.BILLYJO_INJECT_HASH || '').trim();

if (!ADMIN_USER || !ADMIN_PASS) {
  throw new Error('BILLYJO_ADMIN_USER/PASS or ADMIN1_USERNAME/ADMIN1_PASSWORD is required');
}
if (!/^[0-9a-f]{7,40}$/i.test(releaseHash)) {
  throw new Error('BILLYJO_INJECT_HASH must be a 7-40 character git hash');
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('https://adminnew.rental-shop.net', { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[name="admin_userid"]', ADMIN_USER);
    await page.fill('input[name="admin_passwd"]', ADMIN_PASS);
    await page.evaluate(() => { if (typeof sendit === 'function') sendit(); });
    await page.waitForTimeout(2500);
    await page.goto('https://adminnew.rental-shop.net/html/basic/setup', { waitUntil: 'networkidle', timeout: 30000 });

    const before = await page.evaluate(() => {
      const field = document.querySelector('textarea[name="logscript_base"]');
      if (!field) throw new Error('logscript_base not found');
      return field.value;
    });
    const pinsBefore = Array.from(before.matchAll(/billyjo-inject@([0-9a-f]{7,40})\/inject\.js/gi), (m) => m[1]);
    const naverLoadersBefore = (before.match(/data-bj-naver-loader/g) || []).length;
    if (!pinsBefore.length) throw new Error('inject.js pin not found in current admin logscript');

    const after = before.replace(
      /billyjo-inject@[0-9a-f]{7,40}\/inject\.js/gi,
      `billyjo-inject@${releaseHash}/inject.js`
    );
    await page.evaluate((content) => {
      const field = document.querySelector('textarea[name="logscript_base"]');
      field.value = content;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      const form = field.closest('form') || document.querySelector('form');
      if (!form) throw new Error('setup form not found');
      form.submit();
    }, after);
    await page.waitForTimeout(4000);
    await page.goto('https://adminnew.rental-shop.net/html/basic/setup', { waitUntil: 'networkidle', timeout: 30000 });

    const verified = await page.evaluate(({ expected, hash }) => {
      const field = document.querySelector('textarea[name="logscript_base"]');
      const value = field ? field.value : '';
      return {
        exact: value === expected,
        pins: Array.from(value.matchAll(/billyjo-inject@([0-9a-f]{7,40})\/inject\.js/gi), (m) => m[1]),
        hasGtm: value.includes('GTM-W32HD9CG'),
        naverLoaders: (value.match(/data-bj-naver-loader/g) || []).length,
        hasExpectedHash: value.includes(`billyjo-inject@${hash}/inject.js`),
        length: value.length
      };
    }, { expected: after, hash: releaseHash });
    if (!verified.exact || !verified.hasExpectedHash || !verified.hasGtm || verified.naverLoaders !== naverLoadersBefore) {
      throw new Error(`Inject pin verification failed: ${JSON.stringify(verified)}`);
    }
    console.log(JSON.stringify({ pinsBefore, naverLoadersBefore, verified }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error && error.stack || error);
  process.exit(1);
});
