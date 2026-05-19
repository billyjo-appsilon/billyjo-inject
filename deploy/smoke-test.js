const { chromium } = require('playwright');

(async () => {
  console.log('Launching Chromium...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Loading billyjo.kr...');
  await page.goto('https://billyjo.kr', { waitUntil: 'domcontentloaded', timeout: 30000 });
  const title = await page.title();
  const ua = await page.evaluate(() => navigator.userAgent);
  const injectLoaded = await page.evaluate(() => {
    return Array.from(document.scripts).some(s => s.src && s.src.includes('billyjo-inject'));
  });
  console.log(JSON.stringify({ title, ua: ua.slice(0, 80), injectLoaded }, null, 2));
  await browser.close();
  console.log('OK');
})().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
