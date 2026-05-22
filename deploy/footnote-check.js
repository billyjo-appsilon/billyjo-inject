const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const configs = [
    { name: 'desktop', ctxOpts: { viewport: { width: 1280, height: 800 } } },
    { name: 'mobile',  ctxOpts: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } },
  ];
  for (const cfg of configs) {
    const b = await chromium.launch();
    const ctx = await b.newContext(cfg.ctxOpts);
    const p = await ctx.newPage();
    const fp = path.resolve(__dirname, '..', 'preview-detail-page-v5.html').split(path.sep).join('/');
    await p.goto('file:///' + fp);
    await p.waitForLoadState('networkidle');
    const out = await p.evaluate(() => {
      const fn = document.querySelector('.pc-footnote');
      if (!fn) return null;
      const r = fn.getBoundingClientRect();
      const cs = getComputedStyle(fn);
      const parentR = fn.parentElement.getBoundingClientRect();
      return {
        w: Math.round(r.width), h: Math.round(r.height),
        parentW: Math.round(parentR.width),
        ta: cs.textAlign, fs: cs.fontSize, lh: cs.lineHeight,
        bodyScrollW: document.body.scrollWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      };
    });
    console.log(cfg.name, JSON.stringify(out));
    await b.close();
  }
})();
