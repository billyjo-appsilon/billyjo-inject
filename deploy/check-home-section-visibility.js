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
          const title = wrapper?.querySelector('h2');
          const lines = title ? Array.from(title.children).map((line) => {
            const rect = line.getBoundingClientRect();
            return { text: line.textContent.trim(), display: getComputedStyle(line).display, top: Math.round(rect.top) };
          }) : [];
          return {
            src: image?.src || '',
            loaded: Boolean(image?.complete && image?.naturalWidth > 0),
            title: title?.textContent.replace(/\s+/g, ' ').trim() || '',
            lines,
            countdownUnits: wrapper?.querySelectorAll('[data-bj-month-countdown-unit]').length || 0,
          };
        })(),
        promoCards: (() => {
          const cards = Array.from(document.querySelectorAll('#bj-home-gift-promos .bj-hgp-card'));
          const visible = cards.filter((card) => !card.hidden && getComputedStyle(card).display !== 'none');
          const tiers = Array.from(document.querySelectorAll('#bj-home-gift-promos [data-bj-hgp-band]')).map((band) => ({
            tier: band.getAttribute('data-bj-hgp-band'),
            total: band.querySelectorAll('.bj-hgp-card').length,
            visible: Array.from(band.querySelectorAll('.bj-hgp-card')).filter((card) => !card.hidden && getComputedStyle(card).display !== 'none').length,
          }));
          const toggle = document.querySelector('[data-bj-hgp-toggle]');
          return { total: cards.length, visible: visible.length, tiers, expanded: toggle?.getAttribute('aria-expanded'), label: toggle?.textContent.trim() || '' };
        })(),
        removedWeeklyNodes: document.querySelectorAll('#bj-home-gift-promos .bj-hgp-head,#bj-home-gift-promos .bj-hgp-countdown,#bj-home-gift-promos .bj-hgp-source').length,
        faq: (() => {
          const node = document.querySelector('.bj-home-faq-zone');
          const section = node?.querySelector('section');
          const style = section ? getComputedStyle(section) : null;
          return {
            visible: Boolean(node && getComputedStyle(node).display !== 'none'),
            finalInOuter: Boolean(node && node.parentElement?.classList.contains('m_outer') && node === node.parentElement.lastElementChild),
            beforeFooter: Boolean(node && document.querySelector('footer') && node.getBoundingClientRect().bottom <= document.querySelector('footer').getBoundingClientRect().top + 1),
            paddingTop: style ? parseFloat(style.paddingTop) : null,
            paddingBottom: style ? parseFloat(style.paddingBottom) : null,
          };
        })(),
        spacing: (() => {
          const v5 = document.querySelector('#bj-v5-injected');
          const promo = document.querySelector('#bj-home-gift-promos');
          return {
            v5PaddingBottom: v5 ? parseFloat(getComputedStyle(v5).paddingBottom) : null,
            promoTail: v5 && promo ? Math.round(v5.getBoundingClientRect().bottom - promo.getBoundingClientRect().bottom) : null,
          };
        })(),
        hierarchy: (() => {
          const promo = document.querySelector('#bj-home-gift-promos');
          const category = document.querySelector('#bj-home-cat-links');
          const benefits = document.querySelector('#bj-home-benefit-cards');
          const hero = document.querySelector('.new-mv_wrap') || document.querySelector('.new-mv');
          return {
            heroBeforeCategory: Boolean(hero && category && hero.nextElementSibling === category),
            categoryBeforePromo: Boolean(category && promo && category.nextElementSibling === promo),
            promoBeforeBenefits: Boolean(promo && benefits && promo.nextElementSibling === benefits),
            redundantEntryRemoved: !document.querySelector('#bj-home-conversion-entry'),
          };
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
    if (result.campaignBanner.lines.length !== 2 || result.campaignBanner.lines.some((line) => line.display !== 'block') ||
        result.campaignBanner.lines[0].text !== '11월도' || result.campaignBanner.lines[1].text !== '반값습니다!' ||
        result.campaignBanner.lines[0].top >= result.campaignBanner.lines[1].top) {
      throw new Error(`campaign banner line break regressed at ${width}px: ${JSON.stringify(result.campaignBanner.lines)}`);
    }
    if (result.promoCards.total !== 24 || result.promoCards.visible !== 12 || result.promoCards.expanded !== 'false' ||
        result.promoCards.label !== '프로모션 상품 12개 더보기' ||
        result.promoCards.tiers.some((tier) => tier.total !== 4 || tier.visible !== 2)) {
      throw new Error(`collapsed promo contract regressed at ${width}px: ${JSON.stringify(result.promoCards)}`);
    }
    if (!Object.values(result.hierarchy).every(Boolean)) {
      throw new Error(`home conversion hierarchy regressed at ${width}px: ${JSON.stringify(result.hierarchy)}`);
    }
    if (result.removedWeeklyNodes !== 0) throw new Error(`weekly header/countdown remains at ${width}px`);
    if (!result.faq.visible || !result.faq.finalInOuter || !result.faq.beforeFooter) {
      throw new Error(`FAQ final placement regressed at ${width}px: ${JSON.stringify(result.faq)}`);
    }
    const expectedPadding = width <= 767 ? 32 : 40;
    if (result.faq.paddingTop !== expectedPadding || result.faq.paddingBottom !== expectedPadding) {
      throw new Error(`FAQ spacing regressed at ${width}px: ${JSON.stringify(result.faq)}`);
    }
    const expectedTail = width <= 767 ? 24 : 32;
    if (result.spacing.v5PaddingBottom !== expectedTail) {
      throw new Error(`promo tail spacing regressed at ${width}px: ${JSON.stringify(result.spacing)}`);
    }
    if (result.scrollWidth > Math.max(result.viewportWidth, width) + 1) {
      throw new Error(`horizontal overflow at ${width}px: ${result.scrollWidth}/${result.viewportWidth}`);
    }
    const relevantErrors = pageErrors.filter((message) => /home-section|SyntaxError|ReferenceError/.test(message));
    if (relevantErrors.length) throw new Error(`relevant page errors: ${relevantErrors.join(' | ')}`);
    await page.locator('[data-bj-hgp-toggle]').click();
    const expanded = await page.evaluate(() => ({
      visible: Array.from(document.querySelectorAll('#bj-home-gift-promos .bj-hgp-card')).filter((card) => !card.hidden && getComputedStyle(card).display !== 'none').length,
      expanded: document.querySelector('[data-bj-hgp-toggle]')?.getAttribute('aria-expanded'),
      label: document.querySelector('[data-bj-hgp-toggle]')?.textContent.trim(),
    }));
    if (expanded.visible !== 24 || expanded.expanded !== 'true' || expanded.label !== '프로모션 상품 접기') {
      throw new Error(`expanded promo contract regressed at ${width}px: ${JSON.stringify(expanded)}`);
    }
    await page.locator('[data-bj-hgp-toggle]').click();
    const collapsedAgain = await page.evaluate(() => ({
      visible: Array.from(document.querySelectorAll('#bj-home-gift-promos .bj-hgp-card')).filter((card) => !card.hidden && getComputedStyle(card).display !== 'none').length,
      expanded: document.querySelector('[data-bj-hgp-toggle]')?.getAttribute('aria-expanded'),
    }));
    if (collapsedAgain.visible !== 12 || collapsedAgain.expanded !== 'false') {
      throw new Error(`promo recollapse contract regressed at ${width}px: ${JSON.stringify(collapsedAgain)}`);
    }
    return { width, visibility, ...result, expanded, collapsedAgain };
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
    for (const width of [320, 390, 430, 1280]) results.push(await inspect(browser, width, hidden));
    results.push(await inspect(browser, 390, visible));
    console.log(JSON.stringify({ contract: 'ok', results }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error && error.stack || error);
  process.exit(1);
});
