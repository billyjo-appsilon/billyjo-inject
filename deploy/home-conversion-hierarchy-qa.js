const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const injectSource = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');
const CORE_RE = /cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject@[^/]+\/inject(?:\.min)?\.js/;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function inspect(browser, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  const pageErrors = [];
  let intercepts = 0;
  page.on('pageerror', (error) => pageErrors.push(String(error?.message || error)));
  await page.addInitScript(() => { window.dataLayer = []; });
  await page.route(CORE_RE, async (route) => {
    intercepts += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript; charset=utf-8',
      headers: { 'access-control-allow-origin': '*' },
      body: injectSource,
    });
  });

  try {
    await page.goto(`https://billyjo.co.kr/?qa=home-conversion-${width}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.locator('#bj-home-conversion-entry').waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('#bj-home-gift-promos').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForFunction(() => document.querySelectorAll('.new-mv .slick-slide:not(.slick-cloned)').length === 4, null, { timeout: 15000 });
    await page.waitForFunction(() => Boolean(document.querySelector('.new-mv .slick-slide.slick-current:not(.slick-cloned) video.billyjo-video-hero__media')), null, { timeout: 3000 });
    await page.waitForTimeout(5600);

    const result = await page.evaluate(() => {
      const entry = document.querySelector('#bj-home-conversion-entry');
      const promo = document.querySelector('#bj-home-gift-promos');
      const category = document.querySelector('#bj-home-cat-links');
      const benefits = document.querySelector('#bj-home-benefit-cards');
      const primary = entry.querySelector('.bj-hce-primary');
      const secondary = entry.querySelector('.bj-hce-secondary');
      const promoCards = Array.from(promo.querySelectorAll('.bj-hgp-card'));
      const visiblePromoCards = promoCards.filter((card) => !card.hidden && getComputedStyle(card).display !== 'none');
      const slides = Array.from(document.querySelectorAll('.new-mv .slick-slide:not(.slick-cloned)'));
      const mobileNav = Array.from(document.querySelectorAll('.category__wrap > a'))
        .filter((node) => getComputedStyle(node).display !== 'none')
        .map((node) => node.textContent.replace(/\s+/g, ' ').trim());
      const desktopNav = Array.from(document.querySelectorAll('.new-gnb > .gnb__menu'))
        .filter((node) => getComputedStyle(node).display !== 'none')
        .map((node) => {
          const direct = Array.from(node.children).find((child) => child.tagName === 'A');
          return direct?.textContent.replace(/\s+/g, ' ').trim() || '';
        });
      const entryRect = entry.getBoundingClientRect();
      const hero = document.querySelector('.new-mv_wrap') || document.querySelector('.new-mv');
      const styleMetrics = (node) => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        const lineHeight = parseFloat(style.lineHeight);
        return { font: parseFloat(style.fontSize), height: Math.round(rect.height), lines: Math.round(rect.height / lineHeight) };
      };
      const nativeRecommendation = document.querySelector('#bj-v5-injected ~ h2.m_tit');
      const nativeCatalog = document.querySelector('.m_outer > .prodList_wrap');
      return {
        entryTop: Math.round(entryRect.top + window.scrollY),
        entryBottom: Math.round(entryRect.bottom + window.scrollY),
        title: entry.querySelector('.bj-hce-title')?.textContent.replace(/\s+/g, ' ').trim() || '',
        removedCopyPresent: entry.textContent.includes('제품·약정·관리방식까지 한 번에 비교해 맞는 혜택만 안내해 드립니다.'),
        primary: {
          text: primary?.textContent.trim() || '',
          href: primary?.getAttribute('href') || '',
          consult: primary?.getAttribute('data-bj-consult') || '',
        },
        secondary: {
          text: secondary?.textContent.trim() || '',
          href: secondary?.getAttribute('href') || '',
        },
        hierarchy: {
          heroBeforeCategory: hero?.nextElementSibling === category,
          categoryBeforePromo: category.nextElementSibling === promo,
          promoBeforeEntry: promo.nextElementSibling === entry,
          entryBeforeBenefits: entry.nextElementSibling === benefits,
        },
        typography: {
          title: styleMetrics(entry.querySelector('.bj-hce-title')),
        },
        promo: {
          total: promoCards.length,
          visible: visiblePromoCards.length,
          toggle: promo.querySelector('[data-bj-hgp-toggle]')?.textContent.trim() || '',
          subcopy: promo.querySelector('.bj-hgp-half-copy p')?.textContent.trim() || '',
          bounds: (() => {
            const rect = promo.getBoundingClientRect();
            return { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) };
          })(),
          firstRows: visiblePromoCards.slice(0, 4).map((card) => {
            const rect = card.getBoundingClientRect();
            return { left: Math.round(rect.left), top: Math.round(rect.top), width: Math.round(rect.width) };
          }),
        },
        hero: {
          count: slides.length,
          counter: document.querySelector('.new-mv_nav')?.textContent.replace(/\s+/g, ' ').trim() || '',
          currentIndex: window.jQuery?.('.new-mv')?.slick('slickCurrentSlide'),
          autoplay: window.jQuery?.('.new-mv')?.slick('getSlick')?.options?.autoplay,
          slides: slides.map((slide) => ({
            video: Boolean(slide.querySelector('video.billyjo-video-hero__media, video')),
            label: slide.querySelector('video')?.getAttribute('aria-label') || slide.querySelector('img')?.alt || '',
            href: slide.querySelector('a')?.getAttribute('href') || '',
            consult: slide.querySelector('a')?.getAttribute('data-bj-consult') || '',
          })),
          clonedLinks: Array.from(document.querySelectorAll('.new-mv .slick-slide.slick-cloned')).map((slide) => ({
            alt: slide.querySelector('img')?.alt || '',
            href: slide.querySelector('a')?.getAttribute('href') || '',
            consult: slide.querySelector('a')?.getAttribute('data-bj-consult') || '',
          })),
        },
        mobileNav,
        drawerGroups: Array.from(document.querySelectorAll('.mobile__aside .bj-aside-group-label')).map((node) => node.textContent.trim()),
        desktopNav,
        searchPlaceholder: document.querySelector('header input[placeholder]')?.getAttribute('placeholder') || '',
        quickDisplay: (() => {
          const node = document.querySelector('.new-qb');
          return node ? getComputedStyle(node).display : 'missing';
        })(),
        stickyExists: Boolean(document.querySelector('#bj-home-sticky-actions')),
        benefitsA11y: (() => {
          const stack = benefits.querySelector('.bj-hbenefit-stack');
          return { tabindex: stack?.getAttribute('tabindex'), role: stack?.getAttribute('role'), aria: stack?.getAttribute('aria-label') || '' };
        })(),
        nativeRecommendation: nativeRecommendation ? getComputedStyle(nativeRecommendation).display : 'missing',
        nativeCatalog: nativeCatalog ? getComputedStyle(nativeCatalog).display : 'missing',
        documentHeight: document.documentElement.scrollHeight,
        viewportWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      };
    });

    assert(intercepts > 0, `${width}px: local inject was not intercepted`);
    assert(result.title === '렌탈료·사은품, 내 조건으로 3초 비교', `${width}px: entry title mismatch`);
    assert(!result.removedCopyPresent, `${width}px: removed comparison copy is still rendered`);
    assert(result.primary.text === '내 조건으로 최대혜택 찾기' && result.primary.href === '/html/dh/counsel' && result.primary.consult === '1', `${width}px: primary CTA contract mismatch`);
    assert(result.secondary.text === '상품 먼저 보기' && result.secondary.href === '/html/dh_prod/prod_list/1-8', `${width}px: secondary CTA contract mismatch`);
    assert(Object.values(result.hierarchy).every(Boolean), `${width}px: section hierarchy mismatch (${JSON.stringify(result.hierarchy)})`);
    assert(result.promo.total === 24 && result.promo.visible === 12 && result.promo.toggle === '프로모션 상품 12개 더보기', `${width}px: progressive promo mismatch (${JSON.stringify(result.promo)})`);
    assert(result.promo.firstRows[0].top === result.promo.firstRows[1].top && result.promo.firstRows[0].left < result.promo.firstRows[1].left && result.promo.firstRows[2].top > result.promo.firstRows[0].top, `${width}px: promotion products are not two per row (${JSON.stringify(result.promo.firstRows)})`);
    assert(result.promo.bounds.left >= 0 && result.promo.bounds.right <= width && result.promo.bounds.width <= 1280, `${width}px: relocated promo bounds mismatch (${JSON.stringify(result.promo.bounds)})`);
    assert(/^11월 혜택 종료까지/.test(result.promo.subcopy), `${width}px: monthly urgency copy mismatch`);
    assert(result.hero.count === 4 && result.hero.counter.endsWith('/ 4'), `${width}px: hero count mismatch (${JSON.stringify(result.hero)})`);
    assert(result.hero.currentIndex === 0 && result.hero.autoplay === false, `${width}px: hero carousel still advances automatically (${JSON.stringify(result.hero)})`);
    assert(result.hero.slides[0]?.video && result.hero.slides[0]?.label === '빌리조 11월 프로모션 영상', `${width}px: video is not the first hero (${JSON.stringify(result.hero.slides)})`);
    assert(result.hero.slides.slice(1).every((slide) => slide.label && slide.href === '/html/dh/counsel' && slide.consult === '1'), `${width}px: retained image hero destination mismatch (${JSON.stringify(result.hero.slides)})`);
    assert(result.nativeRecommendation === 'none' && result.nativeCatalog === 'none', `${width}px: duplicated native product modules remain`);
    assert(result.benefitsA11y.tabindex === '0' && result.benefitsA11y.role === 'region' && result.benefitsA11y.aria.includes('혜택 6개'), `${width}px: benefit scroller accessibility mismatch`);
    assert(result.scrollWidth <= Math.max(result.viewportWidth, width) + 1, `${width}px: horizontal overflow (${result.scrollWidth}/${result.viewportWidth}; requested ${width})`);

    if (width <= 767) {
      assert(result.mobileNav.length >= 10 && result.mobileNav.includes('물·공기·청소가전') && result.mobileNav.includes('냉장가전') && result.mobileNav.includes('자동차 장기렌트'), `${width}px: previous mobile category menu was not restored (${JSON.stringify(result.mobileNav)})`);
      assert(!result.mobileNav.includes('인기상품') && !result.mobileNav.includes('3초견적') && result.drawerGroups.length === 0, `${width}px: simplified navigation remnants remain (${JSON.stringify({ mobileNav: result.mobileNav, drawerGroups: result.drawerGroups })})`);
      assert(result.typography.title.font <= 22 && result.typography.title.lines <= 2, `${width}px: compact entry typography regressed (${JSON.stringify(result.typography)})`);
      assert(result.quickDisplay === 'none' && result.stickyExists, `${width}px: mobile floating controls were not consolidated`);
      await page.evaluate(() => window.scrollTo(0, 700));
      await page.waitForFunction(() => document.querySelector('#bj-home-sticky-actions')?.classList.contains('is-visible'));
      await page.waitForTimeout(260);
      const sticky = await page.evaluate(() => {
        const node = document.querySelector('#bj-home-sticky-actions');
        const rect = node.getBoundingClientRect();
        return {
          primary: node.querySelector('.bj-hsa-primary')?.textContent.trim(),
          secondary: node.querySelector('.bj-hsa-secondary')?.textContent.trim(),
          bottom: Math.round(innerHeight - rect.bottom),
          inside: rect.left >= 0 && rect.right <= innerWidth,
          ariaHidden: node.getAttribute('aria-hidden'),
          inert: node.inert,
        };
      });
      assert(sticky.primary === '최대혜택 찾기' && sticky.secondary === '문의하기' && sticky.inside && sticky.bottom >= 0 && sticky.ariaHidden === 'false' && !sticky.inert, `${width}px: sticky action contract mismatch (${JSON.stringify(sticky)})`);
    } else {
      assert(result.desktopNav.length >= 10 && result.desktopNav.includes('물·공기·청소가전') && result.desktopNav.includes('냉장가전') && result.desktopNav.includes('자동차 장기렌트'), `${width}px: previous desktop menu was not restored (${JSON.stringify(result.desktopNav)})`);
      assert(result.documentHeight < 7500, `${width}px: desktop page is still excessively long (${result.documentHeight}px)`);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator('#bj-home-conversion-entry .bj-hce-primary').click();
    await page.locator('[data-bj-lead-step="contact"]').waitFor({ state: 'visible', timeout: 10000 });
    assert((await page.locator('.bj-reserve-title').textContent()).trim() === '3초 견적·제품 추천', `${width}px: primary CTA did not open the existing funnel`);
    const tracked = await page.evaluate(() => Array.isArray(window.dataLayer) && window.dataLayer.some((item) => item?.event === 'bj_home_entry_click' && item?.choice === 'consult'));
    assert(tracked, `${width}px: consult CTA diagnostic event was not captured`);

    const relevantErrors = pageErrors.filter((message) => /home-conversion|SyntaxError|ReferenceError|TypeError/.test(message));
    assert(relevantErrors.length === 0, `${width}px: relevant page errors (${relevantErrors.join(' | ')})`);
    return { width, entryTop: result.entryTop, promoVisible: result.promo.visible, heroSlides: result.hero.count, documentHeight: result.documentHeight };
  } finally {
    await page.close();
  }
}

async function inspectPromotionFallback(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.route('**/v1/promotions/current?**', async (route) => {
    await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ detail: 'qa unavailable' }) });
  });
  await page.route(CORE_RE, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', headers: { 'access-control-allow-origin': '*' }, body: injectSource });
  });
  try {
    await page.goto('https://billyjo.co.kr/?qa=home-conversion-promo-fallback', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.locator('#bj-home-conversion-entry').waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('#bj-v5-injected').waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(5600);
    const result = await page.evaluate(() => {
      const heading = document.querySelector('#bj-v5-injected ~ h2.m_tit');
      const catalog = document.querySelector('.m_outer > .prodList_wrap');
      return {
        promoExists: Boolean(document.querySelector('#bj-home-gift-promos')),
        promoReady: document.body.classList.contains('bj-home-promo-ready'),
        productFallback: document.querySelector('#bj-home-conversion-entry .bj-hce-secondary')?.getAttribute('href') || '',
        nativeRecommendation: heading ? getComputedStyle(heading).display : 'missing',
        nativeCatalog: catalog ? getComputedStyle(catalog).display : 'missing',
      };
    });
    assert(!result.promoExists && !result.promoReady, `fallback: stale promotion state (${JSON.stringify(result)})`);
    assert(result.productFallback === '/html/dh_prod/prod_list/1-8', `fallback: product link is not a real destination (${JSON.stringify(result)})`);
    assert(result.nativeRecommendation !== 'none' && result.nativeCatalog !== 'none', `fallback: native product discovery stayed hidden (${JSON.stringify(result)})`);
    return result;
  } finally {
    await page.close();
  }
}

async function inspectHeroSourceOrderFixture(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const fixtureUrl = 'https://billyjo.co.kr/?qa=hero-source-order-fixture';
  await page.route(fixtureUrl, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: `<!doctype html><html><head>
        <script src="/js/jquery-3.4.1.js"></script>
        <script src="/js/slick.min.js"></script>
      </head><body>
        <div class="new-mv_wrap"><div class="new-mv">
          <div class="item"><img src="https://example.com/257819f60f7d71ce6ac88ddcd6f43863.png" alt=""></div>
          <div class="item"><video class="billyjo-video-hero__media"></video></div>
          <div class="item"><img src="https://example.com/9f88ad8e3e55be589f6e6a1ff97e77e8.png" alt=""></div>
          <div class="item"><img src="https://example.com/hero-loss-138manwon.png" alt=""></div>
        </div></div>
        <script>window.jQuery('.new-mv').slick({ autoplay:false, arrows:false });</script>
        <script src="/qa-local-inject.js"></script>
      </body></html>`,
    });
  });
  await page.route('https://billyjo.co.kr/qa-local-inject.js', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: injectSource });
  });
  try {
    await page.goto(fixtureUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => document.querySelector('.new-mv')?.getAttribute('data-bj-home-curated') === '1', null, { timeout: 15000 });
    const slides = await page.evaluate(() => Array.from(document.querySelectorAll('.new-mv .slick-slide:not(.slick-cloned)')).map((slide) => ({
      video: Boolean(slide.querySelector('video.billyjo-video-hero__media, video')),
      source: slide.querySelector('img')?.src || '',
    })));
    assert(slides.length === 4 && slides[0]?.video, `source-order fixture: video was not promoted to first (${JSON.stringify(slides)})`);
    assert(slides[1]?.source.includes('hero-loss-138manwon.png') && slides[2]?.source.includes('257819f60f7d71ce6ac88ddcd6f43863.png') && slides[3]?.source.includes('9f88ad8e3e55be589f6e6a1ff97e77e8.png'), `source-order fixture: configured image order was not enforced (${JSON.stringify(slides)})`);
    return slides;
  } finally {
    await page.close();
  }
}

async function inspectHeroIncompleteFixture(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const fixtureUrl = 'https://billyjo.co.kr/?qa=hero-incomplete-fixture';
  await page.route(fixtureUrl, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: `<!doctype html><html><head>
        <script src="/js/jquery-3.4.1.js"></script>
        <script src="/js/slick.min.js"></script>
      </head><body>
        <div class="new-mv_wrap"><div class="new-mv">
          <div class="item"><video class="billyjo-video-hero__media"></video></div>
          <div class="item"><img src="https://example.com/hero-loss-138manwon.png" alt=""></div>
          <div class="item"><img src="https://example.com/257819f60f7d71ce6ac88ddcd6f43863.png" alt=""></div>
        </div></div>
        <script>window.jQuery('.new-mv').slick({ autoplay:true, autoplaySpeed:100, arrows:false, responsive:[{ breakpoint:640, settings:{ dots:false } }] });</script>
        <script src="/qa-local-inject.js"></script>
      </body></html>`,
    });
  });
  await page.route('https://billyjo.co.kr/qa-local-inject.js', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: injectSource });
  });
  try {
    await page.goto(fixtureUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => window.jQuery?.('.new-mv')?.slick('getSlick')?.options?.autoplay === false, null, { timeout: 15000 });
    await page.waitForTimeout(900);
    const result = await page.evaluate(() => ({
      curated: document.querySelector('.new-mv')?.getAttribute('data-bj-home-curated') || '',
      slideCount: document.querySelectorAll('.new-mv .slick-slide:not(.slick-cloned)').length,
      currentIndex: window.jQuery('.new-mv').slick('slickCurrentSlide'),
      autoplay: window.jQuery('.new-mv').slick('getSlick').options.autoplay,
    }));
    assert(!result.curated && result.slideCount === 3, `incomplete fixture: original slides were not preserved (${JSON.stringify(result)})`);
    assert(result.currentIndex === 0 && result.autoplay === false, `incomplete fixture: hero still auto-advances (${JSON.stringify(result)})`);
    await page.setViewportSize({ width: 800, height: 844 });
    await page.waitForTimeout(900);
    const afterResize = await page.evaluate(() => ({
      currentIndex: window.jQuery('.new-mv').slick('slickCurrentSlide'),
      autoplay: window.jQuery('.new-mv').slick('getSlick').options.autoplay,
    }));
    assert(afterResize.currentIndex === 0 && afterResize.autoplay === false, `incomplete fixture: responsive refresh restored autoplay (${JSON.stringify(afterResize)})`);
    return { ...result, afterResize };
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [];
    for (const [width, height] of [[320, 760], [390, 844], [430, 900], [1280, 900], [1920, 1080]]) {
      results.push(await inspect(browser, width, height));
    }
    const heroSourceOrderFixture = await inspectHeroSourceOrderFixture(browser);
    const heroIncompleteFixture = await inspectHeroIncompleteFixture(browser);
    const fallback = await inspectPromotionFallback(browser);
    console.log(JSON.stringify({ contract: 'ok', results, heroSourceOrderFixture, heroIncompleteFixture, fallback }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});
