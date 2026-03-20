!function () {

  /* ─── CONFIGURACIÓN ───────────────────────────────────── */
  var BASE             = 'https://TUDOMINIO.com/';
  var HOME_URL         = 'https://TU-LANDING.com/';
  var IMG_BASE         = 'https://eduardoallen02.github.io/floor-navigato/pngs/';
  var BRIGHTNESS_HOVER = 1.3;

  // Desktop: la barra de habitaciones va a la derecha → podemos empezar desde arriba
  var NAV_TOP_DESKTOP  = 2;   // % del viewport
  // Mobile: la barra de habitaciones se pone arriba → dejamos espacio
  var NAV_TOP_MOBILE   = 12;  // % del viewport
  // Bottom igual para ambos: antes del minimapa 3D
  var NAV_BOTTOM_VH    = 65;

  var LEFT_PX          = 8;
  var MOBILE_BREAKPOINT = 768; // px de ancho para considerar mobile
  /* ──────────────────────────────────────────────────────── */

  var FLOOR_NAMES = {
    'GF': 'Ground Floor',
    '1F': 'First Floor',
    '2F': 'Second Floor',
    '3F': 'Third Floor',
    '4F': 'Fourth Floor',
    '5F': 'Fifth Floor',
    '6F': 'Sixth Floor'
  };

  var FLOORS = [
    { l: '6F', p: 'sap6', img: '6F_Q.png' },
    { l: '5F', p: 'sap5', img: '5F_Q.png' },
    { l: '4F', p: 'sap4', img: '4F_Q.png' },
    { l: '3F', p: 'sap3', img: '3F_Q.png' },
    { l: '2F', p: 'sap2', img: '2F_Q.png' },
    { l: '1F', p: 'sap1', img: '1F_Q.png' },
    { l: 'GF', p: 'sap0', img: 'GF_Q.png' }
  ];

  // Items: 1 label + 1 home + 1 sep + 7 floors
  var LABEL_RATIO = 0.55; // altura del label relativa al botón
  var SEP_RATIO   = 0.05;
  var GAP_RATIO   = 0.1;
  var ITEM_COUNT  = FLOORS.length + 1; // home + 7 pisos

  function isMobile(winW) {
    return winW <= MOBILE_BREAKPOINT ||
           ('ontouchstart' in window && winW < 1024);
  }

  function getWin() {
    try {
      return { w: window.top.innerWidth, h: window.top.innerHeight };
    } catch(e) {
      return { w: window.innerWidth, h: window.innerHeight };
    }
  }

  function calcSizes(winH, topVH) {
    var availPx = winH * (NAV_BOTTOM_VH - topVH) / 100;
    // availPx = labelH + gap + ITEM_COUNT * size + (ITEM_COUNT - 1) * gap + sepH
    // labelH = LABEL_RATIO * size
    // gap    = GAP_RATIO * size
    // sepH   = SEP_RATIO * size
    // availPx = size * (LABEL_RATIO + GAP_RATIO + ITEM_COUNT + (ITEM_COUNT-1)*GAP_RATIO + SEP_RATIO)
    var divisor = LABEL_RATIO + GAP_RATIO + ITEM_COUNT + (ITEM_COUNT - 1) * GAP_RATIO + SEP_RATIO;
    var size    = Math.floor(availPx / divisor);
    var gap     = Math.round(size * GAP_RATIO);
    var sepH    = Math.round(size * SEP_RATIO);
    var labelH  = Math.round(size * LABEL_RATIO);
    size  = Math.max(22, Math.min(64, size));
    gap   = Math.max(2,  Math.min(10, gap));
    labelH = Math.max(14, Math.min(36, labelH));
    return { size: size, gap: gap, sepH: sepH, labelH: labelH };
  }

  function go(u) {
    try { window.top.location.href = u; } catch (e) { window.location.href = u; }
  }

  function injectStyles(doc, b) {
    var ex = doc.getElementById('fn-styles');
    if (ex) ex.remove();
    var s = doc.createElement('style');
    s.id  = 'fn-styles';
    s.textContent =
      '#fn-root img {' +
        'display:block!important;' +
        'border-radius:10px!important;' +
        'cursor:pointer!important;' +
        'transition:transform 0.18s ease, filter 0.18s ease!important;' +
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
        'filter:brightness('+b+')!important;' +
        'transform:scale(1)!important;' +
        'box-shadow:0 0 10px 0px rgba(27,145,255,0.55), 0 0 22px 8px rgba(27,145,255,0.25)!important;' +
        'border-radius:12px!important;' +
      '}';
    doc.head.appendChild(s);
  }

  function applySize(el, size) {
    el.style.setProperty('width',  size + 'px', 'important');
    el.style.setProperty('height', size + 'px', 'important');
  }

  function setup(cfg) {
    var cur = cfg.getAttribute('data-floor') || 'GF';
    var floorName = FLOOR_NAMES[cur] || cur;

    var targetDoc, targetBody;
    try { targetDoc = window.top.document; targetBody = window.top.document.body; }
    catch (e) { targetDoc = document; targetBody = document.body; }

    var old = targetBody.querySelector('#fn-root');
    if (old) old.remove();

    var win    = getWin();
    var mobile = isMobile(win.w);
    var topVH  = mobile ? NAV_TOP_MOBILE : NAV_TOP_DESKTOP;
    var sz     = calcSizes(win.h, topVH);

    injectStyles(targetDoc, BRIGHTNESS_HOVER);

    /* ── Contenedor raíz ── */
    var root = document.createElement('div');
    root.id  = 'fn-root';
    var rs   = root.style;
    rs.setProperty('position',       'fixed',           'important');
    rs.setProperty('top',            topVH + 'vh',      'important');
    rs.setProperty('left',           LEFT_PX + 'px',    'important');
    rs.setProperty('display',        'flex',            'important');
    rs.setProperty('flex-direction', 'column',          'important');
    rs.setProperty('align-items',    'flex-start',      'important');
    rs.setProperty('gap',            sz.gap + 'px',     'important');
    rs.setProperty('z-index',        '2147483647',      'important');
    rs.setProperty('pointer-events', 'auto',            'important');

    /* ── Label nombre del piso ── */
    var label = document.createElement('div');
    label.textContent = floorName;
    var ls = label.style;
    ls.setProperty('color',       '#ffffff',                        'important');
    ls.setProperty('font-weight', '700',                            'important');
    ls.setProperty('font-family', 'sans-serif',                     'important');
    ls.setProperty('font-size',   sz.labelH*0.7 + 'px',                 'important');
    ls.setProperty('line-height', '1',                              'important');
    ls.setProperty('white-space', 'nowrap',                         'important');
    ls.setProperty('text-shadow', '0 1px 4px rgba(0,0,0,0.7)',     'important');
    ls.setProperty('pointer-events', 'none',                        'important');
    ls.setProperty('padding-left', '4px',                           'important');
    root.appendChild(label);

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

    /* ── Separador ── */
    var sep = document.createElement('div');
    sep.style.setProperty('height',      sz.sepH + 'px', 'important');
    sep.style.setProperty('width',       '1px',          'important');
    sep.style.setProperty('flex-shrink', '0',            'important');
    root.appendChild(sep);

    /* ── Pisos ── */
    var allImgs = [homeImg];
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
    console.log('[FloorNav] OK | piso:', cur, '| mobile:', mobile, '| size:', sz.size + 'px');

    /* ── Resize ── */
    var resizeTimer;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var nw     = getWin();
        var nm     = isMobile(nw.w);
        var ntop   = nm ? NAV_TOP_MOBILE : NAV_TOP_DESKTOP;
        var ns     = calcSizes(nw.h, ntop);
        root.style.setProperty('top', ntop + 'vh', 'important');
        root.style.setProperty('gap', ns.gap + 'px', 'important');
        label.style.setProperty('font-size', ns.labelH + 'px', 'important');
        sep.style.setProperty('height', ns.sepH + 'px', 'important');
        allImgs.forEach(function (img) { applySize(img, ns.size); });
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
