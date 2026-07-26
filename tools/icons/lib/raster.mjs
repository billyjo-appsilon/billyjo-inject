// Lottie → GIF / APNG / 정지 PNG 래스터화.
// npm 의존성 없음: 설치된 Chrome 을 CDP 로 1회만 띄워 전 프레임을 격자 스프라이트로 그리고,
// ffmpeg 의 untile 필터로 다시 프레임 시퀀스로 풀어서 인코딩한다.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { screenshot } from './chrome.mjs';

const HERE = path.dirname(new URL(import.meta.url).pathname);
// 래스터화는 canvas 렌더러 빌드가 필요하다 (lottie_light 는 SVG 전용).
// 웹 배포에 쓰는 런타임은 vendor/lottie_light.min.js — 용도가 다르니 헷갈리지 말 것.
const LOTTIE_JS = path.join(HERE, '..', 'vendor', 'lottie_light_canvas.min.js');

const tmpfile = (name) => path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'bjicon-')), name);

/**
 * 재생할 구간을 고른다.
 * Lordicon 의 Raw 익스포트는 여러 state(in-reveal / hover-pinch / morph …)를 한 타임라인에
 * 이어 붙이고 markers 로 구간을 표시한다. ip→op 전체를 렌더하면 state 경계의 빈 구간이
 * 그대로 섞여 들어가므로, 반드시 마커 구간 하나를 골라야 한다.
 * `default:` 접두 마커가 그 아이콘의 기본 애니메이션이다.
 */
export function pickSegment(lottieJson, state) {
  const markers = (lottieJson.markers || []).filter((m) => typeof m.tm === 'number' && m.dr > 0);
  if (!markers.length) return { from: lottieJson.ip || 0, to: lottieJson.op || 0, name: null, states: [] };

  const states = markers.map((m) => m.cm);
  const clean = (s) => String(s || '').replace(/^default:/, '');
  const chosen = (state && markers.find((m) => clean(m.cm) === clean(state)))
    || markers.find((m) => /^default:/.test(m.cm))
    || markers.find((m) => !/^in-/.test(m.cm))   // in-* 은 등장 연출이라 루프에 부적합
    || markers[0];

  return { from: chosen.tm, to: chosen.tm + chosen.dr, name: chosen.cm, states };
}

/** 소스 fps 에서 목표 fps 로 균등 샘플링한 프레임 번호 */
function sampleFrames(lottieJson, fps, state) {
  const { from, to } = pickSegment(lottieJson, state);
  const step = (lottieJson.fr || 30) / fps;
  const frames = [];
  for (let t = from; t < to; t += step) frames.push(Math.round(t));
  return frames.length ? frames : [from];
}

/** 전 프레임을 cols×rows 격자 한 장으로 렌더 */
export async function renderSheet(lottieJson, { cell = 400, cols = 8, fps = 25, bg = null, state = null } = {}) {
  const frames = sampleFrames(lottieJson, fps, state);
  const rows = Math.ceil(frames.length / cols);

  const html = `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;padding:0;background:${bg || 'transparent'}}canvas{display:block}
#src{position:fixed;left:-9999px;top:0;width:${cell}px;height:${cell}px}</style>
<canvas id="sheet"></canvas><div id="src"></div>
<script>${fs.readFileSync(LOTTIE_JS, 'utf8')}</script>
<script>
try{
  var DATA=${JSON.stringify(lottieJson)},FRAMES=${JSON.stringify(frames)},CELL=${cell},COLS=${cols};
  var sheet=document.getElementById('sheet');
  sheet.width=COLS*CELL; sheet.height=${rows}*CELL;
  var ctx=sheet.getContext('2d');
  var anim=lottie.loadAnimation({container:document.getElementById('src'),renderer:'canvas',
    loop:false,autoplay:false,animationData:DATA,
    rendererSettings:{clearCanvas:true,preserveAspectRatio:'xMidYMid meet'}});
  anim.addEventListener('DOMLoaded',function(){
    try{
      var src=document.querySelector('#src canvas');
      // lottie-web 의 goToAndStop(frame, true) 는 ip 기준 "상대" 프레임이다.
      // 절대 프레임을 그대로 넘기면 ip 만큼 밀려 타임라인 밖을 그리게 된다.
      var IP = DATA.ip || 0;
      FRAMES.forEach(function(f,i){
        anim.goToAndStop(f - IP, true);
        ctx.drawImage(src,(i%COLS)*CELL,Math.floor(i/COLS)*CELL,CELL,CELL);
      });
      document.title='READY';
    }catch(e){document.title='ERROR:'+e.message;}
  });
}catch(e){document.title='ERROR:'+e.message;}
</script>`;

  const sheet = await screenshot({
    html, out: tmpfile('sheet.png'), width: cols * cell, height: rows * cell,
  });
  return { sheet, cols, rows, count: frames.length, fps, segment: pickSegment(lottieJson, state) };
}

function ffmpeg(args) {
  try {
    execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args], { stdio: 'pipe', timeout: 180000 });
  } catch (e) {
    throw new Error(`ffmpeg 실패: ${(e.stderr || '').toString().trim() || e.message}`);
  }
}

// untile 이 뱉는 프레임은 원본 PNG 의 PTS 를 잘게 쪼개 물려받아 간격이 1ms 미만이다.
// 그대로 fps 필터를 태우면 전 프레임이 한 장으로 뭉개지므로 setpts 로 타임스탬프를 재생성한다.
const untile = ({ cols, rows, count, fps }) =>
  `untile=${cols}x${rows},trim=end_frame=${count},setpts=N/${fps}/TB`;

/** 격자 스프라이트 → GIF (palettegen/paletteuse 로 색 품질 확보) */
export function sheetToGif(s, out, { size = 200, transparent = true } = {}) {
  const chain = `${untile(s)},scale=${size}:${size}:flags=lanczos`;
  const gen = transparent ? 'palettegen=stats_mode=diff:reserve_transparent=1' : 'palettegen=stats_mode=diff';
  const use = transparent
    ? 'paletteuse=dither=bayer:bayer_scale=3:alpha_threshold=128'
    : 'paletteuse=dither=bayer:bayer_scale=3';
  ffmpeg(['-i', s.sheet, '-filter_complex', `[0:v]${chain},split[a][b];[a]${gen}[p];[b][p]${use}`,
    '-r', String(s.fps), '-loop', '0', out]);
  return out;
}

/** 격자 스프라이트 → APNG (알파 온전, GIF 보다 훨씬 깨끗) */
export function sheetToApng(s, out, { size = 200 } = {}) {
  ffmpeg(['-i', s.sheet, '-vf', `${untile(s)},scale=${size}:${size}:flags=lanczos`,
    '-r', String(s.fps), '-plays', '0', '-f', 'apng', out]);
  return out;
}

/** 정지 PNG 1장 (포스터 / prefers-reduced-motion 폴백) */
export function sheetToPoster(s, out, { size = 200, at = 'last' } = {}) {
  const idx = at === 'last' ? s.count - 1 : Math.min(Number(at) || 0, s.count - 1);
  ffmpeg(['-i', s.sheet, '-vf',
    `untile=${s.cols}x${s.rows},select='eq(n\\,${idx})',scale=${size}:${size}:flags=lanczos`,
    '-frames:v', '1', out]);
  return out;
}

/**
 * 로컬 Lottie JSON 후보들을 라벨 붙은 격자 한 장으로 — 에이전트가 "눈으로 보고" 고르기 위한 용도.
 * Chrome 을 1회만 띄워 N개를 한꺼번에 그린다. items: [{ label, json }]
 * 정지 프레임은 애니메이션 후반(기본 70% 지점)을 쓴다 — 초반은 대개 비어 있어 판별이 안 된다.
 */
export async function lottieContactSheet(items, out, { cell = 220, cols = 5, bg = '#ffffff', at = 0.7 } = {}) {
  const rows = Math.ceil(items.length / cols);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const box = cell - 60;

  const html = `<!doctype html><meta charset="utf-8">
<style>
  html,body{margin:0;background:${bg};font:12px/1.35 -apple-system,'Helvetica Neue',sans-serif;color:#111827}
  #g{display:grid;grid-template-columns:repeat(${cols},minmax(0,${cell}px))}
  figure{margin:0;padding:10px;box-sizing:border-box;min-width:0;text-align:center;border:1px solid #e5e7eb}
  .a{width:${box}px;height:${box}px;margin:0 auto}
  figcaption{margin-top:8px;word-break:break-all;color:#334155;white-space:pre-line}
</style>
<div id="g">${items.map((it, i) =>
    `<figure><div class="a" id="a${i}"></div><figcaption>${esc(it.label)}</figcaption></figure>`).join('')}</div>
<script>${fs.readFileSync(LOTTIE_JS, 'utf8')}</script>
<script>
try{
  var DATA=${JSON.stringify(items.map((i) => i.json))};
  var SEG=${JSON.stringify(items.map((i) => pickSegment(i.json)))};
  DATA.forEach(function(d,i){
    var a=lottie.loadAnimation({container:document.getElementById('a'+i),renderer:'canvas',
      loop:false,autoplay:false,animationData:d,
      rendererSettings:{clearCanvas:true,preserveAspectRatio:'xMidYMid meet'}});
    a.addEventListener('DOMLoaded',function(){
      var seg = SEG[i];
      a.goToAndStop(Math.round(seg.from + (seg.to - seg.from) * ${at}) - (d.ip || 0), true);
    });
  });
  setTimeout(function(){document.title='READY';},1200);
}catch(e){document.title='ERROR:'+e.message;}
</script>`;

  return screenshot({ html, out, width: cols * cell + 2, height: rows * (cell + 20) + 2 });
}

/**
 * 후보 아이콘들을 라벨 붙은 격자 한 장으로 — 에이전트가 "눈으로 보고" 고르기 위한 용도.
 * items: [{ label, file }] — file 은 로컬 이미지 경로(gif/png/svg)
 */
export async function contactSheet(items, out, { cell = 220, cols = 5, bg = '#ffffff' } = {}) {
  const rows = Math.ceil(items.length / cols);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const cards = items.map((it) => {
    const b64 = fs.readFileSync(it.file).toString('base64');
    const ext = path.extname(it.file).toLowerCase();
    const mime = ext === '.svg' ? 'image/svg+xml' : ext === '.gif' ? 'image/gif' : 'image/png';
    return `<figure><img src="data:${mime};base64,${b64}"><figcaption>${esc(it.label)}</figcaption></figure>`;
  }).join('');

  const html = `<!doctype html><meta charset="utf-8">
<style>
  html,body{margin:0;background:${bg};font:12px/1.35 -apple-system,'Helvetica Neue',sans-serif;color:#111827}
  #g{display:grid;grid-template-columns:repeat(${cols},minmax(0,${cell}px))}
  figure{margin:0;padding:10px;box-sizing:border-box;min-width:0;text-align:center;border:1px solid #e5e7eb}
  img{width:${cell - 60}px;height:${cell - 60}px;object-fit:contain;display:block;margin:0 auto}
  figcaption{margin-top:8px;word-break:break-all;color:#334155;white-space:pre-line}
</style><div id="g">${cards}</div>
<script>addEventListener('load',function(){document.title='READY'})</script>`;

  return screenshot({ html, out, width: cols * cell + 2, height: rows * (cell + 20) + 2 });
}
