// Verify section gaps after change + crop the 신청방법 heading region Jun circled.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const LOCAL = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');

(async () => {
  const browser = await chromium.launch();
  for (const vp of [
    { name: 'desktop', width: 1440, height: 1000, mobile: false },
    { name: 'mobile', width: 390, height: 844, mobile: true },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.mobile ? 2 : 1,
      isMobile: vp.mobile,
      userAgent: vp.mobile ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1' : undefined,
    });
    await ctx.route(/inject\.js/, (route) =>
      route.fulfill({ status: 200, contentType: 'application/javascript', body: LOCAL })
    );
    const page = await ctx.newPage();
    await page.goto('https://billyjo.kr/', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(5000);

    const gaps = await page.evaluate(() => {
      const pe = document.querySelector('#bj-v5-injected');
      const rg = getComputedStyle(pe).rowGap;
      const kids = Array.from(pe.children)
        .filter(c => { const r = c.getBoundingClientRect(); return getComputedStyle(c).display !== 'none' && r.height > 0; })
        .map(c => ({ el: c, r: c.getBoundingClientRect() }))
        .sort((a, b) => a.r.top - b.r.top);
      const g = [];
      for (let i = 1; i < kids.length; i++) g.push(Math.round(kids[i].r.top - kids[i - 1].r.bottom));
      return { rowGap: rg, gaps: g };
    });
    console.log(`[${vp.name}] rowGap=${gaps.rowGap}  section gaps=[${gaps.gaps.join(', ')}]`);

    // crop the 신청방법 section + the block above it (the circled region)
    const clip = await page.evaluate(() => {
      const pe = document.querySelector('#bj-v5-injected');
      let apply = null;
      Array.from(pe.children).forEach(c => { if ((c.innerText || '').indexOf('어렵지 않아요') !== -1) apply = c; });
      if (!apply) return null;
      apply.scrollIntoView({ block: 'center' });
      const r = apply.getBoundingClientRect();
      return { x: 0, y: Math.max(0, r.top - 180), w: window.innerWidth, h: 240 };
    });
    if (clip) {
      await page.waitForTimeout(300);
      await page.screenshot({ path: `secgap-${vp.name}.png`, clip: { x: clip.x, y: clip.y, width: clip.w, height: clip.h } });
    }
    await ctx.close();
  }
  await browser.close();
})();
