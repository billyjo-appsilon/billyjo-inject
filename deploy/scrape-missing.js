const { chromium } = require('playwright');
const fs = require('fs');
const missing = JSON.parse(fs.readFileSync('/tmp/missing-prods.json', 'utf-8'));
(async () => {
  const browser = await chromium.launch({ headless: true });
  // load existing batch + extend
  var existing = {};
  if (fs.existsSync('/tmp/scraped-batch.json')) existing = JSON.parse(fs.readFileSync('/tmp/scraped-batch.json', 'utf-8'));

  async function scrape(page, pid) {
    try {
      await page.goto('https://www.billyjo.co.kr/html/dh_prod/prod_view/' + pid, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1500);
      return await page.evaluate(() => {
        var name = (document.querySelector('.prod_name > b') || {}).textContent || '';
        var model = (document.querySelector('.prod_name .model_name small') || {}).textContent || '';
        var rentalType = ((document.querySelector('.prod_name .dh_orange') || {}).textContent || '').trim();
        var crumb = '';
        var specs = {};
        Array.from(document.querySelectorAll('.prod_table_wrap tr')).forEach(tr => {
          var th = tr.querySelector('th'), td = tr.querySelector('td');
          if (th && td) specs[th.textContent.trim()] = td.textContent.trim();
        });
        var prices = Array.from(document.querySelectorAll('a[id*="_price_of_"][data-month][data-price]')).map(el => ({
          month: el.dataset.month, price: el.dataset.price,
          dcprice: el.dataset.dcprice, card_dis: el.dataset.card_dis,
          supname: el.dataset.supname, supcode: el.dataset.supcode,
        }));
        var topMin = (document.querySelector('.top_min_price') || {}).innerText || '';
        var cardMinus = (document.querySelector('.top_min_price_minus_card') || {}).innerText || '';
        return { name, model, rentalType, crumb, specs, prices, topMin, cardMinus };
      });
    } catch (e) { return { error: e.message.slice(0, 100) }; }
  }
  // parallel 4
  var ctx1 = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  var ctx2 = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  var ctx3 = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  var ctx4 = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  var pages = [await ctx1.newPage(), await ctx2.newPage(), await ctx3.newPage(), await ctx4.newPage()];
  var idx = 0;
  async function worker(p) {
    while (idx < missing.length) {
      var i = idx++;
      var pid = missing[i];
      var d = await scrape(p, pid);
      existing[pid] = d;
      console.log(pid, '→', (d.name || d.error || '').slice(0, 50));
    }
  }
  await Promise.all(pages.map(worker));
  fs.writeFileSync('/tmp/scraped-batch.json', JSON.stringify(existing));
  console.log('updated /tmp/scraped-batch.json: total', Object.keys(existing).length);
  await browser.close();
})().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
