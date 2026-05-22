const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true });
  const p = await ctx.newPage();
  const fp = path.resolve(__dirname, '..', 'preview-detail-page-v5.html').split(path.sep).join('/');
  await p.goto('file:///' + fp);
  await p.waitForLoadState('networkidle');
  const out = await p.evaluate(() => {
    const cards = document.querySelectorAll('.step-card');
    const cta = document.querySelector('.btn-consult');
    const items = [];
    cards.forEach(c => {
      const cs = getComputedStyle(c);
      const r = c.getBoundingClientRect();
      const t = c.querySelector('.step-t');
      const d = c.querySelector('.step-d');
      items.push({
        w: Math.round(r.width), h: Math.round(r.height),
        pad: cs.padding,
        title: t ? t.textContent.trim() : null,
        titleFs: t ? getComputedStyle(t).fontSize : null,
        desc: d ? d.textContent.trim().substring(0,40) : null,
        descLh: d ? getComputedStyle(d).lineHeight : null,
        overflow: c.scrollWidth > c.clientWidth + 1 ? 'X-OVERFLOW' : 'ok',
      });
    });
    return {
      count: cards.length,
      items,
      cta: cta ? { text: cta.textContent.trim(), w: Math.round(cta.getBoundingClientRect().width), fs: getComputedStyle(cta).fontSize } : null
    };
  });
  console.log(JSON.stringify(out, null, 2));
  await b.close();
})();
