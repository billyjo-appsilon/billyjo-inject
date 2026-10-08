/* Naver SA/GFA conversion tracking for BillyJo appliance/general landings.
 * Common key: s_265c8d8df91c
 *
 * The car service is a separate analytics property. This file only enables
 * the general-appliance hosts and exits before loading wcslog.js on
 * car.billyjo.co.kr and on billyjo.co.kr/car.
 */
(function billyjoNaverTracking(w, d) {
  'use strict';

  var ACCOUNT_ID = 's_265c8d8df91c';
  var SCRIPT_SRC = 'https://wcs.naver.net/wcslog.js';
  var host = String(w.location && w.location.hostname || '').toLowerCase();
  var path = String(w.location && w.location.pathname || '/');
  var GENERAL_HOSTS = {
    'billyjo.co.kr': true,
    'live1.billyjo.co.kr': true,
    'live.billyjo.co.kr': true,
    'meta.billyjo.co.kr': true
  };
  var enabled = !!GENERAL_HOSTS[host] &&
    !(host === 'billyjo.co.kr' && /^\/car(?:\/|$)/.test(path));
  var state = w.__billyjoNaverTracking = w.__billyjoNaverTracking || {
    enabled: enabled,
    ready: false,
    pageViewSent: false,
    queue: [],
    sent: {}
  };

  function noop() { return false; }
  if (!enabled) {
    state.enabled = false;
    w.BillyjoNaverTrackLead = w.BillyjoNaverTrackLead || noop;
    return;
  }
  if (w.BillyjoNaverTrackLead) return;

  function clean(value, max) {
    return String(value == null ? '' : value).trim().slice(0, max || 120);
  }

  function storageKey(id) { return 'bj_naver_lead:' + id; }
  function wasSent(id) {
    if (state.sent[id]) return true;
    try { return w.sessionStorage.getItem(storageKey(id)) === '1'; } catch (err) { return false; }
  }
  function markSent(id) {
    state.sent[id] = true;
    try { w.sessionStorage.setItem(storageKey(id), '1'); } catch (err) { /* storage unavailable */ }
  }

  function conversionId(payload) {
    var p = payload || {};
    return clean(p.lead_id || p.request_id || p.event_id || p.id || '', 120);
  }

  function sendLead(payload) {
    if (!state.ready || !w.wcs || typeof w.wcs.trans !== 'function') {
      state.queue.push(payload || {});
      return false;
    }
    var id = conversionId(payload);
    var dedupeId = id || '__page_lead__';
    if (wasSent(dedupeId)) return false;
    var conversion = { type: 'lead' };
    if (id) conversion.id = id;
    w.wcs.trans(conversion);
    markSent(dedupeId);
    state.lastConversion = conversion;
    return true;
  }

  function flush() {
    var pending = state.queue.splice(0);
    pending.forEach(sendLead);
  }

  function initialize() {
    if (!w.wcs || typeof w.wcs.inflow !== 'function') return false;
    w.wcs_add = w.wcs_add || {};
    w.wcs_add.wa = ACCOUNT_ID;
    w.wcs.inflow(host);
    if (!state.pageViewSent && typeof w.wcs_do === 'function') {
      w.wcs_do();
      state.pageViewSent = true;
    }
    state.ready = true;
    state.accountId = ACCOUNT_ID;
    state.cookieScope = host;
    flush();
    return true;
  }

  var TEST_PHONES = { '01099191322': true };
  var TEST_PHONE_PREFIXES = ['0700000', '0100000'];
  var SEMANTIC_FIELDS = {
    name: true, customername: true, memo: true, message: true,
    product: true, productname: true, selection: true, selections: true,
    persona: true, campaign: true, campaignname: true,
    source_name: true, description: true, note: true
  };

  function flattenSemantic(value, out, visible) {
    out = out || [];
    if (value == null || out.join(' ').length > 8000) return out;
    if (Array.isArray(value)) {
      if (visible) value.forEach(function (item) { flattenSemantic(item, out, true); });
    } else if (typeof value === 'object') {
      Object.keys(value).forEach(function (key) {
        var childVisible = visible || !!SEMANTIC_FIELDS[String(key).toLowerCase()];
        flattenSemantic(value[key], out, childVisible);
      });
    } else if (visible) {
      out.push(String(value));
    }
    return out;
  }

  function hasTestMarker(text) {
    var value = String(text || '').toLowerCase();
    return /(전환테스트|테스트|더미|샘플)/.test(value) ||
      /(^|[^a-z])(test|dummy|sample|conversion_recheck)/.test(value);
  }

  function requestBody(init) {
    try {
      var raw = init && init.body;
      if (!raw || typeof raw !== 'string') return {};
      return JSON.parse(raw);
    } catch (err) { return {}; }
  }

  function isTestPayload(body) {
    body = body || {};
    var digits = clean(body.phone || body.customerPhone || '', 30).replace(/\D+/g, '');
    if (TEST_PHONES[digits] || TEST_PHONE_PREFIXES.some(function (prefix) {
      return digits.indexOf(prefix) === 0;
    })) return true;
    return hasTestMarker(flattenSemantic(body, [], false).join(' '));
  }

  function isTestRequest(init) {
    return isTestPayload(requestBody(init));
  }

  function responseLeadId(response) {
    if (!response || typeof response.clone !== 'function') return Promise.resolve('');
    return response.clone().json().then(function (body) {
      var consult = body && body.consult || {};
      return clean(consult.requestId || consult.code || '', 120);
    }).catch(function () { return ''; });
  }

  w.BillyjoNaverTrackLead = sendLead;
  state.enabled = true;

  if (w.fetch && !w.__billyjoNaverFetchWrapped) {
    var nativeFetch = w.fetch;
    w.__billyjoNaverFetchWrapped = true;
    w.fetch = function billyjoNaverFetch(input, init) {
      var url = '';
      try { url = typeof input === 'string' ? input : (input && input.url) || ''; } catch (err) { url = ''; }
      return nativeFetch.apply(this, arguments).then(function (response) {
        if (response && response.ok && /\/v1\/consult\/quick-assign(?:\?|$)/.test(url)) {
          responseLeadId(response).then(function (id) {
            sendLead({ lead_id: id, request_id: id });
          });
        }
        return response;
      });
    };
  }

  if (initialize()) return;
  var existing = d.querySelector('script[data-bj-naver-common-key]');
  if (existing) {
    existing.addEventListener('load', initialize, { once: true });
    return;
  }
  var script = d.createElement('script');
  script.src = SCRIPT_SRC;
  script.async = true;
  script.dataset.bjNaverCommonKey = ACCOUNT_ID;
  script.onload = initialize;
  script.onerror = function () { state.loadError = true; };
  (d.head || d.documentElement).appendChild(script);
})(window, document);
