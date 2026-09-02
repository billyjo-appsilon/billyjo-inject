const assert = require('assert');
const path = require('path');
const { chromium } = require('playwright');

const injectPath = path.resolve(__dirname, '..', 'inject.js');

function productHtml(prodNo, name, model) {
  return `<!doctype html>
<html><head><title>${name}</title><meta property="og:image" content="/goodsImages/${prodNo}.jpg"></head>
<body>
  <h1 class="prod_name"><b>${name}</b></h1>
  <button class="bj-btn-rent-gift" onclick="window.rentClicked = (window.rentClicked || 0) + 1">렌탈신청</button>
  <form name="order" id="order">
    <input name="public_model_no" value="${prodNo}">
    <input name="prod_model_no" value="${model}">
    <input name="prod_name" value="${name}">
    <input name="cate_no" value="1">
    <input name="opt_name" value="">
  </form>
  <button class="month_box layer_price" data-supcode="SUP${prodNo}" data-supname="공급사" data-month="36개월" data-month_key="36" data-price="29900" data-dcprice="0" data-rebate="0"></button>
</body></html>`;
}

async function newMockedPage(browser, { enabled }) {
  const context = await browser.newContext({ baseURL: 'https://billyjo.co.kr' });
  const page = await context.newPage();
  const cartPosts = [];

  await page.route('https://admin2-api.billyjo.co.kr/v1/landing/direct_offer', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        config: {
          enabled,
          hero: { badge: '복수제품 설계', headline: 'AI 견적', subcopy: '실제 상품 기준' },
          personaSection: { title: '제품 선택', sub: '' },
          productsSection: { title: '함께 많이 신청한 BEST', sub: '' },
          ctaLabel: 'AI 견적신청하기',
          maxSelect: 5,
          perCategory: 2,
          bundleAddons: [],
          directOffer: {
            enabled,
            showTopBar: true,
            showActivity: false,
            countdownMinutes: 15,
            activityMinSeconds: 40,
            activityMaxSeconds: 70,
            activityLookbackHours: 48,
            customerGiftRate: 0.7,
            autoOpen: false,
            openDelaySeconds: 2,
          },
        },
      }),
    });
  });
  await page.route('https://admin2-api.billyjo.co.kr/v1/packages/popular**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        categories: [
          {
            category: '공기청정기',
            products: [
              {
                model: 'AP-3021D',
                prodNo: '7606',
                name: '코웨이 노블 공기청정기 AP-3021D',
                category: '공기청정기',
                image: 'https://billyjo.co.kr/logo.png',
                maxGift: 300000,
                term: '36개월',
                reviewCount: 128,
                avgStars: 4.8,
                detailUrl: 'https://billyjo.co.kr/html/dh_prod/prod_view/7606',
              },
              {
                model: 'UNKNOWN-GIFT',
                prodNo: '99999',
                name: '상담 필요 제품',
                category: '공기청정기',
                image: 'https://billyjo.co.kr/logo.png',
                maxGift: 0,
                term: '상담확인',
                reviewCount: 3,
                avgStars: 4.1,
                detailUrl: 'https://billyjo.co.kr/html/dh_prod/prod_view/99999',
              },
            ],
          },
          {
            category: '비데',
            products: [
              {
                model: 'BAS51-A',
                prodNo: '32985',
                name: '코웨이 더 매너 비데 플러스 BAS51-A',
                category: '비데',
                image: 'https://billyjo.co.kr/logo.png',
                maxGift: 200000,
                term: '36개월',
                reviewCount: 71,
                avgStars: 4.7,
                detailUrl: 'https://billyjo.co.kr/html/dh_prod/prod_view/32985',
              },
            ],
          },
        ],
      }),
    });
  });
  await page.route('https://admin2-api.billyjo.co.kr/v1/packages/product/123', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        product: {
          model: 'WP-123',
          prodNo: '123',
          name: '코웨이 정수기',
          category: '정수기',
          image: '/goodsImages/123.jpg',
          maxGift: 500000,
          term: '36개월',
          reviewCount: 642,
          avgStars: 4.9,
          detailUrl: 'https://billyjo.co.kr/html/dh_prod/prod_view/123',
        },
      }),
    });
  });
  await page.route('https://admin2-api.billyjo.co.kr/v1/reviews**', async (route) => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ ok: true, items: [{ text: '설치가 빨랐어요.' }] }) });
  });
  await page.route('https://billyjo.co.kr/html/dh_prod/prod_view/7606', async (route) => {
    await route.fulfill({ contentType: 'text/html', body: productHtml('7606', '코웨이 노블 공기청정기 AP-3021D', 'AP-3021D') });
  });
  await page.route('https://billyjo.co.kr/html/dh_prod/prod_view/32985', async (route) => {
    await route.fulfill({ contentType: 'text/html', body: productHtml('32985', '코웨이 더 매너 비데 플러스 BAS51-A', 'BAS51-A') });
  });
  await page.route('https://billyjo.co.kr/html/dh_order/shop_cart', async (route) => {
    const request = route.request();
    if (request.method() === 'POST') cartPosts.push(request.postData() || '');
    await route.fulfill({ contentType: 'text/html', body: '<html><body>cart</body></html>' });
  });
  await page.route('https://billyjo.co.kr/html/dh_prod/prod_view/123', async (route) => {
    await route.fulfill({ contentType: 'text/html', body: productHtml('123', '코웨이 정수기', 'WP-123') });
  });
  await page.route('https://billyjo.co.kr/?**', async (route) => {
    await route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><head><meta property="og:image" content="https://billyjo.co.kr/logo.png"></head><body><main>home</main></body></html>' });
  });
  await page.route('https://billyjo.co.kr/html/dh_prod/prod_view/1792', async (route) => {
    await route.fulfill({ contentType: 'text/html', body: productHtml('1792', '코웨이 얼음냉온정수기 CHPI-620L', 'CHPI-620L') });
  });
  await page.route('https://billyjo.co.kr/html/dh_prod/prod_view/35200', async (route) => {
    await route.fulfill({ contentType: 'text/html', body: productHtml('35200', 'LG 퓨리케어 AI 오브제컬렉션 냉동얼음정수기 WD724R', 'WD724R') });
  });

  return { context, page, cartPosts };
}

async function testOffIsInert(browser) {
  const { context, page } = await newMockedPage(browser, { enabled: false });
  await page.goto('https://billyjo.co.kr/html/dh_prod/prod_view/123', { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ path: injectPath });
  await page.waitForTimeout(300);
  await page.click('.bj-btn-rent-gift');

  assert.strictEqual(await page.evaluate(() => window.rentClicked || 0), 1, 'OFF must not intercept the native rent click');
  assert.strictEqual(await page.locator('#bj-do-back, #bj-do-topbar, #bj-do-fab').count(), 0, 'OFF must not mount direct-offer DOM');
  await context.close();
}

async function testOnQuoteCartFlow(browser) {
  const { context, page, cartPosts } = await newMockedPage(browser, { enabled: true });
  await page.goto('https://billyjo.co.kr/html/dh_prod/prod_view/123', { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ path: injectPath });
  await page.waitForSelector('#bj-do-fab', { timeout: 5000 });
  await page.click('.bj-btn-rent-gift');
  await page.waitForSelector('#bj-do-back');

  assert.strictEqual(await page.evaluate(() => window.rentClicked || 0), 0, 'ON should intercept rent click and open popup first');
  assert.ok((await page.locator('.bj-do-copy').innerText()).includes('AI 견적신청하기'), 'CTA should be quote-oriented');
  assert.ok(await page.locator('.bj-do-card', { hasText: '코웨이 정수기' }).count(), 'Current real product should be included');
  assert.ok(await page.locator('.bj-do-card', { hasText: '코웨이 노블 공기청정기 AP-3021D' }).count(), 'Recommended real product should be shown');
  assert.strictEqual(await page.locator('.bj-do-card', { hasText: '상담 필요 제품' }).count(), 0, 'Products without confirmed gift amount should be hidden');
  assert.ok((await page.locator('.bj-do-card', { hasText: '코웨이 정수기' }).innerText()).includes('결합 사은품 500,000원'), 'Gift amount label should use 결합 사은품');
  assert.strictEqual(await page.locator('.bj-do-gift', { hasText: '예상 지원금' }).count(), 0, 'Direct offer cards should not use 예상 지원금 label');
  assert.strictEqual(await page.locator('.bj-do-gift', { hasText: '상담 시 확인' }).count(), 0, 'Unknown gift products should not be shown as 상담 시 확인');

  await page.locator('.bj-do-card', { hasText: '코웨이 노블 공기청정기 AP-3021D' }).click();
  await page.click('.bj-do-copy');
  await page.waitForURL('**/html/dh_order/shop_cart', { timeout: 8000 });

  assert.strictEqual(cartPosts.length, 2, 'Selected current + additional products should both post to cart');
  assert.ok(cartPosts.some((body) => body.includes('public_model_no=123')), 'Current product should be posted to cart');
  assert.ok(cartPosts.some((body) => body.includes('public_model_no=7606')), 'Additional selected product should be posted to cart');
  await context.close();
}

async function testLpDirectOnlySelectedProduct(browser) {
  const { context, page, cartPosts } = await newMockedPage(browser, { enabled: true });
  await page.goto('https://billyjo.co.kr/?bj_direct_apply=1&bj_lp_products=AP-3021D,BAS51-A', { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ path: injectPath });
  await page.waitForSelector('#bj-do-back', { timeout: 5000 });
  await page.waitForFunction(() => !document.querySelector('.bj-do-intro'), null, { timeout: 8000 });
  assert.ok((await page.locator('.bj-do-h').innerText()).includes('이번달 특가 프로모션 제품 같이 신청하고, 더x2 많은 사은품 받으세요!'), 'New promo headline should be visible');
  assert.strictEqual((await page.locator('.bj-do-sub').innerText()).trim(), '', 'Header subcopy should be removed');
  assert.ok(await page.locator('.bj-do-card', { hasText: 'AP-3021D' }).count(), 'First LP selected product should be visible');
  assert.ok(await page.locator('.bj-do-card', { hasText: 'BAS51-A' }).count(), 'Second LP selected product should be visible');

  await page.click('.bj-do-copy');
  await page.waitForURL('**/html/dh_order/shop_cart', { timeout: 8000 });

  assert.strictEqual(cartPosts.length, 2, 'LP selected products without addons should be posted to cart');
  assert.ok(cartPosts.some((body) => body.includes('public_model_no=7606')), 'First LP selected product should resolve to a cartable prodNo');
  assert.ok(cartPosts.some((body) => body.includes('public_model_no=32985')), 'Second LP selected product should resolve to a cartable prodNo');
  await context.close();
}

async function testLpSelectedProductsUseProductThumbs(browser) {
  const { context, page } = await newMockedPage(browser, { enabled: true });
  await page.goto('https://billyjo.co.kr/?bj_direct_apply=1&bj_lp_products=AP-3021D,BAS51-A', { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ path: injectPath });
  await page.waitForSelector('#bj-do-back', { timeout: 5000 });
  await page.waitForFunction(() => !document.querySelector('.bj-do-intro'), null, { timeout: 8000 });

  const srcs = await page.locator('.bj-do-group', { hasText: '현재 보고 있는 상품' })
    .locator('xpath=following-sibling::div[contains(@class,"bj-do-card")]')
    .evaluateAll((cards) => cards.slice(0, 2).map((card) => card.querySelector('img')?.src || ''));

  assert.strictEqual(srcs.length, 2, 'LP selected products should render two current product cards');
  assert.ok(await page.locator('.bj-do-card', { hasText: '코웨이 노블 공기청정기 AP-3021D' }).count(), 'LP model token should hydrate to the full product name');
  assert.ok(await page.locator('.bj-do-card', { hasText: '코웨이 더 매너 비데 플러스 BAS51-A' }).count(), 'LP model token should hydrate to the full bidet product name');
  assert.ok(srcs[0].includes('/images/'), 'First LP selected card should use the LP product thumbnail');
  assert.ok(srcs[0].includes('AP-3021D'), 'First LP selected card should use AP-3021D thumbnail');
  assert.ok(srcs[1].includes('/images/'), 'Second LP selected card should use the LP product thumbnail');
  assert.ok(srcs[1].includes('BAS51-A'), 'Second LP selected card should use BAS51-A thumbnail');
  assert.ok(srcs.every((src) => !src.includes('/logo.png')), 'LP selected cards must not fall back to the BillyJo logo image');
  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await testOffIsInert(browser);
    await testOnQuoteCartFlow(browser);
    await testLpDirectOnlySelectedProduct(browser);
    await testLpSelectedProductsUseProductThumbs(browser);
  } finally {
    await browser.close();
  }
  console.log('direct-offer QA OK');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
