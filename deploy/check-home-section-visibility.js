const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const repoRoot = path.join(__dirname, '..');
const injectSource = fs.readFileSync(path.join(repoRoot, 'inject.js'), 'utf8');
const live1BannerPath = '/v1/landing/hero-assets/qa20261119';
const live1BannerUrl = `https://admin2-api.billyjo.co.kr${live1BannerPath}`;
const live1BannerSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1254" height="1254"><rect width="1254" height="1254" fill="#0838f8"/></svg>';

for (const required of [
  "HOME_CONFIG_URL = 'https://admin2-api.billyjo.co.kr/v1/landing/home'",
  'HOME_VISIBILITY_DEFAULTS = { consultingSteps: false, legacyBenefits: false }',
  "data-bj-home-section', 'consultingSteps'",
  "data-bj-home-section', 'legacyBenefits'",
  'applyHomeSectionVisibility(pageEl, HOME_VISIBILITY_DEFAULTS)',
]) {
  if (!injectSource.includes(required)) throw new Error(`missing source contract: ${required}`);
}

async function inspect(browser, width, visibility) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const pageErrors = [];
  let injectIntercepts = 0;
  let configRequests = 0;
  page.on('pageerror', (error) => pageErrors.push(String(error && error.message || error)));
  await page.route('https://admin2-api.billyjo.co.kr/v1/landing/home', async (route) => {
    configRequests += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/json; charset=utf-8',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({ ok: true, pageKey: 'home', config: { sectionVisibility: visibility } }),
    });
  });
  await page.route('https://admin2-api.billyjo.co.kr/v1/landing/live1', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json; charset=utf-8',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({
        ok: true,
        pageKey: 'live1',
        config: {},
        heroBanners: [{ id: 'hb_live1_qa', imageUrl: live1BannerPath, alt: '11월 프로모션', order: 1, month: '2026-11' }],
      }),
    });
  });
  await page.route(live1BannerUrl, async (route) => {
    await route.fulfill({ status: 200, contentType: 'image/svg+xml', body: live1BannerSvg });
  });
  await page.route(/billyjo-inject@[0-9a-f]{7,40}\/inject(?:\.min)?\.js/i, async (route) => {
    injectIntercepts += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript; charset=utf-8',
      headers: { 'access-control-allow-origin': '*' },
      body: injectSource,
    });
  });

  try {
    await page.goto('https://billyjo.co.kr/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForSelector('#bj-v5-injected[data-bj-home-released]', { timeout: 30000 });
    await page.waitForFunction((expected) => {
      const consulting = document.querySelector('[data-bj-home-section="consultingSteps"]');
      const legacy = document.querySelector('[data-bj-home-section="legacyBenefits"]');
      return consulting?.getAttribute('data-bj-home-visible') === (expected.consultingSteps ? '1' : '0')
        && legacy?.getAttribute('data-bj-home-visible') === (expected.legacyBenefits ? '1' : '0');
    }, visibility, { timeout: 15000 });
    await page.waitForTimeout(4200);

    const result = await page.evaluate(() => {
      const read = (key) => {
        const node = document.querySelector(`[data-bj-home-section="${key}"]`);
        return {
          exists: Boolean(node),
          visibleAttr: node?.getAttribute('data-bj-home-visible') || null,
          display: node ? getComputedStyle(node).display : null,
        };
      };
      return {
        consultingSteps: read('consultingSteps'),
        legacyBenefits: read('legacyBenefits'),
        newBenefitCards: document.querySelectorAll('#bj-home-benefit-cards .bj-hbenefit-card').length,
        campaignBanner: (() => {
          const image = document.querySelector('#bj-home-gift-promos .bj-hgp-campaign-banner img');
          return {
            src: image?.src || '',
            loaded: Boolean(image?.complete && image?.naturalWidth > 0),
          };
        })(),
        removedWeeklyNodes: document.querySelectorAll('#bj-home-gift-promos .bj-hgp-head,#bj-home-gift-promos .bj-hgp-countdown,#bj-home-gift-promos .bj-hgp-source').length,
        faqVisible: (() => {
          const node = document.querySelector('.bj-home-faq-zone');
          return Boolean(node && getComputedStyle(node).display !== 'none');
        })(),
        viewportWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      };
    });

    if (injectIntercepts < 1) throw new Error(`inject not intercepted at ${width}px`);
    if (configRequests < 1) throw new Error(`Admin2 home config not requested at ${width}px`);
    for (const key of ['consultingSteps', 'legacyBenefits']) {
      const expected = visibility[key];
      const section = result[key];
      if (!section.exists) throw new Error(`${key} marker missing at ${width}px`);
      if ((section.display !== 'none') !== expected) {
        throw new Error(`${key} visibility mismatch at ${width}px: ${JSON.stringify(section)}`);
      }
    }
    if (result.newBenefitCards !== 6) throw new Error(`new 01-06 cards regressed at ${width}px`);
    if (!result.campaignBanner.loaded || result.campaignBanner.src !== live1BannerUrl) {
      throw new Error(`live1 campaign banner regressed at ${width}px: ${JSON.stringify(result.campaignBanner)}`);
    }
    if (result.removedWeeklyNodes !== 0) throw new Error(`weekly header/countdown remains at ${width}px`);
    if (!result.faqVisible) throw new Error(`FAQ regressed at ${width}px`);
    if (result.scrollWidth > result.viewportWidth + 1) {
      throw new Error(`horizontal overflow at ${width}px: ${result.scrollWidth}/${result.viewportWidth}`);
    }
    const relevantErrors = pageErrors.filter((message) => /home-section|SyntaxError|ReferenceError/.test(message));
    if (relevantErrors.length) throw new Error(`relevant page errors: ${relevantErrors.join(' | ')}`);
    return { width, visibility, ...result };
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const hidden = { consultingSteps: false, legacyBenefits: false };
    const visible = { consultingSteps: true, legacyBenefits: true };
    const results = [];
    for (const width of [320, 390, 1280]) results.push(await inspect(browser, width, hidden));
    results.push(await inspect(browser, 390, visible));
    console.log(JSON.stringify({ contract: 'ok', results }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error && error.stack || error);
  process.exit(1);
});
