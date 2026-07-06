/* ===== 빌리조 모바일 카테고리 탭 + 상품 그리드(스와이프) — bjct- 네임스페이스 ===== */
(function () {
  if (window.__bjctInit) return;
  window.__bjctInit = true;

  var RAW = __DATA__;
  var CAT_META = [
    { key: 'all', name: '전체' },
    { key: 'water', name: '정수기' }, { key: 'air', name: '공기청정기' },
    { key: 'aircon', name: '에어컨' }, { key: 'fridge', name: '냉장고' },
    { key: 'wash', name: '세탁기' }, { key: 'tv', name: 'TV' },
    { key: 'heat', name: '냉난방기' }, { key: 'dry', name: '건조기' }
  ];
  var ICON = { water: '💧', air: '🍃', aircon: '❄️', fridge: '🧊', wash: '🫧', tv: '📺', heat: '♨️', dry: '💨' };
  var won = function (n) { return (n || 0).toLocaleString('ko-KR'); };

  function proc(p, i) {
    var parts = (p.name || '').split(' ');
    var brand = parts[0] || '';
    var name = parts.slice(1).join(' ') || p.name;
    var hasDisc = p.disc > 0 && p.final > 0 && p.final < p.orig;
    return { img: p.img, brand: brand, name: name, orig: p.orig, final: hasDisc ? p.final : p.orig, disc: p.disc, hasDisc: hasDisc, best: i === 0, link: '/html/dh_prod/prod_view/' + p.pid };
  }
  var BY = {}, TOP = [];
  CAT_META.forEach(function (c) {
    if (c.key === 'all') return;
    var raw = (RAW[c.key] && RAW[c.key].items) || [];
    BY[c.key] = raw.map(proc);
    TOP.push.apply(TOP, BY[c.key].slice(0, 2)); // 전체 = 카테고리별 상위 2개
  });
  BY.all = TOP;
  function listFor(k) { return BY[k] || []; }

  var CSS = [
    '#bjct-sec{display:none;background:#fff;font-family:inherit;-webkit-tap-highlight-color:transparent}',
    '@media(max-width:767px){#bjct-sec{display:block}.new-mc:not(.show-767){display:none !important}}',
    '#bjct-sec *{box-sizing:border-box}',
    '#bjct-sec .bjct-head{padding:18px 18px 4px}',
    '#bjct-sec .bjct-kick{font-size:12px;font-weight:800;color:#0838f8;letter-spacing:.02em}',
    '#bjct-sec .bjct-h2{font-size:20px;font-weight:900;letter-spacing:-.03em;margin:3px 0 0;color:#16181d}',
    '#bjct-sec .bjct-sub{font-size:12.5px;color:#8a8f9c;margin-top:4px}',
    '#bjct-sec .bjct-tabwrap{background:#fff;border-bottom:1px solid #eceef2}',
    '#bjct-sec .bjct-tabs{display:flex;gap:4px;overflow-x:auto;padding:10px 12px 0;position:relative;scrollbar-width:none}',
    '#bjct-sec .bjct-tabs::-webkit-scrollbar{display:none}',
    '#bjct-sec .bjct-tab{flex:0 0 auto;position:relative;border:0;background:none;cursor:pointer;padding:6px 12px 14px;font-size:14.5px;font-weight:700;color:#9298a4;letter-spacing:-.02em;white-space:nowrap;font-family:inherit}',
    '#bjct-sec .bjct-tab.on{color:#16181d;font-weight:800}',
    '#bjct-sec .bjct-ic{margin-right:4px}',
    '#bjct-sec .bjct-ind{position:absolute;bottom:0;left:0;height:2.5px;background:#0838f8;border-radius:2px;transition:transform .28s cubic-bezier(.4,0,.2,1),width .28s cubic-bezier(.4,0,.2,1)}',
    '#bjct-sec .bjct-count{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 8px}',
    '#bjct-sec .bjct-count .bjct-n{font-size:13px;color:#4a4e58;font-weight:600}',
    '#bjct-sec .bjct-count .bjct-n b{color:#0838f8;font-weight:800}',
    '#bjct-sec .bjct-sort{font-size:12px;color:#6b7280;font-weight:600;background:#fff;border:1px solid #eceef2;padding:5px 10px;border-radius:8px}',
    '#bjct-sec .bjct-pager{position:relative;overflow:hidden;touch-action:pan-y;user-select:none;-webkit-user-select:none;transition:height .3s cubic-bezier(.4,0,.2,1)}',
    '#bjct-sec .bjct-panel{position:absolute;top:0;left:0;width:100%;transition:transform .3s cubic-bezier(.4,0,.2,1)}',
    '#bjct-sec.bjct-noanim .bjct-pager,#bjct-sec.bjct-noanim .bjct-panel{transition:none}',
    '#bjct-sec .bjct-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:2px 12px 22px}',
    '#bjct-sec .bjct-card{background:#fff;border-radius:14px;overflow:hidden;border:1px solid #f0f1f4;display:flex;flex-direction:column;text-decoration:none;color:inherit}',
    '#bjct-sec .bjct-thumb{aspect-ratio:1/.88;background:#f6f7f9;display:flex;align-items:center;justify-content:center;position:relative;padding:12px}',
    '#bjct-sec .bjct-thumb img{max-width:100%;max-height:100%;object-fit:contain;mix-blend-mode:multiply;pointer-events:none}',
    '#bjct-sec .bjct-tag{position:absolute;top:8px;left:8px;background:#0838f8;color:#fff;font-size:10px;font-weight:800;padding:3px 7px;border-radius:6px}',
    '#bjct-sec .bjct-heart{position:absolute;top:7px;right:8px;width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center}',
    '#bjct-sec .bjct-heart svg{width:13px;height:13px;stroke:#b6bcc7;fill:none;stroke-width:2}',
    '#bjct-sec .bjct-body{padding:10px 10px 12px;display:flex;flex-direction:column;gap:2px}',
    '#bjct-sec .bjct-brand{font-size:11px;color:#8a8f9c;font-weight:700}',
    '#bjct-sec .bjct-name{font-size:12.5px;font-weight:600;line-height:1.34;color:#23262d;letter-spacing:-.02em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:34px;margin-bottom:5px}',
    '#bjct-sec .bjct-orow{display:flex;align-items:center;gap:5px;white-space:nowrap}',
    '#bjct-sec .bjct-chip{font-size:9px;font-weight:800;color:#7a808c;background:#f0f1f4;padding:2px 4px;border-radius:4px;flex:0 0 auto}',
    '#bjct-sec .bjct-orig{font-size:10.5px;color:#b0b4be;text-decoration:line-through}',
    '#bjct-sec .bjct-frow{display:flex;align-items:baseline;gap:5px;margin-top:3px;white-space:nowrap}',
    '#bjct-sec .bjct-off{color:#ff2d55;font-size:13px;font-weight:900}',
    '#bjct-sec .bjct-final{font-size:14px;font-weight:900;color:#16181d}',
    '#bjct-sec .bjct-final .bjct-mo{font-size:10px;font-weight:700;color:#6b7280;margin-right:1px}',
    '#bjct-sec .bjct-note{display:flex;align-items:center;gap:4px;margin-top:7px;font-size:10.5px;color:#0838f8;font-weight:700}',
    '#bjct-sec .bjct-note b{background:#eaf0ff;border-radius:5px;padding:2px 6px;font-weight:700}'
  ].join('');

  function cardHTML(p) {
    var price = p.hasDisc
      ? '<div class="bjct-orow"><span class="bjct-chip">최저</span><span class="bjct-orig">월 ' + won(p.orig) + '원</span></div>'
        + '<div class="bjct-frow"><span class="bjct-off">' + p.disc + '%</span><span class="bjct-final"><span class="bjct-mo">월</span>' + won(p.final) + '원</span></div>'
        + '<div class="bjct-note"><b>제휴카드</b> 추가 할인</div>'
      : '<div class="bjct-orow" style="visibility:hidden"><span class="bjct-chip">최저</span><span class="bjct-orig">월 ' + won(p.orig) + '원</span></div>'
        + '<div class="bjct-frow"><span class="bjct-final"><span class="bjct-mo">월</span>' + won(p.orig) + '원</span></div>'
        + '<div class="bjct-note" style="visibility:hidden"><b>제휴카드</b> 추가 할인</div>';
    return '<a class="bjct-card" href="' + p.link + '">'
      + '<div class="bjct-thumb">' + (p.best ? '<span class="bjct-tag">BEST</span>' : '')
      + '<img src="' + p.img + '" loading="lazy" alt="">'
      + '<span class="bjct-heart"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.3-7-9a3.7 3.7 0 017-1.5A3.7 3.7 0 0119 11c0 4.7-7 9-7 9z"/></svg></span></div>'
      + '<div class="bjct-body"><div class="bjct-brand">' + p.brand + '</div><div class="bjct-name">' + p.name + '</div>' + price + '</div></a>';
  }

  function build(anchor) {
    var sec = document.createElement('section');
    sec.id = 'bjct-sec';
    sec.innerHTML =
      '<div class="bjct-head"><div class="bjct-kick">CATEGORY</div><div class="bjct-h2">카테고리별 인기 렌탈</div><div class="bjct-sub">원하는 가전을 골라 최저가로 비교하세요</div></div>'
      + '<div class="bjct-tabwrap"><nav class="bjct-tabs" id="bjct-tabs"><span class="bjct-ind" id="bjct-ind"></span></nav></div>'
      + '<div class="bjct-count"><div class="bjct-n"><b id="bjct-cnt">0</b>개의 상품</div><div class="bjct-sort">인기순 ▾</div></div>'
      + '<div class="bjct-pager" id="bjct-pager"></div>';
    anchor.parentNode.insertBefore(sec, anchor);

    var tabbar = sec.querySelector('#bjct-tabs');
    var ind = sec.querySelector('#bjct-ind');
    var pager = sec.querySelector('#bjct-pager');
    var cntEl = sec.querySelector('#bjct-cnt');

    CAT_META.forEach(function (c, i) {
      var b = document.createElement('button');
      b.className = 'bjct-tab'; b.setAttribute('data-i', i);
      b.innerHTML = (c.key !== 'all' ? '<span class="bjct-ic">' + ICON[c.key] + '</span>' : '') + c.name;
      b.addEventListener('click', function () { go(i, true); });
      tabbar.appendChild(b);
    });
    var tabs = [].slice.call(tabbar.querySelectorAll('.bjct-tab'));
    var panels = CAT_META.map(function (c) {
      var el = document.createElement('div');
      el.className = 'bjct-panel';
      el.innerHTML = '<div class="bjct-grid">' + listFor(c.key).map(cardHTML).join('') + '</div>';
      pager.appendChild(el);
      return el;
    });

    var idx = 0, W = 360;
    function measureW() { W = pager.clientWidth || 360; }
    function panelH(i) { return panels[i].firstChild.scrollHeight; }
    function moveInd(t) { ind.style.width = (t.offsetWidth - 24) + 'px'; ind.style.transform = 'translateX(' + (t.offsetLeft + 12) + 'px)'; }
    function place(dx, dir) {
      panels.forEach(function (p, i) {
        var x;
        if (i === idx) x = dx;
        else if (dir && i === idx + dir) x = dir * W + dx;
        else x = (i < idx ? -1 : 1) * W;
        p.style.transform = 'translate3d(' + x + 'px,0,0)';
      });
    }
    function go(i, animate) {
      i = Math.max(0, Math.min(CAT_META.length - 1, i)); idx = i;
      tabs.forEach(function (t, j) { t.classList.toggle('on', j === i); });
      moveInd(tabs[i]);
      tabs[i].scrollIntoView({ behavior: animate ? 'smooth' : 'auto', inline: 'center', block: 'nearest' });
      cntEl.textContent = listFor(CAT_META[i].key).length;
      measureW();
      if (!animate) sec.classList.add('bjct-noanim');
      place(0, 0);
      pager.style.height = panelH(i) + 'px';
      if (!animate) requestAnimationFrame(function () { sec.classList.remove('bjct-noanim'); });
    }

    var x0 = 0, y0 = 0, drag = false, decided = false, horiz = false, dir = 0, lastDx = 0;
    pager.addEventListener('pointerdown', function (e) { measureW(); x0 = e.clientX; y0 = e.clientY; drag = true; decided = false; horiz = false; dir = 0; lastDx = 0; });
    pager.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      if (!decided) {
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) { decided = true; horiz = true; sec.classList.add('bjct-noanim'); try { pager.setPointerCapture(e.pointerId); } catch (_) { } }
        else if (Math.abs(dy) > 6) { decided = true; horiz = false; } else return;
      }
      if (!horiz) return;
      e.preventDefault();
      lastDx = dx;
      dir = dx < 0 ? 1 : -1;
      var nb = idx + dir, edge = (nb < 0 || nb >= CAT_META.length);
      place(edge ? dx * 0.28 : dx, edge ? 0 : dir);
      if (!edge) pager.style.height = Math.max(panelH(idx), panelH(nb)) + 'px';
    });
    function endDrag(e) {
      if (!drag) return; drag = false;
      if (!horiz) { decided = false; return; }
      sec.classList.remove('bjct-noanim');
      var dx = lastDx, nb = idx + dir;
      if (Math.abs(dx) > W * 0.22 && nb >= 0 && nb < CAT_META.length) go(nb, true);
      else { place(0, dir); pager.style.height = panelH(idx) + 'px'; }
      horiz = false; decided = false;
    }
    pager.addEventListener('pointerup', endDrag);
    pager.addEventListener('pointercancel', endDrag);

    go(0, false);
    window.addEventListener('resize', function () { measureW(); place(0, 0); pager.style.height = panelH(idx) + 'px'; moveInd(tabs[idx]); });
    // 이미지 로드 후 높이 재보정
    setTimeout(function () { pager.style.height = panelH(idx) + 'px'; }, 1200);
  }

  function injectCSS() {
    if (document.getElementById('bjct-css')) return;
    var s = document.createElement('style'); s.id = 'bjct-css'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  var tries = 0;
  function init() {
    if (document.getElementById('bjct-sec')) return;
    var anchor = document.querySelector('.new-mc:not(.show-767)');
    if (!anchor) { if (tries++ < 25) setTimeout(init, 300); return; }
    injectCSS();
    build(anchor);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
