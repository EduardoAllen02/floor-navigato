(function () {
  'use strict';

  var FLOORS = [
    { label: '6F', path: 'sap6' },
    { label: '5F', path: 'sap5' },
    { label: '4F', path: 'sap4' },
    { label: '3F', path: 'sap3' },
    { label: '2F', path: 'sap2' },
    { label: '1F', path: 'sap1' },
    { label: 'G',  path: 'sap0' }
  ];

  function navigate(url) {
    try { window.top.location.href = url; } catch (e) { window.location.href = url; }
  }

  function init() {
    var cfg = document.getElementById('fn-cfg');
    if (!cfg) return;

    var currentFloor = cfg.getAttribute('data-floor') || 'G';
    var base         = cfg.getAttribute('data-base')  || '';
    var homeUrl      = cfg.getAttribute('data-home')  || '';

    // Remove any previous instance
    var old = document.getElementById('fn-dialog');
    if (old) { try { old.close(); } catch(e) {} old.remove(); }

    /* ── Build nav ── */
    var nav = document.createElement('nav');
    nav.id = 'fn-nav';

    FLOORS.forEach(function (floor) {
      var btn = document.createElement('button');
      btn.className = 'fn-btn' + (floor.label === currentFloor ? ' fn-active' : '');
      btn.textContent = floor.label;
      btn.title = 'Piso ' + floor.label;

      if (floor.label !== currentFloor) {
        btn.addEventListener('click', function () {
          navigate(base + floor.path);
        });
      }
      nav.appendChild(btn);
    });

    var sep = document.createElement('div');
    sep.className = 'fn-sep';
    nav.appendChild(sep);

    var homeBtn = document.createElement('button');
    homeBtn.className = 'fn-home';
    homeBtn.innerHTML = '&#8962;';
    homeBtn.title = 'Inicio';
    homeBtn.addEventListener('click', function () { navigate(homeUrl); });
    nav.appendChild(homeBtn);

    /* ── Wrap in <dialog> → top layer, escapes any CSS transform ── */
    var dialog = document.createElement('dialog');
    dialog.id = 'fn-dialog';
    dialog.appendChild(nav);
    document.body.appendChild(dialog);
    dialog.showModal();

    // Backdrop click → do nothing (no close)
    dialog.addEventListener('cancel', function (e) { e.preventDefault(); });
    dialog.addEventListener('click',  function (e) { e.stopPropagation(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
