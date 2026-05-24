/**
 * 카드 자동 생성기 (v1, family-templated).
 * 입력: /tmp/scraped-10.json (제품 스크래핑 데이터)
 * 출력: skin-css/works/cards/{prodNo}.html
 *
 * 알고리즘:
 *  1. 제품명/스펙에서 family (F01~F14) 추정
 *  2. cards/10914.html 템플릿 로드
 *  3. family별 personas/step 텍스트 치환
 *  4. 제품별 specifics (이름·모델·메타·8칸 스펙) 치환
 *  5. 4-지표는 가격대·카테고리 휴리스틱으로 letter 산출
 */

const fs = require('fs');
const path = require('path');

const SCRAPED = JSON.parse(fs.readFileSync('/tmp/scraped-10.json', 'utf-8'));
const TEMPLATE = fs.readFileSync('/Users/appsilon/repos/billyJo/skin-css/works/cards/10914.html', 'utf-8');
const OUT_DIR = '/Users/appsilon/repos/billyJo/skin-css/works/cards';

// Family detection
function detectFamily(name, specs) {
  var n = name || '';
  if (/정수기|연수기|샤워기/.test(n)) return 'F01';
  if (/비데/.test(n)) return 'F02';
  if (/공기청정|에어컨|냉난방|제습기|환기|보일러|공청기/.test(n)) return 'F03';
  if (/청소기|로봇청소/.test(n)) return 'F04';
  if (/냉장|김치|냉동|와인셀러|얼음/.test(n)) return 'F05';
  if (/세탁|건조|스타일러/.test(n)) return 'F06';
  if (/식기세척|커피머신|인덕션|에어프라이|레인지|밥솥/.test(n)) return 'F07';
  if (/TV|노트북|모니터|빔프로젝터/.test(n)) return 'F08';
  if (/안마|런닝|헬스기|운동/.test(n)) return 'F09';
  if (/드라이기|이미용/.test(n)) return 'F10';
  if (/소파|침대|매트리스|모션베드|가구/.test(n)) return 'F11';
  if (/자전거|스쿠터|자동차/.test(n)) return 'F12';
  if (/CCTV|도어락|AI로봇/.test(n)) return 'F13';
  if (/POS|키오스크|자판기|서빙로봇/.test(n)) return 'F14';
  if (/의류청정|의류케어/.test(n)) return 'F10';  // 의류케어
  return 'F01';
}

// Family별 metadata
var FAMILIES = {
  F01: { stepTitles: ['정수성능', '위생관리', '편의기능'] },
  F02: { stepTitles: ['세정성능', '위생관리', '편의기능'] },
  F03: { stepTitles: ['냉방·정화 성능', '위생관리', 'AI·편의'] },
  F04: { stepTitles: ['청소성능', '배터리·내구', '편의기능'] },
  F05: { stepTitles: ['보관성능', '냉각·에너지', '편의기능'] },
  F06: { stepTitles: ['세탁·건조성능', '위생관리', '편의기능'] },
  F07: { stepTitles: ['세척·조리성능', '위생관리', '편의기능'] },
  F08: { stepTitles: ['화질·음향', '연결성', '편의기능'] },
  F09: { stepTitles: ['마사지·운동성능', '안전·내구', '편의·디자인'] },
  F10: { stepTitles: ['케어성능', '위생관리', '편의기능'] },
  F11: { stepTitles: ['편안함·내구', '소재·위생', '디자인·기능'] },
  F12: { stepTitles: ['주행성능', '배터리·안전', '편의기능'] },
  F13: { stepTitles: ['보안성능', '연결·내구', '편의기능'] },
  F14: { stepTitles: ['업무성능', '내구·보안', '관리·편의'] },
};

// 4-지표 letter from score
function letterOf(s) {
  if (s == null) return null;
  if (s >= 90) return 'S';
  if (s >= 85) return 'A+';
  if (s >= 80) return 'A';
  if (s >= 70) return 'B+';
  if (s >= 60) return 'B';
  if (s >= 50) return 'C+';
  if (s >= 40) return 'C';
  return null; // 평가 없음
}
function classOf(letter) {
  return ({ 'S':'g-S', 'A+':'g-Aplus', 'A':'g-A', 'B+':'g-Bplus', 'B':'g-B', 'C+':'g-Cplus', 'C':'g-C' })[letter] || 'g-d';
}
function colorVarOf(letter) {
  return ({ 'S':'--g-1', 'A+':'--g-1-5', 'A':'--g-2', 'B+':'--g-2-5', 'B':'--g-3', 'C+':'--g-3-5', 'C':'--g-4' })[letter] || '--g-d';
}
function labelOf(letter) {
  return ({ 'S':'최고', 'A+':'적극추천', 'A':'추천', 'B+':'우수', 'B':'좋음', 'C+':'적합', 'C':'보통' })[letter] || '평가 없음';
}

// 가격 휴리스틱 (1만원대 = S, 2~3만원대 = A, 4~6만원대 = B+, 7만원+ = B)
function scorePriceFromTopMin(topMinStr) {
  var m = (topMinStr || '').match(/(\d+(?:,\d+)*)/);
  if (!m) return 75;
  var n = parseInt(m[1].replace(/,/g, ''), 10);
  if (n < 20000) return 92;
  if (n < 30000) return 85;
  if (n < 50000) return 78;
  if (n < 80000) return 68;
  return 58;
}

// Render full card
function render(pid, d) {
  var family = detectFamily(d.name, d.specs);
  var fam = FAMILIES[family];

  var priceScore = scorePriceFromTopMin(d.topMin);
  // 휴리스틱: 다른 metric은 기본값
  var perfScore = 80;
  var hygieneScore = 70;
  var convScore = 72;
  var overallNum = ((priceScore + perfScore + hygieneScore + convScore) / 4).toFixed(1);
  var overallLetter = letterOf(parseFloat(overallNum));

  var priceLetter = letterOf(priceScore);
  var perfLetter = letterOf(perfScore);
  var hygieneLetter = letterOf(hygieneScore);
  var convLetter = letterOf(convScore);

  var dasharray = Math.round(parseFloat(overallNum) * 1.65);

  // Spec rows from .prod_table_wrap data + topMin
  var specKeys = Object.keys(d.specs);
  var specRows = [];
  specRows.push({ label: '렌탈료', value: d.topMin || '—' });
  specKeys.slice(0, 7).forEach(k => {
    specRows.push({ label: k, value: d.specs[k] });
  });
  while (specRows.length < 6) specRows.push({ label: '', value: '' });
  specRows = specRows.slice(0, 8);

  var specsHtml = specRows.map(s => {
    if (!s.label) return '';
    return '<div class="sc"><div class="sl">' + escapeHtml(s.label) + '</div><div class="sv">' + escapeHtml(s.value) + '</div></div>';
  }).join('\n            ');

  // Personas (generic, family-aware)
  var personasHtml =
    '<div class="p">' +
      '<div class="p-top"><i class="ti ti-home"></i><span class="rec-p-level-1">매우 추천</span></div>' +
      '<div class="rec-p-title">합리적 가격 선호 1인·신혼</div>' +
      '<div class="p-d">' + escapeHtml(d.topMin || '월 합리적 가격') + ' 부담 없는 진입, 핵심 기능 충분</div>' +
      '<div class="feat-btns"><span class="feat-btn">가성비</span><span class="feat-btn">컴팩트</span><span class="feat-btn">기본 기능</span></div>' +
    '</div>' +
    '<div class="p">' +
      '<div class="p-top"><i class="ti ti-users"></i><span class="rec-p-level-1">매우 추천</span></div>' +
      '<div class="rec-p-title">3-4인 가족 표준 사용</div>' +
      '<div class="p-d">' + escapeHtml(family === 'F05' ? '용량 충분' : family === 'F06' ? '대용량 세탁' : family === 'F09' ? '온 가족 사용' : '가족 단위 일상 사용') + '에 적합</div>' +
      '<div class="feat-btns"><span class="feat-btn">표준 용량</span><span class="feat-btn">검증된 브랜드</span><span class="feat-btn">A/S 안심</span></div>' +
    '</div>' +
    '<div class="p">' +
      '<div class="p-top"><i class="ti ti-shield-check"></i><span class="rec-p-level-2">추천</span></div>' +
      '<div class="rec-p-title">신뢰성 우선 사용자</div>' +
      '<div class="p-d">대기업 브랜드 + 검증된 모델 선호 — A/S·내구성 우선</div>' +
      '<div class="feat-btns"><span class="feat-btn">브랜드</span><span class="feat-btn">A/S</span><span class="feat-btn">내구성</span></div>' +
    '</div>';

  // Steps — family-specific titles, generic summaries
  var step1 = '<div class="step-h"><span class="step-n">1</span><span class="step-title">' + fam.stepTitles[0] + '</span><span class="grade-badge ' + classOf(perfLetter) + '" style="margin-left:auto">' + labelOf(perfLetter) + '<small>' + perfLetter + '</small></span></div>' +
              '<div class="step-sum">표준 ' + fam.stepTitles[0] + ' — 카테고리 기본 기능 만족 (상세는 본문 참조)</div>' +
              '<details class="step-details"><summary>자세히 보기</summary><div class="field"><div class="field-l">기본 특징</div><div class="pills"><span class="pill on">기본 기능</span></div></div></details>';

  var step2 = '<div class="step-h"><span class="step-n">2</span><span class="step-title">' + fam.stepTitles[1] + '</span><span class="grade-badge ' + classOf(hygieneLetter) + '" style="margin-left:auto">' + labelOf(hygieneLetter) + '<small>' + hygieneLetter + '</small></span></div>' +
              '<div class="step-sum">' + fam.stepTitles[1] + ' — 표준 수준 (상세 미공개 항목 다수)</div>' +
              '<details class="step-details"><summary>자세히 보기</summary><div class="field"><div class="field-l">기본 특징</div><div class="pills"><span class="pill on">표준</span></div></div></details>';

  var step3 = '<div class="step-h"><span class="step-n">3</span><span class="step-title">' + fam.stepTitles[2] + '</span><span class="grade-badge ' + classOf(convLetter) + '" style="margin-left:auto">' + labelOf(convLetter) + '<small>' + convLetter + '</small></span></div>' +
              '<div class="step-sum">' + fam.stepTitles[2] + ' — 표준 수준</div>' +
              '<details class="step-details"><summary>자세히 보기</summary><div class="field"><div class="field-l">기본 특징</div><div class="pills"><span class="pill on">표준</span></div></div></details>';

  // Strength chips
  var chips =
    '<span class="strength-chip"><i class="ti ti-currency-won"></i>' + escapeHtml(d.topMin || '가성비') + '</span>' +
    (d.specs['관리방식'] || d.specs['관리'] ? '<span class="strength-chip"><i class="ti ti-tool"></i>' + escapeHtml(d.specs['관리방식'] || d.specs['관리']) + '</span>' : '') +
    (d.specs['용량'] ? '<span class="strength-chip"><i class="ti ti-box"></i>' + escapeHtml(d.specs['용량']) + '</span>' : '') +
    (d.specs['규격'] ? '<span class="strength-chip"><i class="ti ti-ruler-measure"></i>' + escapeHtml(d.specs['규격'].slice(0, 25)) + '</span>' : '') +
    '<span class="strength-chip"><i class="ti ti-shield-check"></i>' + (d.specs['브랜드'] || '검증 브랜드') + '</span>';

  // Meta line
  var metaParts = [d.model || ''];
  if (d.specs['타입'] || d.specs['형태']) metaParts.push(d.specs['타입'] || d.specs['형태']);
  if (d.specs['용량']) metaParts.push(d.specs['용량']);
  if (d.specs['규격']) metaParts.push(d.specs['규격'].slice(0, 25));
  var meta = '모델명: <span class="model-num">' + escapeHtml(d.model.split('_')[0] || d.model) + '</span> · ' + metaParts.slice(1).join(' · ');

  var html = TEMPLATE;
  // Header comment
  html = html.replace(
    /<!-- AI 카드 v0\.4\.2 \([\s\S]*?\)[\s\S]*?-->/,
    '<!-- AI 카드 v0.4.3 (' + pid + ' / ' + (d.model || d.name.slice(0, 30)) + ') — auto-generated v1 (' + family + ') -->\n<!-- 라이브: https://www.billyjo.co.kr/html/dh_prod/prod_view/' + pid + ' -->'
  );
  // SLOT 1
  html = html.replace(
    /<div class="name">[\s\S]*?<\/div>\s*<div class="meta">[\s\S]*?<\/div>/,
    '<div class="name">' + escapeHtml(d.name) + '</div>\n              <div class="meta">' + meta + '</div>'
  );
  // SLOT 2 게이지 (stroke color + dasharray + letter color + letter text)
  html = html.replace(/stroke="var\(--g-2-5\)" stroke-width="6" stroke-linecap="round" stroke-dasharray="\d+ 165"/,
                      'stroke="var(' + colorVarOf(overallLetter) + ')" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + dasharray + ' 165"');
  html = html.replace(/fill="var\(--g-2-5\)" style="font-family:'Pretendard',sans-serif;font-weight:700">B\+/,
                      'fill="var(' + colorVarOf(overallLetter) + ')" style="font-family:\'Pretendard\',sans-serif;font-weight:700">' + overallLetter);
  // 4지표 mgrid
  html = html.replace(/<div class="mgrid">[\s\S]*?<\/div>\s*<\/div>\s*<!-- SLOT 3/,
    '<div class="mgrid">' +
      '<div class="m"><span class="ml">렌탈료</span><span class="grade-badge ' + classOf(priceLetter) + '">' + labelOf(priceLetter) + '<small>' + priceLetter + '</small></span></div>' +
      '<div class="m"><span class="ml">' + fam.stepTitles[0] + '</span><span class="grade-badge ' + classOf(perfLetter) + '">' + labelOf(perfLetter) + '<small>' + perfLetter + '</small></span></div>' +
      '<div class="m"><span class="ml">' + fam.stepTitles[1] + '</span><span class="grade-badge ' + classOf(hygieneLetter) + '">' + labelOf(hygieneLetter) + '<small>' + hygieneLetter + '</small></span></div>' +
      '<div class="m"><span class="ml">' + fam.stepTitles[2] + '</span><span class="grade-badge ' + classOf(convLetter) + '">' + labelOf(convLetter) + '<small>' + convLetter + '</small></span></div>' +
    '</div>\n          </div>\n\n          <!-- SLOT 3'
  );
  // SLOT 3 specs
  html = html.replace(
    /<div class="specs">[\s\S]*?<\/div>\s*\n\s*<!-- SLOT 4/,
    '<div class="specs">\n            ' + specsHtml + '\n          </div>\n\n          <!-- SLOT 4'
  );
  // SLOT 5 personas
  html = html.replace(
    /<div class="persona">[\s\S]*?<\/div>\s*\n\s*<\/div>\s*\n\s*<!-- SLOT 6/,
    '<div class="persona">\n              ' + personasHtml + '\n            </div>\n          </div>\n\n          <!-- SLOT 6'
  );
  // SLOT 4 strengths
  html = html.replace(
    /<div class="strengths">[\s\S]*?<\/div>/,
    '<div class="strengths">' + chips + '</div>'
  );
  // SLOT 6 steps — replace all 3 step blocks
  html = html.replace(
    /<div class="step-h"><span class="step-n">1[\s\S]*?<\/details>/,
    step1
  );
  html = html.replace(
    /<div class="step-h"><span class="step-n">2[\s\S]*?<\/details>/,
    step2
  );
  html = html.replace(
    /<div class="step-h"><span class="step-n">3[\s\S]*?<\/details>/,
    step3
  );

  return html;
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Process all
var results = [];
for (var pid of Object.keys(SCRAPED)) {
  var d = SCRAPED[pid];
  if (d.error) { console.log(pid, '(err, skip)'); continue; }
  var html = render(pid, d);
  var outPath = path.join(OUT_DIR, pid + '.html');
  fs.writeFileSync(outPath, html);
  results.push({ pid, file: outPath, family: detectFamily(d.name, d.specs), name: d.name });
  console.log('✓', pid, '→', detectFamily(d.name, d.specs), '(' + d.name.slice(0, 40) + ')');
}
console.log('\ngenerated:', results.length);
