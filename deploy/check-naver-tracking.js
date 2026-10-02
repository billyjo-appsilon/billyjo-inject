const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require('node:path').join(__dirname, '../tracking/naver.js'), 'utf8');

function runtime(hostname, pathname = '/') {
  const appended = [];
  const calls = { inflow: [], pageView: 0, conversions: [] };
  const storage = new Map();
  const response = {
    ok: true,
    clone() { return { json: async () => ({ consult: { requestId: 'REQ-77' } }) }; }
  };
  const document = {
    head: { appendChild(node) { appended.push(node); } },
    documentElement: { appendChild(node) { appended.push(node); } },
    createElement() { return { dataset: {}, addEventListener() {} }; },
    querySelector() { return null; }
  };
  const window = {
    location: { hostname, pathname, href: `https://${hostname}${pathname}` },
    sessionStorage: {
      getItem(key) { return storage.get(key) || null; },
      setItem(key, value) { storage.set(key, value); }
    },
    fetch: async () => response
  };
  window.window = window;
  vm.runInContext(source, vm.createContext({ window, document, console, setTimeout, clearTimeout }), {
    filename: 'tracking/naver.js'
  });
  return {
    window, appended, calls,
    load() {
      window.wcs = {
        inflow(value) { calls.inflow.push(value); },
        trans(value) { calls.conversions.push({ ...value }); }
      };
      window.wcs_do = () => { calls.pageView += 1; };
      appended[0].onload();
    }
  };
}

(async () => {
  for (const host of [
    'billyjo.co.kr',
    'live1.billyjo.co.kr',
    'live.billyjo.co.kr',
    'meta.billyjo.co.kr'
  ]) {
    const allowed = runtime(host);
    assert.equal(allowed.appended[0].src, 'https://wcs.naver.net/wcslog.js', `${host}: must load Naver script`);
    allowed.load();
    assert.equal(allowed.window.wcs_add.wa, 's_265c8d8df91c');
    assert.deepEqual(allowed.calls.inflow, [host]);
    assert.equal(allowed.calls.pageView, 1);
  }

  const app = runtime('billyjo.co.kr');
  app.load();

  await app.window.fetch('https://admin2-api.billyjo.co.kr/v1/consult/quick-assign', {
    method: 'POST',
    body: JSON.stringify({ phone: '01012345678', name: '실고객' })
  });
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.deepEqual(app.calls.conversions, [{ type: 'lead', id: 'REQ-77' }]);

  await app.window.fetch('https://admin2-api.billyjo.co.kr/v1/consult/quick-assign', {
    method: 'POST',
    body: JSON.stringify({ phone: '01000001234', name: '전환테스트' })
  });
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(app.calls.conversions.length, 1, 'test lead must be suppressed');

  app.window.BillyjoNaverTrackLead({
    lead_id: 'REQ-OPAQUE',
    phone: '01012345679',
    name: '정상 고객',
    memo: '최신 제품 문의',
    gclid: 'opaque-TEST-token'
  });
  assert.deepEqual(app.calls.conversions[1], { type: 'lead', id: 'REQ-OPAQUE' });

  app.window.BillyjoNaverTrackLead({
    lead_id: 'REQ-TEST-DIRECT',
    phone: '01012345670',
    name: 'my-test-user'
  });
  assert.equal(app.calls.conversions.length, 2, 'direct test payload must be suppressed');

  app.window.BillyjoNaverTrackLead({
    lead_id: 'REQ-CONTEST',
    phone: '01012345671',
    name: 'contest winner'
  });
  assert.deepEqual(app.calls.conversions[2], { type: 'lead', id: 'REQ-CONTEST' });

  for (const [host, path] of [
    ['car.billyjo.co.kr', '/'],
    ['billyjo.co.kr', '/car'],
    ['billyjo.co.kr', '/car/estimate'],
    ['cars.billyjo.co.kr', '/'],
    ['landing.billyjo.co.kr', '/'],
    ['www.billyjo.co.kr', '/']
  ]) {
    const excluded = runtime(host, path);
    assert.equal(excluded.appended.length, 0, `${host}${path}: must not load Naver script`);
    assert.equal(excluded.window.fetch.name, 'fetch', `${host}${path}: fetch must not be wrapped`);
  }

  console.log('Naver general-landing boundary checks passed');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
