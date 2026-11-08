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

  /* The site now opens directly (no opening animation). */
  function intro(after) { if (after) after(); }

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
