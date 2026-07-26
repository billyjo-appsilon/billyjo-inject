// Lottie 색상 인벤토리 / 리컬러.
// Lottie 는 색을 여러 자리에 다른 모양으로 저장한다. 전부 처리한다:
//   - fill/stroke 정적:    { c: { a:0, k:[r,g,b,a] } }
//   - fill/stroke 애니:    { c: { a:1, k:[{ s:[r,g,b,a], e:[r,g,b,a] }, ...] } }
//   - 그라디언트:          { g: { p:N, k:{ a:0, k:[pos,r,g,b, pos,r,g,b, ...] } } }
//   - 솔리드 레이어:       { ty:1, sc:"#rrggbb" }
//   - 이펙트(Fill/Tint):   { ef:[{ ty:2, v:{ a:0, k:[r,g,b,a] } }] }
// r,g,b 는 0..1 정규화 값.

const COLOR_KEYS = new Set(['c', 'fc', 'sc']);

export function hexToRgb01(hex) {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

export function rgb01ToHex(rgb) {
  return '#' + rgb.slice(0, 3)
    .map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0'))
    .join('');
}

const isRgbTuple = (v) =>
  Array.isArray(v) && v.length >= 3 && v.slice(0, 3).every((n) => typeof n === 'number' && n >= 0 && n <= 1);

// 색이 놓인 모든 자리를 { get, set } 접근자로 평탄화해서 돌려준다.
function* colorSlots(node, parentKey = null, grandparent = null) {
  if (Array.isArray(node)) {
    for (const item of node) yield* colorSlots(item, parentKey, grandparent);
    return;
  }
  if (!node || typeof node !== 'object') return;

  // 솔리드 레이어의 sc 는 hex 문자열
  if (node.ty === 1 && typeof node.sc === 'string' && /^#[0-9a-f]{6}$/i.test(node.sc)) {
    yield { get: () => node.sc.toLowerCase(), set: (hex) => { node.sc = hex; } };
  }

  for (const key of Object.keys(node)) {
    const val = node[key];
    if (!val || typeof val !== 'object') continue;

    // 그라디언트 스톱 배열: [pos, r,g,b, pos, r,g,b, ...]
    if (key === 'g' && val.k && Array.isArray(val.k.k) && typeof val.p === 'number') {
      const stops = val.k.k;
      for (let i = 0; i < val.p; i++) {
        const base = i * 4 + 1;
        if (base + 2 < stops.length && isRgbTuple(stops.slice(base, base + 3))) {
          yield {
            get: () => rgb01ToHex(stops.slice(base, base + 3)),
            set: (hex) => { const [r, g, b] = hexToRgb01(hex); stops[base] = r; stops[base + 1] = g; stops[base + 2] = b; },
          };
        }
      }
    }

    const isColorProp = COLOR_KEYS.has(key) || (key === 'v' && node.ty === 2); // ty:2 = 이펙트 컬러
    if (isColorProp && 'k' in val) {
      if (isRgbTuple(val.k)) {
        yield {
          get: () => rgb01ToHex(val.k),
          set: (hex) => { const c = hexToRgb01(hex); val.k[0] = c[0]; val.k[1] = c[1]; val.k[2] = c[2]; },
        };
      } else if (Array.isArray(val.k)) {
        for (const kf of val.k) {
          for (const field of ['s', 'e']) {
            if (kf && isRgbTuple(kf[field])) {
              const arr = kf[field];
              yield {
                get: () => rgb01ToHex(arr),
                set: (hex) => { const c = hexToRgb01(hex); arr[0] = c[0]; arr[1] = c[1]; arr[2] = c[2]; },
              };
            }
          }
        }
      }
    }

    yield* colorSlots(val, key, parentKey);
  }
}

/** 아이콘에 쓰인 색 → 등장 횟수 */
export function collectColors(lottie) {
  const counts = new Map();
  for (const slot of colorSlots(lottie)) {
    const hex = slot.get();
    counts.set(hex, (counts.get(hex) || 0) + 1);
  }
  return counts;
}

/**
 * roles(hex→역할) + theme(역할→hex) 로 리컬러한 새 Lottie 를 만든다.
 * 원본은 건드리지 않는다. 매핑되지 않은 색은 그대로 두고 unmapped 로 보고한다.
 */
export function recolor(lottie, roles, theme) {
  const out = structuredClone(lottie);
  const applied = new Map();
  const unmapped = new Map();

  for (const slot of colorSlots(out)) {
    const from = slot.get();
    const role = roles[from];
    const to = role ? theme[role] : null;
    if (!to) {
      // 검정은 마스크/매트에 쓰이는 경우가 많아 기본적으로 건드리지 않는다.
      if (from !== '#000000') unmapped.set(from, (unmapped.get(from) || 0) + 1);
      continue;
    }
    slot.set(to);
    applied.set(`${from} → ${to} (${role})`, (applied.get(`${from} → ${to} (${role})`) || 0) + 1);
  }

  return { json: out, applied, unmapped };
}

/**
 * 스트로크 두께 배율.
 * Lordicon wired/outline 의 기본 스트로크는 자사몰 기존 아이콘보다 가늘어서, 같은 자리에 넣으면
 * 시각적 무게가 떨어져 묻힌다. 재수급(Export 의 bold 옵션) 대신 코드로 조절해 미세 튜닝한다.
 * shape item ty:'st'(stroke) / 'gs'(gradient stroke) 의 w 값을 곱한다. 정적·애니메이션 모두 처리.
 */
export function scaleStroke(lottie, factor) {
  if (!factor || factor === 1) return { json: structuredClone(lottie), changed: 0 };
  const out = structuredClone(lottie);
  let changed = 0;

  (function walk(node) {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== 'object') return;
    if ((node.ty === 'st' || node.ty === 'gs') && node.w && typeof node.w === 'object') {
      const w = node.w;
      if (typeof w.k === 'number') { w.k *= factor; changed++; }
      else if (Array.isArray(w.k)) {
        for (const kf of w.k) {
          for (const field of ['s', 'e']) {
            if (Array.isArray(kf?.[field])) { kf[field] = kf[field].map((v) => (typeof v === 'number' ? v * factor : v)); changed++; }
          }
        }
      }
    }
    for (const k of Object.keys(node)) walk(node[k]);
  })(out);

  return { json: out, changed };
}

/**
 * 재생 구간 밖의 state 레이어를 잘라낸다.
 * Lordicon Raw 익스포트는 in-reveal / hover-* / loop-* / morph-* 를 각각 별도 레이어로 넣어
 * 한 타임라인에 이어 붙인다. 우리는 default 구간 하나만 재생하므로 나머지는 순수 낭비다.
 * (자사몰에서 네트워크로 받는 자산이라 용량이 그대로 로딩 비용이다.)
 */
export function trimToSegment(lottie, from, to) {
  const out = structuredClone(lottie);
  const before = (out.layers || []).length;

  const keep = (l) => {
    const lin = typeof l.ip === 'number' ? l.ip : -Infinity;
    const lout = typeof l.op === 'number' ? l.op : Infinity;
    return lout > from && lin < to;      // 구간과 겹치는 레이어만 유지
  };

  const kept = (out.layers || []).filter(keep);
  const keptIdx = new Set(kept.map((l) => l.ind).filter((i) => i !== undefined));
  // 남은 레이어가 부모로 참조하는 레이어는 잘라내면 안 된다
  let grew = true;
  while (grew) {
    grew = false;
    for (const l of (out.layers || [])) {
      if (l.parent !== undefined && keptIdx.has(l.ind) === false) continue;
      if (l.parent !== undefined && !keptIdx.has(l.parent)) {
        const p = (out.layers || []).find((x) => x.ind === l.parent);
        if (p && !kept.includes(p)) { kept.push(p); keptIdx.add(p.ind); grew = true; }
      }
    }
  }

  out.layers = (out.layers || []).filter((l) => kept.includes(l));
  out.ip = from;
  out.op = to;
  out.markers = (out.markers || []).filter((m) => m.tm >= from && m.tm < to);

  return { json: out, layersBefore: before, layersAfter: out.layers.length };
}

/** 무료 다운로드본에 박히는 watermark 레이어 감지 (PRO API 경유본에는 없어야 함) */
export function findWatermark(lottie) {
  const names = (lottie.layers || []).map((l) => l.nm || '');
  return names.filter((n) => /watermark|lordicon\.com/i.test(n));
}
