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
  var C = {
    normal:      { bg: '#89D1FF', color: '#fff' },
    active:      { bg: '#fff',    color: '#89D1FF' },
    hover:       { bg: '#fff',    color: '#89D1FF' }
  };

  function go(u) {
    try { window.top.location.href = u; } catch (e) { window.location.href = u; }
  }

  function applyBaseBtn(b, active) {
    var bs = b.style;
    bs.setProperty('display',         'flex',                         'important');
    bs.setProperty('align-items',     'center',                       'important');
    bs.setProperty('justify-content', 'center',                       'important');
    bs.setProperty('width',           '42px',                         'important');
    bs.setProperty('height',          '38px',                         'important');
    bs.setProperty('border',          'none',                         'important');
    bs.setProperty('border-radius',   '5px',                          'important');
    bs.setProperty('font-size',       '12px',                         'important');
    bs.setProperty('font-weight',     '700',                          'important');
    bs.setProperty('font-family',     'sans-serif',                   'important');
    bs.setProperty('box-sizing',      'border-box',                   'important');
    bs.setProperty('margin',          '0',                            'important');
    bs.setProperty('padding',         '0',                            'important');
    bs.setProperty('transition',      'background 0.18s, color 0.18s, transform 0.15s', 'important');
    bs.setProperty('cursor',          active ? 'default' : 'pointer', 'important');
    bs.setProperty('background',      active ? C.active.bg    : C.normal.bg,    'important');
    bs.setProperty('color',           active ? C.active.color : C.normal.color, 'important');
    bs.setProperty('transform',       'translateX(0)',                 'important');
  }

  function addHover(btn) {
    btn.addEventListener('mouseenter', function () {
      btn.style.setProperty('background', C.hover.bg,    'important');
      btn.style.setProperty('color',      C.hover.color, 'important');
      btn.style.setProperty('transform',  'translateX(4px)', 'important');
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.setProperty('background', C.normal.bg,    'important');
      btn.style.setProperty('color',      C.normal.color, 'important');
      btn.style.setProperty('transform',  'translateX(0)', 'important');
    });
  }

  function setup(cfg) {
    var cur  = cfg.getAttribute('data-floor') || 'G';
    var base = (cfg.getAttribute('data-base') || '').replace(/\/$/, '') + '/';
    var home = cfg.getAttribute('data-home') || '';

    var old = document.getElementById('fn-root');
    if (old) old.remove();

    var root = document.createElement('div');
    root.id = 'fn-root';
    var rs = root.style;
    rs.setProperty('position',       'fixed',            'important');
    rs.setProperty('top',            '50%',              'important');
    rs.setProperty('left',           '0',                'important');
    rs.setProperty('transform',      'translateY(-50%)', 'important');
    rs.setProperty('display',        'flex',             'important');
    rs.setProperty('flex-direction', 'column',           'important');
    rs.setProperty('align-items',    'center',           'important');
    rs.setProperty('gap',            '5px',              'important');
    rs.setProperty('padding',        '10px 6px',         'important');
    rs.setProperty('z-index',        '2147483647',       'important');
    rs.setProperty('pointer-events', 'auto',             'important');

    FLOORS.forEach(function (f) {
      var isActive = f.l === cur;
      var btn = document.createElement('button');
      btn.textContent = f.l;
      applyBaseBtn(btn, isActive);
      if (!isActive) {
        addHover(btn);
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          go(base + f.p);
        });
      }
      root.appendChild(btn);
    });

    var sep = document.createElement('div');
    sep.style.setProperty('width',      '28px',                  'important');
    sep.style.setProperty('height',     '1px',                   'important');
    sep.style.setProperty('background', 'rgba(255,255,255,0.4)', 'important');
    sep.style.setProperty('margin',     '2px 0',                 'important');
    root.appendChild(sep);

    var hb = document.createElement('button');
    hb.innerHTML = '\u2302';
    applyBaseBtn(hb, false);
    hb.style.setProperty('font-size', '20px', 'important');
    addHover(hb);
    hb.addEventListener('click', function (e) {
      e.stopPropagation();
      go(home);
    });
    root.appendChild(hb);

    var targetBody;
    try { targetBody = window.top.document.body; } catch (e) { targetBody = document.body; }
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
