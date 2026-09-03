/* 상세페이지 하단 고정 위젯 회귀 검사.
 *
 * 검사 항목:
 *   - billyjo inject.js가 로드됐는가
 *   - .prod_view_bot.card.mt40 또는 native .prod_fix_wrap 이 실제 viewport 안에 보이는가
 *   - 커스텀 위젯이면 .bj-bar-handle 이 있고, 최소 높이/가로폭이 확보됐는가
 *
 * 사용:
 *   node bottom-widget-check.js
 *   node bottom-widget-check.js 24578 18931
 *   node bottom-widget-check.js --local 24578
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
const LOCAL_MODE = argv.includes('--local');
const PRODUCTS = argv.filter((a) => /^\d+$/.test(a));
const TARGETS = PRODUCTS.length ? PRODUCTS : ['24578', '18931', '27281'];
const LOCAL = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');
const SHOT_DIR = path.join(__dirname, '.logs', 'bottom-widget');

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
];

function userAgent(vp) {
  return vp.mobile
    ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    : undefined;
}

(async () => {
  const browser = await chromium.launch();
  const fails = [];
  const rows = [];

  for (const pid of TARGETS) {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.mobile,
        hasTouch: vp.mobile,
        userAgent: userAgent(vp),
      });
      if (LOCAL_MODE) {
        await ctx.route(/billyjo-inject@[^/]+\/inject\.js/, (route) =>
          route.fulfill({ status: 200, contentType: 'application/javascript', body: LOCAL })
        );
      }
      const page = await ctx.newPage();
      const url = `https://www.billyjo.co.kr/html/dh_prod/prod_view/${pid}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(10000);

      const result = await page.evaluate(() => {
        const scripts = Array.from(document.scripts).map((s) => s.src).filter(Boolean);
        const injectSrc = scripts.find((src) => src.includes('billyjo-inject') && src.includes('/inject.js')) || '';
        const custom = document.querySelector('.prod_view_bot.card.mt40');
        const native = Array.from(document.querySelectorAll('.prod_fix_wrap')).find((el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return cs.display !== 'none' && cs.visibility !== 'hidden' && r.height > 10 && r.bottom > 0 && r.top < innerHeight;
        });
        const target = custom || native;
        if (!target) return { injectSrc, ok: false, reason: 'no widget element' };
        const r = target.getBoundingClientRect();
        const cs = getComputedStyle(target);
        const inViewport = r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
        const visible = cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity || 1) > 0.05;
        const hasHandle = !!target.querySelector('.bj-bar-handle') || target.classList.contains('prod_fix_wrap');
        const rentButton = Array.from(target.querySelectorAll('button, a, input')).find((el) => {
          const label = (el.value || el.textContent || '').replace(/\s+/g, ' ').trim();
          if (!/렌탈\s*\+?\s*사은품\s*신청|지원금\s*쿠폰\s*받고\s*신청|렌탈신청/.test(label)) return false;
          const rr = el.getBoundingClientRect();
          const rs = getComputedStyle(el);
          return rs.display !== 'none' && rs.visibility !== 'hidden' &&
            rr.height > 10 && rr.width > 60 && rr.bottom > 0 && rr.top < innerHeight;
        });
        const rentRect = rentButton && rentButton.getBoundingClientRect();
        const rentStyle = rentButton && getComputedStyle(rentButton);
        const rentVisible = !!(rentButton && rentStyle.display !== 'none' && rentStyle.visibility !== 'hidden' &&
          rentRect.height > 10 && rentRect.width > 60 && rentRect.bottom > 0 && rentRect.top < innerHeight);
        const isCustom = !!custom;
        const isCollapsed = !isCustom || target.classList.contains('bj-bar-collapsed');
        const rentHiddenWhileCollapsed = !isCustom || !rentVisible;
        return {
          injectSrc,
          ok: Boolean(inViewport && visible && hasHandle && isCollapsed && rentHiddenWhileCollapsed && r.height > 10 && r.width > Math.min(300, innerWidth * 0.7)),
          reason: '',
          kind: custom ? 'custom' : 'native',
          className: target.className,
          rect: { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) },
          handleText: (target.querySelector('.bj-bar-handle') || target).textContent.trim().replace(/\s+/g, ' ').slice(0, 120),
          rentText: rentButton ? (rentButton.value || rentButton.textContent || '').trim().replace(/\s+/g, ' ') : '',
          isCollapsed,
          rentVisible,
        };
      });

      const expandedResult = await page.evaluate(async () => {
        const target = document.querySelector('.prod_view_bot.card.mt40');
        const handle = target && target.querySelector('.bj-bar-handle');
        if (!target || !handle) return { ok: true, skipped: true };
        handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: innerWidth / 2, clientY: innerHeight - 22 }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: innerWidth / 2, clientY: innerHeight - 22 }));
        await new Promise((resolve) => setTimeout(resolve, 420));
        const rentButton = Array.from(target.querySelectorAll('button, a, input')).find((el) => {
          const label = (el.value || el.textContent || '').replace(/\s+/g, ' ').trim();
          if (!/렌탈\s*\+?\s*사은품\s*신청|지원금\s*쿠폰\s*받고\s*신청|렌탈신청/.test(label)) return false;
          const rr = el.getBoundingClientRect();
          const rs = getComputedStyle(el);
          return rs.display !== 'none' && rs.visibility !== 'hidden' &&
            rr.height > 10 && rr.width > 60 && rr.bottom > 0 && rr.top < innerHeight;
        });
        return {
          ok: target.classList.contains('bj-bar-expanded') && !target.classList.contains('bj-bar-collapsed') && !!rentButton,
          className: target.className,
          rentText: rentButton ? (rentButton.value || rentButton.textContent || '').trim().replace(/\s+/g, ' ') : '',
        };
      });

      const tag = `[${pid}/${vp.name}]`;
      rows.push({ tag, ...result });
      console.log(`${tag} ${result.ok ? 'OK' : 'FAIL'} ${result.kind || '-'} ${result.rentText || result.handleText || result.reason || ''}`);
      if (!result.injectSrc) fails.push(`${tag} inject.js not loaded`);
      if (!result.ok) {
        fails.push(`${tag} bottom widget not visible (${result.reason || JSON.stringify(result.rect || {})})`);
        fs.mkdirSync(SHOT_DIR, { recursive: true });
        await page.screenshot({ path: path.join(SHOT_DIR, `${pid}-${vp.name}.png`), fullPage: false });
      }
      if (!expandedResult.ok) {
        fails.push(`${tag} bottom widget handle does not expand to CTA (${expandedResult.className || 'no class'})`);
        fs.mkdirSync(SHOT_DIR, { recursive: true });
        await page.screenshot({ path: path.join(SHOT_DIR, `${pid}-${vp.name}-expanded-fail.png`), fullPage: false });
      }
      await ctx.close();
    }
  }

  await browser.close();
  if (fails.length) {
    console.error(`\nFAIL (${fails.length}건):\n- ` + fails.join('\n- '));
    process.exit(1);
  }
  console.log(`\nOK — 상세 ${TARGETS.length}개 x 뷰포트 ${VIEWPORTS.length}개 하단 위젯 노출 정상`);
})().catch((e) => { console.error('FAIL:', e.message); process.exit(1); });
