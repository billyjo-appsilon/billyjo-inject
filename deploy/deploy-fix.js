const { chromium } = require('playwright');
const fs = require('fs');

const ADMIN_USER = process.env.BILLYJO_ADMIN_USER;
const ADMIN_PASS = process.env.BILLYJO_ADMIN_PASS;
if (!ADMIN_USER || !ADMIN_PASS) {
  console.error('Set BILLYJO_ADMIN_USER and BILLYJO_ADMIN_PASS (e.g. node --env-file=.env deploy-fix.js)');
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const logscript = fs.readFileSync('current-logscript.html', 'utf8');
  console.log('Local file size:', logscript.length);

  // Login
  await page.goto('https://adminnew.rental-shop.net', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.fill('input[name="admin_userid"]', ADMIN_USER);
  await page.fill('input[name="admin_passwd"]', ADMIN_PASS);
  await page.evaluate(() => { if (typeof sendit === 'function') sendit(); });
  await page.waitForTimeout(3000);

  // Go to setup
  await page.goto('https://adminnew.rental-shop.net/html/basic/setup', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Set value directly via JavaScript (not page.fill which may truncate)
  // Pass content via page.evaluate with a single arg
  const setResult = await page.evaluate((content) => {
    var ta = document.querySelector('textarea[name="logscript_base"]');
    if (!ta) return { error: 'textarea not found' };
    ta.value = content;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.dispatchEvent(new Event('change', { bubbles: true }));
    return { set: ta.value.length, last50: ta.value.substring(ta.value.length - 50) };
  }, logscript);
  console.log('After setValue:', JSON.stringify(setResult));

  // Submit form
  await page.evaluate(() => {
    var form = document.querySelector('form');
    if (form) form.submit();
  });
  await page.waitForTimeout(5000);
  await page.waitForLoadState('networkidle').catch(() => {});

  // Verify by reloading
  await page.goto('https://adminnew.rental-shop.net/html/basic/setup', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const verify = await page.evaluate(() => {
    var ta = document.querySelector('textarea[name="logscript_base"]');
    if (!ta) return { error: 'not found' };
    return {
      len: ta.value.length,
      last100: ta.value.substring(ta.value.length - 100),
      hasLptEmpty: ta.value.includes('lpt-empty'),
      hasBottomBar: ta.value.includes('billyjo-bottom-bar'),
      hasFallback: ta.value.includes('Fallback'),
      has49d: ta.value.includes('49d134')
    };
  });
  console.log('Verified:', JSON.stringify(verify, null, 2));

  await browser.close();
})();
