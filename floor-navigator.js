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
    try { window.top.location.href = url; }
    catch (e) { window.location.href = url; }
  }

  function setup(cfg) {
    var currentFloor = cfg.getAttribute('data-floor') || 'G';
    var base         = (cfg.getAttribute('data-base')  || '').replace(/\/$/, '') + '/';
    var homeUrl      = cfg.getAttribute('data-home')  || '';

    /* Limpia instancias previas */
    ['fn-nav', 'fn-dialog'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { try { el.close(); } catch (e) {} el.remove(); }
    });

    /* ── Construye el nav ── */
    var nav = document.createElement('nav');
    nav.id = 'fn-nav';

    FLOORS.forEach(function (floor) {
      var btn = document.createElement('button');
      btn.className = 'fn-btn' + (floor.label === currentFloor ? ' fn-active' : '');
      btn.textContent = floor.label;
      btn.title = 'Piso ' + floor.label;
      if (floor.label !== currentFloor) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
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
    homeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      navigate(homeUrl);
    });
    nav.appendChild(homeBtn);

    /* ── Monta usando <dialog> si está disponible ── */
    if (window.HTMLDialogElement) {
      var dialog = document.createElement('dialog');
      dialog.id = 'fn-dialog';
      dialog.appendChild(nav);
      document.body.appendChild(dialog);
      try {
        dialog.showModal();
        dialog.addEventListener('cancel', function (e) { e.preventDefault(); });
      } catch (err) {
        dialog.setAttribute('open', '');
      }
    } else {
      document.body.appendChild(nav);
    }

    console.log('[FloorNav] montado en piso:', currentFloor);
  }

  function tryInit(attempts) {
    attempts = attempts || 0;
    var cfg = document.getElementById('fn-cfg');
    if (cfg) {
      setup(cfg);
      return;
    }
    if (attempts < 30) {
      setTimeout(function () { tryInit(attempts + 1); }, 200);
    } else {
      console.warn('[FloorNav] fn-cfg no encontrado tras 6s');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { tryInit(); });
  } else {
    tryInit();
  }
})();
