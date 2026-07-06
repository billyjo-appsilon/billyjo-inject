const { chromium } = require('playwright');
const fs = require('fs');

const CATS = [
  { key: 'water',  name: '정수기',   url: '/html/dh_prod/prod_list/1-8' },
  { key: 'air',    name: '공기청정기', url: '/html/dh_prod/prod_list/1-6' },
  { key: 'aircon', name: '에어컨',    url: '/html/dh_prod/prod_list/1-87' },
  { key: 'fridge', name: '냉장고',    url: '/html/dh_prod/prod_list/8-658' },
  { key: 'wash',   name: '세탁기',    url: '/html/dh_prod/prod_list/3-99' },
  { key: 'tv',     name: 'TV',       url: '/html/dh_prod/prod_list/6-678' },
  { key: 'heat',   name: '냉난방기',  url: '/html/dh_prod/prod_list/10-1153' },
  { key: 'dry',    name: '건조기',    url: '/html/dh_prod/prod_list/3-25' },
];
const N = 8;

(async () => {
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage({ viewport: { width: 1280, height: 1600 }, deviceScaleFactor: 1 });
  const out = {};
  for (const c of CATS) {
    try {
      await p.goto('https://billyjo.kr' + c.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await p.waitForSelector('.prod_list .item', { timeout: 30000 });
      await p.waitForTimeout(3000);
      const items = await p.evaluate((n) => {
        const num = s => { const m = (s || '').replace(/[^0-9]/g, ''); return m ? parseInt(m, 10) : 0; };
        const res = [];
        const els = document.querySelectorAll('.prod_list .item');
        for (let i = 0; i < els.length && res.length < n; i++) {
          const it = els[i];
          const a = it.querySelector('a[href*="prod_view"]');
          if (!a) continue;
          const href = a.getAttribute('href') || '';
          const pid = (href.match(/prod_view\/(\d+)/) || [])[1] || '';
          const name = (it.querySelector('.name')?.textContent || '').replace(/\s+/g, ' ').trim();
          const brand = (it.querySelector('.brand')?.textContent || '').replace(/\s+/g, ' ').trim();
          const img = it.querySelector('.thumb img')?.getAttribute('src') || '';
          const orig = num(it.querySelector('.fee .price.sale strong')?.textContent);
          const feeCard = it.querySelector('.fee2 .price.sale strong');
          const final = feeCard ? num(feeCard.textContent) : orig;
          const disc = parseInt(it.getAttribute('data-bj-disc') || '0', 10);
          const best = !!it.querySelector('.best-pill');
          const rvn = parseInt(it.getAttribute('data-bj-rvn') || '0', 10);
          if (!name || !orig) continue;
          res.push({ pid, name, brand, img, orig, final, disc, best, rvn });
        }
        return res;
      }, N);
      out[c.key] = { name: c.name, url: c.url, items };
      console.log(c.name, '→', items.length, 'items', items[0] ? '| e.g. ' + items[0].name.slice(0, 20) + ' ' + items[0].orig + '/' + items[0].final + ' -' + items[0].disc + '%' : '');
    } catch (e) {
      console.log(c.name, 'ERR:', e.message.slice(0, 80));
      out[c.key] = { name: c.name, url: c.url, items: [], error: e.message };
    }
  }
  fs.writeFileSync('cat-products.json', JSON.stringify(out, null, 2));
  const total = Object.values(out).reduce((s, c) => s + (c.items ? c.items.length : 0), 0);
  console.log('\nsaved cat-products.json — total', total, 'products');
  await b.close();
})().catch(e => { console.error('FAIL', e.message); process.exit(1); });
