/* floor-navigator.js — hospedar en tu servidor */
(function() {

  var FLOORS = [
    { label: '6F', path: 'sap6' },
    { label: '5F', path: 'sap5' },
    { label: '4F', path: 'sap4' },
    { label: '3F', path: 'sap3' },
    { label: '2F', path: 'sap2' },
    { label: '1F', path: 'sap1' },
    { label: 'G',  path: 'sap0' }
  ];

  function inject() {
    if (document.getElementById('floorNavUI')) return;
    var cfg = document.getElementById('fn-cfg');
    if (!cfg) return;
    var current = cfg.getAttribute('data-floor') || 'G';
    var baseUrl = cfg.getAttribute('data-base')  || '';
    var homeUrl = cfg.getAttribute('data-home')  || '#';

    var nav = document.createElement('div');
    nav.id = 'floorNavUI';

    FLOORS.forEach(function(floor) {
      var isActive = floor.label === current;
      var btn = document.createElement('button');
      btn.className = isActive ? 'fn-btn fn-active' : 'fn-btn';
      btn.textContent = floor.label;
      btn.title = 'Piso ' + floor.label;
      if (!isActive) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          window.location.href = baseUrl + floor.path + '/';
        });
      }
      nav.appendChild(btn);
    });

    var sep = document.createElement('div');
    sep.className = 'fn-sep';
    nav.appendChild(sep);

    var home = document.createElement('button');
    home.className = 'fn-home';
    home.innerHTML = '&#8962;';
    home.title = 'Pagina principal';
    home.addEventListener('click', function(e) {
      e.stopPropagation();
      window.location.href = homeUrl;
    });
    nav.appendChild(home);

    var lbl = document.createElement('div');
    lbl.id = 'floorNavLabel';
    lbl.textContent = 'Blue ' + current;

    document.body.appendChild(nav);
    document.body.appendChild(lbl);
  }

  inject();
  setTimeout(inject, 800);
  setTimeout(inject, 2500);

  try {
    var mo = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].removedNodes.length > 0) {
          if (!document.getElementById('floorNavUI')) { inject(); break; }
        }
      }
    });
    mo.observe(document.body, { childList: true });
  } catch(e) {}

})();
