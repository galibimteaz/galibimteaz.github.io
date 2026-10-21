/*! Domain Decoded - Halloween theme toggle.
   One self-contained file: injects its own CSS, button and decorations.
   Add  <script src="halloween.js"></script>  inside <head> of every page. */
(function () {
  var KEY = 'dd-theme', CLS = 'halloween', root = document.documentElement;
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function put(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  // apply saved theme immediately (before first paint) so pages don't flash
  if (get() === CLS) root.classList.add(CLS);

  var css = [
  /* ---------- theme variables + page colours ---------- */
  'html.halloween{--bg:#0d0612;--bg-raised:#170b1f;--bg-card:#1c1026;--line:rgba(255,122,0,.26);--line-strong:rgba(255,122,0,.52);--gold:#ff7a00;--gold-bright:#ffa94d;--cream:#f4eaf9;--cream-dim:#b9a8c9;--green-ok:#9be564;--green-accent:#9be564;--teal-accent:#7df3d0;--purple-accent:#c58bff;--coral-accent:#ff6b4a;--red-x:#ff5a4a;color-scheme:dark}',
  'html.halloween body{color:var(--cream);background:radial-gradient(circle 150px at 90% 150px,rgba(255,226,170,.20),rgba(255,226,170,.06) 62%,transparent 64%) fixed,radial-gradient(ellipse 900px 500px at 85% -10%,rgba(255,122,0,.16),transparent 60%),radial-gradient(ellipse 700px 500px at 0% 25%,rgba(139,60,200,.18),transparent 60%),repeating-linear-gradient(45deg,rgba(255,160,80,.03) 0 1px,transparent 1px 28px),repeating-linear-gradient(-45deg,rgba(190,120,255,.025) 0 1px,transparent 1px 28px),#0d0612}',
  'html.halloween ::selection{background:#ff7a00;color:#1a0a00}',
  'html.halloween .topbar{background:rgba(26,10,36,.92);border-bottom-color:rgba(255,122,0,.5)}',
  'html.halloween .site-nav a{background:rgba(13,6,18,.6);border-color:rgba(255,122,0,.45)}',
  'html.halloween .site-nav a:nth-child(1){color:#ffa94d}html.halloween .site-nav a:nth-child(2){color:#c58bff}html.halloween .site-nav a:nth-child(3){color:#9be564}html.halloween .site-nav a:nth-child(4){color:#ff9a3c}html.halloween .site-nav a:nth-child(5){color:#ff7d63}html.halloween .site-nav a:nth-child(6){color:#f0c8ff}',
  'html.halloween .site-nav a:hover,html.halloween .site-nav a.active{background:rgba(255,122,0,.18);border-color:#ff7a00}',
  'html.halloween .brand-link,html.halloween .brand-link .accent,html.halloween .footer-brand,html.halloween .footer-brand .accent{color:#9be564;text-shadow:0 0 14px rgba(155,229,100,.35)}',
  'html.halloween h1,html.halloween h2{text-shadow:0 0 24px rgba(255,122,0,.30)}',
  'html.halloween .btn.primary,html.halloween .submit-btn{background:linear-gradient(135deg,#ffb347,#ff7a00);color:#1a0a00}',
  'html.halloween .cta-box,html.halloween .quote-block,html.halloween .gw-note{background:rgba(255,122,0,.07)}',
  'html.halloween .site-footer,html.halloween footer.wrap{background:linear-gradient(180deg,rgba(70,22,92,.45),rgba(20,8,28,.96));border-top-color:rgba(255,122,0,.55)}',
  'html.halloween .sec-green{--gold:#8b3fd1;--gold-bright:#c58bff;--line:rgba(160,90,230,.28);--line-strong:rgba(160,90,230,.55)}',
  'html.halloween .sec-green .cta-box{background:rgba(160,90,230,.08)}',
  'html.halloween .svc-card.g{border-color:rgba(197,139,255,.55);background:rgba(197,139,255,.08)}html.halloween .svc-card.g .k,html.halloween .svc-card.g .go{color:#c58bff}html.halloween .svc-card.g:hover{background:rgba(197,139,255,.15)}',
  'html.halloween .faq-group.g-green{color:#c58bff}',
  'html.halloween .step-result.approved,html.halloween .screen-results li b{color:#9be564}',
  'html.halloween .whatsapp-fab{box-shadow:0 8px 24px rgba(255,122,0,.35)}',
  'html.hw-fade *{transition:background-color .7s ease,color .7s ease,border-color .7s ease,box-shadow .7s ease!important}',

  /* ---------- toggle button ---------- */
  '.hw-toggle{position:fixed;top:82px;right:14px;z-index:300;width:50px;height:50px;padding:0;border-radius:50%;border:2px solid rgba(255,138,0,.85);background:linear-gradient(145deg,#2a1608,#120a04);cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(0,0,0,.45);transition:transform .15s ease}',
  '.hw-toggle:hover{transform:scale(1.08)}.hw-toggle:focus-visible{outline:3px solid #ffa94d;outline-offset:3px}',
  '.hw-toggle svg{width:30px;height:30px;display:block}',
  '.hw-toggle .i-sun{display:none}html.halloween .hw-toggle .i-sun{display:block}html.halloween .hw-toggle .i-pk{display:none}',
  'html.halloween .hw-toggle{background:linear-gradient(145deg,#fff3d6,#ffd28a);border-color:#ffd9a0}',
  '.hw-toggle:not(.on){animation:hw-pulse 2.6s ease-out infinite}',
  '@keyframes hw-pulse{0%{box-shadow:0 6px 20px rgba(0,0,0,.45),0 0 0 0 rgba(255,138,0,.55)}70%,100%{box-shadow:0 6px 20px rgba(0,0,0,.45),0 0 0 16px rgba(255,138,0,0)}}',
  'body:has(.site-nav.open) .hw-toggle{display:none}',
  '.hw-toast{position:fixed;top:80px;left:50%;z-index:310;max-width:90vw;transform:translate(-50%,-16px);opacity:0;pointer-events:none;background:#1c1026;color:#f4eaf9;border:1px solid rgba(255,138,0,.7);border-radius:999px;padding:10px 20px;font:500 13.5px/1.4 Jost,system-ui,sans-serif;text-align:center;white-space:nowrap;box-shadow:0 10px 30px rgba(0,0,0,.5);transition:opacity .3s ease,transform .3s ease}',
  '.hw-toast.show{opacity:1;transform:translate(-50%,0)}',
  '.hw-flash{position:fixed;inset:0;z-index:400;pointer-events:none;opacity:0;background:radial-gradient(circle at 92% 8%,rgba(255,138,0,.6),transparent 62%)}',
  '.hw-flash.go{animation:hw-flash .9s ease-out}@keyframes hw-flash{0%{opacity:1}100%{opacity:0}}',

  /* ---------- decorations (only visible in Halloween mode) ---------- */
  '.hw-deco{display:none;position:fixed;inset:0;z-index:210;pointer-events:none;overflow:hidden}html.halloween .hw-deco{display:block}',
  '.hw-spider{position:absolute;top:0;transform-origin:top center;animation:hw-swing 4.6s ease-in-out infinite}',
  '.hw-spider .th{width:1.5px;margin:0 auto;background:rgba(240,230,255,.55);height:var(--len)}.hw-spider svg{width:30px;display:block;margin:-3px auto 0}',
  '@keyframes hw-swing{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}',
  '.hw-bat{position:absolute;left:-80px;width:54px;opacity:.75;animation:hw-fly var(--d) linear infinite;animation-delay:var(--delay)}',
  '.hw-bat svg{width:100%;display:block;animation:hw-flap .32s ease-in-out infinite alternate}',
  '@keyframes hw-fly{0%{transform:translate(0,0)}25%{transform:translate(28vw,-34px)}50%{transform:translate(58vw,22px)}75%{transform:translate(88vw,-26px)}100%{transform:translate(120vw,10px)}}',
  '@keyframes hw-flap{from{transform:scaleY(1)}to{transform:scaleY(.5)}}',
  '.hw-web{position:absolute;left:0;top:66px;width:130px;opacity:.5}',
  '.hw-corner-pk{position:absolute;left:10px;bottom:8px;width:84px}',
  '.hw-pk .face{animation:hw-flicker 3.2s ease-in-out infinite}',
  '@keyframes hw-flicker{0%,100%{opacity:1}45%{opacity:.82}50%{opacity:.6}55%{opacity:.9}}',
  '.hw-row{display:none;position:absolute;left:0;right:0;top:-40px;justify-content:space-around;align-items:flex-end;pointer-events:none;z-index:2;padding:0 12px}',
  'html.halloween .hw-row{display:flex}html.halloween footer{position:relative}',
  '.hw-row svg{width:62px;height:auto;filter:drop-shadow(0 0 12px rgba(255,122,0,.45))}.hw-row svg:nth-child(2n){width:46px}.hw-row svg:nth-child(3){width:74px}',
  '@media(max-width:900px){.hw-corner-pk{display:none}}',
  '@media(max-width:640px){.hw-toggle{top:76px;right:10px;width:46px;height:46px}.hw-spider.s1{left:58%!important}.hw-spider.s2{left:74%!important}.hw-web{width:90px}.hw-row svg{width:50px}.hw-row svg:nth-child(3){width:58px}.hw-row svg:nth-child(n+5){display:none}}',
  '@media(prefers-reduced-motion:reduce){.hw-spider,.hw-bat svg,.hw-toggle,.hw-pk .face{animation:none!important}.hw-bat{display:none}.hw-flash{display:none}}'
  ].join('\n');

  var st = document.createElement('style');
  st.id = 'hw-style'; st.textContent = css;
  (document.head || root).appendChild(st);

  /* ---------- artwork ---------- */
  var PUMPKIN = '<svg class="hw-pk" viewBox="0 0 100 88" aria-hidden="true">' +
    '<path d="M47 24c0-9 4-14 12-17l3 6c-5 2-8 6-8 11z" fill="#4a8a2c"/>' +
    '<ellipse cx="25" cy="55" rx="21" ry="30" fill="#d85f00"/><ellipse cx="75" cy="55" rx="21" ry="30" fill="#d85f00"/>' +
    '<ellipse cx="38" cy="55" rx="21" ry="32" fill="#ff7a00"/><ellipse cx="62" cy="55" rx="21" ry="32" fill="#ff7a00"/>' +
    '<ellipse cx="50" cy="55" rx="17" ry="33" fill="#ff8f22"/>' +
    '<g class="face" fill="#ffe27a"><path d="M30 52l8-13 8 13z"/><path d="M70 52l-8-13-8 13z"/>' +
    '<path d="M27 63l9 8 6-7 8 9 8-9 6 7 9-8q-23 20-46 0z"/></g></svg>';
  var BAT = '<svg viewBox="0 0 64 32" aria-hidden="true"><path d="M32 13c-3-7-8-10-15-10 2 3 2 6 1 9-4-1-9 0-14 5 5 0 8 2 10 5 2-2 4-3 6-2 3 0 5 3 6 8 1-5 3-8 6-8 2-1 4 0 6 2 2-3 5-5 10-5-5-5-10-6-14-5-1-3-1-6 1-9-7 0-12 3-15 10z" fill="#3a1f55" stroke="rgba(255,138,0,.6)" stroke-width="1"/></svg>';
  var SPIDER = '<svg viewBox="0 0 40 40" aria-hidden="true"><g stroke="#2a1440" stroke-width="2" fill="none" stroke-linecap="round"><path d="M13 20l-9-7M12 24l-10 2M13 28l-8 8M15 31l-3 8M27 20l9-7M28 24l10 2M27 28l8 8M25 31l3 8"/></g><ellipse cx="20" cy="25" rx="9" ry="9" fill="#2a1440" stroke="#ff7a00" stroke-width="1"/><circle cx="20" cy="15" r="5" fill="#2a1440" stroke="#ff7a00" stroke-width="1"/><circle cx="18" cy="14" r="1.3" fill="#ff3b30"/><circle cx="22" cy="14" r="1.3" fill="#ff3b30"/></svg>';
  var WEB = '<svg viewBox="0 0 120 120" aria-hidden="true" fill="none" stroke="#e9dcff" stroke-width="1"><path d="M0 0L118 24M0 0L96 70M0 0L58 108M0 0L20 118"/><path d="M0 28Q26 30 42 5M0 54Q40 56 68 8M0 82Q56 80 92 14M0 110Q72 104 112 22"/></svg>';
  var PK_ICON = '<svg class="i-pk" viewBox="0 0 100 88" aria-hidden="true"><path d="M47 24c0-9 4-14 12-17l3 6c-5 2-8 6-8 11z" fill="#4a8a2c"/><ellipse cx="25" cy="55" rx="21" ry="30" fill="#d85f00"/><ellipse cx="75" cy="55" rx="21" ry="30" fill="#d85f00"/><ellipse cx="38" cy="55" rx="21" ry="32" fill="#ff7a00"/><ellipse cx="62" cy="55" rx="21" ry="32" fill="#ff7a00"/><ellipse cx="50" cy="55" rx="17" ry="33" fill="#ff8f22"/><g fill="#2a0f00"><path d="M30 52l8-13 8 13z"/><path d="M70 52l-8-13-8 13z"/><path d="M27 63l9 8 6-7 8 9 8-9 6 7 9-8q-23 20-46 0z"/></g></svg>';
  var SUN_ICON = '<svg class="i-sun" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="6" fill="#c9a227"/><g stroke="#c9a227" stroke-width="2.4" stroke-linecap="round"><path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M25.2 6.8l-2.8 2.8M9.6 22.4l-2.8 2.8"/></g></svg>';

  function init() {
    if (document.getElementById('hw-toggle')) return;
    var deco = document.createElement('div');
    deco.className = 'hw-deco'; deco.setAttribute('aria-hidden', 'true');
    deco.innerHTML =
      '<div class="hw-web">' + WEB + '</div>' +
      '<div class="hw-spider s1" style="left:22%;--len:74px"><div class="th"></div>' + SPIDER + '</div>' +
      '<div class="hw-spider s2" style="left:31%;--len:98px;animation-delay:-2s"><div class="th"></div>' + SPIDER + '</div>' +
      '<div class="hw-bat" style="top:16%;--d:19s;--delay:0s">' + BAT + '</div>' +
      '<div class="hw-bat" style="top:38%;--d:26s;--delay:-9s;width:42px">' + BAT + '</div>' +
      '<div class="hw-bat" style="top:62%;--d:22s;--delay:-15s;width:48px">' + BAT + '</div>' +
      '<div class="hw-corner-pk">' + PUMPKIN + '</div>';
    document.body.appendChild(deco);

    var ft = document.querySelector('footer');
    if (ft) {
      var row = document.createElement('div');
      row.className = 'hw-row'; row.setAttribute('aria-hidden', 'true');
      row.innerHTML = PUMPKIN + PUMPKIN + PUMPKIN + PUMPKIN + PUMPKIN + PUMPKIN;
      ft.insertBefore(row, ft.firstChild);
    }

    var btn = document.createElement('button');
    btn.id = 'hw-toggle'; btn.className = 'hw-toggle'; btn.type = 'button';
    btn.innerHTML = PK_ICON + SUN_ICON;
    var toast = document.createElement('div'); toast.className = 'hw-toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
    var flash = document.createElement('div'); flash.className = 'hw-flash';
    document.body.appendChild(btn); document.body.appendChild(toast); document.body.appendChild(flash);

    var tt;
    function say(msg) { toast.textContent = msg; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('show'); }, 2800); }
    function sync() {
      var on = root.classList.contains(CLS);
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      var label = on ? 'Switch back to the classic theme' : 'Switch to the Halloween theme';
      btn.setAttribute('aria-label', label); btn.title = label;
    }
    sync();
    btn.addEventListener('click', function () {
      var on = !root.classList.contains(CLS);
      root.classList.add('hw-fade');
      setTimeout(function () { root.classList.remove('hw-fade'); }, 900);
      root.classList.toggle(CLS, on);
      put(on ? CLS : 'classic');
      sync();
      flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
      say(on ? 'Happy Halloween! \uD83C\uDF83' : 'Classic theme is back');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
