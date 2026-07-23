// Focused element screenshots of the stacked-line captions (after state).
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

  const shots = [
    { sel: '.bj-bridge', name: 'cap-bridge' },
    { sel: '#bj-v5-injected .lead.bj-trust-sub', name: 'cap-trustsub' }, // first trust-sub
  ];
  for (const s of shots) {
    const el = await page.$(s.sel);
    if (el) { await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(300); await el.screenshot({ path: `${s.name}.png` }); }
  }
  // grab the two service/curation lead headings by matching text
  const leads = await page.$$('#bj-v5-injected .lead');
  let n = 0;
  for (const el of leads) {
    const t = await el.innerText();
    if (/고객 신뢰도 100%|나의 라이프스타일|렌탈\? 어렵지/.test(t)) {
      await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(200);
      await el.screenshot({ path: `cap-lead-${n++}.png` });
    }
  }
  await browser.close();
})();
