/* 후기 섹션(#bj-reviews-root) 삽입 위치 회귀 검사.
 *
 * 배경: AI 카드(billyjo-cards)는 별도 저장소의 외부 마크업이라 구조가 예고 없이 바뀐다.
 * 2026-07-28 사고 — SLOT6이 <div class="sec"> 에서 <details class="sec spec-collapse"><summary>…
 * 로 바뀌면서 후기 블록이 <summary>(display:flex) 안에 삽입돼 '상세 스펙' 제목 옆에 나란히 렌더됐다.
 * 카드 템플릿을 건드렸거나 inject.js 의 후기 삽입 로직을 손봤으면 이 검사를 돌린다.
 *
 * 사용법:
 *   node review-placement-check.js            # 로컬 inject.js 를 route 로 주입해 검사 (배포 전)
 *   node review-placement-check.js live       # 사이트에 실제 배포된 스크립트 그대로 검사 (배포 후)
 *   node review-placement-check.js live 24129 # 상품번호 지정
 *
 * 실패 시 exit 1.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const MODE = process.argv[2] === 'live' ? 'live' : 'local';
const PROD = process.argv[3] || '24129';
const URL = 'https://www.billyjo.co.kr/html/dh_prod/prod_view/' + PROD;
const LOCAL = fs.readFileSync(path.join(__dirname, '..', 'inject.js'), 'utf8');

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
];

(async () => {
  const browser = await chromium.launch();
  const fails = [];

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.mobile,
      hasTouch: vp.mobile,
      userAgent: vp.mobile
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
        : undefined,
    });
    if (MODE === 'local') {
      await ctx.route(/billyjo-inject@[^/]+\/inject\.js/, (route) =>
        route.fulfill({ status: 200, contentType: 'application/javascript', body: LOCAL })
      );
    }
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(14000); // 카드 fetch + 후기 fetch + 위치 워치독(최대 13s) 통과

    const r = await page.evaluate(() => {
      const root = document.getElementById('bj-reviews-root');
      if (!root) return { found: false };
      const secT = (re) => [...document.querySelectorAll('#ai-card-root .sec-t')].find((t) => re.test(t.textContent || ''));
      const spec = secT(/상세\s*스펙/);
      const specSec = spec ? spec.closest('.sec') : null;
      const persona = secT(/이런\s*분/);
      const personaSec = persona ? persona.closest('.sec') : null;
      const top = (el) => (el ? Math.round(el.getBoundingClientRect().top + scrollY) : null);
      const chain = [];
      for (let e = root.parentElement; e && chain.length < 5; e = e.parentElement) {
        chain.push(e.tagName.toLowerCase() + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).join('.') : ''));
      }
      return {
        found: true,
        inSummary: !!root.closest('summary'),
        insideSpecSec: !!(specSec && specSec.contains(root)),
        parentChain: chain,
        rootWidth: Math.round(root.getBoundingClientRect().width),
        parentWidth: Math.round(root.parentElement.getBoundingClientRect().width),
        rootTop: top(root),
        specTop: top(specSec),
        personaTop: top(personaSec),
        cards: root.querySelectorAll('.rv-card').length,
        hasCard: !!document.querySelector('#ai-card-root'),
      };
    });

    const tag = `[${MODE}/${vp.name}]`;
    console.log(tag, JSON.stringify(r));

    if (!r.found) { console.log(tag, 'SKIP — 후기 블록 미노출(브랜드/카테고리 미분류 또는 후기 0건)'); await ctx.close(); continue; }
    if (!r.hasCard) { console.log(tag, 'SKIP — AI 카드 없음(폴백 위치 사용)'); await ctx.close(); continue; }

    // 1) summary 안이면 안 된다 — 제목 옆에 나란히 렌더되는 원인
    if (r.inSummary) fails.push(`${tag} 후기 블록이 <summary> 안에 있음 (parent: ${r.parentChain[0]})`);
    // 2) '상세 스펙' 섹션 내부면 안 된다 — 접으면 후기가 같이 사라진다
    if (r.insideSpecSec) fails.push(`${tag} 후기 블록이 '상세 스펙' 섹션 내부에 있음`);
    // 3) 부모 폭의 90% 이상 — 옆으로 밀려 좁아진 상태 감지
    if (r.rootWidth < r.parentWidth * 0.9) fails.push(`${tag} 후기 블록 폭이 좁음 (${r.rootWidth}px / 부모 ${r.parentWidth}px)`);
    // 4) 순서: 페르소나(SLOT5) → 후기 → 상세 스펙(SLOT6)
    if (r.personaTop != null && r.rootTop <= r.personaTop) fails.push(`${tag} 후기가 페르소나 섹션보다 위 (${r.rootTop} <= ${r.personaTop})`);
    if (r.specTop != null && r.rootTop >= r.specTop) fails.push(`${tag} 후기가 '상세 스펙' 섹션보다 아래 (${r.rootTop} >= ${r.specTop})`);

    await ctx.close();
  }

  await browser.close();
  if (fails.length) { console.error('\nFAIL:\n- ' + fails.join('\n- ')); process.exit(1); }
  console.log('\nOK — 후기 섹션 위치 정상');
})().catch((e) => { console.error('FAIL:', e.message); process.exit(1); });
