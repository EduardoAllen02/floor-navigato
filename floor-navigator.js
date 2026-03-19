!function () {
  var FLOORS = [
    { l: '6F', p: 'sap6' },
    { l: '5F', p: 'sap5' },
    { l: '4F', p: 'sap4' },
    { l: '3F', p: 'sap3' },
    { l: '2F', p: 'sap2' },
    { l: '1F', p: 'sap1' },
    { l: 'G',  p: 'sap0' }
  ];

  var BLUE = '#1B91FF';
  var C = {
    normal: { bg: BLUE,   color: '#fff'  },
    active: { bg: '#fff', color: BLUE    },
    hover:  { bg: '#fff', color: BLUE    }
  };

  var open = true; // empieza visible

  function go(u) {
    try { window.top.location.href = u; } catch (e) { window.location.href = u; }
  }

  function injectStyles(doc) {
    if (doc.getElementById('fn-styles')) return;
    var s = doc.createElement('style');
    s.id = 'fn-styles';
    s.textContent = [
      '@keyframes fnIn{',
        'from{transform:translateX(-56px) scale(0.85);opacity:0;}',
        'to  {transform:translateX(0)     scale(1);   opacity:1;}',
      '}',
      '@keyframes fnOut{',
        'from{transform:translateX(0)     scale(1);   opacity:1;}',
        'to  {transform:translateX(-56px) scale(0.85);opacity:0;}',
      '}',
      '@keyframes fnToggleOpen{',
        'from{transform:rotate(0deg)   scale(1);}',
        '50% {transform:rotate(180deg) scale(1.2);}',
        'to  {transform:rotate(360deg) scale(1);}',
      '}',
      '@keyframes fnToggleClose{',
        'from{transform:rotate(0deg)   scale(1);}',
        '50% {transform:rotate(-180deg) scale(1.2);}',
        'to  {transform:rotate(-360deg) scale(1);}',
      '}'
    ].join('');
    doc.head.appendChild(s);
  }

  function styleRoot(el) {
    var s = el.style;
    s.setProperty('position',       'fixed',            'important');
    s.setProperty('top',            '50%',              'important');
    s.setProperty('left',           '0',                'important');
    s.setProperty('transform',      'translateY(-50%)', 'important');
    s.setProperty('display',        'flex',             'important');
    s.setProperty('flex-direction', 'column',           'important');
    s.setProperty('align-items',    'center',           'important');
    s.setProperty('gap',            '5px',              'important');
    s.setProperty('padding',        '10px 6px',         'important');
    s.setProperty('z-index',        '2147483647',       'important');
    s.setProperty('pointer-events', 'auto',             'important');
  }

  function styleBtn(el, isActive, bigger) {
    var s = el.style;
    s.setProperty('display',         'flex',                         'important');
    s.setProperty('align-items',     'center',                       'important');
    s.setProperty('justify-content', 'center',                       'important');
    s.setProperty('width',           bigger ? '48px' : '42px',       'important');
    s.setProperty('height',          bigger ? '42px' : '38px',       'important');
    s.setProperty('background',      isActive ? C.active.bg    : C.normal.bg,    'important');
    s.setProperty('color',           isActive ? C.active.color : C.normal.color, 'important');
    s.setProperty('border',          isActive ? '2px solid '+BLUE : 'none',      'important');
    s.setProperty('border-radius',   '6px',                          'important');
    s.setProperty('font-size',       bigger ? '18px' : '12px',       'important');
    s.setProperty('font-weight',     '700',                          'important');
    s.setProperty('font-family',     'sans-serif',                   'important');
    s.setProperty('box-sizing',      'border-box',                   'important');
    s.setProperty('margin',          '0',                            'important');
    s.setProperty('padding',         '0',                            'important');
    s.setProperty('cursor',          isActive ? 'default' : 'pointer','important');
    s.setProperty('opacity',         '1',                            'important');
    s.setProperty('filter',          'none',                         'important');
    s.setProperty('transition',      'background 0.2s, color 0.2s, border 0.2s, transform 0.15s', 'important');
    s.setProperty('transform',       'translateX(0)',                 'important');
  }

  function addHover(btn, isBig) {
    btn.addEventListener('mouseenter', function () {
      btn.style.setProperty('background', C.hover.bg,       'important');
      btn.style.setProperty('color',      C.hover.color,    'important');
      btn.style.setProperty('transform',  'translateX(4px) scale(1.07)', 'important');
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.setProperty('background', C.normal.bg,      'important');
      btn.style.setProperty('color',      C.normal.color,   'important');
      btn.style.setProperty('transform',  'translateX(0) scale(1)',      'important');
    });
  }

  function makeSep() {
    var d = document.createElement('div');
    d.style.setProperty('width',      '30px',                  'important');
    d.style.setProperty('height',     '1px',                   'important');
    d.style.setProperty('background', 'rgba(255,255,255,0.35)','important');
    d.style.setProperty('margin',     '1px 0',                 'important');
    return d;
  }

  function animateFloors(floorEls, showing, cb) {
    var total = floorEls.length;
    var done  = 0;
    // mostrar: top→bottom; ocultar: bottom→top (efecto cascada inversa)
    var ordered = showing ? floorEls.slice() : floorEls.slice().reverse();

    ordered.forEach(function (el, i) {
      el.style.setProperty('animation', 'none', 'important');
      el.style.setProperty('pointer-events', 'none', 'important');

      setTimeout(function () {
        el.style.setProperty('display', 'flex', 'important');
        var anim = showing ? 'fnIn' : 'fnOut';
        el.style.setProperty('animation', anim+' 0.35s cubic-bezier(0.34,1.56,0.64,1) both', 'important');

        el.addEventListener('animationend', function handler() {
          el.removeEventListener('animationend', handler);
          if (!showing) el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('pointer-events', showing ? 'auto' : 'none', 'important');
          done++;
          if (done === total && cb) cb();
        });
      }, i * 55);
    });
  }

  function setup(cfg) {
    var cur  = cfg.getAttribute('data-floor') || 'G';
    var base = (cfg.getAttribute('data-base') || '').replace(/\/$/, '') + '/';
    var home = cfg.getAttribute('data-home') || '';

    var targetDoc, targetBody;
    try { targetDoc = window.top.document; targetBody = window.top.document.body; }
    catch (e) { targetDoc = document; targetBody = document.body; }

    var old = targetBody.querySelector('#fn-root');
    if (old) old.remove();

    injectStyles(targetDoc);

    var root = document.createElement('div');
    root.id = 'fn-root';
    styleRoot(root);

    /* ── Toggle button ── */
    var toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '&#9776;'; // hamburger ≡
    styleBtn(toggleBtn, false, true);
    toggleBtn.title = 'Mostrar/ocultar pisos';

    /* ── Separador tras toggle ── */
    var sepTop = makeSep();

    /* ── Floor buttons ── */
    var floorEls = [];
    FLOORS.forEach(function (f) {
      var isActive = f.l === cur;
      var btn = document.createElement('button');
      btn.textContent = f.l;
      styleBtn(btn, isActive, false);
      if (!isActive) {
        addHover(btn);
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          go(base + f.p);
        });
      }
      floorEls.push(btn);
      root.appendChild(btn);
    });

    /* ── Separador y home ── */
    var sepBot = makeSep();
    var homeBtn = document.createElement('button');
    homeBtn.innerHTML = '&#8962;';
    styleBtn(homeBtn, false, false);
    homeBtn.style.setProperty('font-size', '20px', 'important');
    addHover(homeBtn);
    homeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      go(home);
    });

    /* ── Ensamblar: toggle arriba, floors, sep, home ── */
    root.innerHTML = '';
    root.appendChild(toggleBtn);
    root.appendChild(sepTop);
    floorEls.forEach(function (el) { root.appendChild(el); });
    root.appendChild(sepBot);
    root.appendChild(homeBtn);

    /* ── Lógica toggle ── */
    var busy = false;
    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (busy) return;
      busy = true;
      open = !open;

      // Anima el icono del toggle
      var iconAnim = open ? 'fnToggleOpen' : 'fnToggleClose';
      toggleBtn.style.setProperty('animation', iconAnim+' 0.5s cubic-bezier(0.34,1.56,0.64,1) both', 'important');
      toggleBtn.innerHTML = open ? '&#9776;' : '&#9776;';

      // Anima pisos
      animateFloors(floorEls, open, function () {
        // Anima separadores
        [sepTop, sepBot].forEach(function(sep) {
          sep.style.setProperty('opacity', open ? '1' : '0', 'important');
          sep.style.setProperty('transition', 'opacity 0.3s', 'important');
        });
        busy = false;
      });
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
