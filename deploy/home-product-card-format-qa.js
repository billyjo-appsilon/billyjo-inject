const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..');
const injectSource = fs.readFileSync(path.join(root, 'inject.js'), 'utf8');
const logoDir = path.join(root, 'images', 'brands');
const productDir = path.join(root, 'images', 'products', 'cutout-20261121');
const alpha = {
  '웰스': { total: 136, top: 4, visible: 128, width: 520, left: 4 },
  'LG전자': { total: 340, top: 0, visible: 340, width: 1280, left: 0 },
  '청호나이스': { total: 34, top: 4, visible: 26, width: 145, left: 1 },
  '쿠쿠': { total: 25, top: 4, visible: 17, width: 103, left: 4 },
  '루헨스': { total: 26, top: 4, visible: 18, width: 145, left: 4 },
  '코웨이': { total: 27, top: 4, visible: 19, width: 114, left: 4 },
  '현대렌탈케어': { total: 153, top: 4, visible: 145, width: 486, left: 4 },
  '세스코': { total: 109, top: 0, visible: 109, width: 186, left: 0 },
  '삼성': { total: 25, top: 4, visible: 17, width: 95, left: 4 },
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function routeLocalAssets(page) {
  await page.route(/cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject(?:@[^/]+)?\/inject(?:\.min)?\.js/, async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: injectSource });
  });
  await page.route('**/images/brands/*-horizontal-20261119.png', async (route) => {
    const file = path.basename(new URL(route.request().url()).pathname);
    const local = path.join(logoDir, file);
    if (!fs.existsSync(local)) return route.continue();
    await route.fulfill({ status: 200, contentType: 'image/png', body: fs.readFileSync(local) });
  });
  await page.route('**/images/products/cutout-20261121/*', async (route) => {
    const file = path.basename(new URL(route.request().url()).pathname);
    const local = path.join(productDir, file);
    if (!fs.existsSync(local)) return route.continue();
    await route.fulfill({
      status: 200,
      contentType: path.extname(file).toLowerCase() === '.webp' ? 'image/webp' : 'image/png',
      body: fs.readFileSync(local),
    });
  });
  await page.route('https://admin2-api.billyjo.co.kr/v1/promotions/current**', async (route) => {
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
              '정수기 렌탈 시 공기청정기 1대 증정',
              '뉴 러블리트리 정수기 64% 할인 월 13,450원~',
              'B700 살균 리모컨 비데 56% 할인 월 10,450원~',
              'The M 얼음정수기 54% 할인 월 20,950원~',
            ],
          }],
        },
      }),
    });
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const widths = [320, 390, 430, 1280];
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await routeLocalAssets(page);
    await page.goto('https://billyjo.co.kr/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('#bj-home-gift-promos[data-bj-product-card-design="fullbleed-review-promo-v1"]', { timeout: 30000 });
    for (const band of await page.locator('#bj-home-gift-promos .bj-hgp-band').all()) {
      await band.scrollIntoViewIfNeeded();
    }
    await page.waitForFunction(() => [...document.querySelectorAll('#bj-home-gift-promos img')].every((img) => img.complete && img.naturalWidth));
    await page.waitForTimeout(100);

    const result = await page.evaluate((alphaBounds) => {
      const section = document.querySelector('#bj-home-gift-promos');
      const cards = [...section.querySelectorAll('.bj-hgp-card')];
      const firstGeneralBand = section.querySelector('.bj-hgp-band:not(.bj-hgp-band--featured)');
      const generalHeading = section.querySelector('.bj-hgp-general-heading');
      return {
        total: cards.length,
        unique: new Set(cards.map((card) => card.dataset.bjHgpProduct)).size,
        promoCount: cards.filter((card) => card.querySelector('.bj-hgp-promo')).length,
        emptyPromoCount: cards.filter((card) => card.querySelector('.bj-hgp-promo') && !card.querySelector('.bj-hgp-promo').textContent.trim()).length,
        genericGiftCount: cards.filter((card) => card.textContent.includes('추가 사은품')).length,
        reviewCount: cards.filter((card) => card.querySelector('.bj-hgp-review-pill')).length,
        noPromoShellsValid: cards.filter((card) => !card.querySelector('.bj-hgp-promo')).every((card) => !card.querySelector('.bj-hgp-image-shell').classList.contains('has-promo')),
        generalHeadingText: generalHeading?.textContent.trim() || '',
        generalHeadingBeforeBands: Boolean(generalHeading && firstGeneralBand && (generalHeading.compareDocumentPosition(firstGeneralBand) & Node.DOCUMENT_POSITION_FOLLOWING)),
        promoById: Object.fromEntries(['34614', '32596', '32586'].map((id) => {
          const card = section.querySelector(`.bj-hgp-band:not(.bj-hgp-band--featured) [data-bj-hgp-product="${id}"]`);
          return [id, card?.querySelector('.bj-hgp-promo')?.getAttribute('aria-label') || ''];
        })),
        promoStyles: [...section.querySelectorAll('.bj-hgp-promo')].map((promo) => {
          const style = getComputedStyle(promo);
          return { background: style.backgroundColor, color: style.color, borderTop: style.borderTopColor };
        }),
        deadlineLayouts: [...section.querySelectorAll('.bj-hgp-promo.has-deadline')].map((promo) => {
          const copy = promo.querySelector('.bj-hgp-promo-copy:not([aria-hidden="true"])');
          const discount = promo.querySelector('.bj-hgp-promo-discount');
          const deadline = promo.querySelector('.bj-hgp-promo-deadline');
          const promoRect = promo.getBoundingClientRect();
          const discountRect = discount.getBoundingClientRect();
          const deadlineRect = deadline.getBoundingClientRect();
          const copyStyle = getComputedStyle(copy);
          return { fontSize: parseFloat(copyStyle.fontSize), justify: copyStyle.justifyContent, align: copyStyle.alignItems,
            leftInset: discountRect.left - promoRect.left, rightInset: promoRect.right - deadlineRect.right,
            centerDelta: Math.abs((discountRect.top + discountRect.height / 2) - (deadlineRect.top + deadlineRect.height / 2)) };
        }),
        nextControl: (() => {
          const button = firstGeneralBand.querySelector('.bj-hgp-slide-button--next');
          const icon = button.querySelector('svg');
          const pathBounds = icon.querySelector('path').getBBox();
          const buttonRect = button.getBoundingClientRect();
          const iconRect = icon.getBoundingClientRect();
          return {
            width: buttonRect.width,
            height: buttonRect.height,
            centerDeltaX: Math.abs((buttonRect.left + buttonRect.width / 2) - (iconRect.left + iconRect.width / 2)),
            centerDeltaY: Math.abs((buttonRect.top + buttonRect.height / 2) - (iconRect.top + iconRect.height / 2)),
            pathCenterDeltaX: Math.abs(12 - (pathBounds.x + pathBounds.width / 2)),
            boxShadow: getComputedStyle(button).boxShadow,
            iconAriaHidden: icon.getAttribute('aria-hidden'),
          };
        })(),
        cards: cards.map((card) => {
          const shell = card.querySelector('.bj-hgp-image-shell');
          const image = card.querySelector('.bj-hgp-image');
          const product = image.querySelector(':scope > img');
          const logo = shell.querySelector('.bj-hgp-brand-logo');
          const brand = logo.alt.replace(/ 로고$/, '');
          const bounds = alphaBounds[brand];
          const logoRect = logo.getBoundingClientRect();
          const infoRect = shell.querySelector('.bj-hgp-model-toggle').getBoundingClientRect();
          const cardRect = card.getBoundingClientRect();
          const imageRect = image.getBoundingClientRect();
          const containScale = Math.min(logoRect.width / bounds.width, logoRect.height / bounds.total);
          const visibleHeight = bounds.visible * containScale;
          const visibleCenter = logoRect.top + bounds.top * containScale + visibleHeight / 2;
          const visibleLeft = logoRect.left + bounds.left * containScale;
          const visibleTop = logoRect.top + bounds.top * containScale;
          const review = card.querySelector('.bj-hgp-review-pill');
          const reviewRect = review.getBoundingClientRect();
          const reviewStyle = getComputedStyle(review);
          return {
            brand,
            id: card.dataset.bjHgpProduct,
            promo: Boolean(card.querySelector('.bj-hgp-promo')),
            review: card.querySelector('.bj-hgp-review-pill').textContent.trim(),
            reviewBottom: reviewStyle.bottom,
            visibleLogoHeight: visibleHeight,
            logoInfoCenterDelta: Math.abs(visibleCenter - (infoRect.top + infoRect.height / 2)),
            visibleLogoLeftDelta: visibleLeft - imageRect.left,
            visibleLogoTopDelta: visibleTop - imageRect.top,
            logoWidth: logoRect.width,
            logoLeftRatio: parseFloat(getComputedStyle(logo).getPropertyValue('--bj-hgp-logo-left-ratio') || 0),
            reviewLeftDelta: reviewRect.left - imageRect.left,
            cardPadding: parseFloat(getComputedStyle(card).paddingTop),
            imageHeight: imageRect.height,
            imageTopDelta: imageRect.top - cardRect.top,
            imageLeftDelta: imageRect.left - cardRect.left,
            productTransform: getComputedStyle(product).transform,
            productNaturalWidth: product.naturalWidth,
            productNaturalHeight: product.naturalHeight,
            productOpacity: getComputedStyle(product).opacity,
            productVisibility: getComputedStyle(product).visibility,
            productDisplay: getComputedStyle(product).display,
            productBlendMode: getComputedStyle(product).mixBlendMode,
            priceLabelFontSize: parseFloat(getComputedStyle(card.querySelector('.bj-hgp-price-label')).fontSize),
            actionHeight: card.querySelector('.bj-hgp-detail').getBoundingClientRect().height,
            cardBorder: getComputedStyle(card).borderTopColor,
            logoBackground: getComputedStyle(logo).backgroundColor,
          };
        }),
        stickyPrimaryText: document.querySelector('#bj-home-sticky-actions .bj-hsa-primary')?.textContent.trim() || '',
        stickyPrimaryHasIcon: Boolean(document.querySelector('#bj-home-sticky-actions .bj-hsa-primary .bj-hsa-icon')),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      };
    }, alpha);

    assert(result.total === 26 && result.unique === 24, `${width}: card population mismatch`);
    assert(result.promoCount === 5 && result.emptyPromoCount === 0, `${width}: promo visibility mismatch`);
    assert(result.genericGiftCount === 0 && result.noPromoShellsValid, `${width}: generic or empty promo remains`);
    assert(result.reviewCount === 26, `${width}: every card needs a review pill`);
    assert(result.cards.every((card) => card.reviewBottom === (card.promo ? '28px' : '3px')), `${width}: review position is not exactly 3px lower ${JSON.stringify(result.cards.map((card) => ({ id: card.id, promo: card.promo, bottom: card.reviewBottom })))}`);
    assert(result.generalHeadingText === '월요금대별 추천제품' && result.generalHeadingBeforeBands, `${width}: general-product divider missing`);
    assert(result.promoById['34614'] === '50% 할인 · 공기청정기 1대 증정', `${width}: 34614 promo mismatch (${result.promoById['34614']})`);
    assert(/^50% 할인 · (?:\d+일 남음|오늘 마감)$/.test(result.promoById['32596']), `${width}: 32596 promo countdown mismatch (${result.promoById['32596']})`);
    assert(result.promoById['32586'] === '47% 할인 · 공기청정기 1대 증정', `${width}: 32586 promo mismatch (${result.promoById['32586']})`);
    assert(result.promoStyles.every((style) => style.background === 'rgb(47, 102, 189)' && style.color === 'rgb(255, 255, 255)' && style.borderTop === 'rgb(24, 75, 155)'), `${width}: promotion strip contrast drift ${JSON.stringify(result.promoStyles)}`);
    assert(result.deadlineLayouts.length > 0 && result.deadlineLayouts.every((layout) => layout.fontSize === 11.5 && layout.justify === 'space-between' && layout.align === 'center' && Math.abs(layout.leftInset - 7) < 0.75 && Math.abs(layout.rightInset - 7) < 0.75 && layout.centerDelta < 0.75), `${width}: promo deadline alignment drift ${JSON.stringify(result.deadlineLayouts)}`);
    const expectedControlSize = width <= 780 ? 36 : 40;
    assert(Math.abs(result.nextControl.width - expectedControlSize) < 0.5 && Math.abs(result.nextControl.height - expectedControlSize) < 0.5 &&
      result.nextControl.centerDeltaX < 0.5 && result.nextControl.centerDeltaY < 0.5 && result.nextControl.pathCenterDeltaX < 0.05 && result.nextControl.iconAriaHidden === 'true' &&
      result.nextControl.boxShadow.includes('rgba(8, 56, 248'), `${width}: next control size/glow/centering mismatch ${JSON.stringify(result.nextControl)}`);
    assert(result.cards.every((card) => Math.abs(card.visibleLogoHeight - 14) < 0.15), `${width}: visible logo height is not 14px`);
    assert(result.cards.every((card) => card.logoInfoCenterDelta < 0.75), `${width}: logo/info centers are not aligned`);
    assert(result.cards.every((card) => Math.abs(card.visibleLogoLeftDelta - 6) < 0.5 && Math.abs(card.reviewLeftDelta - 6) < 0.5), `${width}: visible logo/review left alignment drift ${JSON.stringify(result.cards)}`);
    assert(result.cards.every((card) => card.cardBorder === 'rgb(217, 228, 247)' && card.logoBackground === 'rgba(0, 0, 0, 0)'), `${width}: card border or logo transparency mismatch`);
    assert(result.cards.every((card) => card.productNaturalWidth > 0 && card.productNaturalHeight > 0 && card.productOpacity === '1' && card.productVisibility === 'visible' && card.productDisplay !== 'none' && card.productBlendMode === 'normal'), `${width}: a product cutout is not visibly loaded ${JSON.stringify(result.cards)}`);
    const expectedPriceLabelFontSize = (width <= 780 ? 7 : 10) + (2 * 96 / 72);
    assert(result.cards.every((card) => Math.abs(card.priceLabelFontSize - expectedPriceLabelFontSize) < 0.1), `${width}: monthly fee label is not 2pt larger`);
    assert(result.stickyPrimaryText === '✅내 견적 확인' && !result.stickyPrimaryHasIcon, `${width}: sticky CTA mismatch`);
    assert(!result.horizontalOverflow, `${width}: page overflows horizontally`);
    if (width <= 780) {
      assert(result.cards.every((card) => Math.abs(card.visibleLogoTopDelta - 5) < 0.5), `${width}: visible logo top inset drift ${JSON.stringify(result.cards)}`);
      assert(result.cards.every((card) => card.cardPadding === 0), `${width}: mobile card is not full bleed`);
      assert(result.cards.every((card) => Math.abs(card.imageHeight - 120) < 0.5), `${width}: mobile thumbnail height mismatch`);
      assert(result.cards.every((card) => card.imageTopDelta <= 1.1 && card.imageLeftDelta <= 1.1), `${width}: mobile thumbnail has outer whitespace`);
      assert(result.cards.every((card) => card.productTransform === 'matrix(1.12, 0, 0, 1.12, 0, 5)'), `${width}: mobile product image offset mismatch`);
      assert(result.cards.every((card) => Math.abs(card.actionHeight - 28) < 0.5), `${width}: mobile action height mismatch`);
    } else {
      assert(result.cards.every((card) => card.productTransform === 'matrix(1.003, 0, 0, 1.003, 0, 0)'), `${width}: desktop product scale mismatch`);
      assert(result.cards.every((card) => Math.abs(card.actionHeight - 34) < 0.5), `${width}: desktop action height mismatch`);
    }

    if (process.env.BJ_QA_SCREENSHOT_DIR) {
      fs.mkdirSync(process.env.BJ_QA_SCREENSHOT_DIR, { recursive: true });
      await page.locator('#bj-home-gift-promos').screenshot({
        path: path.join(process.env.BJ_QA_SCREENSHOT_DIR, `product-cards-${width}.png`),
      });
      if (width === 390) {
        for (const id of ['32918', '33000', '29036', '33632']) {
          await page.locator(`[data-bj-hgp-product="${id}"] .bj-hgp-image`).first().screenshot({
            path: path.join(process.env.BJ_QA_SCREENSHOT_DIR, `product-cutout-${id}-${width}.png`),
          });
        }
      }
    }

    if (width === 320) {
      await page.locator('[data-bj-hgp-product="34614"] .bj-hgp-promo').first().evaluate((promo) => { promo.style.width = '80px'; });
      await page.waitForFunction(() => [...document.querySelectorAll('[data-bj-hgp-product="34614"] .bj-hgp-promo')].some((promo) => promo.classList.contains('is-rolling')));
      await page.waitForTimeout(1300);
      const moving = await page.locator('[data-bj-hgp-product="34614"] .bj-hgp-promo.is-rolling .bj-hgp-promo-track').first().evaluate(async (track) => {
        const before = getComputedStyle(track).transform;
        await new Promise((resolve) => setTimeout(resolve, 350));
        return before !== getComputedStyle(track).transform;
      });
      assert(moving, '320: long promotion text is not sliding');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const reduced = await page.locator('[data-bj-hgp-product="34614"] .bj-hgp-promo.is-rolling .bj-hgp-promo-track').first().evaluate((track) => getComputedStyle(track).animationName);
      assert(reduced === 'none', '320: promotion reduced-motion fallback is missing');
    }

    console.log(`${width}: ok`);
    await page.close();
  }
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
