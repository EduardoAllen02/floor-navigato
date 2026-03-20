!function () {

  /* ─── CONFIGURACIÓN ───────────────────────────────────── */
  var BASE             = 'https://TUDOMINIO.com/';
  var HOME_URL         = 'https://TU-LANDING.com/';
  var IMG_BASE         = 'https://eduardoallen02.github.io/floor-navigato/pngs/';
  var BRIGHTNESS_HOVER = 1.3;   // ← brillo al hover (1.0 = normal, 1.3 = 30% más brillante)
  var NAV_TOP_VH       = 8;     // ← desde donde empieza la nav (% del viewport)
  var NAV_BOTTOM_VH    = 58;    // ← hasta donde llega la nav (% del viewport, antes del minimapa)
  var LEFT_PX          = 8;     // ← distancia al borde izquierdo en px
  /* ──────────────────────────────────────────────────────── */

  var FLOORS = [
    { l: '6F', p: 'sap6', img: '6F_Q.png' },
    { l: '5F', p: 'sap5', img: '5F_Q.png' },
    { l: '4F', p: 'sap4', img: '4F_Q.png' },
    { l: '3F', p: 'sap3', img: '3F_Q.png' },
    { l: '2F', p: 'sap2', img: '2F_Q.png' },
    { l: '1F', p: 'sap1', img: '1F_Q.png' },
    { l: 'GF', p: 'sap0', img: 'GF_Q.png' }
  ];

  // 8 imgs + 1 separador pequeño
  var ITEM_COUNT    = FLOORS.length + 1; // 7 pisos + home
  var SEP_RATIO     = 0.2;  // el separador vale 0.4 "items" de altura
  var GAP_RATIO     = 0.15; // gap entre items = 15% del tamaño del botón

  function calcSizes(winH) {
    var availPx  = winH * (NAV_BOTTOM_VH - NAV_TOP_VH) / 100;
    // availPx = ITEM_COUNT * size + (ITEM_COUNT - 1) * gap + SEP_RATIO * size
    // gap = GAP_RATIO * size
    // availPx = size * (ITEM_COUNT + SEP_RATIO + (ITEM_COUNT - 1) * GAP_RATIO)
    var divisor  = ITEM_COUNT + SEP_RATIO + (ITEM_COUNT - 1) * GAP_RATIO;
    var size     = Math.floor(availPx / divisor);
    var gap      = Math.round(size * GAP_RATIO);
    var sepH     = Math.round(size * SEP_RATIO);
    // clamp: mínimo 28px, máximo 64px
    size = Math.max(28, Math.min(64, size));
    gap  = Math.max(3,  Math.min(10, gap));
    return { size: size, gap: gap, sepH: sepH };
  }

  function go(u) {
    try { window.top.location.href = u; } catch (e) { window.location.href = u; }
  }

  function injectStyles(doc, b) {
    var existing = doc.getElementById('fn-styles');
    if (existing) existing.remove();
    var s = doc.createElement('style');
    s.id = 'fn-styles';
    s.textContent =
      '#fn-root img {' +
        'display:block!important;' +
        'border-radius:10px!important;' +
        'cursor:pointer!important;' +
        'transition:transform 0.18s ease, filter 0.18s ease, background 0.18s ease!important;' +
        'transform:scale(1)!important;' +
        'filter:brightness(1)!important;' +
        'opacity:1!important;' +
        'user-select:none!important;' +
        '-webkit-user-drag:none!important;' +
        'box-sizing:border-box!important;' +
        'flex-shrink:0!important;' +
      '}' +
      '#fn-root img:hover {' +
        'transform:scale(1.05)!important;' +
        'filter:brightness('+b+')!important;' +
      '}' +
      '#fn-root img.fn-active {' +
        'cursor:default!important;' +
        'border-radius:10px!important;' +
        'background:#fff!important;' +
        'padding:3px!important;' +
        'filter:brightness('+b+')!important;' +
        'transform:scale(1)!important;' +
      '}';
    doc.head.appendChild(s);
  }

  function applySize(el, size) {
    el.style.setProperty('width',  size + 'px', 'important');
    el.style.setProperty('height', size + 'px', 'important');
  }

  var allImgs = [];
  var sepEl   = null;
  var rootEl  = null;

  function setup(cfg) {
    var cur = cfg.getAttribute('data-floor') || 'GF';

    var targetDoc, targetBody;
    try { targetDoc = window.top.document; targetBody = window.top.document.body; }
    catch (e) { targetDoc = document; targetBody = document.body; }

    var old = targetBody.querySelector('#fn-root');
    if (old) old.remove();
    allImgs = [];

    var winH = (function() {
      try { return window.top.innerHeight; } catch(e) { return window.innerHeight; }
    })();

    var sz = calcSizes(winH);

    injectStyles(targetDoc, BRIGHTNESS_HOVER);

    /* ── Contenedor raíz ── */
    var root = document.createElement('div');
    root.id  = 'fn-root';
    rootEl   = root;
    var rs   = root.style;
    rs.setProperty('position',       'fixed',                    'important');
    rs.setProperty('top',            NAV_TOP_VH + 'vh',          'important');
    rs.setProperty('left',           LEFT_PX + 'px',             'important');
    rs.setProperty('display',        'flex',                     'important');
    rs.setProperty('flex-direction', 'column',                   'important');
    rs.setProperty('align-items',    'center',                   'important');
    rs.setProperty('gap',            sz.gap + 'px',              'important');
    rs.setProperty('z-index',        '2147483647',               'important');
    rs.setProperty('pointer-events', 'auto',                     'important');

    /* ── Home ── */
    var homeImg = document.createElement('img');
    homeImg.src   = IMG_BASE + 'Home.png';
    homeImg.alt   = 'Home';
    homeImg.title = 'Inicio';
    applySize(homeImg, sz.size);
    homeImg.addEventListener('click', function (e) {
      e.stopPropagation();
      go(HOME_URL);
    });
    root.appendChild(homeImg);
    allImgs.push(homeImg);

    /* ── Separador ── */
    var sep = document.createElement('div');
    sep.style.setProperty('height',     sz.sepH + 'px',           'important');
    sep.style.setProperty('width',      '1px',                    'important');
    sep.style.setProperty('flex-shrink','0',                      'important');
    sepEl = sep;
    root.appendChild(sep);

    /* ── Pisos ── */
    FLOORS.forEach(function (f) {
      var isActive = f.l === cur;
      var img = document.createElement('img');
      img.src   = IMG_BASE + f.img;
      img.alt   = f.l;
      img.title = 'Piso ' + f.l;
      applySize(img, sz.size);
      if (isActive) img.classList.add('fn-active');
      if (!isActive) {
        img.addEventListener('click', function (e) {
          e.stopPropagation();
          go(BASE.replace(/\/$/, '') + '/' + f.p);
        });
      }
      root.appendChild(img);
      allImgs.push(img);
    });

    targetBody.appendChild(root);
    console.log('[FloorNav] OK | piso:', cur, '| btnSize:', sz.size + 'px');

    /* ── Resize: recalcula tamaños en tiempo real ── */
    var resizeTimer;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var h = (function() {
          try { return window.top.innerHeight; } catch(e) { return window.innerHeight; }
        })();
        var ns = calcSizes(h);
        root.style.setProperty('gap', ns.gap + 'px', 'important');
        sep.style.setProperty('height', ns.sepH + 'px', 'important');
        allImgs.forEach(function (img) { applySize(img, ns.size); });
        console.log('[FloorNav] resize | btnSize:', ns.size + 'px');
      }, 100);
    }
    try { window.top.addEventListener('resize', onResize); }
    catch (e) { window.addEventListener('resize', onResize); }
  }

  function init(n) {
    n = n || 0;
    var cfg = document.getElementById('fn-cfg');
    if (cfg) { setup(cfg); return; }
    if (n < 30) setTimeout(function () { init(n + 1); }, 200);
    else console.warn('[FloorNav] fn-cfg no hallado');
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', function () { init(); })
    : init();
}();
