/**
 * 빌리조 전제품(2544) 배치 스크레이퍼.
 * 4 병렬 페이지 + 증분 저장 (에러 시 재개 가능).
 *
 * 출력: /tmp/scraped-batch.json (prodNo → product data)
 * 진행 로그: /tmp/scraped-batch.log
 */

const { chromium } = require('playwright');
const fs = require('fs');

const CONCURRENCY = 4;
const CATALOG_FILE = '/tmp/billyjo-full-catalog.json';
const OUTPUT_FILE = '/tmp/scraped-batch.json';
const LOG_FILE = '/tmp/scraped-batch.log';

function log(msg) {
  var line = '[' + new Date().toISOString() + '] ' + msg;
  console.log(line);
  try { fs.appendFileSync(LOG_FILE, line + '\n'); } catch(e){}
}

(async () => {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf-8'));
  const allIds = Object.keys(catalog);
  log('total products: ' + allIds.length);

  // Resume: skip already-scraped
  var existing = {};
  if (fs.existsSync(OUTPUT_FILE)) {
    try { existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8')); } catch(e){ existing = {}; }
  }
  var alreadyOK = Object.keys(existing).filter(k => !existing[k].error);
  log('already scraped (skipping): ' + alreadyOK.length);
  var todo = allIds.filter(id => !existing[id] || existing[id].error);
  log('to scrape: ' + todo.length);

  if (todo.length === 0) {
    log('nothing to do');
    return;
  }

  const browser = await chromium.launch({ headless: true });
  // shared result map
  var results = existing;

  // Persist every N
  var persistEvery = 50;
  var since = 0;

  async function scrape(page, pid) {
    try {
      await page.goto('https://www.billyjo.co.kr/html/dh_prod/prod_view/' + pid, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1200);
      return await page.evaluate(() => {
        var name = (document.querySelector('.prod_name > b') || {}).textContent || '';
        var model = (document.querySelector('.prod_name .model_name small') || {}).textContent || '';
        var rentalType = ((document.querySelector('.prod_name .dh_orange') || {}).textContent || '').trim();
        var crumb = Array.from(document.querySelectorAll('.location a, .breadcrumb a')).map(a => a.textContent.trim()).filter(Boolean).join(' > ');
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
    } catch (e) {
      return { error: e.message.slice(0, 200) };
    }
  }

  // Worker pool
  var idx = 0;
  var done = 0;
  async function worker(id) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    while (idx < todo.length) {
      var myIdx = idx++;
      var pid = todo[myIdx];
      var data = await scrape(page, pid);
      results[pid] = data;
      done++;
      since++;
      if (data.error) {
        log('[w' + id + '] ' + pid + ' ERR: ' + data.error.slice(0, 60));
      } else if (done % 25 === 0) {
        log('[w' + id + '] ' + done + '/' + todo.length + ' (' + pid + ' "' + (data.name || '').slice(0, 30) + '")');
      }
      // Persist incremental
      if (since >= persistEvery) {
        since = 0;
        try { fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results)); } catch(e){}
      }
    }
    await ctx.close();
  }

  var workers = [];
  for (var i = 0; i < CONCURRENCY; i++) workers.push(worker(i));
  await Promise.all(workers);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results));
  log('DONE. total in results: ' + Object.keys(results).length);
  await browser.close();
})().catch(e => { log('FATAL: ' + e.message); process.exit(1); });
