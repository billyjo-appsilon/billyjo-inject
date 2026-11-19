const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const repoRoot = path.join(__dirname, '..');
const injectSource = fs.readFileSync(path.join(repoRoot, 'inject.js'), 'utf8');
const live1MascotUrl = 'https://live.billyjo.co.kr/images/toss-banner-mascot.webp';

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
    await page.locator('#bj-home-gift-promos .bj-hgp-half-banner').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const image = document.querySelector('#bj-home-gift-promos .bj-hgp-half-visual img');
      return Boolean(image?.complete && image?.naturalWidth > 0);
    }, null, { timeout: 15000 });
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
          const wrapper = document.querySelector('#bj-home-gift-promos .bj-hgp-half-banner');
          const image = wrapper?.querySelector('.bj-hgp-half-visual img');
          return {
            src: image?.src || '',
            loaded: Boolean(image?.complete && image?.naturalWidth > 0),
            title: wrapper?.querySelector('h2')?.textContent.replace(/\s+/g, ' ').trim() || '',
            countdownUnits: wrapper?.querySelectorAll('[data-bj-month-countdown-unit]').length || 0,
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
    if (!result.campaignBanner.loaded || result.campaignBanner.src !== live1MascotUrl ||
        result.campaignBanner.title !== '11월도 반값습니다!' || result.campaignBanner.countdownUnits !== 4) {
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
