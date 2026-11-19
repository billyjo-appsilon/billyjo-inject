const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const injectSource = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');
const logoFiles = [
  'wells-horizontal-20261119.png',
  'lg-electronics-horizontal-20261119.png',
  'chungho-horizontal-20261119.png',
  'cuckoo-horizontal-20261119.png',
  'ruhens-horizontal-20261119.png',
  'coway-horizontal-20261119.png',
  'quming-horizontal-20261119.png',
  'cesco-horizontal-20261119.png',
  'samsung-horizontal-20261119.png',
];
const logoAssets = new Map(logoFiles.map((file) => [
  file,
  fs.readFileSync(path.join(__dirname, '..', 'images', 'brands', file)),
]));

(async () => {
  const browser = await chromium.launch({ headless: true });
  const cases = [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  for (const testCase of cases) {
    const page = await browser.newPage({ viewport: testCase });
    let cartPostBody = '';
    await page.route(/cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject@[^/]+\/inject(?:\.min)?\.js/, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: injectSource });
    });
    await page.route('**/images/brands/*-horizontal-20261119.png', async (route) => {
      const file = path.basename(new URL(route.request().url()).pathname);
      const body = logoAssets.get(file);
      if (!body) return route.continue();
      await route.fulfill({ status: 200, contentType: 'image/png', body });
    });
    await page.route('**/html/dh_prod/prod_view/24129', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: '<form name="order">' +
          '<input name="public_model_no" value="WP610NWA 6개월택배">' +
          '<input name="prod_model_no" value="WP610NWA 6개월택배">' +
          '<input name="prod_name" value="웰스 미미 직수 무전원 정수기 (정수)">' +
          '<input name="cate_no" value="1-8">' +
          '</form><a class="month_box layer_price" data-supcode="20210222" data-supname="교원웰스" data-month="5년(5년의무)" data-month_key="48" data-price="8,900" data-dcprice="0" data-rebate="126000"></a>',
      });
    });
    await page.route('**/html/dh_order/shop_cart', async (route) => {
      cartPostBody = route.request().postData() || '';
      await route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: '<main>cart ok</main>' });
    });
    await page.goto('https://billyjo.co.kr/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('#bj-home-gift-promos', { timeout: 30000 });
    try {
      await page.waitForFunction(() => {
        const products = [...document.querySelectorAll('#bj-home-gift-promos .bj-hgp-image > img:not(.bj-hgp-brand-logo)')];
        const logos = [...document.querySelectorAll('#bj-home-gift-promos .bj-hgp-brand-logo')];
        return products.length === 24 && logos.length === 24 &&
          products.concat(logos).every((image) => image.complete && image.naturalWidth > 0);
      }, null, { timeout: 30000 });
    } catch (error) {
      const failedImages = await page.evaluate(() => [...document.querySelectorAll('#bj-home-gift-promos img')]
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.src));
      throw new Error(`${testCase.name}: image load timeout (${failedImages.join(', ')})`, { cause: error });
    }
    await page.waitForTimeout(10000);

    const result = await page.evaluate(() => {
      const section = document.querySelector('#bj-home-gift-promos');
      const heading = [...document.querySelectorAll('h2')].find((node) => node.textContent.includes('이달의 추천제품'));
      const cards = [...document.querySelectorAll('.bj-hgp-card')];
      const bands = [...document.querySelectorAll('.bj-hgp-band')];
      const menuLabels = [...document.querySelectorAll('.bj-best-gnb, .bj-newlywed-cat')]
        .map((node) => node.textContent.replace(/\s+/g, ' ').trim());
      return {
        cards: cards.map((card) => ({
          id: card.getAttribute('data-bj-hgp-product'),
          tier: card.getAttribute('data-bj-hgp-tier'),
          text: card.textContent.replace(/\s+/g, ' ').trim(),
          regularText: card.querySelector('.bj-hgp-regular')?.textContent.replace(/\s+/g, ' ').trim() || '',
          priceText: card.querySelector('.bj-hgp-price')?.textContent.replace(/\s+/g, ' ').trim() || '',
          href: card.querySelector('.bj-hgp-main')?.href || '',
          imageLoaded: card.querySelector('img').naturalWidth > 0,
          verticalLayout: (() => {
            const imageRect = card.querySelector('.bj-hgp-image').getBoundingClientRect();
            const infoRect = card.querySelector('.bj-hgp-info').getBoundingClientRect();
            return imageRect.bottom <= infoRect.top + 1 && Math.abs(imageRect.left - infoRect.left) < 4;
          })(),
          imageWidth: card.querySelector('.bj-hgp-image').getBoundingClientRect().width,
          badgeTopOffset: (() => {
            const imageRect = card.querySelector('.bj-hgp-image').getBoundingClientRect();
            const badgeRect = card.querySelector('.bj-hgp-discount').getBoundingClientRect();
            return badgeRect.top - imageRect.top;
          })(),
          cardPadding: parseFloat(getComputedStyle(card).paddingTop),
          cardHeight: card.getBoundingClientRect().height,
          cardBackground: getComputedStyle(card).backgroundColor,
          cardBackgroundImage: getComputedStyle(card).backgroundImage,
          imageBackground: getComputedStyle(card.querySelector('.bj-hgp-image')).backgroundColor,
          imageBackgroundImage: getComputedStyle(card.querySelector('.bj-hgp-image')).backgroundImage,
          hasRegularPrice: !!card.querySelector('.bj-hgp-regular'),
          hasReviews: !!card.querySelector('.bj-hgp-reviews'),
          reviewText: card.querySelector('.bj-hgp-reviews')?.textContent.replace(/\s+/g, ' ').trim() || '',
          badgeText: card.querySelector('.bj-hgp-discount').textContent.replace(/\s+/g, ' ').trim(),
          officialPromoBadge: !card.querySelector('.bj-hgp-discount').classList.contains('is-benefit'),
          brandLogoLoaded: card.querySelector('.bj-hgp-brand-logo')?.naturalWidth > 0,
          brandLogoAlt: card.querySelector('.bj-hgp-brand-logo')?.alt || '',
          brandLogoSrc: card.querySelector('.bj-hgp-brand-logo')?.src || '',
          brandLogoBlendMode: getComputedStyle(card.querySelector('.bj-hgp-brand-logo')).mixBlendMode,
          brandLogoHeight: card.querySelector('.bj-hgp-brand-logo').getBoundingClientRect().height,
          brandLogoWidth: card.querySelector('.bj-hgp-brand-logo').getBoundingClientRect().width,
          brandLogoTransform: getComputedStyle(card.querySelector('.bj-hgp-brand-logo')).transform,
          productImageTransform: getComputedStyle(card.querySelector('.bj-hgp-image > img:not(.bj-hgp-brand-logo)')).transform,
          brandLogoWrapperHeight: card.querySelector('.bj-hgp-brandmark').getBoundingClientRect().height,
          brandLogoOverlay: (() => {
            const image = card.querySelector('.bj-hgp-image').getBoundingClientRect();
            const mark = card.querySelector('.bj-hgp-brandmark').getBoundingClientRect();
            return {
              position: getComputedStyle(card.querySelector('.bj-hgp-brandmark')).position,
              insideImage: mark.left >= image.left && mark.right <= image.right && mark.top >= image.top && mark.bottom <= image.bottom,
              leftGap: mark.left - image.left,
              bottomGap: image.bottom - mark.bottom,
              parentIsImage: card.querySelector('.bj-hgp-brandmark').parentElement.classList.contains('bj-hgp-image'),
            };
          })(),
          nameModelGap: (() => {
            const nameRect = card.querySelector('.bj-hgp-name').getBoundingClientRect();
            const modelRect = card.querySelector('.bj-hgp-model').getBoundingClientRect();
            return modelRect.top - nameRect.bottom;
          })(),
          infoTextAlign: getComputedStyle(card.querySelector('.bj-hgp-info')).textAlign,
          hasPriceBox: !!card.querySelector('.bj-hgp-pricebox'),
          priceBoxHeight: card.querySelector('.bj-hgp-pricebox').getBoundingClientRect().height,
          priceRowLayout: (() => {
            const row = card.querySelector('.bj-hgp-price');
            const label = row.querySelector('.bj-hgp-price-label').getBoundingClientRect();
            const value = row.querySelector('.bj-hgp-price-value').getBoundingClientRect();
            const style = getComputedStyle(row);
            return {
              display: style.display,
              justifyContent: style.justifyContent,
              labelLeft: label.left,
              valueRight: value.right,
              rowLeft: row.getBoundingClientRect().left,
              rowRight: row.getBoundingClientRect().right,
            };
          })(),
          hasActions: !!card.querySelector('.bj-hgp-actions'),
          cartLabel: card.querySelector('.bj-hgp-cart')?.textContent.trim() || '',
          detailLabel: card.querySelector('.bj-hgp-detail')?.textContent.trim() || '',
          detailHeight: card.querySelector('.bj-hgp-detail')?.getBoundingClientRect().height || 0,
          cartHeight: card.querySelector('.bj-hgp-cart')?.getBoundingClientRect().height || 0,
          detailFontSize: parseFloat(getComputedStyle(card.querySelector('.bj-hgp-detail')).fontSize),
          cartFontSize: parseFloat(getComputedStyle(card.querySelector('.bj-hgp-cart')).fontSize),
        })),
        title: section.querySelector('.bj-hgp-title').textContent.replace(/\s+/g, ' ').trim(),
        countdown: [...section.querySelectorAll('[data-bj-countdown]')].map((node) => ({
          unit: node.getAttribute('data-bj-countdown'),
          value: node.textContent,
        })),
        countdownVisible: (() => {
          const timer = section.querySelector('[data-bj-week-countdown]');
          return !!timer && getComputedStyle(timer).display !== 'none' && timer.getBoundingClientRect().height > 0;
        })(),
        countdownAria: section.querySelector('[data-bj-week-countdown]')?.getAttribute('aria-label') || '',
        headingCentered: getComputedStyle(section.querySelector('.bj-hgp-heading')).alignItems === 'center' &&
          getComputedStyle(section.querySelector('.bj-hgp-head')).textAlign === 'center',
        bands: bands.map((band) => ({
          tier: band.getAttribute('data-bj-hgp-band'),
          cardCount: band.querySelectorAll('.bj-hgp-card').length,
          columnCount: getComputedStyle(band.querySelector('.bj-hgp-grid')).gridTemplateColumns.split(' ').length,
        })),
        beforeNativeRecommendation: !!(section.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING),
        menuLabels,
        oldVisibleMenuCount: [...document.querySelectorAll('.bj-best-gnb, .bj-newlywed-cat')]
          .filter((node) => node.textContent.includes('시크릿 1:1 패키지')).length,
        sectionVisible: getComputedStyle(section).display !== 'none' && section.getBoundingClientRect().height > 0,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      };
    });

    if (result.cards.length !== 24) throw new Error(`${testCase.name}: expected twenty-four promo cards`);
    if (result.cards.map((card) => card.id).join(',') !== '24129,11327,3657,35287,34614,32596,10914,23052,32586,32100,28918,27223,32918,33000,22764,10428,35730,32592,27476,27503,29036,33632,31903,32406') {
      throw new Error(`${testCase.name}: promo card order is wrong`);
    }
    if (result.title !== '빌리조 위크 - 이번주 한정') throw new Error(`${testCase.name}: weekly title is wrong`);
    if (!result.headingCentered) throw new Error(`${testCase.name}: weekly heading is not centered`);
    if (!result.countdownVisible) throw new Error(`${testCase.name}: weekly countdown is hidden`);
    if (result.countdown.map((item) => item.unit).join(',') !== 'day,hour,minute,second') {
      throw new Error(`${testCase.name}: countdown unit order is wrong`);
    }
    if (!result.countdown.every((item) => /^\d{2}$/.test(item.value))) {
      throw new Error(`${testCase.name}: countdown values must be two digits`);
    }
    if (!/^이번주 특가 종료까지 \d+일 \d+시간 \d+분 \d+초$/.test(result.countdownAria)) {
      throw new Error(`${testCase.name}: countdown accessible label is wrong`);
    }
    const expectedTiers = ['1만원 언더', '1만원대', '2만원대', '3만원대', '4만원대', '5만원대'];
    if (result.bands.map((band) => band.tier).join(',') !== expectedTiers.join(',')) {
      throw new Error(`${testCase.name}: price band order is wrong`);
    }
    if (!result.bands.every((band) => band.cardCount === 4)) {
      throw new Error(`${testCase.name}: every price band must contain four cards`);
    }
    if (!result.bands.every((band) => band.columnCount === 2)) {
      throw new Error(`${testCase.name}: every price band must render two cards per row`);
    }
    for (const expected of ['11월 특가', '4.9 · 후기 23개', '4.9 · 후기 58개', '4.8 · 후기 149개', '4.8 · 후기 173개', '공기청정기 1대 증정 대상', '추가 사은품 증정']) {
      if (!result.cards.some((card) => card.text.includes(expected))) {
        throw new Error(`${testCase.name}: missing ${expected}`);
      }
    }
    const discountedPrices = {
      '34614': ['정가 월 26,900원', '할인가 월 13,450원~'],
      '32596': ['정가 월 20,900원', '할인가 월 10,450원~'],
      '32586': ['정가 월 39,900원', '할인가 월 20,950원~'],
    };
    for (const [id, expected] of Object.entries(discountedPrices)) {
      const card = result.cards.find((item) => item.id === id);
      if (!card || card.regularText !== expected[0] || card.priceText !== expected[1]) {
        throw new Error(`${testCase.name}: sourced regular/sale price mismatch for ${id}`);
      }
    }
    if (result.cards.filter((card) => card.officialPromoBadge).length !== 3) {
      throw new Error(`${testCase.name}: only three approved promotion badges may render`);
    }
    if (result.cards.filter((card) => card.hasRegularPrice).length !== 3) {
      throw new Error(`${testCase.name}: exactly three cards must show sourced regular prices`);
    }
    if (result.cards.filter((card) => card.hasReviews).length !== 4) {
      throw new Error(`${testCase.name}: exactly four model-verified review summaries must render`);
    }
    if (result.cards.some((card) => card.text.includes('50% 할인'))) {
      throw new Error(`${testCase.name}: an unapproved generic 50% badge remains`);
    }
    if (result.cards.some((card) => /\d+% 할인/.test(card.badgeText))) {
      throw new Error(`${testCase.name}: contradictory percentage badge remains beside regular/sale prices`);
    }
    const reviewByProduct = {
      '24129': '★4.9 · 후기 23개',
      '11327': '★4.9 · 후기 58개',
      '34614': '★4.8 · 후기 149개',
      '32586': '★4.8 · 후기 173개',
    };
    for (const [id, expectedReview] of Object.entries(reviewByProduct)) {
      const card = result.cards.find((item) => item.id === id);
      if (!card || card.reviewText !== expectedReview) {
        throw new Error(`${testCase.name}: model-bound review mismatch for ${id}`);
      }
    }
    if (!result.cards.every((card) => card.imageLoaded)) throw new Error(`${testCase.name}: promo image failed`);
    if (!result.cards.every((card) => card.brandLogoLoaded && / 로고$/.test(card.brandLogoAlt))) {
      throw new Error(`${testCase.name}: brand logo failed`);
    }
    const wellsCard = result.cards.find((card) => card.id === '24129');
    if (!wellsCard || !wellsCard.brandLogoSrc.includes('wells-horizontal-20261119.png') || wellsCard.brandLogoBlendMode !== 'normal') {
      throw new Error(`${testCase.name}: transparent Wells logo is not active`);
    }
    const qumingCard = result.cards.find((card) => card.id === '35287');
    if (!qumingCard || !qumingCard.brandLogoSrc.includes('quming-horizontal-20261119.png')) {
      throw new Error(`${testCase.name}: supplied Quming logo is not active`);
    }
    const lgCard = result.cards.find((card) => card.id === '11327');
    if (!lgCard || !lgCard.brandLogoSrc.includes('lg-electronics-horizontal-20261119.png')) {
      throw new Error(`${testCase.name}: supplied LG Electronics logo is not active`);
    }
    const expectedLogoHeight = testCase.name === 'mobile' ? 18 : 20;
    const expectedWrapperHeight = testCase.name === 'mobile' ? 22 : 24;
    if (!result.cards.every((card) => Math.abs(card.brandLogoHeight - expectedLogoHeight) < 0.5 &&
        Math.abs(card.brandLogoWrapperHeight - expectedWrapperHeight) < 0.5 &&
        card.brandLogoWidth <= 120.5 && card.brandLogoBlendMode === 'normal')) {
      throw new Error(`${testCase.name}: brand logo heights are not normalized`);
    }
    if (!result.cards.every((card) => card.brandLogoOverlay.position === 'absolute' &&
        card.brandLogoOverlay.insideImage && card.brandLogoOverlay.parentIsImage &&
        card.brandLogoOverlay.leftGap >= 0 && card.brandLogoOverlay.leftGap <= 9 &&
        card.brandLogoOverlay.bottomGap >= 0 && card.brandLogoOverlay.bottomGap <= 8)) {
      throw new Error(`${testCase.name}: brand logo must overlay the product image`);
    }
    if (!result.cards.every((card) => card.productImageTransform === 'matrix(1.18, 0, 0, 1.18, 0, 0)' && card.brandLogoTransform === 'none')) {
      throw new Error(`${testCase.name}: product thumbnails must scale to 1.18 without scaling brand logos`);
    }
    if (testCase.name === 'mobile' && result.cards.some((card) => card.nameModelGap > 2)) {
      throw new Error(`mobile: product name/model gap is too large (${Math.max(...result.cards.map((card) => card.nameModelGap))}px)`);
    }
    if (!result.cards.every((card) => card.infoTextAlign === 'left' && card.hasPriceBox)) {
      throw new Error(`${testCase.name}: card information hierarchy is not left-aligned`);
    }
    if (!result.cards.every((card) => card.priceRowLayout.display === 'flex' &&
        card.priceRowLayout.justifyContent === 'space-between' &&
        Math.abs(card.priceRowLayout.labelLeft - card.priceRowLayout.rowLeft) < 1 &&
        Math.abs(card.priceRowLayout.valueRight - card.priceRowLayout.rowRight) < 1)) {
      throw new Error(`${testCase.name}: monthly fee label/value must align to opposite edges`);
    }
    if (testCase.name === 'mobile' && result.cards.some((card) => card.priceBoxHeight > (card.hasRegularPrice ? 39 : 31))) {
      throw new Error(`mobile: price box is too tall (${Math.max(...result.cards.map((card) => card.priceBoxHeight))}px)`);
    }
    if (!result.cards.every((card) => card.cardBackground === 'rgb(255, 255, 255)' && card.imageBackground === 'rgb(255, 255, 255)' &&
        card.cardBackgroundImage === 'none' && card.imageBackgroundImage === 'none')) {
      throw new Error(`${testCase.name}: thumbnail and card backgrounds must use the same solid white`);
    }
    if (!result.cards.every((card) => card.hasActions && card.cartLabel === '담기' && card.detailLabel === '상세보기')) {
      throw new Error(`${testCase.name}: compact card actions are missing`);
    }
    const expectedButtonHeight = testCase.name === 'mobile' ? 28 : 34;
    const expectedButtonFontSize = testCase.name === 'mobile' ? 11 : 13;
    if (!result.cards.every((card) => Math.abs(card.detailHeight - expectedButtonHeight) < 0.5 &&
        Math.abs(card.cartHeight - expectedButtonHeight) < 0.5 &&
        Math.abs(card.detailFontSize - expectedButtonFontSize) < 0.1 &&
        Math.abs(card.cartFontSize - expectedButtonFontSize) < 0.1)) {
      throw new Error(`${testCase.name}: action button dimensions are wrong`);
    }
    if (testCase.name === 'mobile' && !result.cards.every((card) => card.verticalLayout)) {
      throw new Error('mobile: promo cards must keep the product image above product info');
    }
    if (testCase.name === 'desktop' && result.cards.some((card) => card.verticalLayout)) {
      throw new Error('desktop: promo cards must use the compact side-by-side layout');
    }
    const maxCardHeight = testCase.name === 'mobile' ? 340 : 300;
    if (!result.cards.every((card) => card.cardHeight <= maxCardHeight)) {
      throw new Error(`${testCase.name}: promo card is too tall (${Math.max(...result.cards.map((card) => card.cardHeight))}px)`);
    }
    const minImageWidth = testCase.name === 'mobile' ? 145 : 175;
    if (!result.cards.every((card) => card.imageWidth >= minImageWidth)) throw new Error(`${testCase.name}: product thumbnail is too small`);
    if (!result.cards.every((card) => card.badgeTopOffset >= 0 && card.badgeTopOffset <= 8)) throw new Error(`${testCase.name}: badge must stay at the thumbnail top`);
    const minPadding = testCase.name === 'mobile' ? 8 : 16;
    if (!result.cards.every((card) => card.cardPadding >= minPadding)) throw new Error(`${testCase.name}: card padding is too tight`);
    if (!result.beforeNativeRecommendation) throw new Error(`${testCase.name}: promo cards must precede native recommendations`);
    if (!result.menuLabels.some((label) => label.includes('프로모션/사은품 확인'))) {
      throw new Error(`${testCase.name}: new menu label is missing`);
    }
    if (result.oldVisibleMenuCount !== 0) throw new Error(`${testCase.name}: old menu label remains visible`);
    if (!result.sectionVisible) throw new Error(`${testCase.name}: promo section is hidden`);
    if (result.horizontalOverflow) throw new Error(`${testCase.name}: horizontal overflow detected`);
    if (testCase.name === 'mobile') {
      if (process.env.BJ_QA_SCREENSHOT) {
        await page.locator('.bj-hgp-band').first().screenshot({ path: process.env.BJ_QA_SCREENSHOT });
      }
      await page.locator('.bj-hgp-cart[data-bj-hgp-cart="24129"]').click();
      await page.locator('.bj-hgp-cart[data-bj-hgp-cart="24129"]').filter({ hasText: '담김 ✓' }).waitFor({ timeout: 10000 });
      const posted = new URLSearchParams(cartPostBody);
      if (posted.get('mode') !== 'cart' || posted.get('public_model_no') !== 'WP610NWA 6개월택배' ||
          posted.get('sup_code') !== '20210222' || posted.get('month') !== '5년(5년의무)' || posted.get('price') !== '8,900') {
        throw new Error(`mobile: cart payload mismatch (${cartPostBody})`);
      }
    }
    console.log(`${testCase.name}: ok`, JSON.stringify(result));
    await page.close();
  }

  // 공식 공기청정기 증정 혜택이 철회되면 가격 할인 문구가 남아 있어도
  // 증정 카드가 포함된 섹션 전체를 fail-closed로 숨긴다.
  const withdrawnGift = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await withdrawnGift.route(/cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject@[^/]+\/inject(?:\.min)?\.js/, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: injectSource });
  });
  await withdrawnGift.route('https://admin2-api.billyjo.co.kr/v1/promotions/current**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json; charset=utf-8',
      body: JSON.stringify({
        success: true,
        data: {
          year_month: '2026-11',
          promotions: [{
            company: '청호나이스',
            benefits: [
              '뉴 러블리트리 정수기 64% 할인 월 13,450원~',
              'B700 살균 리모컨 비데 56% 할인 월 10,450원~',
              'The M 얼음정수기 54% 할인 월 20,950원~',
            ],
          }],
        },
      }),
    });
  });
  await withdrawnGift.goto('https://billyjo.co.kr/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await withdrawnGift.waitForTimeout(3000);
  if (await withdrawnGift.locator('#bj-home-gift-promos').count()) {
    throw new Error('withdrawn-gift: promo section must stay hidden without official gift benefit');
  }
  console.log('withdrawn-gift: ok');
  await withdrawnGift.close();
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
