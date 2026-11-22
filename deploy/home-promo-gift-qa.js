const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const injectSource = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');
const live1MascotUrl = 'https://live.billyjo.co.kr/images/toss-banner-mascot.webp';
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
const productAssetDir = path.join(__dirname, '..', 'images', 'products', 'cutout-20261121');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const cases = [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  for (const testCase of cases) {
    const page = await browser.newPage({ viewport: testCase });
    let cartPostBody = '';
    await page.route(/cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject(?:@[^/]+)?\/inject(?:\.min)?\.js/, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: injectSource });
    });
    await page.route('**/images/brands/*-horizontal-20261119.png', async (route) => {
      const file = path.basename(new URL(route.request().url()).pathname);
      const body = logoAssets.get(file);
      if (!body) return route.continue();
      await route.fulfill({ status: 200, contentType: 'image/png', body });
    });
    await page.route('**/images/products/cutout-20261121/*', async (route) => {
      const file = path.basename(new URL(route.request().url()).pathname);
      const localPath = path.join(productAssetDir, file);
      if (!fs.existsSync(localPath)) return route.continue();
      const contentType = path.extname(file).toLowerCase() === '.webp' ? 'image/webp' : 'image/png';
      await route.fulfill({ status: 200, contentType, body: fs.readFileSync(localPath) });
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
    await page.locator('#bj-home-gift-promos .bj-hgp-half-banner').scrollIntoViewIfNeeded();
    const initialPromoState = await page.evaluate(() => {
      const section = document.querySelector('#bj-home-gift-promos');
      const cards = [...section.querySelectorAll('.bj-hgp-card')];
      const visibleCards = cards.filter((card) => !card.hidden && getComputedStyle(card).display !== 'none');
      const toggle = section.querySelector('[data-bj-hgp-toggle]');
      const titleLines = [...section.querySelectorAll('.bj-hgp-half-copy h2 > *')].map((line) => ({
        text: line.textContent.trim(),
        display: getComputedStyle(line).display,
        top: Math.round(line.getBoundingClientRect().top),
      }));
      return {
        design: section.getAttribute('data-bj-product-card-design') || '',
        total: cards.length,
        visible: visibleCards.length,
        tierVisible: [...section.querySelectorAll('[data-bj-hgp-band]')].map((band) =>
          [...band.querySelectorAll('.bj-hgp-card')].filter((card) => !card.hidden && getComputedStyle(card).display !== 'none').length),
        expanded: toggle.getAttribute('aria-expanded'),
        label: toggle.textContent.trim(),
        titleLines,
      };
    });
    if (initialPromoState.design !== 'vertical-review-right' || initialPromoState.total !== 24 || initialPromoState.visible !== 12 ||
        !initialPromoState.tierVisible.every((count) => count === 2) ||
        initialPromoState.expanded !== 'false' || initialPromoState.label !== '프로모션 상품 12개 더보기') {
      throw new Error(`${testCase.name}: initial progressive promo contract mismatch (${JSON.stringify(initialPromoState)})`);
    }
    if (initialPromoState.titleLines.length !== 2 ||
        initialPromoState.titleLines.map((line) => line.text).join('|') !== '11월도|반값습니다!' ||
        !initialPromoState.titleLines.every((line) => line.display === 'block') ||
        initialPromoState.titleLines[0].top === initialPromoState.titleLines[1].top) {
      throw new Error(`${testCase.name}: campaign title must render as two forced lines (${JSON.stringify(initialPromoState.titleLines)})`);
    }
    await page.locator('[data-bj-hgp-toggle]').click();
    const promoBands = page.locator('#bj-home-gift-promos .bj-hgp-band');
    for (let index = 0; index < await promoBands.count(); index += 1) {
      await promoBands.nth(index).scrollIntoViewIfNeeded();
    }
    try {
      await page.waitForFunction(() => {
        const products = [...document.querySelectorAll('#bj-home-gift-promos .bj-hgp-image > img:not(.bj-hgp-brand-logo)')];
        const logos = [...document.querySelectorAll('#bj-home-gift-promos .bj-hgp-brand-logo')];
        const banner = document.querySelector('#bj-home-gift-promos .bj-hgp-half-visual img');
        return products.length === 24 && logos.length === 24 && banner &&
          products.concat(logos, [banner]).every((image) => image.complete && image.naturalWidth > 0);
      }, null, { timeout: 30000 });
    } catch (error) {
      const imageState = await page.evaluate(() => {
        const products = [...document.querySelectorAll('#bj-home-gift-promos .bj-hgp-image > img:not(.bj-hgp-brand-logo)')];
        const logos = [...document.querySelectorAll('#bj-home-gift-promos .bj-hgp-brand-logo')];
        const banner = document.querySelector('#bj-home-gift-promos .bj-hgp-half-visual img');
        return {
          products: products.length,
          logos: logos.length,
          banner: Boolean(banner),
          failed: products.concat(logos, banner ? [banner] : [])
            .filter((image) => !image.complete || image.naturalWidth === 0)
            .map((image) => image.src),
        };
      });
      throw new Error(`${testCase.name}: image load timeout (${JSON.stringify(imageState)})`, { cause: error });
    }
    const cutoutScreenshotDir = String(process.env.BILLYJO_CUTOUT_SCREENSHOT_DIR || '').trim();
    if (testCase.name === 'mobile' && cutoutScreenshotDir) {
      fs.mkdirSync(cutoutScreenshotDir, { recursive: true });
      const bands = page.locator('#bj-home-gift-promos .bj-hgp-band');
      for (let index = 0; index < await bands.count(); index += 1) {
        await bands.nth(index).scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(cutoutScreenshotDir, `band-${index + 1}.png`) });
      }
    }
    const expandedPromoState = await page.evaluate(() => {
      const section = document.querySelector('#bj-home-gift-promos');
      const cards = [...section.querySelectorAll('.bj-hgp-card')];
      const toggle = section.querySelector('[data-bj-hgp-toggle]');
      return {
        visible: cards.filter((card) => !card.hidden && getComputedStyle(card).display !== 'none').length,
        expanded: toggle.getAttribute('aria-expanded'),
        label: toggle.textContent.trim(),
      };
    });
    if (expandedPromoState.visible !== 24 || expandedPromoState.expanded !== 'true' || expandedPromoState.label !== '프로모션 상품 접기') {
      throw new Error(`${testCase.name}: expanded promo contract mismatch (${JSON.stringify(expandedPromoState)})`);
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
        design: section.getAttribute('data-bj-product-card-design') || '',
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
          horizontalLayout: (() => {
            const imageRect = card.querySelector('.bj-hgp-image').getBoundingClientRect();
            const infoRect = card.querySelector('.bj-hgp-info').getBoundingClientRect();
            return imageRect.right <= infoRect.left + 1 && Math.abs(imageRect.top - infoRect.top) < 8;
          })(),
          cardWidth: card.getBoundingClientRect().width,
          imageWidth: card.querySelector('.bj-hgp-image').getBoundingClientRect().width,
          badgeTopOffset: (() => {
            const imageRect = card.querySelector('.bj-hgp-image').getBoundingClientRect();
            const badge = card.querySelector('.bj-hgp-discount');
            if (!badge) return null;
            const badgeRect = badge.getBoundingClientRect();
            return badgeRect.top - imageRect.top;
          })(),
          badgeLeftOffset: (() => {
            const imageRect = card.querySelector('.bj-hgp-image').getBoundingClientRect();
            const badge = card.querySelector('.bj-hgp-discount');
            if (!badge) return null;
            return badge.getBoundingClientRect().left - imageRect.left;
          })(),
          badgeBorderRadius: card.querySelector('.bj-hgp-discount')
            ? getComputedStyle(card.querySelector('.bj-hgp-discount')).borderRadius
            : '',
          cardPadding: parseFloat(getComputedStyle(card).paddingTop),
          cardHeight: card.getBoundingClientRect().height,
          cardBackground: getComputedStyle(card).backgroundColor,
          cardBackgroundImage: getComputedStyle(card).backgroundImage,
          imageBackground: getComputedStyle(card.querySelector('.bj-hgp-image')).backgroundColor,
          imageBackgroundImage: getComputedStyle(card.querySelector('.bj-hgp-image')).backgroundImage,
          imageOverlay: getComputedStyle(card.querySelector('.bj-hgp-image'), '::after').backgroundImage,
          hasRegularPrice: !!card.querySelector('.bj-hgp-regular'),
          hasReviews: !!card.querySelector('.bj-hgp-reviews'),
          reviewText: card.querySelector('.bj-hgp-reviews')?.textContent.replace(/\s+/g, ' ').trim() || '',
          reviewPlacement: (() => {
            const brandRow = card.querySelector('.bj-hgp-brandrow');
            const brand = card.querySelector('.bj-hgp-brandmark');
            const review = card.querySelector('.bj-hgp-reviews');
            if (!review) return null;
            const rowRect = brandRow.getBoundingClientRect();
            const brandRect = brand.getBoundingClientRect();
            const reviewRect = review.getBoundingClientRect();
            return {
              parentIsBrandRow: review.parentElement === brandRow,
              brandRowInInfo: brandRow.parentElement.classList.contains('bj-hgp-info'),
              sameRow: Math.abs(brandRect.top - reviewRect.top) < 4,
              rightOfBrand: reviewRect.left >= brandRect.right - 1,
              insideRow: reviewRect.right <= rowRect.right + 1,
              fontSize: parseFloat(getComputedStyle(review).fontSize),
            };
          })(),
          badgeText: card.querySelector('.bj-hgp-discount')?.textContent.replace(/\s+/g, ' ').trim() || '',
          officialPromoBadge: Boolean(card.querySelector('.bj-hgp-discount')),
          brandLogoLoaded: card.querySelector('.bj-hgp-brand-logo')?.naturalWidth > 0,
          brandLogoAlt: card.querySelector('.bj-hgp-brand-logo')?.alt || '',
          brandLogoSrc: card.querySelector('.bj-hgp-brand-logo')?.src || '',
          brandLogoBlendMode: getComputedStyle(card.querySelector('.bj-hgp-brand-logo')).mixBlendMode,
          brandLogoHeight: card.querySelector('.bj-hgp-brand-logo').getBoundingClientRect().height,
          brandLogoWidth: card.querySelector('.bj-hgp-brand-logo').getBoundingClientRect().width,
          brandLogoTransform: getComputedStyle(card.querySelector('.bj-hgp-brand-logo')).transform,
          productImageTransform: getComputedStyle(card.querySelector('.bj-hgp-image > img:not(.bj-hgp-brand-logo)')).transform,
          productImageBlendMode: getComputedStyle(card.querySelector('.bj-hgp-image > img:not(.bj-hgp-brand-logo)')).mixBlendMode,
          productImageSrc: card.querySelector('.bj-hgp-image > img:not(.bj-hgp-brand-logo)').src,
          productImageCutoutMarker: card.querySelector('.bj-hgp-image').getAttribute('data-bj-product-cutout'),
          brandLogoWrapperHeight: card.querySelector('.bj-hgp-brandmark').getBoundingClientRect().height,
          brandPlacement: (() => {
            const mark = card.querySelector('.bj-hgp-brandmark').getBoundingClientRect();
            const name = card.querySelector('.bj-hgp-name').getBoundingClientRect();
            return {
              position: getComputedStyle(card.querySelector('.bj-hgp-brandmark')).position,
              parentIsBrandRow: card.querySelector('.bj-hgp-brandmark').parentElement.classList.contains('bj-hgp-brandrow'),
              brandRowInInfo: card.querySelector('.bj-hgp-brandmark').parentElement.parentElement.classList.contains('bj-hgp-info'),
              aboveName: mark.bottom <= name.top + 1,
            };
          })(),
          modelPlacement: (() => {
            const image = card.querySelector('.bj-hgp-image').getBoundingClientRect();
            const node = card.querySelector('.bj-hgp-model');
            const model = node.getBoundingClientRect();
            return {
              position: getComputedStyle(node).position,
              parentIsImage: node.parentElement.classList.contains('bj-hgp-image'),
              insideImage: model.left >= image.left && model.right <= image.right && model.top >= image.top && model.bottom <= image.bottom,
              bottomGap: image.bottom - model.bottom,
              rightGap: image.right - model.right,
              text: node.textContent.replace(/\s+/g, ' ').trim(),
              ariaLabel: node.getAttribute('aria-label') || '',
            };
          })(),
          giftBackground: getComputedStyle(card.querySelector('.bj-hgp-gift')).backgroundImage,
          giftColor: getComputedStyle(card.querySelector('.bj-hgp-gift')).color,
          giftLayout: (() => {
            const gift = card.querySelector('.bj-hgp-gift');
            const price = card.querySelector('.bj-hgp-pricebox');
            const style = getComputedStyle(gift);
            return {
              width: gift.getBoundingClientRect().width,
              priceWidth: price.getBoundingClientRect().width,
              fontSize: parseFloat(style.fontSize),
              textAlign: style.textAlign,
              justifyContent: style.justifyContent,
            };
          })(),
          nameLayout: (() => {
            const name = card.querySelector('.bj-hgp-name');
            const first = name.querySelector('.bj-hgp-name-copy:not([aria-hidden="true"])');
            const duplicate = name.querySelector('.bj-hgp-name-copy[aria-hidden="true"]');
            const style = getComputedStyle(name);
            return {
              whiteSpace: style.whiteSpace,
              lineHeight: parseFloat(style.lineHeight),
              height: name.getBoundingClientRect().height,
              viewportWidth: name.clientWidth,
              textWidth: first.getBoundingClientRect().width,
              isRolling: name.classList.contains('is-rolling'),
              textOverflows: first.getBoundingClientRect().width > name.clientWidth + 1,
              firstText: first.textContent.trim(),
              duplicateText: duplicate.textContent.trim(),
              duplicateAriaHidden: duplicate.getAttribute('aria-hidden'),
              title: name.getAttribute('title'),
              animationName: getComputedStyle(name.querySelector('.bj-hgp-name-track')).animationName,
            };
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
        campaignBanner: (() => {
          const wrapper = section.querySelector('.bj-hgp-half-banner');
          const image = wrapper?.querySelector('.bj-hgp-half-visual img');
          const rect = wrapper?.getBoundingClientRect();
          return {
            exists: Boolean(wrapper && image),
            title: wrapper?.querySelector('h2')?.textContent.replace(/\s+/g, ' ').trim() || '',
            subcopy: wrapper?.querySelector('p')?.textContent.replace(/\s+/g, ' ').trim() || '',
            src: image?.src || '',
            loaded: Boolean(image?.complete && image?.naturalWidth > 0 && image?.naturalHeight > 0),
            visible: Boolean(rect && rect.width > 0 && rect.height > 0 && getComputedStyle(wrapper).display !== 'none'),
            units: [...wrapper.querySelectorAll('[data-bj-month-countdown-unit]')].map((group) => ({
              unit: group.getAttribute('data-bj-month-countdown-unit'),
              value: [...group.querySelectorAll('.bj-hgp-flip-digit')].map((digit) => digit.textContent).join(''),
            })),
            aria: wrapper.querySelector('[data-bj-month-countdown]')?.getAttribute('aria-label') || '',
          };
        })(),
        removedWeeklyNodes: section.querySelectorAll('.bj-hgp-head,.bj-hgp-title,.bj-hgp-countdown,.bj-hgp-source,[data-bj-week-countdown],[data-bj-countdown]').length,
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

    if (result.design !== 'vertical-review-right') throw new Error(`${testCase.name}: product card design marker mismatch`);
    if (result.cards.length !== 24) throw new Error(`${testCase.name}: expected twenty-four promo cards`);
    if (result.cards.map((card) => card.id).join(',') !== '24129,11327,3657,35287,34614,32596,10914,23052,32586,32100,28918,27223,32918,33000,22764,10428,35730,32592,27476,27503,29036,33632,31903,32406') {
      throw new Error(`${testCase.name}: promo card order is wrong`);
    }
    if (!result.campaignBanner.exists || !result.campaignBanner.visible || !result.campaignBanner.loaded) {
      throw new Error(`${testCase.name}: live1 campaign banner is missing or unloaded`);
    }
    if (result.campaignBanner.title !== '11월도 반값습니다!' ||
        result.campaignBanner.subcopy !== '선착순, 재고/사은품 소진시 종료' ||
        result.campaignBanner.src !== live1MascotUrl) {
      throw new Error(`${testCase.name}: live1 campaign banner contract mismatch (${JSON.stringify(result.campaignBanner)})`);
    }
    if (result.campaignBanner.units.map((item) => item.unit).join(',') !== 'day,hour,minute,second' ||
        !result.campaignBanner.units.every((item) => /^\d{2}$/.test(item.value)) ||
        !/^이번 달 특가 마감까지 \d+일 \d+시간 \d+분 \d+초$/.test(result.campaignBanner.aria)) {
      throw new Error(`${testCase.name}: live1 monthly countdown contract mismatch`);
    }
    if (result.removedWeeklyNodes !== 0) throw new Error(`${testCase.name}: removed weekly header/countdown remains`);
    const expectedTiers = ['1만원 언더', '1만원대', '2만원대', '3만원대', '4만원대', '5만원대'];
    if (result.bands.map((band) => band.tier).join(',') !== expectedTiers.join(',')) {
      throw new Error(`${testCase.name}: price band order is wrong`);
    }
    if (!result.bands.every((band) => band.cardCount === 4)) {
      throw new Error(`${testCase.name}: every price band must contain four cards`);
    }
    const expectedColumns = 2;
    if (!result.bands.every((band) => band.columnCount === expectedColumns)) {
      throw new Error(`${testCase.name}: price-band column count mismatch`);
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
    if (result.cards.some((card) => card.badgeText && card.badgeText !== '11월 특가') ||
        result.cards.some((card) => card.text.includes('혜택 집중'))) {
      throw new Error(`${testCase.name}: an unapproved benefit badge remains`);
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
    const expectedLogoHeight = testCase.name === 'mobile' ? 14.4 : 16;
    const expectedWrapperHeight = testCase.name === 'mobile' ? 17 : 20;
    if (!result.cards.every((card) => Math.abs(card.brandLogoHeight - expectedLogoHeight) < 0.5 &&
        Math.abs(card.brandLogoWrapperHeight - expectedWrapperHeight) < 0.5 &&
        card.brandLogoWidth <= (testCase.name === 'mobile' ? 54.5 : 112.5) && card.brandLogoBlendMode === 'normal')) {
      throw new Error(`${testCase.name}: brand logo heights are not normalized`);
    }
    if (!result.cards.every((card) => card.brandPlacement.position === 'static' &&
        card.brandPlacement.parentIsBrandRow && card.brandPlacement.brandRowInInfo && card.brandPlacement.aboveName)) {
      throw new Error(`${testCase.name}: brand logo must sit in the row above the product name`);
    }
    const reviewFontFloor = testCase.name === 'mobile' ? 9 : 10;
    if (!result.cards.filter((card) => card.hasReviews).every((card) => card.reviewPlacement?.parentIsBrandRow &&
        card.reviewPlacement.brandRowInInfo && card.reviewPlacement.sameRow && card.reviewPlacement.rightOfBrand &&
        card.reviewPlacement.insideRow && card.reviewPlacement.fontSize >= reviewFontFloor)) {
      throw new Error(`${testCase.name}: review summary must be readable at the right of the brand row`);
    }
    if (!result.cards.every((card) => card.modelPlacement.position === 'absolute' &&
        card.modelPlacement.parentIsImage && card.modelPlacement.insideImage &&
        Math.abs(card.modelPlacement.bottomGap - (testCase.name === 'mobile' ? 6 : 7)) < 0.5 &&
        Math.abs(card.modelPlacement.rightGap - (testCase.name === 'mobile' ? 6 : 8)) < 0.5 &&
        /^\(i\)\S/.test(card.modelPlacement.text) && /^모델명 \S/.test(card.modelPlacement.ariaLabel))) {
      throw new Error(`${testCase.name}: (i) model name must sit at the bottom-right of the product image`);
    }
    const expectedProductTransform = testCase.name === 'mobile' ? 'matrix(1.12, 0, 0, 1.12, 0, 0)' : 'matrix(1.18, 0, 0, 1.18, 0, 0)';
    if (!result.cards.every((card) => card.productImageTransform === expectedProductTransform && card.productImageBlendMode === 'normal' && card.brandLogoTransform === 'none')) {
      throw new Error(`${testCase.name}: product thumbnail scale mismatch`);
    }
    if (!result.cards.every((card) => card.productImageCutoutMarker === 'true' &&
        /\/images\/products\/cutout-20261121\/.+\.(?:png|webp)(?:\?|$)/.test(card.productImageSrc))) {
      throw new Error(`${testCase.name}: transparent cutout product assets are not active`);
    }
    if (!result.cards.every((card) => card.giftBackground.includes('linear-gradient') && card.giftColor === 'rgb(255, 255, 255)')) {
      throw new Error(`${testCase.name}: gift badge must use the vivid orange treatment`);
    }
    const expectedGiftFontSize = testCase.name === 'mobile' ? 10 : 12;
    if (!result.cards.every((card) => Math.abs(card.giftLayout.width - card.giftLayout.priceWidth) < 1 &&
        card.giftLayout.fontSize >= expectedGiftFontSize && card.giftLayout.textAlign === 'center' &&
        card.giftLayout.justifyContent === 'center')) {
      throw new Error(`${testCase.name}: gift box must match the price box width and use the larger centered label`);
    }
    if (!result.cards.every((card) => card.nameLayout.whiteSpace === 'nowrap' &&
        card.nameLayout.height <= card.nameLayout.lineHeight + 1 &&
        card.nameLayout.firstText === card.nameLayout.duplicateText &&
        card.nameLayout.title === card.nameLayout.firstText &&
        card.nameLayout.duplicateAriaHidden === 'true')) {
      throw new Error(`${testCase.name}: product names must remain on one accessible line`);
    }
    if (result.cards.some((card) => card.nameLayout.textOverflows !== card.nameLayout.isRolling)) {
      throw new Error(`${testCase.name}: only overflowing product names may roll`);
    }
    if (result.cards.filter((card) => card.nameLayout.isRolling).some((card) => card.nameLayout.animationName !== 'bj-hgp-name-roll')) {
      throw new Error(`${testCase.name}: overflowing product name roll animation is inactive`);
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
    if (testCase.name === 'mobile' && result.cards.some((card) => card.priceBoxHeight > 43)) {
      throw new Error(`mobile: price box is too tall (${Math.max(...result.cards.map((card) => card.priceBoxHeight))}px)`);
    }
    if (!result.cards.every((card) => card.cardBackground === 'rgb(255, 255, 255)' &&
        card.cardBackgroundImage === 'none' && card.imageBackgroundImage.includes('radial-gradient') && card.imageOverlay.includes('linear-gradient'))) {
      throw new Error(`${testCase.name}: B-style blue product background is missing`);
    }
    if (!result.cards.every((card) => card.hasActions && card.cartLabel === '담기' && card.detailLabel === '상세보기')) {
      throw new Error(`${testCase.name}: compact card actions are missing`);
    }
    const expectedButtonHeight = testCase.name === 'mobile' ? 30 : 34;
    const expectedButtonFontSize = testCase.name === 'mobile' ? 11 : 13;
    if (!result.cards.every((card) => Math.abs(card.detailHeight - expectedButtonHeight) < 0.5 &&
        Math.abs(card.cartHeight - expectedButtonHeight) < 0.5 &&
        Math.abs(card.detailFontSize - expectedButtonFontSize) < 0.1 &&
        Math.abs(card.cartFontSize - expectedButtonFontSize) < 0.1)) {
      throw new Error(`${testCase.name}: action button dimensions are wrong`);
    }
    if (testCase.name === 'mobile' && !result.cards.every((card) => card.verticalLayout && !card.horizontalLayout && card.cardWidth >= 140)) {
      throw new Error('mobile: promo cards must use the approved two-column vertical layout');
    }
    if (testCase.name === 'desktop' && result.cards.some((card) => card.verticalLayout)) {
      throw new Error('desktop: promo cards must use the compact side-by-side layout');
    }
    const maxCardHeight = testCase.name === 'mobile' ? 295 : 300;
    if (!result.cards.every((card) => card.cardHeight <= maxCardHeight)) {
      throw new Error(`${testCase.name}: promo card is too tall (${Math.max(...result.cards.map((card) => card.cardHeight))}px)`);
    }
    const minImageWidth = testCase.name === 'mobile' ? 140 : 175;
    if (!result.cards.every((card) => card.imageWidth >= minImageWidth)) throw new Error(`${testCase.name}: product thumbnail is too small`);
    if (!result.cards.filter((card) => card.badgeTopOffset !== null).every((card) =>
      Math.abs(card.badgeTopOffset) < 0.5 && Math.abs(card.badgeLeftOffset) < 0.5 &&
      card.badgeBorderRadius === (testCase.name === 'mobile' ? '10px 0px 8px' : '12px 0px 9px'))) {
      throw new Error(`${testCase.name}: promotion badge must align flush with the rounded thumbnail corner`);
    }
    const minPadding = testCase.name === 'mobile' ? 8 : 16;
    if (!result.cards.every((card) => card.cardPadding >= minPadding)) throw new Error(`${testCase.name}: card padding is too tight`);
    if (!result.beforeNativeRecommendation) throw new Error(`${testCase.name}: promo cards must precede native recommendations`);
    if (!result.menuLabels.some((label) => label === '🎁교체지원금/사은품 확인')) {
      throw new Error(`${testCase.name}: restored promotion menu label is missing`);
    }
    if (result.menuLabels.some((label) => label === '혜택')) throw new Error(`${testCase.name}: simplified menu label remains visible`);
    if (!result.sectionVisible) throw new Error(`${testCase.name}: promo section is hidden`);
    if (result.horizontalOverflow) throw new Error(`${testCase.name}: horizontal overflow detected`);
    if (testCase.name === 'mobile') {
      await page.setViewportSize({ width: 320, height: 844 });
      await page.waitForFunction(() => document.querySelectorAll('.bj-hgp-name.is-rolling').length > 0, null, { timeout: 5000 });
      const narrowNameState = await page.evaluate(() => {
        const cards = [...document.querySelectorAll('.bj-hgp-card')];
        return {
          rollingIds: cards.filter((card) => card.querySelector('.bj-hgp-name').classList.contains('is-rolling'))
            .map((card) => card.getAttribute('data-bj-hgp-product')),
          staticIds: cards.filter((card) => !card.querySelector('.bj-hgp-name').classList.contains('is-rolling'))
            .map((card) => card.getAttribute('data-bj-hgp-product')),
          oneLine: cards.every((card) => {
            const name = card.querySelector('.bj-hgp-name');
            return name.getBoundingClientRect().height <= parseFloat(getComputedStyle(name).lineHeight) + 1;
          }),
          horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        };
      });
      if (!narrowNameState.rollingIds.includes('33632') || !narrowNameState.staticIds.includes('23052') ||
          !narrowNameState.oneLine || narrowNameState.horizontalOverflow) {
        throw new Error(`mobile-320: long names must roll while short names remain still (${JSON.stringify(narrowNameState)})`);
      }
      await page.waitForTimeout(1600);
      const rollTransformBefore = await page.locator('[data-bj-hgp-product="33632"] .bj-hgp-name-track').evaluate((node) => getComputedStyle(node).transform);
      await page.waitForTimeout(350);
      const rollTransformAfter = await page.locator('[data-bj-hgp-product="33632"] .bj-hgp-name-track').evaluate((node) => getComputedStyle(node).transform);
      if (rollTransformBefore === rollTransformAfter || rollTransformAfter === 'none') {
        throw new Error(`mobile-320: product name is marked rolling but does not move (${rollTransformBefore} -> ${rollTransformAfter})`);
      }
      await page.locator('[data-bj-hgp-product="33632"] .bj-hgp-name').hover();
      const hoverPlayState = await page.locator('[data-bj-hgp-product="33632"] .bj-hgp-name-track').evaluate((node) => getComputedStyle(node).animationPlayState);
      if (hoverPlayState !== 'paused') throw new Error(`mobile-320: rolling product name does not pause on hover (${hoverPlayState})`);
      await page.mouse.move(0, 0);
      if (process.env.BJ_QA_SCREENSHOT) {
        await page.locator('.bj-hgp-band').first().screenshot({ path: process.env.BJ_QA_SCREENSHOT });
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const reducedMotionState = await page.locator('[data-bj-hgp-product="33632"] .bj-hgp-name').evaluate((name) => ({
        animationName: getComputedStyle(name.querySelector('.bj-hgp-name-track')).animationName,
        duplicateDisplay: getComputedStyle(name.querySelector('.bj-hgp-name-copy[aria-hidden="true"]')).display,
        textOverflow: getComputedStyle(name.querySelector('.bj-hgp-name-copy:first-child')).textOverflow,
        oneLine: name.getBoundingClientRect().height <= parseFloat(getComputedStyle(name).lineHeight) + 1,
      }));
      if (reducedMotionState.animationName !== 'none' || reducedMotionState.duplicateDisplay !== 'none' ||
          reducedMotionState.textOverflow !== 'ellipsis' || !reducedMotionState.oneLine) {
        throw new Error(`mobile-320: reduced-motion fallback is wrong (${JSON.stringify(reducedMotionState)})`);
      }
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForFunction(() => !document.querySelector('[data-bj-hgp-product="33632"] .bj-hgp-name').classList.contains('is-rolling'), null, { timeout: 5000 });
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
  await withdrawnGift.route(/cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject(?:@[^/]+)?\/inject(?:\.min)?\.js/, async (route) => {
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
