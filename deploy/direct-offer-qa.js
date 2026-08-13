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
                model: 'AP-456',
                prodNo: '456',
                name: '코웨이 공기청정기',
                category: '공기청정기',
                image: '/goodsImages/456.jpg',
                maxGift: 300000,
                term: '36개월',
                reviewCount: 128,
                avgStars: 4.8,
                detailUrl: 'https://billyjo.co.kr/html/dh_prod/prod_view/456',
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
  await page.route('https://billyjo.co.kr/html/dh_prod/prod_view/456', async (route) => {
    await route.fulfill({ contentType: 'text/html', body: productHtml('456', '코웨이 공기청정기', 'AP-456') });
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
    await route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><body><main>home</main></body></html>' });
  });
  await page.route('https://billyjo.co.kr/html/dh_prod/prod_view/1792', async (route) => {
    await route.fulfill({ contentType: 'text/html', body: productHtml('1792', '코웨이 얼음냉온정수기 CHPI-620L', 'CHPI-620L') });
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
  assert.ok(await page.locator('.bj-do-card', { hasText: '코웨이 공기청정기' }).count(), 'Recommended real product should be shown');

  await page.locator('.bj-do-card', { hasText: '코웨이 공기청정기' }).click();
  await page.click('.bj-do-copy');
  await page.waitForURL('**/html/dh_order/shop_cart', { timeout: 8000 });

  assert.strictEqual(cartPosts.length, 2, 'Selected current + additional products should both post to cart');
  assert.ok(cartPosts.some((body) => body.includes('public_model_no=123')), 'Current product should be posted to cart');
  assert.ok(cartPosts.some((body) => body.includes('public_model_no=456')), 'Additional selected product should be posted to cart');
  await context.close();
}

async function testLpDirectOnlySelectedProduct(browser) {
  const { context, page, cartPosts } = await newMockedPage(browser, { enabled: true });
  await page.goto('https://billyjo.co.kr/?bj_direct_apply=1&bj_lp_products=CHPI-620L', { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ path: injectPath });
  await page.waitForSelector('#bj-do-back', { timeout: 5000 });
  await page.waitForFunction(() => !document.querySelector('.bj-do-intro'), null, { timeout: 8000 });
  assert.ok(await page.locator('.bj-do-card', { hasText: 'CHPI-620L' }).count(), 'LP selected product should be visible');

  await page.click('.bj-do-copy');
  await page.waitForURL('**/html/dh_order/shop_cart', { timeout: 8000 });

  assert.strictEqual(cartPosts.length, 1, 'LP selected product without addons should be posted to cart');
  assert.ok(cartPosts[0].includes('public_model_no=1792'), 'LP selected product should resolve to a cartable prodNo');
  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await testOffIsInert(browser);
    await testOnQuoteCartFlow(browser);
    await testLpDirectOnlySelectedProduct(browser);
  } finally {
    await browser.close();
  }
  console.log('direct-offer QA OK');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
