const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const injectSource = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');
const FIXED_NOW = new Date('2026-11-19T05:00:00.000Z').getTime();
const CORE_RE = /cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject(?:@[^/]+)?\/inject(?:\.min)?\.js/;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function runViewport(browser, name, viewport) {
  const page = await browser.newPage({ viewport });
  const requests = [];
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.addInitScript((fixedNow) => {
    const RealDate = Date;
    class FixedDate extends RealDate {
      constructor(...args) {
        super(...(args.length ? args : [fixedNow]));
      }
      static now() { return fixedNow; }
    }
    window.Date = FixedDate;
    window.__bjPersonaWizardEnabled = false;
  }, FIXED_NOW);
  await page.route('**/v1/consult/quick-assign', async (route) => {
    requests.push(JSON.parse(route.request().postData() || '{}'));
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        code: '1234',
        phone: '1577-9469',
        telLink: 'tel:15779469,,1234',
        requestId: 999,
        expiresAtMinutes: 1440,
        consultantCard: { name: '빌리조', rating: 5, todayCalls: 1, totalCalls: 1 },
        queueStats: { nowWaiting: 0, activeConsultants: 1, avgResponseSecs: 30 },
      }),
    });
  });
  await page.route(CORE_RE, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript; charset=utf-8',
      headers: { 'access-control-allow-origin': '*' },
      body: injectSource,
    });
  });
  await page.goto(`https://billyjo.co.kr/?qa=main-quote-form-${name}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.locator('button.bj-trust-cta[data-bj-consult]').waitFor({ state: 'visible', timeout: 20000 });
  await page.click('button.bj-trust-cta[data-bj-consult]');

  assert(await page.locator('[data-bj-lead-step="contact"]').isVisible(), `${name}: contact step missing (${pageErrors.join('; ') || 'no page error'})`);
  assert((await page.locator('.bj-reserve-title').textContent()).trim() === '3초 견적·제품 추천', `${name}: title mismatch`);
  assert(await page.locator('.bj-slot').count() === 0, `${name}: reservation slots leaked into step 1`);
  assert(!(await page.locator('#bj-privacy-consent').isChecked()), `${name}: consent must default unchecked`);
  assert(
    await page.locator('.bj-consent a').getAttribute('href') === 'https://www.billyjo.co.kr/html/dh/privacy_policy',
    `${name}: privacy policy link mismatch`,
  );

  await page.fill('#bj-apply-name', '홍길동');
  await page.fill('#bj-apply-phone', '01012345678');
  await page.click('#bj-apply-now');
  assert(requests.length === 0, `${name}: request escaped without consent`);
  assert((await page.locator('#bj-apply-err').textContent()).includes('동의'), `${name}: missing consent error`);

  await page.check('#bj-privacy-consent');
  await page.click('#bj-apply-reserve');
  assert(await page.locator('[data-bj-lead-step="reservation"]').isVisible(), `${name}: reservation step missing`);
  assert(await page.locator('.bj-slot').count() === 8, `${name}: expected 8 reservation slots`);
  assert(requests.length === 0, `${name}: opening reservation submitted a lead`);

  await page.click('#bj-apply-back');
  assert(await page.inputValue('#bj-apply-name') === '홍길동', `${name}: name was not preserved`);
  assert(await page.inputValue('#bj-apply-phone') === '010-1234-5678', `${name}: phone was not preserved`);
  assert(await page.locator('#bj-privacy-consent').isChecked(), `${name}: consent was not preserved`);

  const dimensions = await page.evaluate(() => {
    const card = document.querySelector('#bj-consult-modal .bj-card');
    const rect = card.getBoundingClientRect();
    return {
      cardHeight: Math.round(rect.height),
      viewportHeight: window.innerHeight,
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
  assert(dimensions.cardHeight < dimensions.viewportHeight, `${name}: step 1 fills or exceeds viewport`);
  assert(dimensions.horizontalOverflow <= 0, `${name}: horizontal overflow ${dimensions.horizontalOverflow}px`);

  await page.click('#bj-apply-now');
  await page.waitForFunction(() => document.querySelector('.bj-code')?.textContent.includes('1234'));
  assert(requests.length === 1, `${name}: expected exactly one immediate lead request`);
  const payload = requests[0];
  assert(payload.formId === 'billyjo-main-quick-quote-v1', `${name}: formId missing`);
  assert(payload.privacyConsentAccepted === true, `${name}: consent flag missing`);
  assert(typeof payload.privacyConsentAcceptedAt === 'string' && payload.privacyConsentAcceptedAt.includes('T'), `${name}: consent timestamp missing`);
  assert(payload.customerName === '홍길동', `${name}: name payload mismatch`);
  assert(payload.customerPhone === '010-1234-5678', `${name}: phone payload mismatch`);

  await page.click('#bj-consult-modal .bj-close');
  await page.click('button.bj-trust-cta[data-bj-consult]');
  await page.fill('#bj-apply-name', '예약고객');
  await page.fill('#bj-apply-phone', '01087654321');
  await page.check('#bj-privacy-consent');
  await page.click('#bj-apply-reserve');
  await page.locator('.bj-slot').first().click();
  await page.waitForFunction(() => document.querySelector('.bj-done-title')?.textContent.includes('예약'));
  assert(requests.length === 2, `${name}: expected one immediate and one reservation request`);
  const reservationPayload = requests[1];
  assert(reservationPayload.formId === 'billyjo-main-quick-quote-v1', `${name}: reservation formId missing`);
  assert(reservationPayload.privacyConsentAccepted === true, `${name}: reservation consent flag missing`);
  assert(reservationPayload.callbackMinutes >= 5, `${name}: reservation callback missing`);
  assert((reservationPayload.customerMemo || '').includes('상담 희망 시간대'), `${name}: reservation memo missing`);

  await page.close();
  return { name, dimensions, slots: 8, requests: requests.length };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [];
    results.push(await runViewport(browser, 'mobile', { width: 390, height: 664 }));
    results.push(await runViewport(browser, 'desktop', { width: 1440, height: 900 }));
    console.log(JSON.stringify({ ok: true, results }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
