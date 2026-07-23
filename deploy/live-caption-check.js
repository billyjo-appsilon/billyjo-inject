const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto('https://billyjo.kr/', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(5000);
  const r = await p.evaluate(() => {
    const g = (s) => { const e = document.querySelector(s); return e ? getComputedStyle(e).lineHeight + ' / ' + getComputedStyle(e).fontSize : 'MISSING'; };
    return {
      bridge: g('.bj-bridge p'),
      trustsub: g('.bj-trust-sub'),
      lead: g('#bj-v5-injected .lead'),
    };
  });
  console.log('LIVE (real CDN):', JSON.stringify(r, null, 2));
  await b.close();
})();
