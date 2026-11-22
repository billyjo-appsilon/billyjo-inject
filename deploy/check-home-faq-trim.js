const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const repoRoot = path.join(__dirname, '..');
const injectSource = fs.readFileSync(path.join(repoRoot, 'inject.js'), 'utf8');

for (const forbidden of [
  '고객 신뢰도 100%',
  '빌리조만의 제공 서비스',
  "['본사보다 빌리조가 좋은', 7]",
]) {
  if (injectSource.includes(forbidden)) throw new Error(`removed service-section copy remains: ${forbidden}`);
}
for (const required of [
  "grid.closest && grid.closest('.bj-ben-zone')",
  "body .m_outer>.bj-home-faq-zone>section,#bj-v5-injected>.bj-home-faq-zone>section{width:calc(100% - 16px)!important",
  'max-width:920px!important',
  '.bj-home-faq-zone{display:block;width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important;padding-left:0!important;padding-right:0!important',
  'class="bj-home-faq-label" aria-hidden="true">Q.</span>',
  'class="bj-home-faq-label" aria-hidden="true">A.</span>',
  '.bj-home-faq-item summary:focus-visible',
  "'본사보다 빌리조가 좋은'",
  'legacyZone.parentElement === pageEl',
]) {
  if (!injectSource.includes(required)) throw new Error(`missing FAQ/service source contract: ${required}`);
}

async function inspect(browser, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const pageErrors = [];
  let injectIntercepts = 0;
  page.on('pageerror', (error) => pageErrors.push(String(error && error.message || error)));
  await page.route(/billyjo-inject(?:@[0-9a-f]{7,40})?\/inject(?:\.min)?\.js/i, async (route) => {
    injectIntercepts += 1;
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript; charset=utf-8',
      headers: { 'access-control-allow-origin': '*' },
      body: injectSource,
    });
  });

  try {
    await page.goto(`https://billyjo.co.kr/?apsi_faq_trim_qa=${width}`, {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });
    await page.waitForSelector('#bj-v5-injected[data-bj-home-released]', { timeout: 30000 });
    await page.waitForSelector('.bj-home-faq-zone .bj-home-faq-item', { timeout: 15000 });
    await page.waitForTimeout(1200);

    const result = await page.evaluate(() => {
      const zone = document.querySelector('.bj-home-faq-zone');
      const section = zone?.querySelector('section');
      const list = zone?.querySelector('.bj-home-faq-list');
      const items = Array.from(zone?.querySelectorAll('.bj-home-faq-item') || []);
      const first = items[0];
      const questionLabel = first?.querySelector('summary .bj-home-faq-label');
      const answerLabel = first?.querySelector('.bj-home-faq-answer > .bj-home-faq-label');
      const rect = (node) => {
        const box = node?.getBoundingClientRect();
        return box ? { left: box.left, right: box.right, width: box.width } : null;
      };
      const style = (node) => node ? getComputedStyle(node) : null;
      return {
        viewportWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        removedCopyCount: Array.from(document.querySelectorAll('#bj-v5-injected section')).filter((node) => {
          const text = node.textContent || '';
          return text.includes('고객 신뢰도 100%') || text.includes('빌리조만의 제공 서비스');
        }).length,
        legacyDiffGrids: Array.from(document.querySelectorAll('#bj-v5-injected .diff-grid')).filter((grid) => !grid.closest('.bj-ben-zone')).length,
        benefitCards: document.querySelectorAll('#bj-v5-injected .bj-ben-zone .diff-card').length,
        itemCount: items.length,
        qLabelCount: zone?.querySelectorAll('summary > .bj-home-faq-label').length || 0,
        aLabelCount: zone?.querySelectorAll('.bj-home-faq-answer > .bj-home-faq-label').length || 0,
        section: rect(section),
        zone: rect(zone),
        list: rect(list),
        first: rect(first),
        computed: section ? {
          width: style(section).width,
          maxWidth: style(section).maxWidth,
          padding: style(section).padding,
          margin: style(section).margin,
        } : null,
        cssHasWideRule: Boolean(document.getElementById('bj-home-faq-css')?.textContent.includes('width:calc(100% - 16px)!important')),
        labels: {
          q: questionLabel?.textContent || '',
          a: answerLabel?.textContent || '',
          qColor: style(questionLabel)?.color || '',
          qBackground: style(questionLabel)?.backgroundColor || '',
          qWeight: style(questionLabel)?.fontWeight || '',
          aColor: style(answerLabel)?.color || '',
          aBackground: style(answerLabel)?.backgroundColor || '',
          aWeight: style(answerLabel)?.fontWeight || '',
          qAriaHidden: questionLabel?.getAttribute('aria-hidden') || '',
          aAriaHidden: answerLabel?.getAttribute('aria-hidden') || '',
        },
        open: Boolean(first?.open),
      };
    });

    if (injectIntercepts < 1) throw new Error(`inject not intercepted at ${width}px`);
    if (result.removedCopyCount !== 0 || result.legacyDiffGrids !== 0) {
      throw new Error(`legacy service section remains at ${width}px: ${JSON.stringify(result)}`);
    }
    if (result.benefitCards !== 4) throw new Error(`kept benefit cards regressed at ${width}px: ${result.benefitCards}`);
    if (result.itemCount !== 6 || result.qLabelCount !== 6 || result.aLabelCount !== 6) {
      throw new Error(`FAQ item/label count regressed at ${width}px: ${JSON.stringify(result)}`);
    }
    if (result.labels.q !== 'Q.' || result.labels.a !== 'A.' ||
        result.labels.qAriaHidden !== 'true' || result.labels.aAriaHidden !== 'true' ||
        Number(result.labels.qWeight) < 800 || Number(result.labels.aWeight) < 800 ||
        result.labels.qBackground === result.labels.aBackground || result.labels.qColor === result.labels.aColor) {
      throw new Error(`Q/A visual distinction regressed at ${width}px: ${JSON.stringify(result.labels)}`);
    }
    if (!result.open) throw new Error(`first FAQ item should start open at ${width}px`);
    if (width <= 767) {
      if (result.first.left > 9 || result.viewportWidth - result.first.right > 9 || result.first.width < result.viewportWidth - 18) {
        throw new Error(`mobile FAQ width regressed at ${width}px: ${JSON.stringify(result)}`);
      }
    } else if (result.first.width < 900 || result.first.width > 921) {
      throw new Error(`desktop FAQ width regressed at ${width}px: ${JSON.stringify(result)}`);
    }
    if (result.scrollWidth > result.viewportWidth + 1) {
      throw new Error(`horizontal overflow at ${width}px: ${result.scrollWidth}/${result.viewportWidth}`);
    }

    await page.locator('.bj-home-faq-item').first().locator('summary').focus();
    await page.keyboard.press('Enter');
    if (await page.locator('.bj-home-faq-item').first().getAttribute('open') !== null) {
      throw new Error(`keyboard Enter did not close FAQ at ${width}px`);
    }
    await page.keyboard.press('Enter');
    if (await page.locator('.bj-home-faq-item').first().getAttribute('open') === null) {
      throw new Error(`keyboard Enter did not reopen FAQ at ${width}px`);
    }

    const relevantErrors = pageErrors.filter((message) => /faq|SyntaxError|ReferenceError|TypeError/.test(message));
    if (relevantErrors.length) throw new Error(`relevant page errors: ${relevantErrors.join(' | ')}`);
    return result;
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [];
    for (const width of [320, 375, 390, 1280]) results.push(await inspect(browser, width));
    console.log(JSON.stringify({ contract: 'ok', results }, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error && error.stack || error);
  process.exit(1);
});
