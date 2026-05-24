/**
 * Hero 제품 카드 품질 정교화 v1.
 * 제품별 product-aware 페르소나 + Step 작성, 기존 generated 카드를 in-place 교체.
 */

const fs = require('fs');
const CARDS_DIR = '/Users/appsilon/repos/billyJo/skin-css/works/cards';

// 정교화 데이터 (수동 작성, 룰북 v0.4.2 기준)
const REFINED = {
  '1422': {
    name: 'SK매직 그랜드 정수기 스탠드형',
    family: 'F01',
    overall: { score: 77.5, letter: 'B+', dasharray: 128, color: '--g-2-5' },
    metrics: {
      price:       { score: 80, letter: 'A',  label: '추천' },  // 2만원대
      perf:        { score: 75, letter: 'B+', label: '우수' },  // 저수조형 + 냉온정
      hygiene:     { score: 78, letter: 'B+', label: '우수' },  // 방문관리 4개월
      convenience: { score: 78, letter: 'B+', label: '우수' },  // 스탠드 대형
    },
    personas: [
      { icon: 'ti-users', intensity: 1, label: '매우 추천',
        title: '3-4인 가족',
        desc: '냉·온·정수 3종 + 대형 스탠드형으로 식수 사용량 많은 가족에 적합',
        feats: ['대용량 출수', '냉온정 3종', '본사 케어'] },
      { icon: 'ti-home', intensity: 1, label: '매우 추천',
        title: '자가관리 부담 회피',
        desc: 'SK매직 4개월 본사 방문관리로 필터 교체·청소 무신경 가능',
        feats: ['4개월 방문', '필터 교체', '무신경 운영'] },
      { icon: 'ti-currency-won', intensity: 2, label: '추천',
        title: '검증 브랜드 + 합리적 가격',
        desc: 'SK매직 대표 모델, 월 2만원대 합리적 가격으로 안정적 신뢰',
        feats: ['SK매직', '월 27,900원~', 'A/S 안심'] },
    ],
    steps: [
      { title: '정수성능', letter: 'B+', class: 'g-Bplus', label: '우수',
        summary: '<strong>저수조형 + UF 필터</strong> · 냉·온·정수 3종 출수 — 기본 정수 안정적 (얼음·살균수·탄산 미지원)' },
      { title: '위생관리', letter: 'B+', class: 'g-Bplus', label: '우수',
        summary: '<strong>SK매직 4개월 본사 방문관리</strong>로 필터·코크 정기 점검 — 저수조 정체수는 본사 케어로 보완 (능동 살균 미명시)' },
      { title: '편의기능', letter: 'B+', class: 'g-Bplus', label: '우수',
        summary: '<strong>스탠드형 350×520×1230mm</strong> 대형 본체로 공간 차지하나 안정적 설치 — 정량출수·필터알림 기본 편의 포함' },
    ],
    chips: [
      { icon: 'ti-currency-won', text: '월 27,900원~ 가성비' },
      { icon: 'ti-home', text: '본사 4개월 방문관리' },
      { icon: 'ti-droplet', text: 'UF + 냉온정 3종' },
      { icon: 'ti-ruler-measure', text: '스탠드형 대용량' },
      { icon: 'ti-shield-check', text: 'SK매직 검증 모델' },
    ],
  },
  '265': {
    name: '삼성전자 그랑데 통버블 세탁기 21KG',
    family: 'F06',
    overall: { score: 81.2, letter: 'A', dasharray: 134, color: '--g-2' },
    metrics: {
      price:       { score: 82, letter: 'A',  label: '추천' },  // 22,300원~
      perf:        { score: 85, letter: 'A+', label: '적극추천' },  // 21KG 대용량
      hygiene:     { score: 78, letter: 'B+', label: '우수' },  // 통버블
      convenience: { score: 80, letter: 'A',  label: '추천' },  // 그랑데
    },
    personas: [
      { icon: 'ti-users', intensity: 1, label: '매우 추천',
        title: '3-4인 가족·아이있는 가구',
        desc: '21KG 대용량으로 이불·커튼까지 한 번에 — 가족 빨래 양 많아도 한 번에 처리',
        feats: ['21KG 대용량', '이불 빨래', '주말 한방'] },
      { icon: 'ti-heart', intensity: 1, label: '매우 추천',
        title: '프리미엄 부담 절감 신혼',
        desc: '삼성 그랑데 통버블 — 목돈 부담 없이 월 22,300원으로 프리미엄 세탁',
        feats: ['삼성 그랑데', '초기비용 0원', '월 2만원대'] },
      { icon: 'ti-leaf', intensity: 2, label: '추천',
        title: '에코·세제 절약',
        desc: '통버블 기술로 적은 세제로도 깨끗 — 환경·비용 모두 절감',
        feats: ['통버블', '세제 절약', '에코 모드'] },
    ],
    steps: [
      { title: '세탁성능', letter: 'A+', class: 'g-Aplus', label: '적극추천',
        summary: '<strong>21KG 대용량 + 통돌이 통버블</strong> — 이불·커튼·옷가지 한 번에. 삼성 대표 그랑데 라인 검증된 세탁력' },
      { title: '위생관리', letter: 'B+', class: 'g-Bplus', label: '우수',
        summary: '<strong>통버블 살균 + 자가관리</strong> — 분리 가능 부품 정기 청소 권장. 능동 UV·고온 살균 정보 미명시' },
      { title: '편의기능', letter: 'A', class: 'g-A', label: '추천',
        summary: '<strong>다양한 세탁 코스 + 디스플레이</strong> — 그랑데 라인 기본 편의 기능 모두 포함 (스마트 연동 모델별 상이)' },
    ],
    chips: [
      { icon: 'ti-wash-machine', text: '21KG 대용량' },
      { icon: 'ti-currency-won', text: '월 22,300원~ 가성비' },
      { icon: 'ti-droplet', text: '통버블 세탁' },
      { icon: 'ti-leaf', text: '에코 세제 절약' },
      { icon: 'ti-shield-check', text: '삼성 그랑데' },
    ],
  },
  '296': {
    name: '쿠쿠 펫 공청기 (25평형)',
    family: 'F03',
    overall: { score: 75.0, letter: 'B+', dasharray: 124, color: '--g-2-5' },
    metrics: {
      price:       { score: 68, letter: 'B',  label: '좋음' },  // 3만원대
      perf:        { score: 82, letter: 'A',  label: '추천' },  // 25평형 펫
      hygiene:     { score: 80, letter: 'A',  label: '추천' },  // 전문가케어
      convenience: { score: 70, letter: 'B+', label: '우수' },  // 표준
    },
    personas: [
      { icon: 'ti-paw', intensity: 1, label: '매우 추천',
        title: '반려동물 동거 가구',
        desc: '펫 전용 설계 — 동물털·암모니아·페로몬 등 펫 특이 입자/냄새 강력 제거',
        feats: ['펫 전용', '털 흡입', '암모니아 제거'] },
      { icon: 'ti-home-2', intensity: 1, label: '매우 추천',
        title: '21-30평 거실 메인 사용',
        desc: '25평형 사용면적 — 거실 + 일부 방까지 광범위 청정 커버',
        feats: ['25평형', '거실 메인', '광범위 토출'] },
      { icon: 'ti-tools', intensity: 2, label: '추천',
        title: '필터 관리 부담 회피',
        desc: '쿠쿠 4개월 전문가 케어 — 필터 교체·내부 청소 본사 일임',
        feats: ['4개월 케어', '본사 청소', '필터 자동'] },
    ],
    steps: [
      { title: '정화성능', letter: 'A', class: 'g-A', label: '추천',
        summary: '<strong>25평형 펫 전용 필터</strong> — 동물털·미세입자·암모니아 강력 제거. 가정용 공기청정기 기준 광범위 토출' },
      { title: '위생관리', letter: 'A', class: 'g-A', label: '추천',
        summary: '<strong>쿠쿠 4개월 전문가 케어</strong> — 필터 교체·내부 청소 본사 일임. 펫 특이 오염도 정기 관리' },
      { title: '편의기능', letter: 'B+', class: 'g-Bplus', label: '우수',
        summary: '<strong>396×396×755mm 콤팩트 본체</strong> — 거실 코너 설치 가능, 자동 운전·필터 알림 기본' },
    ],
    chips: [
      { icon: 'ti-paw', text: '펫 전용 설계' },
      { icon: 'ti-home-2', text: '25평형 광범위' },
      { icon: 'ti-tools', text: '4개월 전문가 케어' },
      { icon: 'ti-wind', text: '암모니아·털 제거' },
      { icon: 'ti-shield-check', text: '쿠쿠 검증 브랜드' },
    ],
  },
};

function classOf(letter){return ({S:'g-S','A+':'g-Aplus',A:'g-A','B+':'g-Bplus',B:'g-B','C+':'g-Cplus',C:'g-C'})[letter]||'g-d';}

for (var pid of Object.keys(REFINED)) {
  var spec = REFINED[pid];
  var path = `${CARDS_DIR}/${pid}.html`;
  var html = fs.readFileSync(path, 'utf-8');

  // Update header comment
  html = html.replace(/^<!-- AI 카드 v0\.4\.[\d]+ \([\s\S]*?-->/m,
    `<!-- AI 카드 v0.4.4 (${pid} / ${spec.name.slice(0,40)}) — hero refined (${spec.family}) -->`);

  // SVG gauge — color + dasharray + letter
  html = html.replace(/stroke="var\(--g-[\d-]+\)" stroke-width="6" stroke-linecap="round" stroke-dasharray="\d+ 165"/,
    `stroke="var(${spec.overall.color})" stroke-width="6" stroke-linecap="round" stroke-dasharray="${spec.overall.dasharray} 165"`);
  html = html.replace(/fill="var\(--g-[\d-]+\)" style="font-family:'Pretendard',sans-serif;font-weight:700">[\w+]+/,
    `fill="var(${spec.overall.color})" style="font-family:'Pretendard',sans-serif;font-weight:700">${spec.overall.letter}`);

  // 4지표 mgrid — replace entire block
  var step_titles_short = { F01: ['정수성능','위생관리','편의기능'], F06: ['세탁성능','위생관리','편의기능'], F03: ['정화성능','위생관리','편의기능'] };
  var titles = step_titles_short[spec.family];
  var newMgrid = '<div class="mgrid">' +
    `<div class="m"><span class="ml">렌탈료</span><span class="grade-badge ${classOf(spec.metrics.price.letter)}">${spec.metrics.price.label}<small>${spec.metrics.price.letter}</small></span></div>` +
    `<div class="m"><span class="ml">${titles[0]}</span><span class="grade-badge ${classOf(spec.metrics.perf.letter)}">${spec.metrics.perf.label}<small>${spec.metrics.perf.letter}</small></span></div>` +
    `<div class="m"><span class="ml">${titles[1]}</span><span class="grade-badge ${classOf(spec.metrics.hygiene.letter)}">${spec.metrics.hygiene.label}<small>${spec.metrics.hygiene.letter}</small></span></div>` +
    `<div class="m"><span class="ml">${titles[2]}</span><span class="grade-badge ${classOf(spec.metrics.convenience.letter)}">${spec.metrics.convenience.label}<small>${spec.metrics.convenience.letter}</small></span></div>` +
    '</div>';
  html = html.replace(/<div class="mgrid">[\s\S]*?<\/div>\s*<\/div>\s*\n\s*<!-- SLOT 3/,
    newMgrid + '\n          </div>\n\n          <!-- SLOT 3');

  // SLOT 4 strengths
  var newChips = spec.chips.map(c => `<span class="strength-chip"><i class="ti ${c.icon}"></i>${c.text}</span>`).join('');
  html = html.replace(/<div class="strengths">[\s\S]*?<\/div>/,
    `<div class="strengths">${newChips}</div>`);

  // SLOT 5 personas
  var newPersonas = spec.personas.map(p =>
    `<div class="p">` +
      `<div class="p-top"><i class="ti ${p.icon}"></i><span class="rec-p-level-${p.intensity}">${p.label}</span></div>` +
      `<div class="rec-p-title">${p.title}</div>` +
      `<div class="p-d">${p.desc}</div>` +
      `<div class="feat-btns">${p.feats.map(f => `<span class="feat-btn">${f}</span>`).join('')}</div>` +
    `</div>`).join('');
  html = html.replace(/<div class="persona">[\s\S]*?<\/div>\s*\n\s*<\/div>\s*\n\s*<!-- SLOT 6/,
    `<div class="persona">${newPersonas}</div>\n          </div>\n\n          <!-- SLOT 6`);

  // SLOT 6 Steps — 3 step blocks
  spec.steps.forEach((s, i) => {
    var n = i + 1;
    var newStep = `<div class="step-h"><span class="step-n">${n}</span><span class="step-title">${s.title}</span><span class="grade-badge ${s.class}" style="margin-left:auto">${s.label}<small>${s.letter}</small></span></div>` +
                  `<div class="step-sum">${s.summary}</div>` +
                  `<details class="step-details"><summary>자세히 보기</summary><div class="field"><div class="field-l">주요 특징</div><div class="pills"><span class="pill on">${s.title}</span></div></div></details>`;
    var pattern = new RegExp(`<div class="step-h"><span class="step-n">${n}[\\s\\S]*?</details>`);
    html = html.replace(pattern, newStep);
  });

  fs.writeFileSync(path, html);
  console.log('✓ refined', pid, '→', spec.family, spec.overall.letter, `(${spec.name.slice(0,40)})`);
}
