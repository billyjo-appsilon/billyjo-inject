const { chromium } = require('playwright');

const ADMIN_USER = process.env.BILLYJO_ADMIN_USER || process.env.ADMIN1_USERNAME;
const ADMIN_PASS = process.env.BILLYJO_ADMIN_PASS || process.env.ADMIN1_PASSWORD;
const releaseHash = String(process.env.BILLYJO_NAVER_HASH || '').trim();

if (!ADMIN_USER || !ADMIN_PASS) {
  throw new Error('BILLYJO_ADMIN_USER/PASS or ADMIN1_USERNAME/ADMIN1_PASSWORD is required');
}
if (!/^[0-9a-f]{7,40}$/i.test(releaseHash)) {
  throw new Error('BILLYJO_NAVER_HASH must be a 7-40 character git hash');
}

const primary = `https://cdn.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@${releaseHash}/tracking/naver.js`;
const fallback = `https://fastly.jsdelivr.net/gh/billyjo-appsilon/billyjo-inject@${releaseHash}/tracking/naver.js`;
const snippet = `<script src="${primary}" async data-bj-naver-loader onerror="var s=document.createElement('script');s.src='${fallback}';s.dataset.bjNaverLoader='fallback';document.head.appendChild(s);"></script>`;

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
    const cleaned = before.replace(/<script\b[^>]*\bdata-bj-naver-loader\b[^>]*>[\s\S]*?<\/script>/gi, '');
    const after = snippet + cleaned;

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
    const verified = await page.evaluate((expected) => {
      const field = document.querySelector('textarea[name="logscript_base"]');
      const value = field ? field.value : '';
      return {
        exact: value === expected,
        naverLoaders: (value.match(/data-bj-naver-loader/g) || []).length,
        hasCommonKeyScript: value.includes('/tracking/naver.js'),
        length: value.length
      };
    }, after);
    if (!verified.exact || verified.naverLoaders !== 1 || !verified.hasCommonKeyScript) {
      throw new Error(`Naver logscript verification failed: ${JSON.stringify(verified)}`);
    }
    console.log(JSON.stringify({ beforeLength: before.length, afterLength: after.length, verified }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error && error.stack || error);
  process.exit(1);
});
