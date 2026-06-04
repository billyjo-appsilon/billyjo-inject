const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  var existing = new Set(fs.readdirSync('/Users/appsilon/repos/billyJo/skin-css/works/cards/').map(f => f.replace('.html', '')));
  console.log('existing cards:', existing.size);

  // Find ALL prod_view links from various billyjo pages
  var sources = [
    'https://www.billyjo.co.kr/',
    'https://www.billyjo.co.kr/html/dh_prod/prod_list/1-8',     // 물·공기·청소가전 (구 정수기·환경)
    'https://www.billyjo.co.kr/html/dh_prod/prod_list/1-87',
    'https://www.billyjo.co.kr/html/dh_prod/prod_list/1-6',
    'https://www.billyjo.co.kr/html/dh_prod/prod_list/1-1232',
    'https://www.billyjo.co.kr/html/dh_prod/prod_list/1-203',
    'https://www.billyjo.co.kr/html/dh_prod/prod_list/1-7',
    'https://www.billyjo.co.kr/html/dh_prod/prod_list/1-374',
    'https://www.billyjo.co.kr/html/dh_prod/prod_list/1-9',
    'https://www.billyjo.co.kr/html/dh_prod/prod_list/1-532',
    'https://www.billyjo.co.kr/html/dh_prod/prod_list/1-1296',
  ];

  var allIds = new Set();
  for (var url of sources) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(500);
      // Also scroll to bottom to trigger lazy loading
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(800);
      var ids = await page.evaluate(() => Array.from(new Set(
        Array.from(document.querySelectorAll('a')).map(a => {
          var m = (a.getAttribute('href') || '').match(/prod_view\/(\d+)/);
          return m ? m[1] : null;
        }).filter(Boolean)
      )));
      ids.forEach(id => allIds.add(id));
      console.log(url + ' → ' + ids.length);
    } catch(e) { console.log(url, 'err'); }
  }
  console.log('total unique found:', allIds.size);
  var missing = Array.from(allIds).filter(id => !existing.has(id));
  console.log('missing (no card):', missing.length);
  if (missing.length > 0) {
    console.log('sample missing:', missing.slice(0, 20).join(', '));
    fs.writeFileSync('/tmp/missing-prods.json', JSON.stringify(missing));
  }
  await browser.close();
})().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
