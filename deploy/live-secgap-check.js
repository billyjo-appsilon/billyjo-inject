const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const vp of [{n:'desktop',w:1440,h:1000,m:false},{n:'mobile',w:390,h:844,m:true}]) {
    const ctx = await b.newContext({ viewport:{width:vp.w,height:vp.h}, isMobile:vp.m, deviceScaleFactor:vp.m?2:1,
      userAgent: vp.m?'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1':undefined });
    const p = await ctx.newPage();
    await p.goto('https://billyjo.kr/', { waitUntil:'networkidle', timeout:60000 });
    await p.waitForTimeout(5000);
    const rg = await p.evaluate(()=>getComputedStyle(document.querySelector('#bj-v5-injected')).rowGap);
    console.log(`LIVE ${vp.n}: row-gap=${rg}`);
    await ctx.close();
  }
  await b.close();
})();
