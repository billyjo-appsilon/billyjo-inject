// Probe the vertical gaps between v5 homepage sections (flex order children of pageEl).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const LOCAL = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await ctx.route(/inject\.js/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: LOCAL })
  );
  const page = await ctx.newPage();
  await page.goto('https://billyjo.kr/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(5000);

  const info = await page.evaluate(() => {
    const pe = document.querySelector('#bj-v5-injected');
    if (!pe) return { err: 'no #bj-v5-injected' };
    const peCS = getComputedStyle(pe);
    // direct flex children that are visible sections, sorted by visual order (getBoundingClientRect top)
    const kids = Array.from(pe.children)
      .filter(c => { const r = c.getBoundingClientRect(); const s = getComputedStyle(c); return s.display !== 'none' && r.height > 0; })
      .map(c => ({ el: c, r: c.getBoundingClientRect() }))
      .sort((a, b) => a.r.top - b.r.top);
    const rows = [];
    for (let i = 0; i < kids.length; i++) {
      const c = kids[i];
      const s = getComputedStyle(c.el);
      const gapAbove = i === 0 ? null : Math.round(c.r.top - kids[i - 1].r.bottom);
      rows.push({
        i,
        cls: (c.el.className || '').toString().slice(0, 40),
        order: s.order,
        mt: s.marginTop, mb: s.marginBottom,
        pt: s.paddingTop, pb: s.paddingBottom,
        gapAbove, // visual px between prev section bottom and this top
        label: (c.el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 30),
      });
    }
    return {
      pageRowGap: peCS.rowGap, pageGap: peCS.gap, pageDisplay: peCS.display, pageFlexDir: peCS.flexDirection,
      count: kids.length, rows,
    };
  });
  console.log('pageEl:', JSON.stringify({ display: info.pageDisplay, flexDir: info.pageFlexDir, rowGap: info.pageRowGap, gap: info.pageGap }));
  console.log('sections (top→bottom):');
  info.rows.forEach(r => console.log(
    `#${String(r.i).padStart(2)} ord=${String(r.order).padStart(2)} gapAbove=${String(r.gapAbove).padStart(4)}  mt=${r.mt} mb=${r.mb} pt=${r.pt} pb=${r.pb}  [${r.cls}] "${r.label}"`
  ));
  await browser.close();
})();
