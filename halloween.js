/* Domain Decoded: Halloween theme switcher
   - Load this in the <head> of every page (no defer), so a saved choice is applied
     before the page paints and there is no dark-to-white flash.
   - The orange "Halloween Theme" button is only built on the home page.
   - The choice is saved in the browser and follows visitors to every other page. */
(function () {
  'use strict';

  var KEY = 'dd-theme';          // saved value: 'halloween' or 'normal'
  var CLS = 'halloween';
  var root = document.documentElement;

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var isOn = read() === 'halloween';
  if (isOn) root.classList.add(CLS);   // runs before first paint

  /* ---------- artwork ---------- */
  function pumpkin(body, face) {
    return '<path d="M50 13 Q50 4 57 2" stroke="#3b7a1e" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="50" cy="45" rx="45" ry="33" fill="' + body + '" stroke="#b04600" stroke-width="2.2"/>' +
      '<path d="M50 12 C30 18 24 72 50 78" fill="none" stroke="#c75300" stroke-width="2.2"/>' +
      '<path d="M50 12 C70 18 76 72 50 78" fill="none" stroke="#c75300" stroke-width="2.2"/>' +
      '<polygon points="27,35 41,35 34,49" fill="' + face + '" stroke="#2a1200" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<polygon points="59,35 73,35 66,49" fill="' + face + '" stroke="#2a1200" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<polygon points="46,51 54,51 50,58" fill="' + face + '" stroke="#2a1200" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M27 59 L36 69 L43 62 L50 70 L57 62 L64 69 L73 59 Q50 75 27 59Z" fill="' + face + '" stroke="#2a1200" stroke-width="1.6" stroke-linejoin="round"/>';
  }

  var OBJ = {
    pumpkin: { w: 100, h: 80, tx: 12, body: pumpkin('#ff7a00', '#ffe14d') },
    ghost: {
      w: 100, h: 120, tx: 8,
      body: '<path d="M15 118 V52 C15 20 32 7 50 7 C68 7 85 20 85 52 V118 L74 106 L62 118 L50 106 L38 118 L26 106Z" fill="#ffffff" stroke="#7d7d7d" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<ellipse cx="38" cy="48" rx="6" ry="9" fill="#222"/><ellipse cx="62" cy="48" rx="6" ry="9" fill="#222"/>' +
        '<ellipse cx="50" cy="73" rx="8" ry="11" fill="#222"/>' +
        '<circle cx="28" cy="62" r="6" fill="rgba(255,122,0,.35)"/><circle cx="72" cy="62" r="6" fill="rgba(255,122,0,.35)"/>'
    },
    spider: {
      w: 100, h: 84, tx: 26,
      body: '<g fill="none" stroke="#111" stroke-width="3.2" stroke-linecap="round">' +
        '<path d="M38 46 Q20 30 8 44"/><path d="M36 52 Q16 46 6 60"/><path d="M37 58 Q20 62 12 76"/><path d="M41 63 Q32 72 28 82"/>' +
        '<path d="M62 46 Q80 30 92 44"/><path d="M64 52 Q84 46 94 60"/><path d="M63 58 Q80 62 88 76"/><path d="M59 63 Q68 72 72 82"/></g>' +
        '<circle cx="50" cy="54" r="16" fill="#111"/><circle cx="50" cy="34" r="10" fill="#111"/>' +
        '<ellipse cx="50" cy="56" rx="5" ry="8" fill="#ff7a00"/>' +
        '<circle cx="46" cy="32" r="2.8" fill="#fff"/><circle cx="54" cy="32" r="2.8" fill="#fff"/>' +
        '<circle cx="46" cy="32" r="1.1" fill="#d00"/><circle cx="54" cy="32" r="1.1" fill="#d00"/>'
    },
    tomb: {
      w: 70, h: 92, tx: 0,
      body: '<path d="M8 90 V36 C8 14 24 5 35 5 C46 5 62 14 62 36 V90Z" fill="#d4d4d4" stroke="#6b6b6b" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<text x="35" y="42" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="17" fill="#555">RIP</text>' +
        '<path d="M22 56 L30 62 L26 70 L34 76" fill="none" stroke="#8a8a8a" stroke-width="1.6" stroke-linecap="round"/>' +
        '<path d="M0 92 Q6 80 10 92Z M58 92 Q64 78 70 92Z M12 92 Q16 82 20 92Z" fill="#3b8a3e"/>'
    },
    candy: {
      w: 60, h: 70, tx: 0,
      body: '<g stroke="#b04600" stroke-width="1.6" stroke-linejoin="round">' +
        '<polygon points="30,4 37.7,24 22.3,24" fill="#ffffff"/>' +
        '<polygon points="22.3,24 37.7,24 45.5,44 14.5,44" fill="#ff8a1f"/>' +
        '<polygon points="14.5,44 45.5,44 54,66 6,66" fill="#ffd23f"/></g>'
    }
  };

  function svg(type, thread) {
    var o = OBJ[type], t = thread || 0, h = o.h + t;
    return '<svg viewBox="0 0 ' + o.w + ' ' + h + '" aria-hidden="true" focusable="false">' +
      (t ? '<line x1="' + (o.w / 2) + '" y1="0" x2="' + (o.w / 2) + '" y2="' + (t + o.tx) + '" stroke="#222" stroke-width="1.8"/>' : '') +
      '<g transform="translate(0,' + t + ')">' + o.body + '</g></svg>';
  }

  function web() {
    var a = [0, 22.5, 45, 67.5, 90], s = '<svg viewBox="0 0 150 150" aria-hidden="true" focusable="false"><g fill="none" stroke="#666" stroke-width="1.1">';
    a.forEach(function (d) {
      var r = d * Math.PI / 180;
      s += '<path d="M0 0L' + (150 * Math.cos(r)).toFixed(1) + ' ' + (150 * Math.sin(r)).toFixed(1) + '"/>';
    });
    [38, 72, 106, 140].forEach(function (R) {
      var p = '';
      for (var i = 0; i < 4; i++) {
        var a1 = a[i] * Math.PI / 180, a2 = a[i + 1] * Math.PI / 180, m = (a1 + a2) / 2;
        if (!i) p += 'M' + (R * Math.cos(a1)).toFixed(1) + ' ' + (R * Math.sin(a1)).toFixed(1);
        p += 'Q' + (R * .86 * Math.cos(m)).toFixed(1) + ' ' + (R * .86 * Math.sin(m)).toFixed(1) + ' ' +
          (R * Math.cos(a2)).toFixed(1) + ' ' + (R * Math.sin(a2)).toFixed(1);
      }
      s += '<path d="' + p + '"/>';
    });
    return s + '</g></svg>';
  }

  var BAT = '<svg viewBox="0 0 60 30" aria-hidden="true" focusable="false"><path fill="#171717" d="M30 8C26 8 25 4 23 3C23 7 21 9 18 9C14 5 8 4 0 8C4 10 6 14 6 18C10 14 14 15 17 19C20 16 26 17 30 24C34 17 40 16 43 19C46 15 50 14 54 18C54 14 56 10 60 8C52 4 46 5 42 9C39 9 37 7 37 3C35 4 34 8 30 8Z"/></svg>';

  /* ---------- decoration layout ---------- */
  // l / r = distance from left / right edge, w = width in px, T = thread length, d = sway seconds
  var HANG = [
    { t: 'pumpkin', l: '2.5%', w: 64, T: 40, c: 'hw-sway', d: 4.6 },
    { t: 'ghost',   l: '8%',   w: 50, T: 70, c: 'hw-sway', d: 5.4, hide: 'hw-hide-xs' },
    { t: 'spider',  l: '27%',  w: 34, T: 60, c: 'hw-drop',          hide: 'hw-hide-sm' },
    { t: 'pumpkin', l: '47%',  w: 44, T: 28, c: 'hw-sway', d: 3.9, hide: 'hw-hide-sm' },
    { t: 'ghost',   l: '68%',  w: 44, T: 54, c: 'hw-sway', d: 5.0, hide: 'hw-hide-sm' },
    { t: 'spider',  l: '83%',  w: 32, T: 84, c: 'hw-drop',          hide: 'hw-hide-sm' },
    { t: 'pumpkin', r: '2.5%', w: 70, T: 52, c: 'hw-sway', d: 5.1 }
  ];
  var GROUND = [
    { t: 'pumpkin', l: '3%',  w: 70 },
    { t: 'tomb',    l: '16%', w: 50, hide: 'hw-hide-xs' },
    { t: 'candy',   l: '31%', w: 32, hide: 'hw-hide-sm' },
    { t: 'ghost',   l: '47%', w: 54, hide: 'hw-hide-sm' },
    { t: 'tomb',    l: '64%', w: 46, hide: 'hw-hide-sm' },
    { t: 'candy',   l: '78%', w: 30, hide: 'hw-hide-sm' },
    { t: 'pumpkin', r: '3%',  w: 82 }
  ];
  var BATS = [
    { top: '16%', dy: '40px',  t: '30s', delay: '3s',  w: 44 },
    { top: '44%', dy: '-30px', t: '38s', delay: '14s', w: 36 },
    { top: '70%', dy: '50px',  t: '34s', delay: '22s', w: 40 }
  ];

  var hang, ground, bats, resizeBound = false;

  function item(cfg, thread) {
    var el = document.createElement('div');
    el.className = 'hw-item ' + (cfg.c || '') + ' ' + (cfg.hide || '');
    el.style.cssText = (cfg.l ? 'left:' + cfg.l + ';' : 'right:' + cfg.r + ';') + '--w:' + cfg.w + 'px;' + (cfg.d ? '--d:' + cfg.d + 's;' : '');
    el.innerHTML = svg(cfg.t, thread ? cfg.T : 0);
    return el;
  }

  function placeHang() {
    if (!hang) return;
    var bar = document.querySelector('.topbar');
    hang.style.setProperty('--hw-top', (bar ? bar.offsetHeight : 0) + 'px');
  }

  function addDecor() {
    if (hang || !document.body) return;

    hang = document.createElement('div');
    hang.className = 'hw-hang';
    hang.setAttribute('aria-hidden', 'true');
    var g = document.createElement('div'); g.className = 'hw-garland'; hang.appendChild(g);
    var w = document.createElement('div'); w.className = 'hw-item hw-web'; w.innerHTML = web(); hang.appendChild(w);
    HANG.forEach(function (c) { hang.appendChild(item(c, true)); });
    document.body.insertBefore(hang, document.body.firstChild);
    placeHang();

    var foot = document.querySelector('footer.site-footer') || document.querySelector('footer');
    if (foot) {
      ground = document.createElement('div');
      ground.className = 'hw-ground';
      ground.setAttribute('aria-hidden', 'true');
      GROUND.forEach(function (c) {
        var el = item(c, false);
        if (c.t === 'pumpkin') el.className += ' hw-glow';
        ground.appendChild(el);
      });
      foot.appendChild(ground);
    }

    bats = document.createElement('div');
    bats.className = 'hw-bats';
    bats.setAttribute('aria-hidden', 'true');
    BATS.forEach(function (b) {
      var el = document.createElement('div');
      el.className = 'hw-bat';
      el.style.cssText = 'top:' + b.top + ';width:' + b.w + 'px;--dy:' + b.dy + ';--t:' + b.t + ';--delay:' + b.delay + ';';
      el.innerHTML = BAT;
      bats.appendChild(el);
    });
    document.body.appendChild(bats);

    if (!resizeBound) {
      resizeBound = true;
      window.addEventListener('resize', placeHang);
      window.addEventListener('load', placeHang);
    }
  }

  function removeDecor() {
    [hang, ground, bats].forEach(function (n) { if (n && n.parentNode) n.parentNode.removeChild(n); });
    hang = ground = bats = null;
  }

  /* ---------- the button (home page only) ---------- */
  var btn, label;

  function isHome() {
    var last = location.pathname.replace(/\/+$/, '').split('/').pop();
    return last === '' || last === 'index.html' || last === 'index';
  }

  function paintButton() {
    if (!btn) return;
    label.textContent = isOn ? 'Normal Theme' : 'Halloween Theme';
    btn.setAttribute('aria-pressed', isOn ? 'true' : 'false');
    btn.setAttribute('aria-label', isOn ? 'Switch back to the normal theme' : 'Switch to the Halloween theme');
  }

  function buildButton() {
    var bar = document.querySelector('.topbar .wrap');
    if (!bar || btn) return;
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hw-toggle';
    btn.innerHTML = '<svg viewBox="0 0 100 80" aria-hidden="true" focusable="false">' + pumpkin('#ffffff', '#f06a00') + '</svg><span class="hw-label"></span>';
    label = btn.querySelector('.hw-label');
    var navToggle = document.getElementById('navToggle');
    bar.insertBefore(btn, navToggle || null);
    root.classList.add('hw-has-toggle');
    paintButton();
    btn.addEventListener('click', function () { apply(!isOn, true); });
  }

  /* ---------- switching ---------- */
  function apply(on, persist) {
    isOn = on;
    root.classList.toggle(CLS, on);
    if (persist) save(on ? 'halloween' : 'normal');
    if (on) addDecor(); else removeDecor();
    paintButton();
  }

  function init() {
    if (isHome()) buildButton();
    if (isOn) addDecor();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // keep two open tabs in step with each other
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) apply(e.newValue === 'halloween', false);
  });
})();
