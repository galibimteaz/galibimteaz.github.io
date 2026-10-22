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

  /* ---------- opening motion: a star races toward a galaxy ---------- */
  function intro() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try { if (sessionStorage.getItem('dd-intro')) return; sessionStorage.setItem('dd-intro', '1'); } catch (e) {}
    if (!document.body || !Element.prototype.animate) return;
    var W = window.innerWidth, H = window.innerHeight, rtl = root.getAttribute('dir') === 'rtl';
    var c = (getComputedStyle(root).getPropertyValue('--gold-bright') || '').trim() || '#f0d78c';
    var wrap = document.createElement('div');
    wrap.className = 'dd-intro'; wrap.setAttribute('aria-hidden', 'true'); wrap.style.setProperty('--dd-c', c);
    var h = '';
    for (var i = 0; i < 28; i++) {
      var sz = 1 + Math.random() * 2.2;
      h += '<i class="dd-st" style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 100).toFixed(1) + '%;width:' + sz.toFixed(1) + 'px;height:' + sz.toFixed(1) + 'px;animation-delay:' + (Math.random() * 1.4).toFixed(2) + 's"></i>';
    }
    var gx = W * (rtl ? 0.17 : 0.83), gy = Math.max(110, H * 0.22);
    h += '<div class="dd-galaxy" style="left:' + gx + 'px;top:' + gy + 'px"><svg viewBox="0 0 120 120" fill="none" stroke-linecap="round">' +
         '<defs><radialGradient id="ddg"><stop offset="0" stop-color="#fff"/><stop offset=".22" stop-color="' + c + '" stop-opacity=".95"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></radialGradient></defs>' +
         '<circle cx="60" cy="60" r="58" fill="url(#ddg)" opacity=".6"/>' +
         '<g stroke="' + c + '" stroke-width="2.4" opacity=".95"><path d="M60 60c10-24 40-24 48 2"/><path d="M60 60c-10 24-40 24-48-2"/><path d="M60 60c-24-10-24-40 2-48"/><path d="M60 60c24 10 24 40-2 48"/></g>' +
         '<g stroke="#fff" stroke-width="1.4" opacity=".7"><path d="M60 60c6-14 24-14 30 0"/><path d="M60 60c-6 14-24 14-30 0"/></g></svg></div>';
    h += '<div class="dd-comet"><div class="tail"></div><div class="head"></div></div>';
    wrap.innerHTML = h;
    document.body.appendChild(wrap);

    var x0 = rtl ? W + 80 : -80, y0 = H * 0.9;
    var ang = Math.atan2(gy - y0, gx - x0) * 180 / Math.PI;
    var comet = wrap.querySelector('.dd-comet'), gal = wrap.querySelector('.dd-galaxy');
    comet.animate([
      { transform: 'translate(' + x0 + 'px,' + y0 + 'px) rotate(' + ang + 'deg)', opacity: 0 },
      { transform: 'translate(' + (x0 + (gx - x0) * 0.15) + 'px,' + (y0 + (gy - y0) * 0.15) + 'px) rotate(' + ang + 'deg)', opacity: 1, offset: 0.15 },
      { transform: 'translate(' + gx + 'px,' + gy + 'px) rotate(' + ang + 'deg) scaleX(.35)', opacity: 1, offset: 0.92 },
      { transform: 'translate(' + gx + 'px,' + gy + 'px) rotate(' + ang + 'deg) scaleX(.1)', opacity: 0 }
    ], { duration: 1500, easing: 'cubic-bezier(.45,0,.85,.5)', fill: 'forwards' });
    gal.animate([
      { opacity: 0, transform: 'scale(.2)' },
      { opacity: 0, transform: 'scale(.3)', offset: 0.42 },
      { opacity: 1, transform: 'scale(1.08)', offset: 0.62 },
      { opacity: 1, transform: 'scale(1)', offset: 0.82 },
      { opacity: 0, transform: 'scale(1.25)' }
    ], { duration: 3300, easing: 'ease-out', fill: 'forwards' });
    setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 3500);
  }

  function boot() {
    var c = get();
    if (c === 'granted') loadGA();
    else if (c !== 'denied') showBar();
    var links = document.querySelectorAll('[data-cookie-settings]');
    for (var i = 0; i < links.length; i++) links[i].addEventListener('click', function (e) { e.preventDefault(); showBar(); });
    wireSwitcher();
    intro();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
