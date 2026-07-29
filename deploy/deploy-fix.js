const { chromium } = require('playwright');
const fs = require('fs');

// admin1(adminnew.rental-shop.net) 로그인 정보.
// 원래는 이 폴더의 .env(BILLYJO_ADMIN_USER/PASS)를 썼는데, 2026-07-28 원본 클론
// (~/repos/billyJo/skin-css)이 아카이브되면서 gitignore 대상인 .env 가 함께 사라졌다.
// 같은 계정이 admin2_backend/.env 에 ADMIN1_USERNAME/ADMIN1_PASSWORD 로 이미 있으므로
// 그 이름도 받는다 — 시크릿 사본을 하나 더 만들지 않기 위해서다. 실행 예:
//   node --env-file=/Users/appsilon/repos/jaden/billyjo_admin2/admin2_backend/.env deploy-fix.js
const ADMIN_USER = process.env.BILLYJO_ADMIN_USER || process.env.ADMIN1_USERNAME;
const ADMIN_PASS = process.env.BILLYJO_ADMIN_PASS || process.env.ADMIN1_PASSWORD;
if (!ADMIN_USER || !ADMIN_PASS) {
  console.error('자격증명 없음 — BILLYJO_ADMIN_USER/PASS 또는 ADMIN1_USERNAME/ADMIN1_PASSWORD 필요.');
  console.error('예: node --env-file=/Users/appsilon/repos/jaden/billyjo_admin2/admin2_backend/.env deploy-fix.js');
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  function ensureGtmSnippet(content) {
    if (content.includes('GTM-W32HD9CG') || content.includes('googletagmanager.com/gtm.js')) {
      return content;
    }
    const gtm = `<script>window.BILLYJO_GTM_ID='GTM-W32HD9CG';(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-W32HD9CG');</script>`;
    return gtm + content;
  }

  const logscript = ensureGtmSnippet(fs.readFileSync('current-logscript.html', 'utf8'));
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
      has49d: ta.value.includes('49d134'),
      hasGtm: ta.value.includes('GTM-W32HD9CG') || ta.value.includes('googletagmanager.com/gtm.js')
    };
  });
  console.log('Verified:', JSON.stringify(verify, null, 2));

  await browser.close();
})();
