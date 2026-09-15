// Regression check for the desktop home product grids.
// It serves the local inject.js over the live page, so it can run before release.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const LOCAL = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');
const VIEWPORTS = [1024, 1280, 1440];

function nearlyEqual(a, b, tolerance = 2) {
  return Math.abs(a - b) <= tolerance;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const failures = [];

  for (const width of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    await context.route(/billyjo-inject@[^/]+\/inject\.js/, route =>
      route.fulfill({ status: 200, contentType: 'application/javascript', body: LOCAL })
    );
    const page = await context.newPage();
    await page.goto('https://billyjo.co.kr/', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2500);

    const report = await page.evaluate(() => {
      const visible = el => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
      };
      return [...document.querySelectorAll('.prodList_wrap .prod_scroll')]
        .filter(visible)
        .map(section => {
          const list = section.querySelector('.pc_prod_list');
          const items = list ? [...list.children].filter(el => el.matches('.item') && visible(el)) : [];
          const boxes = items.map(el => {
            const r = el.getBoundingClientRect();
            return { x: Math.round(r.x), y: Math.round(r.y), width: r.width };
          });
          return {
            title: section.querySelector('.m_tit')?.textContent.trim() || section.id,
            display: list ? getComputedStyle(list).display : '',
            itemCount: boxes.length,
            boxes
          };
        });
    });

    for (const section of report) {
      if (!section.itemCount) continue;
      if (section.display !== 'grid') failures.push(`${width}px ${section.title}: display=${section.display}`);
      const expectedRows = Math.ceil(section.itemCount / 4);
      const rows = [...new Set(section.boxes.map(box => box.y))];
      const columns = [...new Set(section.boxes.map(box => box.x))];
      if (rows.length !== expectedRows) failures.push(`${width}px ${section.title}: rows=${rows.length}, expected=${expectedRows}`);
      if (columns.length !== Math.min(4, section.itemCount)) failures.push(`${width}px ${section.title}: columns=${columns.length}`);
      for (const rowY of rows) {
        const row = section.boxes.filter(box => box.y === rowY).sort((a, b) => a.x - b.x);
        for (let i = 1; i < row.length; i += 1) {
          if (!nearlyEqual(row[i].width, row[0].width)) failures.push(`${width}px ${section.title}: unequal column widths`);
          if (row[i].x <= row[i - 1].x) failures.push(`${width}px ${section.title}: non-monotonic card order`);
        }
      }
    }

    console.log(JSON.stringify({ width, sections: report.map(({ title, display, itemCount, boxes }) => ({
      title,
      display,
      itemCount,
      rows: [...new Set(boxes.map(box => box.y))].length,
      columns: [...new Set(boxes.map(box => box.x))].length
    })) }, null, 2));
    await context.close();
  }

  // Guard the two excluded surfaces: mobile home and normal product-list pages.
  for (const surface of [
    { name: 'mobile-home', url: 'https://billyjo.co.kr/', width: 390 },
    { name: 'desktop-product-list', url: 'https://billyjo.co.kr/html/dh_prod/prod_list/1-8', width: 1440 }
  ]) {
    const context = await browser.newContext({ viewport: { width: surface.width, height: 900 } });
    await context.route(/billyjo-inject@[^/]+\/inject\.js/, route =>
      route.fulfill({ status: 200, contentType: 'application/javascript', body: LOCAL })
    );
    const page = await context.newPage();
    await page.goto(surface.url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2500);
    const guard = await page.evaluate(() => {
      const first = document.querySelector('.pc_prod_list, .prod_list');
      return {
        path: location.pathname,
        homeClass: document.documentElement.classList.contains('bj-home-product-grid'),
        firstListDisplay: first ? getComputedStyle(first).display : '',
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth
      };
    });
    if (surface.name === 'mobile-home' && guard.firstListDisplay === 'grid') failures.push('mobile home: desktop grid rule leaked');
    if (surface.name === 'desktop-product-list' && guard.homeClass) failures.push('product-list page: home grid class leaked');
    if (surface.name === 'desktop-product-list' && guard.firstListDisplay === 'grid') failures.push('product-list page: home grid rule leaked');
    if (guard.overflow > 1) failures.push(`${surface.name}: horizontal overflow=${guard.overflow}px`);
    console.log(JSON.stringify({ surface: surface.name, ...guard }, null, 2));
    await context.close();
  }

  await browser.close();
  if (failures.length) throw new Error(failures.join('\n'));
  console.log('PASS: desktop home product grids remain ordered 4-column layouts.');
})().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
