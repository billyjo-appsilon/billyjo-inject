'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { HOME_RENDER_GATE_STYLE } = require('./home-render-logscript');

const injectSource = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');
const CORE_RE = /cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject(?:@[^/]+)?\/inject(?:\.min)?\.js/;
const V5_RE = /cdn\.jsdelivr\.net\/gh\/billyjo-appsilon\/billyjo-inject@4c8fe10\/preview-detail-page-v5\.html/;

async function runCase(browser, name, options) {
  const promotionStatus = options.promotionStatus ?? 200;
  const promotionDelay = options.promotionDelay ?? 650;
  const v5Status = options.v5Status ?? 200;
  const v5Delay = options.v5Delay ?? 120;
  const expectedReason = options.expectedReason || 'promotion-ready';
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const requestTimes = {};

  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('/v1/promotions/current')) requestTimes.promotion = Date.now();
    if (V5_RE.test(url)) requestTimes.v5 = Date.now();
  });
  await page.addInitScript(() => {
    window.__bjRenderAudit = { states: [], events: [], dcl: 0 };
    function visible(element) {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    }
    function capture(reason) {
      const v5 = document.getElementById('bj-v5-injected');
      window.__bjRenderAudit.states.push({
        at: performance.now(),
        reason,
        v5Visible: visible(v5),
        promoExists: !!document.getElementById('bj-home-gift-promos'),
        released: v5 && v5.getAttribute('data-bj-home-released') || '',
      });
    }
    document.addEventListener('DOMContentLoaded', () => {
      window.__bjRenderAudit.dcl = Date.now();
      capture('dcl');
      const observer = new MutationObserver(() => capture('mutation'));
      observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'data-bj-home-released'] });
      const timer = setInterval(() => capture('interval'), 25);
      setTimeout(() => { clearInterval(timer); observer.disconnect(); capture('stop'); }, 5000);
    });
    document.addEventListener('bj:home-render-ready', (event) => {
      window.__bjRenderAudit.events.push({ at: performance.now(), reason: event.detail && event.detail.reason || '' });
      capture('ready-event');
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
  await page.route(V5_RE, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, v5Delay));
    if (v5Status === 200) return route.continue();
    await route.fulfill({ status: v5Status, contentType: 'text/plain', body: 'qa v5 failure' });
  });
  await page.route('**/v1/promotions/current?month=*', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, promotionDelay));
    if (promotionStatus === 200) return route.continue();
    await route.fulfill({ status: promotionStatus, contentType: 'application/json', body: '{"detail":"qa failure"}' });
  });

  await page.goto(`https://billyjo.co.kr/?qa=home-render-once-${name}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  if (v5Status !== 200) {
    await page.waitForFunction(() => document.body?.classList.contains('bj-home-native-fallback'), null, { timeout: 15000 });
  } else if (expectedReason === 'promotion-ready') {
    await page.waitForSelector('#bj-home-gift-promos', { state: 'visible', timeout: 15000 });
  } else {
    await page.waitForFunction((reason) => document.querySelector('#bj-v5-injected')?.getAttribute('data-bj-home-released') === reason, expectedReason, { timeout: 15000 });
  }
  await page.waitForTimeout(200);

  const audit = await page.evaluate(() => window.__bjRenderAudit);
  const visibleIntermediate = audit.states.filter((state) => state.v5Visible && !state.promoExists && !state.released);
  if (visibleIntermediate.length) throw new Error(`${name}: v5 became visible before final promotion cards: ${JSON.stringify(visibleIntermediate.slice(0, 4))}`);
  if (!requestTimes.v5 || !requestTimes.promotion || !audit.dcl) throw new Error(`${name}: request/DCL timing evidence is incomplete`);
  if (requestTimes.v5 > audit.dcl || requestTimes.promotion > audit.dcl) throw new Error(`${name}: home requests did not start before DOMContentLoaded`);
  const reasons = audit.events.map((event) => event.reason);
  if (v5Status === 200 && !reasons.includes(expectedReason)) throw new Error(`${name}: missing ${expectedReason} release event`);
  if (expectedReason === 'promotion-ready' && !audit.states.some((state) => state.v5Visible && state.promoExists && state.released === 'promotion-ready')) {
    throw new Error(`${name}: final content was not revealed as one state`);
  }
  if (v5Status !== 200) {
    const nativeFallback = await page.evaluate(() => ({
      active: document.body.classList.contains('bj-home-native-fallback'),
      reason: document.body.getAttribute('data-bj-home-fallback'),
      v5: !!document.getElementById('bj-v5-injected'),
    }));
    if (!nativeFallback.active || nativeFallback.reason !== 'v5-fetch-failed' || nativeFallback.v5) {
      throw new Error(`${name}: native fallback did not recover cleanly: ${JSON.stringify(nativeFallback)}`);
    }
  }

  console.log(`${name}: ok`, JSON.stringify({ requestLeadMs: { v5: audit.dcl - requestTimes.v5, promotion: audit.dcl - requestTimes.promotion }, reasons }));
  await context.close();
}

async function runCssGateCase(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.setContent(`<!doctype html><html><head>${HOME_RENDER_GATE_STYLE}</head><body><section class="new-mc">native cards</section></body></html>`);
  const initial = await page.locator('.new-mc').evaluate((element) => getComputedStyle(element).visibility);
  if (initial !== 'hidden') throw new Error(`css-gate: expected initial hidden state, got ${initial}`);
  await page.waitForTimeout(5200);
  const recovered = await page.locator('.new-mc').evaluate((element) => getComputedStyle(element).visibility);
  if (recovered !== 'visible') throw new Error(`css-gate: native fallback animation did not recover (${recovered})`);
  console.log('css-gate: ok');
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await runCssGateCase(browser);
    await runCase(browser, 'success', { promotionStatus: 200, v5Delay: 120, promotionDelay: 650, expectedReason: 'promotion-ready' });
    await runCase(browser, 'promo-first', { promotionStatus: 200, v5Delay: 650, promotionDelay: 120, expectedReason: 'promotion-ready' });
    await runCase(browser, 'promo-failed', { promotionStatus: 503, v5Delay: 120, promotionDelay: 650, expectedReason: 'promotion-fetch-failed' });
    await runCase(browser, 'promotion-timeout', { promotionStatus: 200, v5Delay: 120, promotionDelay: 4000, expectedReason: 'promotion-timeout' });
    await runCase(browser, 'v5-failed', { promotionStatus: 200, v5Status: 503, v5Delay: 0, promotionDelay: 650, expectedReason: 'v5-fetch-failed' });
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
