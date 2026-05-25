const fs = require('fs');
const CARDS_DIR = '/Users/appsilon/repos/billyJo/skin-css/works/cards';

const REFINED = {
  '10914': {
    name: '세스코 스마트핏 데스크형 THE슬림 냉온정수기', family: 'F01',
    overall: { score: 78.3, letter: 'A', dasharray: 129, color: '--g-2' },
    metrics: { price:{s:92,l:'S',lb:'최고'}, perf:{s:80,l:'A',lb:'추천'}, hygiene:{s:0,l:null,lb:'평가 없음'}, conv:{s:64,l:'B',lb:'좋음'} },
    stepTitles: ['정수성능','위생관리','편의기능'],
    personas: [
      { i:'ti-home', lv:1, lb:'매우 추천', t:'좁은 주방 1인 가구', d:'230mm 슬림 데스크형으로 좁은 공간에 설치하는 자취·신혼', f:['230mm 슬림','데스크형','가성비'] },
      { i:'ti-armchair', lv:1, lb:'매우 추천', t:'방문관리 선호 시니어', d:'필터 교체·코크 청소를 본사가 정기 케어해 자가관리 부담 없는 60대+', f:['필터 교체','코크 청소','본사 케어'] },
      { i:'ti-heart', lv:2, lb:'추천', t:'가성비 우선 신혼', d:'월 17,900원 합리적 가격을 선호하는 2030 신혼·1인 가구', f:['월 1만원대','60개월 약정','무상 A/S'] },
    ],
    steps: [
      { lt:'A', cl:'g-A', lb:'추천', sm:'<strong>출수 3종 (냉·온·정수)</strong> + <strong>UF 중공사막 4단계 필터</strong> — 기본 정수 만족 (얼음·살균수 미지원)' },
      { lt:null, cl:'g-d', lb:'평가 없음', sm:'능동 살균(UV·자동·고온·전해수) 정보가 공식·빌리조 페이지 모두 미명시 → <strong>평가 없음</strong> 처리. 본사 정기 케어로 위생 보완' },
      { lt:'B', cl:'g-B', lb:'좋음', sm:'<strong>정량출수 + 필터교환알림</strong> 등 기본 편의 — IoT·맞춤출수·자가진단 등 프리미엄 기능 미포함' },
    ],
    chips: [
      { i:'ti-currency-won', t:'월 17,900원 가성비' },
      { i:'ti-ruler-measure', t:'230mm 슬림' },
      { i:'ti-filter', t:'UF 4단계' },
      { i:'ti-droplet', t:'분리세척 코크' },
      { i:'ti-shield-check', t:'무상 A/S 6개월' },
    ],
  },
  '12955': {
    name: '코웨이 나노직수 정수기 미니 정수전용', family: 'F01',
    overall: { score: 71.3, letter: 'B+', dasharray: 118, color: '--g-2-5' },
    metrics: { price:{s:92,l:'S',lb:'최고'}, perf:{s:78,l:'B+',lb:'우수'}, hygiene:{s:65,l:'B',lb:'좋음'}, conv:{s:50,l:'C+',lb:'적합'} },
    stepTitles: ['정수성능','위생관리','편의기능'],
    personas: [
      { i:'ti-tool', lv:1, lb:'매우 추천', t:'자가관리 선호 1인 가구', d:'필터 직접 교체로 방문관리 비용 절감, 셀프 케어가 익숙한 자취·1인', f:['셀프 필터교체','방문비 0원','월 1만원대'] },
      { i:'ti-home', lv:1, lb:'매우 추천', t:'좁은 주방·오피스', d:'폭 130mm 초슬림으로 코너·싱크 옆 좁은 공간에도 설치 가능', f:['130mm 폭','컴팩트','색상 3종'] },
      { i:'ti-droplet', lv:2, lb:'추천', t:'정수 위주 사용', d:'냉수·온수 안 쓰고 미네랄 살아있는 정수만 빠르게 마시고 싶은 사용자', f:['정수전용','나노직수','미네랄 유지'] },
    ],
    steps: [
      { lt:'B+', cl:'g-Bplus', lb:'우수', sm:'<strong>나노직수 (저수조 X)</strong> — 미네랄 유지하며 즉시 정수 (정수전용, 냉·온·얼음 미지원)' },
      { lt:'B', cl:'g-B', lb:'좋음', sm:'<strong>직수형으로 저수조 정체수 위험 자체 없음</strong> — 능동 살균(UV·고온·자동) 정보는 공식 명시 안됨. 자가관리(필터 직접 교체) 필요' },
      { lt:'C+', cl:'g-Cplus', lb:'적합', sm:'<strong>정수전용 + 자가관리</strong> — 냉수·온수·얼음·살균수 등 부가 기능 미지원. 색상 3종 선택 가능' },
    ],
    chips: [
      { i:'ti-currency-won', t:'월 15,900원 최저가' },
      { i:'ti-ruler-measure', t:'130mm 초슬림' },
      { i:'ti-droplet', t:'나노직수 (저수조 X)' },
      { i:'ti-tool', t:'자가관리 (방문비 X)' },
      { i:'ti-palette', t:'색상 3종 선택' },
    ],
  },
  '945': {
    name: 'LG전자 1way 천장형에어컨 18평', family: 'F03',
    overall: { score: 78.0, letter: 'B+', dasharray: 129, color: '--g-2-5' },
    metrics: { price:{s:62,l:'B',lb:'좋음'}, perf:{s:88,l:'A+',lb:'적극추천'}, hygiene:{s:75,l:'B+',lb:'우수'}, conv:{s:80,l:'A',lb:'추천'} },
    stepTitles: ['냉방·정화 성능','위생관리','AI·편의'],
    personas: [
      { i:'ti-building-store', lv:1, lb:'매우 추천', t:'중대형 상가·사무실 (17-19평)', d:'17-19평 공간 천장 매립 — 매장·오피스 균일한 냉방, 바닥 공간 100% 활용', f:['17-19평','천장 매립','공간 효율'] },
      { i:'ti-home-2', lv:1, lb:'매우 추천', t:'대형 신축 거주 (오픈 거실)', d:'18평형 거실+주방 통합 공간에서 균일한 냉방 — 천장형 깔끔', f:['거실 통합','깔끔 천장','대형'] },
      { i:'ti-credit-card', lv:2, lb:'추천', t:'카드 할인 활용', d:'월 68,500원 → 카드 할인 적용 시 월 43,500원 절감, 부담 절반', f:['카드 25,000원 할인','월 43,500원','60개월'] },
    ],
    steps: [
      { lt:'A+', cl:'g-Aplus', lb:'적극추천', sm:'<strong>1way 천장 매립 + 18평형 대용량</strong> — LG 에어컨 검증된 냉방력. 균일 토출로 사각 없음' },
      { lt:'B+', cl:'g-Bplus', lb:'우수', sm:'<strong>기본 필터 + 자가관리</strong> — LG 표준 필터, 정기 청소 권장. 능동 살균 옵션은 모델별 상이' },
      { lt:'A', cl:'g-A', lb:'추천', sm:'<strong>LG ThinQ 연동 가능</strong> — 스마트 제어, 자동 모드, 정전 복구 등 LG 표준 편의' },
    ],
    chips: [
      { i:'ti-snowflake', t:'18평형 대용량' },
      { i:'ti-building-store', t:'천장 매립' },
      { i:'ti-credit-card', t:'카드 25,000원 할인' },
      { i:'ti-device-mobile', t:'LG ThinQ' },
      { i:'ti-shield-check', t:'LG 신뢰' },
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

  // mgrid — hygiene이 평가없음(letter=null)일 때 .g-d 배지 사용
  function metricCell(label, m) {
    if (m.l === null) {
      return `<div class="m"><span class="ml">${label}</span><span class="g-d">평가 없음</span></div>`;
    }
    return `<div class="m"><span class="ml">${label}</span><span class="grade-badge ${classOf(m.l)}">${m.lb}<small>${m.l}</small></span></div>`;
  }
  var newMgrid = '<div class="mgrid">' +
    metricCell('렌탈료', spec.metrics.price) +
    metricCell(spec.stepTitles[0], spec.metrics.perf) +
    metricCell(spec.stepTitles[1], spec.metrics.hygiene) +
    metricCell(spec.stepTitles[2], spec.metrics.conv) +
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
    var badge = s.lt === null
      ? `<span class="g-d" style="margin-left:auto">평가 없음</span>`
      : `<span class="grade-badge ${s.cl}" style="margin-left:auto">${s.lb}<small>${s.lt}</small></span>`;
    var newStep = `<div class="step-h"><span class="step-n">${n}</span><span class="step-title">${title}</span>${badge}</div>` +
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
