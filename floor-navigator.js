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

  function go(u) {
    try { window.top.location.href = u; } catch (e) { window.location.href = u; }
  }

  function setup(cfg) {
    var cur  = cfg.getAttribute('data-floor') || 'G';
    var base = (cfg.getAttribute('data-base') || '').replace(/\/$/, '') + '/';
    var home = cfg.getAttribute('data-home') || '';

    var old = document.getElementById('fn-root');
    if (old) old.remove();

    var root = document.createElement('div');
    root.id = 'fn-root';

    var s = root.style;
    s.setProperty('position',       'fixed',               'important');
    s.setProperty('top',            '50%',                 'important');
    s.setProperty('left',           '0',                   'important');
    s.setProperty('transform',      'translateY(-50%)',    'important');
    s.setProperty('display',        'flex',                'important');
    s.setProperty('flex-direction', 'column',              'important');
    s.setProperty('align-items',    'center',              'important');
    s.setProperty('gap',            '5px',                 'important');
    s.setProperty('padding',        '10px 6px',            'important');
    s.setProperty('z-index',        '2147483647',          'important');
    s.setProperty('pointer-events', 'auto',                'important');

    function makeBtn(label, active) {
      var b = document.createElement('button');
      b.textContent = label;
      var bs = b.style;
      bs.setProperty('display',          'flex',                        'important');
      bs.setProperty('align-items',      'center',                      'important');
      bs.setProperty('justify-content',  'center',                      'important');
      bs.setProperty('width',            '42px',                        'important');
      bs.setProperty('height',           '38px',                        'important');
      bs.setProperty('background',       active ? '#2b6ccf' : 'rgba(42,36,28,0.88)', 'important');
      bs.setProperty('color',            active ? '#fff' : '#e8e0d4',  'important');
      bs.setProperty('border',           'none',                        'important');
      bs.setProperty('border-radius',    '5px',                         'important');
      bs.setProperty('font-size',        '12px',                        'important');
      bs.setProperty('font-weight',      '700',                         'important');
      bs.setProperty('font-family',      'sans-serif',                  'important');
      bs.setProperty('cursor',           active ? 'default' : 'pointer','important');
      bs.setProperty('box-sizing',       'border-box',                  'important');
      bs.setProperty('margin',           '0',                           'important');
      bs.setProperty('padding',          '0',                           'important');
      return b;
    }

    FLOORS.forEach(function (f) {
      var btn = makeBtn(f.l, f.l === cur);
      if (f.l !== cur) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          go(base + f.p);
        });
      }
      root.appendChild(btn);
    });

    var sep = document.createElement('div');
    sep.style.setProperty('width',      '28px',                    'important');
    sep.style.setProperty('height',     '1px',                     'important');
    sep.style.setProperty('background', 'rgba(255,255,255,0.2)',   'important');
    sep.style.setProperty('margin',     '2px 0',                   'important');
    root.appendChild(sep);

    var hb = makeBtn('\u2302', false);
    hb.style.setProperty('font-size', '20px', 'important');
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
