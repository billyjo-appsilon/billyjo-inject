(function billyjoKarrotTracking(w, d) {
  var PIXEL_ID = '1785819744721510001';
  if (w.__billyjoKarrotTrackingLoaded) return;
  w.__billyjoKarrotTrackingLoaded = true;
  w.__billyjoKarrotTracked = w.__billyjoKarrotTracked || {};
  w.__billyjoKarrotPixelId = PIXEL_ID;

  function addScript(src, onload) {
    var s = d.createElement('script');
    s.src = src;
    s.async = true;
    if (onload) s.onload = onload;
    (d.head || d.documentElement).appendChild(s);
  }

  function pushDataLayer(eventName, params) {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(Object.assign({
      event: eventName === 'CompleteRegistration' ? 'bj_karrot_complete_registration' : 'bj_karrot_view_page',
      karrot_event: eventName,
      karrot_pixel_id: PIXEL_ID,
      page_location: location.href,
      page_referrer: d.referrer || ''
    }, params || {}));
  }

  function track(eventName, params) {
    eventName = eventName || 'ViewPage';
    var key = eventName === 'CompleteRegistration' ? 'lead' : eventName;
    if (w.__billyjoKarrotTracked[key]) return false;
    w.__billyjoKarrotTracked[key] = true;
    pushDataLayer(eventName, params);
    if (w.karrotPixel && w.karrotPixel.track) {
      try {
        w.karrotPixel.track(eventName, params || {});
        return true;
      } catch (err) {
        if (w.console) w.console.warn('[billyjo-karrot] track failed', err);
      }
    }
    return false;
  }

  w.BillyjoKarrotTrack = w.BillyjoKarrotTrack || track;

  if (!w.karrotPixel) {
    w.karrotPixel = { stub: true, queue: [] };
    w.karrotPixel.init = function () {
      w.karrotPixel.queue.push(['init', arguments, Date.now()]);
    };
    w.karrotPixel.track = function () {
      w.karrotPixel.queue.push(['track', arguments, Date.now()]);
    };
    addScript('https://karrot-pixel.business.daangn.com/karrot-pixel.js');
  }

  w.karrotPixel.init(PIXEL_ID);
  w.BillyjoKarrotTrack('ViewPage');

  if (w.fetch && !w.__billyjoKarrotFetchWrapped) {
    var nativeFetch = w.fetch;
    w.__billyjoKarrotFetchWrapped = true;
    w.fetch = function billyjoKarrotFetch(input, init) {
      var url = '';
      try {
        url = typeof input === 'string' ? input : (input && input.url) || '';
      } catch (err) {
        url = '';
      }
      return nativeFetch.apply(this, arguments).then(function (res) {
        if (res && res.ok && /\/v1\/consult\/quick-assign(?:\?|$)/.test(url)) {
          setTimeout(function () {
            w.BillyjoKarrotTrack('CompleteRegistration', {
              event: 'generate_lead',
              lead_source_event: 'generate_lead',
              source: 'billyjo.co.kr',
              value: 1,
              currency: 'KRW'
            });
          }, 0);
        }
        return res;
      });
    };
  }
})(window, document);
