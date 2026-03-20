!function () {

  /* ─── CONFIGURACIÓN ───────────────────────────────────── */
  var BASE      = 'https://TUDOMINIO.com/';          // ← URL base de los tours
  var HOME_URL  = 'https://TU-LANDING.com/';         // ← URL del landing
  var IMG_BASE  = 'https://eduardoallen02.github.io/floor-navigato/pngs/'; // ← GitHub Pages
  var TOP_POS   = '45%';   // ← posición vertical: 50% = centro exacto
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

  function go(u) {
    try { window.top.location.href = u; } catch (e) { window.location.href = u; }
  }

  function injectStyles(doc) {
    if (doc.getElementById('fn-styles')) return;
    var s = doc.createElement('style');
    s.id = 'fn-styles';
    s.textContent =
      '#fn-root img {' +
        'display:block!important;' +
        'width:52px!important;' +
        'height:52px!important;' +
        'border-radius:12px!important;' +
        'cursor:pointer!important;' +
        'transition:transform 0.18s ease, filter 0.18s ease!important;' +
        'transform:scale(1)!important;' +
        'filter:brightness(1)!important;' +
        'opacity:1!important;' +
        'user-select:none!important;' +
        '-webkit-user-drag:none!important;' +
      '}' +
      '#fn-root img:hover {' +
        'transform:scale(1.05)!important;' +
        'filter:brightness(1.1)!important;' +
      '}' +
      '#fn-root img.fn-active {' +
        'cursor:default!important;' +
        'box-shadow:0 0 0 2.5px #1B91FF!important;' +
      '}';
    doc.head.appendChild(s);
  }

  function setup(cfg) {
    var cur = cfg.getAttribute('data-floor') || 'GF';

    var targetDoc, targetBody;
    try { targetDoc = window.top.document; targetBody = window.top.document.body; }
    catch (e) { targetDoc = document; targetBody = document.body; }

    var old = targetBody.querySelector('#fn-root');
    if (old) old.remove();

    injectStyles(targetDoc);

    /* ── Contenedor raíz ── */
    var root = document.createElement('div');
    root.id = 'fn-root';
    var rs = root.style;
    rs.setProperty('position',        'fixed',            'important');
    rs.setProperty('top',             TOP_POS,            'important');
    rs.setProperty('left',            '8px',              'important');
    rs.setProperty('transform',       'translateY(-50%)', 'important');
    rs.setProperty('display',         'flex',             'important');
    rs.setProperty('flex-direction',  'column',           'important');
    rs.setProperty('align-items',     'center',           'important');
    rs.setProperty('gap',             '6px',              'important');
    rs.setProperty('z-index',         '2147483647',       'important');
    rs.setProperty('pointer-events',  'auto',             'important');

    /* ── Home arriba ── */
    var homeImg = document.createElement('img');
    homeImg.src = IMG_BASE + 'Home.png';
    homeImg.alt = 'Home';
    homeImg.title = 'Inicio';
    homeImg.addEventListener('click', function (e) {
      e.stopPropagation();
      go(HOME_URL);
    });
    root.appendChild(homeImg);

    /* ── Separador con espacio ── */
    var sep = document.createElement('div');
    sep.style.setProperty('height', '14px', 'important');
    root.appendChild(sep);

    /* ── Botones de piso ── */
    FLOORS.forEach(function (f) {
      var isActive = f.l === cur;
      var img = document.createElement('img');
      img.src = IMG_BASE + f.img;
      img.alt = f.l;
      img.title = 'Piso ' + f.l;
      if (isActive) img.classList.add('fn-active');
      if (!isActive) {
        img.addEventListener('click', function (e) {
          e.stopPropagation();
          go(BASE.replace(/\/$/, '') + '/' + f.p);
        });
      }
      root.appendChild(img);
    });

    targetBody.appendChild(root);
    console.log('[FloorNav] OK piso:', cur);
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
