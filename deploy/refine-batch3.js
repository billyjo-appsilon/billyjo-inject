const fs = require('fs');
const CARDS_DIR = '/Users/appsilon/repos/billyJo/skin-css/works/cards';

const REFINED = {
  '790': {
    name: '코지마 카이저 안마의자', family: 'F09',
    overall: { score: 82.5, letter: 'A', dasharray: 136, color: '--g-2' },
    metrics: { price:{s:65,l:'B',lb:'좋음'}, perf:{s:90,l:'S',lb:'최고'}, hygiene:{s:80,l:'A',lb:'추천'}, conv:{s:85,l:'A+',lb:'적극추천'} },
    stepTitles: ['마사지성능','안전·내구','편의·디자인'],
    personas: [
      { i:'ti-armchair', lv:1, lb:'매우 추천', t:'어깨·허리 만성 피로 직장인', d:'코지마 카이저 하이엔드 — 어깨·허리 집중 모드로 매일 회복', f:['어깨 집중','허리 회복','매일 사용'] },
      { i:'ti-coin', lv:1, lb:'매우 추천', t:'프리미엄 초기비용 부담 회피', d:'고가 안마의자(수백만원)를 월 89,900원 렌탈로 — 목돈 부담 0', f:['목돈 0','월 89,900원~','체험 후 결정'] },
      { i:'ti-home', lv:2, lb:'추천', t:'온가족 휴식 공간 강조', d:'거실 메인 포커스 — 가족 누구나 사용 가능, 자가관리로 운영 부담 없음', f:['거실 포커스','온가족','자가관리'] },
    ],
    steps: [
      { lt:'S', cl:'g-S', lb:'최고', sm:'<strong>코지마 카이저 하이엔드 라인</strong> — 어깨·허리·종아리·발 풀바디 마사지. 다양한 자동 코스' },
      { lt:'A', cl:'g-A', lb:'추천', sm:'<strong>안전 잠금 + 검증된 내구</strong> — 코지마 브랜드 신뢰. 자가관리 (먼지 청소·천 점검 권장)' },
      { lt:'A+', cl:'g-Aplus', lb:'적극추천', sm:'<strong>리모컨 조작 + 모던 디자인</strong> — 자동 모드·강도 조절·온열 등 프리미엄 편의' },
    ],
    chips: [
      { i:'ti-armchair', t:'풀바디 마사지' },
      { i:'ti-coin', t:'목돈 부담 0' },
      { i:'ti-currency-won', t:'월 89,900원~' },
      { i:'ti-shield-check', t:'코지마 카이저' },
      { i:'ti-home', t:'거실 포커스' },
    ],
  },
  '32657': {
    name: '로보락 로봇청소기 Q8', family: 'F04',
    overall: { score: 81.0, letter: 'A', dasharray: 134, color: '--g-2' },
    metrics: { price:{s:88,l:'A+',lb:'적극추천'}, perf:{s:80,l:'A',lb:'추천'}, hygiene:{s:78,l:'B+',lb:'우수'}, conv:{s:82,l:'A',lb:'추천'} },
    stepTitles: ['청소성능','내구·소모품','편의기능'],
    personas: [
      { i:'ti-robot', lv:1, lb:'매우 추천', t:'바닥 청소 자동화 선호', d:'외출 중 자동 청소 — 매일 깨끗한 바닥 유지, 가사 시간 대폭 절감', f:['자동 청소','외출 중','매일 깨끗'] },
      { i:'ti-paw', lv:1, lb:'매우 추천', t:'반려동물 동거 가구', d:'반려동물 털·미세먼지 일상 청소 — 알러지·위생 관리에 효과', f:['털 청소','일상 위생','자동'] },
      { i:'ti-currency-won', lv:2, lb:'추천', t:'월 1만원대 가성비', d:'로보락 Q8 — 가성비 좋은 로봇청소기 라인, 부담 없는 렌탈 시작', f:['월 11,900원~','가성비','부담 없는 시작'] },
    ],
    steps: [
      { lt:'A', cl:'g-A', lb:'추천', sm:'<strong>로보락 Q8 검증된 흡입력</strong> — 일반 바닥·러그 자동 청소. 매일 패턴 학습 (모델별 상이)' },
      { lt:'B+', cl:'g-Bplus', lb:'우수', sm:'<strong>소모품 교체 + 자가관리</strong> — 먼지통·필터 정기 청소 권장 (로보락 정품 부품 안정)' },
      { lt:'A', cl:'g-A', lb:'추천', sm:'<strong>앱 연동 + 자동 도킹</strong> — 스마트폰으로 스케줄링·구역 설정 가능' },
    ],
    chips: [
      { i:'ti-robot', t:'자동 청소' },
      { i:'ti-currency-won', t:'월 11,900원~ 가성비' },
      { i:'ti-paw', t:'펫털 청소' },
      { i:'ti-device-mobile', t:'앱 연동' },
      { i:'ti-shield-check', t:'로보락 Q8' },
    ],
  },
  '24720': {
    name: '인켈 UHD TV 55인치', family: 'F08',
    overall: { score: 75.5, letter: 'B+', dasharray: 125, color: '--g-2-5' },
    metrics: { price:{s:85,l:'A+',lb:'적극추천'}, perf:{s:75,l:'B+',lb:'우수'}, hygiene:{s:65,l:'B',lb:'좋음'}, conv:{s:75,l:'B+',lb:'우수'} },
    stepTitles: ['화질·음향','연결성','편의기능'],
    personas: [
      { i:'ti-device-tv', lv:1, lb:'매우 추천', t:'영화·OTT 시청 자주', d:'55인치 UHD — 영화·드라마·스포츠 몰입 시청, 거실 메인 TV', f:['55인치','UHD','거실 메인'] },
      { i:'ti-currency-won', lv:1, lb:'매우 추천', t:'프리미엄 대화면 저가 구독', d:'인켈 UHD — 월 18,900원으로 부담 없는 대화면 입문', f:['월 18,900원~','대화면','가성비'] },
      { i:'ti-home', lv:2, lb:'추천', t:'신혼 거실 셋업', d:'스탠드 or 벽걸이 — 거실 공간 설계 유연. 신혼 거실 첫 TV', f:['스탠드/벽걸이','신혼 거실','셋업'] },
    ],
    steps: [
      { lt:'B+', cl:'g-Bplus', lb:'우수', sm:'<strong>55인치 UHD 4K 해상도</strong> — 일반 시청 충분한 화질. 고급 OLED·QLED 대비 기본 화질' },
      { lt:'B', cl:'g-B', lb:'좋음', sm:'<strong>표준 HDMI/USB 포트</strong> — OTT 스틱·게임기 연결 가능 (스마트 OS 기본 — 자세히는 모델 사양 참조)' },
      { lt:'B+', cl:'g-Bplus', lb:'우수', sm:'<strong>리모컨 + 스탠드/벽걸이 양용</strong> — 설치 유연, 일반 시청 편의 기본 충족' },
    ],
    chips: [
      { i:'ti-device-tv', t:'55인치 대화면' },
      { i:'ti-currency-won', t:'월 18,900원~ 가성비' },
      { i:'ti-resize', t:'4K UHD' },
      { i:'ti-home', t:'스탠드/벽걸이' },
      { i:'ti-shield-check', t:'인켈' },
    ],
  },
  '22687': {
    name: '삼성전자 무선청소기 150W', family: 'F04',
    overall: { score: 79.0, letter: 'B+', dasharray: 130, color: '--g-2-5' },
    metrics: { price:{s:90,l:'S',lb:'최고'}, perf:{s:75,l:'B+',lb:'우수'}, hygiene:{s:72,l:'B+',lb:'우수'}, conv:{s:78,l:'B+',lb:'우수'} },
    stepTitles: ['청소성능','내구·소모품','편의기능'],
    personas: [
      { i:'ti-vacuum-cleaner', lv:1, lb:'매우 추천', t:'1인·신혼 부담 없는 시작', d:'월 9,000원 1만원 미만 — 청소기 입문 가성비 최강', f:['월 9,000원','1인 가구','입문'] },
      { i:'ti-stair-up', lv:1, lb:'매우 추천', t:'좁은 공간 즉각 청소', d:'무선 스틱형 — 좁은 주방·침실 코너 즉각 청소, 매일 사용 부담 0', f:['무선','좁은 공간','즉각 청소'] },
      { i:'ti-shield-check', lv:2, lb:'추천', t:'검증 브랜드 안정성', d:'삼성 무선청소기 라인 — 150W 흡입 + A/S 안심', f:['삼성','150W','A/S'] },
    ],
    steps: [
      { lt:'B+', cl:'g-Bplus', lb:'우수', sm:'<strong>150W 무선 스틱형</strong> — 일반 가정 바닥·러그 충분한 흡입. 강력 모드는 배터리 빠른 소진' },
      { lt:'B+', cl:'g-Bplus', lb:'우수', sm:'<strong>소모품 자가 관리</strong> — 먼지통 비우기·필터 청소 주기적 권장. 삼성 정품 부품 안정' },
      { lt:'B+', cl:'g-Bplus', lb:'우수', sm:'<strong>경량 + 직립 거치</strong> — 들고다니기 편함, 충전 거치대로 보관' },
    ],
    chips: [
      { i:'ti-currency-won', t:'월 9,000원 최저가' },
      { i:'ti-vacuum-cleaner', t:'무선 스틱' },
      { i:'ti-bolt', t:'150W 흡입' },
      { i:'ti-home', t:'좁은 공간' },
      { i:'ti-shield-check', t:'삼성 안심' },
    ],
  },
  '8009': {
    name: 'LG전자 일반 냉장고 189L', family: 'F05',
    overall: { score: 80.5, letter: 'A', dasharray: 133, color: '--g-2' },
    metrics: { price:{s:92,l:'S',lb:'최고'}, perf:{s:75,l:'B+',lb:'우수'}, hygiene:{s:78,l:'B+',lb:'우수'}, conv:{s:78,l:'B+',lb:'우수'} },
    stepTitles: ['보관성능','냉각·에너지','편의기능'],
    personas: [
      { i:'ti-home', lv:1, lb:'매우 추천', t:'1-2인 신혼·자취', d:'189L — 1-2인 신혼·자취 적정 용량, 좁은 주방에 딱 맞는 사이즈', f:['189L','신혼 사이즈','컴팩트'] },
      { i:'ti-currency-won', lv:1, lb:'매우 추천', t:'월 1만원대 최저가 입문', d:'LG 일반형 — 월 13,500원 가장 합리적 진입 가격', f:['월 13,500원','1만원대','LG 입문'] },
      { i:'ti-shield-check', lv:2, lb:'추천', t:'검증 브랜드 신뢰', d:'LG 냉장고 라인 — 내구·A/S 신뢰성 검증', f:['LG','내구성','A/S'] },
    ],
    steps: [
      { lt:'B+', cl:'g-Bplus', lb:'우수', sm:'<strong>189L 일반형 2도어</strong> — 1-2인 식료품·반찬 보관 충분. 김치냉장고·대용량 필요 시 별도' },
      { lt:'B+', cl:'g-Bplus', lb:'우수', sm:'<strong>표준 인버터 압축기</strong> — 안정적 냉각, 에너지 절약. 에너지 효율 등급은 모델 라벨 참조' },
      { lt:'B+', cl:'g-Bplus', lb:'우수', sm:'<strong>일반 도어 + 컴팩트 555×1400×585mm</strong> — 좁은 주방 설치 용이' },
    ],
    chips: [
      { i:'ti-fridge', t:'189L 신혼 사이즈' },
      { i:'ti-currency-won', t:'월 13,500원~ 최저가' },
      { i:'ti-ruler-measure', t:'컴팩트 555mm폭' },
      { i:'ti-shield-check', t:'LG 신뢰' },
      { i:'ti-bolt', t:'에너지 절약' },
    ],
  },
};

function classOf(letter){return ({S:'g-S','A+':'g-Aplus',A:'g-A','B+':'g-Bplus',B:'g-B','C+':'g-Cplus',C:'g-C'})[letter]||'g-d';}

var done = 0;
for (var pid of Object.keys(REFINED)) {
  var spec = REFINED[pid];
  var path = `${CARDS_DIR}/${pid}.html`;
  if (!fs.existsSync(path)) { console.log('SKIP:', pid); continue; }
  var html = fs.readFileSync(path, 'utf-8');

  html = html.replace(/^<!-- AI 카드 v0\.4\.[\d]+ \([\s\S]*?-->/m,
    `<!-- AI 카드 v0.4.4 (${pid} / ${spec.name.slice(0,40)}) — hero refined (${spec.family}) -->`);
  html = html.replace(/stroke="var\(--g-[\d-]+\)" stroke-width="6" stroke-linecap="round" stroke-dasharray="\d+ 165"/,
    `stroke="var(${spec.overall.color})" stroke-width="6" stroke-linecap="round" stroke-dasharray="${spec.overall.dasharray} 165"`);
  html = html.replace(/fill="var\(--g-[\d-]+\)" style="font-family:'Pretendard',sans-serif;font-weight:700">[\w+]+/,
    `fill="var(${spec.overall.color})" style="font-family:'Pretendard',sans-serif;font-weight:700">${spec.overall.letter}`);

  var newMgrid = '<div class="mgrid">' +
    `<div class="m"><span class="ml">렌탈료</span><span class="grade-badge ${classOf(spec.metrics.price.l)}">${spec.metrics.price.lb}<small>${spec.metrics.price.l}</small></span></div>` +
    `<div class="m"><span class="ml">${spec.stepTitles[0]}</span><span class="grade-badge ${classOf(spec.metrics.perf.l)}">${spec.metrics.perf.lb}<small>${spec.metrics.perf.l}</small></span></div>` +
    `<div class="m"><span class="ml">${spec.stepTitles[1]}</span><span class="grade-badge ${classOf(spec.metrics.hygiene.l)}">${spec.metrics.hygiene.lb}<small>${spec.metrics.hygiene.l}</small></span></div>` +
    `<div class="m"><span class="ml">${spec.stepTitles[2]}</span><span class="grade-badge ${classOf(spec.metrics.conv.l)}">${spec.metrics.conv.lb}<small>${spec.metrics.conv.l}</small></span></div>` +
    '</div>';
  html = html.replace(/<div class="mgrid">[\s\S]*?<\/div>\s*<\/div>\s*\n\s*<!-- SLOT 3/, newMgrid + '\n          </div>\n\n          <!-- SLOT 3');

  var newChips = spec.chips.map(c => `<span class="strength-chip"><i class="ti ${c.i}"></i>${c.t}</span>`).join('');
  html = html.replace(/<div class="strengths">[\s\S]*?<\/div>/, `<div class="strengths">${newChips}</div>`);

  var newPersonas = spec.personas.map(p =>
    `<div class="p"><div class="p-top"><i class="ti ${p.i}"></i><span class="rec-p-level-${p.lv}">${p.lb}</span></div>` +
    `<div class="rec-p-title">${p.t}</div><div class="p-d">${p.d}</div>` +
    `<div class="feat-btns">${p.f.map(f => `<span class="feat-btn">${f}</span>`).join('')}</div></div>`).join('');
  html = html.replace(/<div class="persona">[\s\S]*?<\/div>\s*\n\s*<\/div>\s*\n\s*<!-- SLOT 6/,
    `<div class="persona">${newPersonas}</div>\n          </div>\n\n          <!-- SLOT 6`);

  spec.steps.forEach((s, i) => {
    var n = i + 1, title = spec.stepTitles[i];
    var newStep = `<div class="step-h"><span class="step-n">${n}</span><span class="step-title">${title}</span><span class="grade-badge ${s.cl}" style="margin-left:auto">${s.lb}<small>${s.lt}</small></span></div>` +
                  `<div class="step-sum">${s.sm}</div>` +
                  `<details class="step-details"><summary>자세히 보기</summary><div class="field"><div class="field-l">주요 특징</div><div class="pills"><span class="pill on">${title}</span></div></div></details>`;
    var pattern = new RegExp(`<div class="step-h"><span class="step-n">${n}[\\s\\S]*?</details>`);
    html = html.replace(pattern, newStep);
  });

  fs.writeFileSync(path, html);
  console.log('✓', pid, '→', spec.family, spec.overall.letter, `(${spec.name.slice(0,42)})`);
  done++;
}
console.log('refined:', done);
