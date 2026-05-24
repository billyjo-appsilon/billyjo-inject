const { chromium } = require('playwright');
const fs = require('fs');

var SAMPLES = ['1422', '292', '296', '945', '8009', '265', '3139', '202', '790', '5316'];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  var results = {};

  for (var pid of SAMPLES) {
    try {
      await page.goto('https://www.billyjo.co.kr/html/dh_prod/prod_view/' + pid, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(3000);

      var data = await page.evaluate(() => {
        // Basic info
        var name = (document.querySelector('.prod_name > b') || {}).textContent || '';
        var model = (document.querySelector('.prod_name .model_name small') || {}).textContent || '';
        var rentalType = ((document.querySelector('.prod_name .dh_orange') || {}).textContent || '').trim();
        // 브래드크럼브
        var crumb = Array.from(document.querySelectorAll('.location a, .breadcrumb a')).map(a => a.textContent.trim()).filter(Boolean).join(' > ');

        // prod_table_wrap 스펙
        var specs = {};
        Array.from(document.querySelectorAll('.prod_table_wrap tr')).forEach(tr => {
          var th = tr.querySelector('th');
          var td = tr.querySelector('td');
          if (th && td) specs[th.textContent.trim()] = td.textContent.trim();
        });

        // 가격 옵션
        var prices = Array.from(document.querySelectorAll('a[id*="_price_of_"][data-month][data-price]')).map(el => ({
          month: el.dataset.month, price: el.dataset.price,
          dcprice: el.dataset.dcprice, card_dis: el.dataset.card_dis,
          supname: el.dataset.supname, supcode: el.dataset.supcode,
        }));

        // 최저 가격
        var topMin = (document.querySelector('.top_min_price') || {}).innerText || '';
        var cardMinus = (document.querySelector('.top_min_price_minus_card') || {}).innerText || '';

        // 이미지 URL (대표)
        var imgEl = document.querySelector('#prod_img, .prod_thumb img, .image img');
        var imgUrl = imgEl ? imgEl.src : '';

        return { name, model, rentalType, crumb, specs, prices, topMin, cardMinus, imgUrl };
      });
      results[pid] = data;
      console.log(pid, '→', data.name.slice(0, 50), '(' + (data.prices.length) + ' price options)');
    } catch(e) {
      console.log(pid, 'ERR:', e.message.slice(0, 80));
      results[pid] = { error: e.message };
    }
  }
  fs.writeFileSync('/tmp/scraped-10.json', JSON.stringify(results, null, 2));
  console.log('saved /tmp/scraped-10.json');
  await browser.close();
})().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
