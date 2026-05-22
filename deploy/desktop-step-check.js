const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  const fp = path.resolve(__dirname, '..', 'preview-detail-page-v5.html').split(path.sep).join('/');
  await p.goto('file:///' + fp);
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(500);
  const out = await p.evaluate(() => {
    const cards = document.querySelectorAll('.step-card');
    const items = [];
    cards.forEach(c => {
      const r = c.getBoundingClientRect();
      const t = c.querySelector('.step-t');
      const d = c.querySelector('.step-d');
      const iconWrap = c.querySelector('.step-icon-wrap');
      const num = c.querySelector('.step-num');
      items.push({
        w: Math.round(r.width), h: Math.round(r.height),
        isAccent: c.classList.contains('accent'),
        title: t.textContent.trim(),
        desc: d.textContent.trim().replace(/\s+/g,' '),
        iconWrapBg: iconWrap ? getComputedStyle(iconWrap).background.substring(0,60) : null,
      });
    });
    // Get arrow indicator visibility
    const card1 = cards[0];
    const after = card1 ? window.getComputedStyle(card1, '::after').content : null;
    return { count: cards.length, items, arrowAfterContent: after };
  });
  console.log(JSON.stringify(out, null, 2));
  await b.close();
})();
