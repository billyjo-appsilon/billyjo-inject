const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const injectSource = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const cases = [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  for (const testCase of cases) {
    const page = await browser.newPage({ viewport: testCase });
    await page.route(/cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject@[^/]+\/inject(?:\.min)?\.js/, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: injectSource });
    });
    await page.goto('https://billyjo.co.kr/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('#bj-home-gift-promos', { timeout: 30000 });
    await page.waitForFunction(() => {
      const images = [...document.querySelectorAll('#bj-home-gift-promos img')];
      return images.length === 12 && images.every((image) => image.complete && image.naturalWidth > 0);
    }, { timeout: 30000 });
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
          href: card.href,
          imageLoaded: card.querySelector('img').naturalWidth > 0,
          horizontalLayout: (() => {
            const imageRect = card.querySelector('.bj-hgp-image').getBoundingClientRect();
            const infoRect = card.querySelector('.bj-hgp-info').getBoundingClientRect();
            return imageRect.right <= infoRect.left + 1 && Math.abs(imageRect.top - infoRect.top) < card.getBoundingClientRect().height;
          })(),
          imageWidth: card.querySelector('.bj-hgp-image').getBoundingClientRect().width,
          badgeTopOffset: (() => {
            const imageRect = card.querySelector('.bj-hgp-image').getBoundingClientRect();
            const badgeRect = card.querySelector('.bj-hgp-discount').getBoundingClientRect();
            return badgeRect.top - imageRect.top;
          })(),
          cardPadding: parseFloat(getComputedStyle(card).paddingTop),
          hasRegularPrice: !!card.querySelector('.bj-hgp-regular'),
          hasReviews: !!card.querySelector('.bj-hgp-reviews'),
          reviewText: card.querySelector('.bj-hgp-reviews')?.textContent.replace(/\s+/g, ' ').trim() || '',
          badgeText: card.querySelector('.bj-hgp-discount').textContent.replace(/\s+/g, ' ').trim(),
          officialPromoBadge: !card.querySelector('.bj-hgp-discount').classList.contains('is-benefit'),
        })),
        title: section.querySelector('.bj-hgp-title').textContent.replace(/\s+/g, ' ').trim(),
        bands: bands.map((band) => ({
          tier: band.getAttribute('data-bj-hgp-band'),
          cardCount: band.querySelectorAll('.bj-hgp-card').length,
        })),
        beforeNativeRecommendation: !!(section.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING),
        menuLabels,
        oldVisibleMenuCount: [...document.querySelectorAll('.bj-best-gnb, .bj-newlywed-cat')]
          .filter((node) => node.textContent.includes('시크릿 1:1 패키지')).length,
        sectionVisible: getComputedStyle(section).display !== 'none' && section.getBoundingClientRect().height > 0,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      };
    });

    if (result.cards.length !== 12) throw new Error(`${testCase.name}: expected twelve promo cards`);
    if (result.cards.map((card) => card.id).join(',') !== '24129,11327,34614,32596,32586,32100,32918,33000,35730,32592,29036,33632') {
      throw new Error(`${testCase.name}: promo card order is wrong`);
    }
    if (result.title !== '11월 특가! 추가 사은품!') throw new Error(`${testCase.name}: dynamic month title is wrong`);
    const expectedTiers = ['1만원 언더', '1만원대', '2만원대', '3만원대', '4만원대', '5만원대'];
    if (result.bands.map((band) => band.tier).join(',') !== expectedTiers.join(',')) {
      throw new Error(`${testCase.name}: price band order is wrong`);
    }
    if (!result.bands.every((band) => band.cardCount === 2)) {
      throw new Error(`${testCase.name}: every price band must contain two cards`);
    }
    for (const expected of ['11월 특가', '4.9 · 후기 23개', '4.9 · 후기 58개', '4.8 · 후기 149개', '4.8 · 후기 173개', '공기청정기 1대 증정 대상', '추가 사은품 상담 대상']) {
      if (!result.cards.some((card) => card.text.includes(expected))) {
        throw new Error(`${testCase.name}: missing ${expected}`);
      }
    }
    const discountedPrices = {
      '34614': ['정가 월 26,900원 (VAT 별도)', '할인가 월 13,450원~ (VAT 별도)'],
      '32596': ['정가 월 20,900원 (VAT 별도)', '할인가 월 10,450원~ (VAT 별도)'],
      '32586': ['정가 월 39,900원 (VAT 별도)', '할인가 월 20,950원~ (VAT 별도)'],
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
    if (!result.cards.every((card) => card.horizontalLayout)) throw new Error(`${testCase.name}: promo cards must keep thumbnail left and product info right`);
    const minImageWidth = testCase.name === 'mobile' ? 110 : 150;
    if (!result.cards.every((card) => card.imageWidth >= minImageWidth)) throw new Error(`${testCase.name}: product thumbnail is too small`);
    if (!result.cards.every((card) => card.badgeTopOffset >= 0 && card.badgeTopOffset <= 8)) throw new Error(`${testCase.name}: badge must stay at the thumbnail top`);
    const minPadding = testCase.name === 'mobile' ? 13 : 18;
    if (!result.cards.every((card) => card.cardPadding >= minPadding)) throw new Error(`${testCase.name}: card padding is too tight`);
    if (!result.beforeNativeRecommendation) throw new Error(`${testCase.name}: promo cards must precede native recommendations`);
    if (!result.menuLabels.some((label) => label.includes('프로모션/사은품 확인'))) {
      throw new Error(`${testCase.name}: new menu label is missing`);
    }
    if (result.oldVisibleMenuCount !== 0) throw new Error(`${testCase.name}: old menu label remains visible`);
    if (!result.sectionVisible) throw new Error(`${testCase.name}: promo section is hidden`);
    if (result.horizontalOverflow) throw new Error(`${testCase.name}: horizontal overflow detected`);
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
