/*! Domain Decoded - shared extras: cookie consent (Google Analytics only after Accept),
   language-switcher behaviour and the opening "star to galaxy" motion. */
(function () {
  'use strict';
  var GA_ID = 'G-LBK3BEMS0E';
  var KEY = 'dd-consent';
  var root = document.documentElement;
  var lang = (root.getAttribute('lang') || 'en').toLowerCase();
  var L = lang.indexOf('ar') === 0 ? 'ar' : lang.indexOf('zh') === 0 ? 'zh' : lang.indexOf('es') === 0 ? 'es' : 'en';

  var TXT = {
    en: { msg: 'This site uses Google Analytics cookies to understand how visitors use it. Nothing is sold, shared or used for any other purpose, and analytics only start if you accept.', ok: 'Accept', no: 'Decline', more: 'Privacy Policy' },
    ar: { msg: 'يستخدم هذا الموقع ملفات تعريف الارتباط الخاصة بـ Google Analytics لفهم كيفية استخدام الزوار له. لا يُباع أي شيء ولا يُشارَك ولا يُستخدم لأي غرض آخر، ولا يبدأ التحليل إلا إذا وافقت.', ok: 'أوافق', no: 'أرفض', more: 'سياسة الخصوصية' },
    zh: { msg: '本网站使用 Google Analytics Cookie 来了解访客如何使用网站。任何信息都不会被出售、共享或用于其他目的，只有在您接受后才会启动统计分析。', ok: '接受', no: '拒绝', more: '隐私政策' },
    es: { msg: 'Este sitio usa cookies de Google Analytics para entender cómo lo usan los visitantes. No se vende, comparte ni usa nada con otros fines, y el análisis solo se activa si lo aceptas.', ok: 'Aceptar', no: 'Rechazar', more: 'Política de privacidad' }
  }[L];

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function put(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  /* ---------- Google Analytics, only after consent ---------- */
  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return; gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  function clearGA() {
    var names = document.cookie.split(';');
    var host = location.hostname.split('.');
    for (var i = 0; i < names.length; i++) {
      var n = names[i].split('=')[0].trim();
      if (n.indexOf('_ga') === 0) {
        document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + location.hostname;
        if (host.length > 1) document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.' + host.slice(-2).join('.');
      }
    }
  }

  var bar = null;
  function closeBar() { if (bar && bar.parentNode) bar.parentNode.removeChild(bar); bar = null; }
  function showBar() {
    if (bar) return;
    bar = document.createElement('div');
    bar.className = 'dd-consent'; bar.setAttribute('role', 'dialog'); bar.setAttribute('aria-label', 'Cookies');
    var p = document.createElement('p');
    p.appendChild(document.createTextNode(TXT.msg + ' '));
    var a = document.createElement('a'); a.href = '/privacy-policy.html'; a.textContent = TXT.more; p.appendChild(a);
    var wrap = document.createElement('div'); wrap.className = 'dd-btns';
    var ok = document.createElement('button'); ok.type = 'button'; ok.className = 'dd-ok'; ok.textContent = TXT.ok;
    var no = document.createElement('button'); no.type = 'button'; no.className = 'dd-no'; no.textContent = TXT.no;
    ok.onclick = function () { put('granted'); closeBar(); loadGA(); };
    no.onclick = function () { put('denied'); closeBar(); clearGA(); };
    wrap.appendChild(no); wrap.appendChild(ok);
    bar.appendChild(p); bar.appendChild(wrap);
    document.body.appendChild(bar);
  }
  window.ddCookieSettings = showBar;

  /* ---------- language switcher: close on outside click / Esc ---------- */
  function wireSwitcher() {
    var sw = document.querySelector('.lang-switch');
    if (!sw) return;
    document.addEventListener('click', function (e) { if (sw.open && !sw.contains(e.target)) sw.open = false; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sw.open) { sw.open = false; var s = sw.querySelector('summary'); if (s) s.focus(); } });
  }

  /* ---------- opening motion: a globe spins to Asia and highlights Bangladesh ---------- */
  var GEO = {
    land: [
      [-9.5,37,-9,43.5,-1.5,43.5,-4.7,48.4,-1.2,46,-1.3,49.7,1.6,50.9,4.5,52.5,8.5,54,8.2,56.5,10.5,57.7,10,55,12,54.2,14.2,54,19,54.5,21,55.5,21.5,57.5,24,57,24.5,59.4,28,59.8,24,60,21.5,60.4,21.5,63,25,65.2,24,65.8,22,65.7,21,64,17.5,62.5,17.2,60.7,18.5,60,16.7,57,14.3,56,12.8,55.5,12,57.7,11,59,10.7,59.9,8,58.1,5.5,58.8,5,61,6.5,62.5,10,64,13,67.5,16.5,69,21,70,26,71,31,70.3,33,69.4,40.5,67,35,66,34.5,64.6,38,64.2,40,64.8,44,66,44,68.5,53,68.5,60,69,66,69.5,70,73,73,72,73,68.5,79,72,82,73.5,87,75,100,77.7,104,77.7,112,76,113,73.7,126,73.5,129,71,140,72.5,150,71.4,160,69.8,170,70,180,68.8,190,66,187.5,64.5,180,64.7,178,62.5,170,60.5,164,59.8,163,57.5,162,54.5,156.8,51,155.8,56,156.5,58.5,159,61,154,59.2,143,59.3,138,56,135,54.5,140.8,53.2,141,50,140.3,48,135.5,43.5,132,43,129.7,41,128,39.5,129.4,36.5,129.2,35.2,126.5,34.4,126.4,37,125,37.7,124.6,39.8,121.5,40.8,121.3,38.8,118,39.1,117.7,38,119,37.3,122.5,37.2,120,36,119,34.5,121.8,31.8,121.9,30.8,121,28,119.5,25.5,116.5,22.8,113.5,22.2,110.3,21.2,108,21.5,106.5,20.3,105.8,19,108.8,15.5,109.2,13,109,11.5,106.7,10.3,105,8.7,105,10.3,103.3,10.6,102.9,12.2,100.9,13.4,100,13.4,100.1,12.1,99.5,10,100.3,8.3,101.5,6.9,103.4,4.5,103.5,1.5,101.3,2.8,100.3,5.5,98.5,8,98.3,10.5,98.5,13.5,97.5,16.5,94.5,16.2,94.2,18.5,92.8,20.2,92.3,21.4,91.8,22.4,90.7,22.5,89,21.8,88.2,21.7,86.8,20.7,85,19.4,82.3,16.5,80.2,15.5,80.1,13,79.8,10.3,79,9.2,77.5,8,76.4,9.5,75.4,12,74.6,14.5,73.4,17.5,72.8,20,72.6,21.5,70.5,20.7,69,22.3,70.2,23,68.3,23.7,67,24.8,66.5,25.4,62,25.2,57.3,25.7,56.8,27,54.3,26.5,51.5,27.8,50.2,30,48.7,30.3,48,29.5,50,26.5,51.5,24.5,53.5,24.2,56,26,56.3,26.3,56.9,24.7,58.8,23.5,59.8,22.5,58.2,20.5,55.2,17.8,52.2,16.2,48.5,14.2,45,12.8,43.3,12.7,42.7,15.7,41,19.5,39,21.7,37,25,35,28,34.9,29.5,34.3,31.3,34.9,32.8,35.8,34.6,35.9,36.6,34.5,36.8,32,36.2,29.5,36.5,27.5,37,26.5,38.5,26.2,40,29,41,31.5,41.1,35,42,38,41,41.5,41.5,41.5,43,37.5,44.7,38,47,33.5,46,33.8,44.4,32.5,45.4,30.5,46.5,28.8,44.5,28,42,26,40.8,24,40.8,22.9,40.5,23.5,38,21.8,36.7,20,39.8,19.5,41.8,16,43.5,13.8,45.5,12.3,45.3,14,42.5,17,40.7,16.5,38,15.7,38,16,39.5,14.5,40.7,12,42,10.5,43.5,8.8,44.4,6.5,43.2,3.2,43.3,3,41.8,0.5,40,-0.4,38.3,-2,36.7,-5.4,36,-6.3,36.8,-8.8,37],
      [-5.9,35.8,-2,35.1,1,36.5,5,36.8,10,37.2,11,35,10,33.8,15.2,32.3,20,30.9,19,30.3,22,32.8,25,31.6,29,30.9,32,31.3,32.5,29.9,33.5,28,34.3,27.7,35.5,24.2,37.2,21,38.6,18,40,15.5,43.2,12.4,44.5,10.4,51.2,11.8,50.8,9.5,48,5,44,1,41,-1.8,39.2,-4.7,39.5,-8,40.5,-10.5,40.5,-14.5,35,-17.5,35.2,-20,34.9,-24,32.8,-26.5,32.5,-28.5,30,-31.5,27,-33.5,22,-34.2,18.4,-34.2,18,-32,16.5,-28.6,15,-26.5,14.5,-22.5,11.8,-17.2,13.8,-12.5,12.3,-6,9.5,-1,9.5,3.8,7,4.3,4.5,6.2,1.5,6,-2,4.7,-4.5,5.2,-7.5,4.4,-11,6.6,-13.2,9.2,-15.5,11.5,-16.8,13.5,-17.5,14.8,-16.5,19,-16,21,-13.2,27.5,-10,29.5,-9.8,31.5,-6.8,34],
      [49.3,-12,50.4,-15.5,47.2,-25,45.2,-25.6,43.8,-22,44.4,-16.2,47.5,-14.5],
      [-168,65.5,-161,64.5,-165,62.5,-166,60.5,-162,58.5,-158,58.5,-160,56.5,-165,54.5,-156,57,-153,59,-149.5,60.5,-146,60.8,-140,59.8,-135,57.5,-131.5,54.8,-127,51,-124.5,48.3,-124,44,-124.2,40.3,-122.5,37.5,-120.6,34.5,-117,32.5,-114.5,28,-110,23,-109.5,25.5,-112.5,29.5,-109.5,31,-108.5,28,-106,23.2,-105.4,20.5,-103.5,18.5,-100,16.8,-96.5,15.7,-94,16.2,-92,14.5,-90,13.8,-87.5,13,-85.7,11.2,-84.5,9.9,-83.2,8.3,-80,7.3,-77.5,8.5,-79.5,9.5,-82.5,9.2,-83.5,11,-83.4,14.5,-87.5,15.8,-88.8,15.9,-88.2,18.2,-87.2,21.5,-90.4,21,-90.5,19.3,-94.5,18.2,-97.2,20.5,-97.8,23.5,-97.2,26,-97.3,27.8,-95,29,-90,29.2,-89,30.2,-85.5,29.7,-83,29,-82.7,27.5,-81.2,25.2,-80,26.8,-81.2,31,-77,34.5,-75.5,35.2,-76,37,-74.1,39.6,-72,41,-70,41.7,-70.7,43,-67,44.8,-65,43.5,-66,45.2,-61,45.5,-60,46.2,-64.5,48,-69,48.2,-66.5,50.2,-60,50.2,-56,52,-55.7,53.4,-60,55.3,-61,57.5,-64.5,60,-65,60.5,-72,62,-78,62.3,-75,64.5,-86,66.5,-90,68.5,-95,71.5,-107,68.2,-115,68,-125,69.5,-132,69.5,-140,69.6,-149,70.4,-156.5,71.3,-161,70.3,-166,68.8,-163,67],
      [-62,66.5,-66,69,-72,71.5,-78,72.5,-85,70.2,-80,68.5,-75,67.6,-73,64.7,-67,62.7,-62,65.4],
      [-72,78,-60,82,-35,83.5,-20,81.5,-18,77,-20,72,-23,70.5,-31,68,-40,65,-43,60,-48,61,-52,64.5,-54,68.5,-58,75,-68,76.5],
      [-24,65.5,-22,66.4,-15,66.2,-13.5,65,-18,63.4,-22.5,63.8],
      [-77.5,8.5,-75,10.8,-72,12,-71,11,-68,10.5,-64,10.5,-61,10.5,-60,8.5,-57,6,-52.5,5,-50,1.5,-50,0,-44.5,-2.5,-39,-3.5,-35,-5.5,-34.8,-8,-37,-12,-39,-17.5,-41,-22,-45,-23.5,-48.5,-26,-48.5,-28.5,-52,-32,-54,-34.5,-57,-35,-57,-37.5,-62,-39,-65,-41,-64.5,-43,-67.5,-46,-66,-48,-69,-51,-68.5,-52.5,-72,-53.5,-74.5,-51,-75.5,-47,-73.5,-41,-73.5,-37,-71.5,-31,-70.5,-24,-70.3,-18.5,-76,-14,-78,-10,-81.2,-6,-80,-3,-81,-1,-79.8,1.5,-78.5,2.5,-77.3,4,-77.5,6.5],
      [113.5,-22,114,-26,115,-34,118,-35,123,-34,129,-31.6,135,-34.8,138,-35,138.5,-34,140,-37.8,145,-38.5,150,-37.5,153,-31,153.5,-26,150,-22.5,146,-19,145.5,-15,143,-11,142,-13,141.5,-17.5,139,-17,135.5,-15,136.8,-12.2,132,-11.5,130,-13,127.5,-14,125,-15,122,-18,118,-20.5,114.5,-21.8],
      [-5.7,50.1,1.4,51.2,1.7,52.8,-0.1,53.7,-2,55.7,-1.7,57.5,-3.2,58.6,-5,58.6,-6,56.7,-5.2,55.3,-3.2,54.8,-3.1,53.3,-4.5,52.8,-5.3,51.7,-3,51.2,-4.7,50.4],
      [-6,52.2,-6.2,54.5,-8,55.2,-10,54,-10,52,-8.5,51.6],
      [95.3,5.6,98,4,100.5,2,103.5,-1,106,-3.2,105.8,-5.8,104.5,-5.9,101,-3,98.7,0.5,96,3],
      [109,2,111,1.5,113.5,3.5,117,7,119,5,117.5,1,116,-3.5,114,-4,111,-3,110,-1.5],
      [105.2,-6.8,108,-6.5,111,-6.5,114.5,-7.8,114.5,-8.5,108,-7.8,105.5,-7],
      [131,-0.8,135,-3.3,138,-1.8,145,-4.7,148,-6,150.5,-10.5,146,-8.5,143.5,-9.2,141,-9.1,138,-8.3,137.5,-5,133,-4,132.5,-2.5],
      [79.8,9.5,81.8,7.5,81,6,80,6,79.8,7.8],
      [121.5,25.3,122,24.5,120.8,21.9,120,23.5],
      [120.5,18.5,122.2,18.5,122,16.4,124,13,121.5,13.5,120.5,15],
      [122,8,125,9.8,126.6,7.2,125.5,5.8,123.5,7.5],
      [130.8,33.9,133,35.3,136,36,137,37.4,139.5,38.8,140.5,41,141.7,40.2,141.5,38,140.9,35.7,138,34.7,135.2,33.7,133,34,131,33.9],
      [140,41.5,141.5,45.4,145.5,43.3,143,42,141,42.5],
      [129.7,33.3,131.5,34,131.5,31.2,130.2,31.2]
    ],
    water: [
      [47,45,51,47,53,45,51,41,54,37,50,37,49,40,47.5,43],
      [-93,58.7,-94,60.4,-91,62.4,-86,64,-82,63.5,-80,63,-77.5,62,-77.5,60,-78.5,58,-78.8,55,-79.5,52,-82,52.8,-86,55.2,-91,56.8]
    ],
    bd: [88.08,24.5,88.35,25.25,88.1,26,88.45,26.5,89.05,26.25,89.85,25.95,89.85,25.3,90.75,25.15,91.55,25.15,92.2,24.9,92.45,24.15,91.95,23.55,91.65,23,92.05,21.7,92.35,20.7,91.85,22.2,91.2,22.4,90.55,22.55,90.3,21.85,89.5,21.75,89,21.85,89.1,22.35,88.75,22.6,88.95,23.2,88.6,23.9]
  };
  var DHAKA = [90.41, 23.81];
  var CAPTION = { en: 'Dhaka, Bangladesh', ar: 'دكا، بنغلاديش', zh: '孟加拉国 · 达卡', es: 'Dacca, Bangladés' }[L];
  var SKIPTXT = { en: 'Skip', ar: 'تخطّي', zh: '跳过', es: 'Saltar' }[L];

  function rgba(c, a) {
    var m = /^#?([0-9a-f]{6})$/i.exec((c || '').trim());
    if (!m) m = /^#?([0-9a-f]{6})$/i.exec('7ff0dc');
    var n = parseInt(m[1], 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function intro(after) {
    var skipIntro = false;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) skipIntro = true;
    try { if (sessionStorage.getItem('dd-intro')) skipIntro = true; else sessionStorage.setItem('dd-intro', '1'); } catch (e) {}
    if (skipIntro || !document.body) { if (after) after(); return; }
    var accent = (getComputedStyle(root).getPropertyValue('--gold-bright') || '').trim() || '#7ff0dc';
    var wrap = document.createElement('div');
    wrap.className = 'dd-globe-intro'; wrap.setAttribute('aria-hidden', 'true');
    var size = Math.min(window.innerWidth * 0.78, window.innerHeight * 0.52, 380);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    wrap.innerHTML = '<canvas class="dd-globe-cv" width="' + Math.round(size * dpr) + '" height="' + Math.round(size * dpr) + '" style="width:' + size + 'px;height:' + size + 'px"></canvas>' +
      '<div class="dd-globe-cap"><span class="dd-globe-brand">Domain Decoded</span><span class="dd-globe-place">' + CAPTION + '</span></div>' +
      '<button type="button" class="dd-globe-skip" tabindex="-1">' + SKIPTXT + '</button>';
    document.body.appendChild(wrap);
    var cv = wrap.querySelector('canvas'), ctx = cv.getContext('2d');
    ctx.scale(dpr, dpr);
    var C = size / 2, R0 = size * 0.42;
    var done = false, start = null;

    function proj(lon, lat, lon0, lat0) {
      var l = (lon - lon0) * Math.PI / 180, p = lat * Math.PI / 180, p0 = lat0 * Math.PI / 180;
      return {
        x: Math.cos(p) * Math.sin(l),
        y: Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l),
        z: Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l)
      };
    }
    function path(poly, lon0, lat0, R) {
      ctx.beginPath();
      var n = poly.length / 2, first = true;
      for (var i = 0; i < n; i++) {
        var a = [poly[2 * i], poly[2 * i + 1]], b = [poly[2 * ((i + 1) % n)], poly[2 * ((i + 1) % n) + 1]];
        var steps = Math.max(1, Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) / 4));
        for (var s = 0; s < steps; s++) {
          var t = s / steps, q = proj(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, lon0, lat0);
          var x = q.x, y = q.y;
          if (q.z < 0) { var h = Math.hypot(x, y) || 1; x /= h; y /= h; }
          var px = C + x * R, py = C - y * R;
          if (first) { ctx.moveTo(px, py); first = false; } else ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
    }
    function frame(ts) {
      if (done) return;
      if (start === null) start = ts;
      var t = (ts - start) / 1000;
      var se = ease(Math.min(t / 3.3, 1));
      var lon0 = -105 + (90.4 + 105) * se;
      var lat0 = 6 + (22 - 6) * se;
      var zoom = 1 + 1.55 * easeOut(Math.min(Math.max((t - 2.6) / 1.5, 0), 1));
      var hl = Math.min(Math.max((t - 3.2) / 0.9, 0), 1);
      var R = R0 * zoom;
      wrap.style.opacity = t < 0.45 ? t / 0.45 : (t > 5.0 ? Math.max(0, 1 - (t - 5.0) / 0.55) : 1);
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.beginPath(); ctx.arc(C, C, R0, 0, 6.2832); ctx.clip();
      var g = ctx.createRadialGradient(C - R0 * 0.35, C - R0 * 0.4, R0 * 0.1, C, C, R0 * 1.05);
      g.addColorStop(0, '#1b2a5a'); g.addColorStop(1, '#070b1f');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 1;
      for (var lo = -180; lo < 180; lo += 30) {
        ctx.beginPath(); var f1 = true;
        for (var la = -80; la <= 80; la += 5) { var q = proj(lo, la, lon0, lat0); if (q.z <= 0) { f1 = true; continue; } var X = C + q.x * R, Y = C - q.y * R; if (f1) { ctx.moveTo(X, Y); f1 = false; } else ctx.lineTo(X, Y); }
        ctx.stroke();
      }
      for (var la2 = -60; la2 <= 60; la2 += 30) {
        ctx.beginPath(); var f2 = true;
        for (var lo2 = -180; lo2 <= 180; lo2 += 5) { var q2 = proj(lo2, la2, lon0, lat0); if (q2.z <= 0) { f2 = true; continue; } var X2 = C + q2.x * R, Y2 = C - q2.y * R; if (f2) { ctx.moveTo(X2, Y2); f2 = false; } else ctx.lineTo(X2, Y2); }
        ctx.stroke();
      }
      ctx.fillStyle = rgba(accent, 0.46); ctx.strokeStyle = rgba(accent, 0.9); ctx.lineWidth = 1;
      for (var i = 0; i < GEO.land.length; i++) { path(GEO.land[i], lon0, lat0, R); ctx.fill(); ctx.stroke(); }
      ctx.fillStyle = '#0a1030';
      for (var j = 0; j < GEO.water.length; j++) { path(GEO.water[j], lon0, lat0, R); ctx.fill(); }
      if (hl > 0) {
        path(GEO.bd, lon0, lat0, R);
        ctx.fillStyle = rgba('#ffffff', 0.9 * hl); ctx.fill();
        ctx.strokeStyle = rgba(accent, hl); ctx.lineWidth = 2; ctx.stroke();
        var d = proj(DHAKA[0], DHAKA[1], lon0, lat0), dx = C + d.x * R, dy = C - d.y * R;
        var pulse = ((t - 3.2) % 1.2) / 1.2;
        ctx.beginPath(); ctx.arc(dx, dy, 6 + pulse * 26, 0, 6.2832);
        ctx.strokeStyle = rgba(accent, (1 - pulse) * 0.9 * hl); ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(dx, dy, 3.2, 0, 6.2832); ctx.fillStyle = '#ff4d5e'; ctx.fill();
      }
      ctx.restore();
      var sh = ctx.createRadialGradient(C, C, R0 * 0.7, C, C, R0 * 1.02);
      sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(C, C, R0, 0, 6.2832); ctx.fill();
      ctx.beginPath(); ctx.arc(C, C, R0, 0, 6.2832); ctx.strokeStyle = rgba(accent, 0.55); ctx.lineWidth = 2; ctx.stroke();
      wrap.querySelector('.dd-globe-cap').style.opacity = Math.min(Math.max((t - 0.5) / 0.6, 0), 1);
      wrap.querySelector('.dd-globe-place').style.opacity = hl;
      if (t >= 5.55) { finish(); return; }
      requestAnimationFrame(frame);
    }
    function finish() { if (done) return; done = true; if (wrap.parentNode) wrap.parentNode.removeChild(wrap); if (after) after(); }
    wrap.addEventListener('click', finish);
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { finish(); document.removeEventListener('keydown', esc); } });
    requestAnimationFrame(frame);
  }

  /* ---------- ambient motion on every page: twinkling stars, drifting birds, a rare shooting star ---------- */
  function ambient() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!document.body || document.querySelector('.dd-ambient')) return;
    var box = document.createElement('div'); box.className = 'dd-ambient'; box.setAttribute('aria-hidden', 'true');
    var h = '', i;
    for (i = 0; i < 22; i++) {
      var sz = 1 + Math.random() * 2;
      h += '<i class="dd-amb-star" style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 100).toFixed(1) + '%;width:' + sz.toFixed(1) + 'px;height:' + sz.toFixed(1) + 'px;--d:' + (3.5 + Math.random() * 5).toFixed(1) + 's;--w:-' + (Math.random() * 6).toFixed(1) + 's"></i>';
    }
    var bird = '<svg viewBox="0 0 48 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path class="wl" d="M24 14C19 4 10 3 3 8"/><path class="wr" d="M24 14C29 4 38 3 45 8"/></svg>';
    h += '<div class="dd-bird" style="top:14%;--fd:48s;--fw:-6s">' + bird + '</div>';
    h += '<div class="dd-bird" style="top:46%;--fd:63s;--fw:-31s;width:34px">' + bird + '</div>';
    h += '<div class="dd-bird" style="top:72%;--fd:55s;--fw:-18s;width:40px">' + bird + '</div>';
    h += '<div class="dd-shoot"></div>';
    box.innerHTML = h;
    document.body.appendChild(box);
  }

  function boot() {
    var c = get();
    if (c === 'granted') loadGA();
    var links = document.querySelectorAll('[data-cookie-settings]');
    for (var i = 0; i < links.length; i++) links[i].addEventListener('click', function (e) { e.preventDefault(); showBar(); });
    wireSwitcher();
    ambient();
    // the cookie notice waits until the opening globe has finished
    intro(function () { if (c !== 'granted' && c !== 'denied') showBar(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
