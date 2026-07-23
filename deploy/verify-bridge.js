// Verify all stacked-line caption texts on the redesigned homepage.
// Serves LOCAL inject.js on live billyjo.kr via route interception.
// Usage: node verify-bridge.js <tag>   (tag = "before" | "after")
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const LOCAL = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');
const TAG = process.argv[2] || 'before';

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

    const report = await page.evaluate(() => {
      const out = [];
      const measure = (el, label) => {
        if (!el) return;
        const cs = getComputedStyle(el);
        const rects = Array.from(el.getClientRects()).map(r => Math.round(r.height));
        const lineRects = Array.from(el.getClientRects());
        const gaps = [];
        for (let i = 1; i < lineRects.length; i++) gaps.push(Math.round(lineRects[i].top - lineRects[i - 1].bottom));
        out.push({
          label,
          text: (el.innerText || '').replace(/\n/g, ' | ').slice(0, 48),
          fontSize: cs.fontSize,
          lineHeight: cs.lineHeight,
          lhRatio: (parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2),
          lines: lineRects.length,
          lineGaps: gaps, // visual px gap between wrapped/br lines
        });
      };
      const p = document.querySelector('.bj-bridge p'); measure(p, 'bj-bridge p');
      document.querySelectorAll('.bj-trust-sub').forEach((e, i) => measure(e, 'bj-trust-sub #' + i));
      document.querySelectorAll('#bj-v5-injected .lead').forEach((e, i) => measure(e, 'lead #' + i));
      document.querySelectorAll('#bj-v5-injected .desc').forEach((e, i) => measure(e, 'desc #' + i));
      document.querySelectorAll('.bj-ben-h').forEach((e, i) => measure(e, 'bj-ben-h #' + i));
      return out;
    });
    console.log(`\n========== [${vp.name}] ==========`);
    report.forEach(r => console.log(
      `${r.label.padEnd(16)} lh=${r.lineHeight}(${r.lhRatio}x ${r.fontSize})  lines=${r.lines}  gaps=[${r.lineGaps.join(',')}]  "${r.text}"`
    ));

    await page.screenshot({ path: `bridge-${TAG}-${vp.name}-full.png`, fullPage: true });
    await ctx.close();
  }
  await browser.close();
})();
