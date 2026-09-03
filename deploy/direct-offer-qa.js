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

async function newMockedPage(browser, { enabled, viewport }) {
  const context = await browser.newContext({ baseURL: 'https://billyjo.co.kr', viewport });
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
  await page.route('https://admin2-api.billyjo.co.kr/v1/quote/calculate', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, gift: { baseAmount: 530000 }, items: [{ giftAmount: 530000 }] }),
    });
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
  await page.waitForSelector('#bj-do-topbar', { timeout: 5000 });
  assert.strictEqual(await page.locator('#bj-do-fab').count(), 0, 'Direct coupon FAB should not mount over the product image');
  const topbarText = await page.locator('#bj-do-topbar').innerText();
  assert.ok(topbarText.includes('지금 이 제품 보는 중'), 'Top social bar should show current viewer count');
  assert.ok(/후기\s*642\s*개/.test(topbarText), 'Top social bar should show current product review count');
  assert.strictEqual(topbarText.includes('동안 이 화면 조건 유지'), false, 'Top social bar should not show condition duration');
  assert.strictEqual(topbarText.includes('오늘 다이렉트 쿠폰'), false, 'Top social bar should not show direct coupon count');
  await page.click('.bj-btn-rent-gift');
  await page.waitForSelector('#bj-do-back');
  assert.ok(await page.evaluate(() => (window.dataLayer || []).some((e) => e.analytics_event_name === 'direct_offer_open' && e.audience_signal === true && e.event_tier === 'high_intent')), 'Direct offer open should be tracked as a high-intent audience signal');

  assert.strictEqual(await page.evaluate(() => window.rentClicked || 0), 0, 'ON should intercept rent click and open popup first');
  assert.ok((await page.locator('.bj-do-copy').innerText()).includes('지원금 쿠폰 받고 신청'), 'CTA should be coupon-claim and application oriented');
  assert.strictEqual(await page.locator('.bj-do-badge').count(), 0, 'Direct coupon badge should be removed from modal header');
  assert.ok((await page.locator('#bj-do-total').innerText()).includes('AI 예상 지원금 합계'), 'Total label should keep AI 예상 지원금 합계');
  assert.ok((await page.locator('#bj-do-total').innerText()).includes('예상 사은품 + 지원금 쿠폰'), 'Total formula should explain gift plus support coupon');
  await page.waitForTimeout(1000);
  const totalText = await page.locator('#bj-do-total').innerText();
  assert.ok(totalText.includes('399,500원') && totalText.includes('470,000원'), 'Displayed total should show 85%~final benefit range');
  assert.ok(totalText.includes('1주일에 한번! 오늘만') && totalText.includes('지원금 쿠폰') && totalText.includes('30,000p'), 'Displayed total should show the 30,000p support coupon banner');
  assert.strictEqual(totalText.includes('이번 주 30,000원 쿠폰은 이미 확인된 조건입니다.'), false, 'Old confirmed-coupon notice should be removed');
  assert.strictEqual(totalText.includes('지원금 합계금은 최종표기금액의 85%'), false, 'Old benefit-range help text should be removed');
  assert.ok(totalText.includes('쿠폰 유효시간'), 'Coupon should show the 30-minute countdown copy');
  assert.strictEqual(await page.locator('.bj-do-coupon-card').count(), 1, 'Coupon should render as a distinct coupon card');
  assert.strictEqual(await page.locator('[data-bj-do-coupon-left]').count(), 1, 'Coupon countdown should be visible below the coupon card');
  assert.strictEqual(totalText.includes('500,000원'), false, 'Displayed total should not flash the undiscounted raw total');
  assert.strictEqual(totalText.includes('530,000원'), false, 'Displayed total should not be overwritten by delayed quote recalculation');
  const couponState = await page.evaluate(() => JSON.parse(localStorage.getItem('bj_direct_offer_weekly_coupon_v1') || '{}'));
  assert.ok(couponState.expiresAt > Date.now(), 'Coupon state should start a 30-minute countdown');
  assert.ok(couponState.weeklyUntil - Date.now() > 6 * 24 * 60 * 60000, 'Coupon state should be held for one week');
  assert.ok(await page.locator('.bj-do-card', { hasText: '코웨이 정수기' }).count(), 'Current real product should be included');
  assert.ok(await page.locator('.bj-do-card', { hasText: '코웨이 노블 공기청정기 AP-3021D' }).count(), 'Recommended real product should be shown');
  assert.strictEqual(await page.locator('.bj-do-card', { hasText: '상담 필요 제품' }).count(), 0, 'Products without confirmed gift amount should be hidden');
  assert.ok((await page.locator('.bj-do-card', { hasText: '코웨이 정수기' }).innerText()).includes('예상 사은품 425,000원 ~ 500,000원'), 'Current product gift label should use 예상 사은품 with a fixed 85%~current range');
  assert.ok((await page.locator('.bj-do-card', { hasText: '코웨이 노블 공기청정기 AP-3021D' }).innerText()).includes('결합 사은품 255,000원 ~ 300,000원'), 'Additional product gift label should keep 결합 사은품');
  assert.strictEqual(await page.locator('.bj-do-gift', { hasText: '예상 지원금' }).count(), 0, 'Direct offer cards should not use 예상 지원금 label');
  assert.strictEqual(await page.locator('.bj-do-gift', { hasText: '상담 시 확인' }).count(), 0, 'Unknown gift products should not be shown as 상담 시 확인');

  await page.locator('.bj-do-card', { hasText: '코웨이 노블 공기청정기 AP-3021D' }).click();
  assert.ok(await page.evaluate(() => (window.dataLayer || []).some((e) => e.analytics_event_name === 'direct_offer_product_select' && e.product_id === '7606' && e.audience_signal === true)), 'Additional product selection should be tracked for remarketing');
  await page.click('.bj-do-copy');
  await page.waitForFunction(() => (window.dataLayer || []).some((e) => e.analytics_event_name === 'direct_offer_submit_success' && e.submit_destination === 'quote_cart' && e.event_tier === 'high_intent'), null, { timeout: 7000 });
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
  assert.ok((await page.locator('.bj-do-h').textContent()).includes('이번달 특가 프로모션 + 결합 추가사은품 BEST'), 'Updated promo headline should remain accessible');
  assert.ok((await page.locator('#bj-do-head').evaluate((el) => getComputedStyle(el).backgroundImage)).includes('direct-offer-top-banner-left-text.png'), 'Promo headline should be rendered as a banner image');
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

async function testMobileJumpToSubmit(browser) {
  const { context, page, cartPosts } = await newMockedPage(browser, {
    enabled: true,
    viewport: { width: 390, height: 720 },
  });
  await page.goto('https://billyjo.co.kr/html/dh_prod/prod_view/123', { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ path: injectPath });
  await page.waitForSelector('#bj-do-topbar', { timeout: 5000 });
  assert.strictEqual(await page.locator('#bj-do-fab').count(), 0, 'Direct coupon FAB should not mount on mobile');
  await page.click('.bj-btn-rent-gift');
  await page.waitForSelector('#bj-do-box.bj-do-jump-on #bj-do-jump', { timeout: 5000 });
  assert.ok((await page.locator('#bj-do-jump').innerText()).includes('지원금 쿠폰 받고 신청'), 'Mobile jump CTA should use coupon-claim and application copy');

  await page.click('#bj-do-jump');
  await page.waitForFunction(() => {
    const scroller = document.querySelector('#bj-do-body');
    const cta = document.querySelector('.bj-do-copy');
    if (!scroller || !cta) return false;
    const sr = scroller.getBoundingClientRect();
    const cr = cta.getBoundingClientRect();
    return cr.top < sr.bottom - 18 && cr.bottom > sr.top + 18;
  }, null, { timeout: 3000 });

  assert.strictEqual(await page.locator('#bj-do-box.bj-do-jump-on').count(), 0, 'Jump button should hide once the original CTA is visible');
  assert.strictEqual(page.url().endsWith('/html/dh_order/shop_cart'), false, 'Jump button should reveal the CTA, not submit automatically');
  assert.strictEqual(cartPosts.length, 0, 'Jump button should not add products to cart by itself');
  await context.close();
}

async function testMobileCartCardLayout(browser) {
  const context = await browser.newContext({
    baseURL: 'https://billyjo.co.kr',
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.route('https://billyjo.co.kr/html/dh_order/shop_cart', async (route) => {
    await route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><html><head><meta charset="utf-8"></head><body>
        <h1>장바구니</h1>
        <div class="page_desc"><p>렌탈은 구매가 아니므로, 결제 없이 신청으로 접수됩니다.</p></div>
        <h2>장바구니 담긴 상품 (1)</h2>
        <table class="order-field cart-list"><tbody>
          <tr>
            <td><input type="checkbox" checked idx="557051" mprice="28900" cprice="0" cnt="1" month="84"></td>
            <td class="thumb size2"><img src="https://billyjo.co.kr/logo.png" alt=""></td>
            <td class="prod"><p class="name">코웨이 아이콘3 아이콘 정수기 3.0 냉온정수기 (CHP-7220N) 자가관리 (색상 6중 1택)</p><p class="brand">코웨이</p></td>
            <td class="row month36 month-etc">7년(7년의무)</td>
            <td>월 28,900 원</td>
            <td><em class="dh_red">해당없음</em></td>
            <td>1 개</td>
          </tr>
        </tbody></table>
        <button class="plain btn-border-s">선택상품 삭제</button>
        <button class="plain btn-border-s">선택상품 견적서출력</button>
        <button class="plain btn_large c2">선택상품 렌탈</button>
        <button class="plain btn_large c1">전체상품 렌탈</button>
      </body></html>`,
    });
  });
  await page.goto('https://billyjo.co.kr/html/dh_order/shop_cart', { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ path: injectPath });
  await page.waitForSelector('.bj-cart-card-row', { timeout: 5000 });
  await page.waitForFunction(() => document.querySelectorAll('.bj-cart-primary-action').length === 2, null, { timeout: 5000 });

  const layout = await page.evaluate(() => {
    const row = document.querySelector('.bj-cart-card-row');
    const term = document.querySelector('.month36');
    const first = document.querySelector('.bj-cart-primary-action');
    const second = Array.from(document.querySelectorAll('.bj-cart-primary-action'))[1];
    const rr = row.getBoundingClientRect();
    const tr = term.getBoundingClientRect();
    const fr = first.getBoundingClientRect();
    const sr = second.getBoundingClientRect();
    return {
      rowLeft: rr.left,
      rowWidth: rr.width,
      termBefore: getComputedStyle(term, '::before').content,
      termHeight: tr.height,
      firstButtonWidth: fr.width,
      secondButtonWidth: sr.width,
      firstButtonText: first.textContent.trim(),
      secondButtonText: second.textContent.trim(),
    };
  });

  assert.ok(layout.rowLeft >= 12, 'Mobile cart card should align with page gutters');
  assert.ok(layout.rowWidth <= 366, 'Mobile cart card should not span edge to edge');
  assert.strictEqual(layout.termBefore, 'none', 'Native month badge pseudo-element must not overlap the term text');
  assert.ok(layout.termHeight >= 16, 'Term text should keep a normal readable line box');
  assert.ok(Math.abs(layout.firstButtonWidth - layout.secondButtonWidth) < 2, 'Primary cart actions should have matching widths');
  assert.strictEqual(layout.firstButtonText, '선택 제품 견적/신청');
  assert.strictEqual(layout.secondButtonText, '전체 상품 견적/신청');
  await context.close();
}

async function testAffiliateCardSelectionModal(browser) {
  const context = await browser.newContext({
    baseURL: 'https://billyjo.co.kr',
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.route('https://admin2-api.billyjo.co.kr/v1/quote/calculate', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        quoteTransactionId: 'BJ-QA-COWAY',
        expiresAt: '2026-09-03T23:59:00+09:00',
        gift: { finalAmount: 348000 },
        customerMemo: '[빌리조 24시간 혜택 보장번호: BJ-QA-COWAY]\n예상 사은품 혜택: 348,000원\n유효기한: 2026-09-03 23:59',
      }),
    });
  });
  await page.route('https://billyjo.co.kr/html/dh_order/shop_cart', async (route) => {
    await route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><html><head><meta charset="utf-8"></head><body>
        <form id="cart-form">
          <table class="order-field cart-list"><tbody>
            <tr>
              <td><input type="checkbox" checked></td>
              <td class="thumb size2"><img src="https://billyjo.co.kr/logo.png" alt=""></td>
              <td class="prod">
                <input name="public_model_no" value="CHP-7220N 셀프 반값할인">
                <input name="prod_model_no" value="CHP-7220N">
                <input name="prod_name" value="코웨이 아이콘3 아이콘 3.0 냉온정수기">
                <input name="sup_name" value="코웨이">
                <input name="month" value="7년(7년의무)">
                <input name="price" value="28,900">
                <p class="name">코웨이 아이콘3 아이콘 3.0 냉온정수기</p>
                <p class="brand">코웨이</p>
              </td>
            </tr>
          </tbody></table>
          <button type="submit" class="plain btn_large c2">선택상품 렌탈</button>
        </form>
      </body></html>`,
    });
  });
  await page.goto('https://billyjo.co.kr/html/dh_order/shop_cart', { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ path: injectPath });
  await page.click('.bj-cart-primary-action');
  await page.waitForSelector('#bj-quote-auth-modal .bj-qam-aff-seg', { timeout: 5000 });

  assert.strictEqual(await page.locator('.bj-qam-memo').count(), 0, 'Customer memo template should not be visible in the quote modal');
  assert.ok(await page.locator('.bj-qam-aff-card', { hasText: '코웨이 신한카드' }).count(), 'Coway affiliate cards should be shown for Coway products');
  assert.ok((await page.locator('.bj-qam-aff-card', { hasText: '코웨이 신한카드' }).innerText()).includes('전월 30만원 기준 월 24,000원 할인'), 'Cards should show the minimum spend discount first');
  assert.ok((await page.locator('.bj-qam-aff-thumb img').first().getAttribute('src')).includes('/af_card/'), 'Card thumbnails should use real affiliate card images');

  await page.click('[data-bj-aff-toggle="apply"]');
  await page.fill('[data-bj-qam-field="giftAccount"]', '신한은행 / 홍길동 / 110-123-456789');
  await page.selectOption('[data-bj-qam-field="payType"]', '통장 결제');
  await page.fill('[data-bj-qam-field="payInfo"]', '국민은행 / 홍길동 / 123456-00-123456');
  await page.click('.bj-qam-go');

  const memo = await page.evaluate(() => sessionStorage.getItem('bj_quote_pending_customer_memo') || '');
  assert.ok(memo.includes('3. 제휴카드: 코웨이 신한카드 / 전월 30만원 기준 월 24,000원 할인'), 'Selected card should be stored in the internal memo');
  assert.strictEqual(memo.includes('사용 / 미사용, 신청 카드명'), false, 'Old free-text affiliate-card template should not remain');
  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await testOffIsInert(browser);
    await testOnQuoteCartFlow(browser);
    await testLpDirectOnlySelectedProduct(browser);
    await testLpSelectedProductsUseProductThumbs(browser);
    await testMobileJumpToSubmit(browser);
    await testMobileCartCardLayout(browser);
    await testAffiliateCardSelectionModal(browser);
  } finally {
    await browser.close();
  }
  console.log('direct-offer QA OK');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
