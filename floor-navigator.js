/* floor-navigator.js v6 - usa dialog top layer */
(function() {

  function go(url) {
    try { window.top.location.href = url; } catch(e) {
      window.location.href = url;
    }
  }

  function build() {
    if (document.getElementById('floorNavDialog')) return;

    var cfg = document.getElementById('fn-cfg');
    if (!cfg) return;

    var current  = cfg.getAttribute('data-floor') || 'G';
    var baseUrl  = cfg.getAttribute('data-base')  || '';
    var homeUrl  = cfg.getAttribute('data-home')  || '#';

    var FLOORS = [
      { label: '6F', path: 'sap6' },
      { label: '5F', path: 'sap5' },
      { label: '4F', path: 'sap4' },
      { label: '3F', path: 'sap3' },
      { label: '2F', path: 'sap2' },
      { label: '1F', path: 'sap1' },
      { label: 'G',  path: 'sap0' }
    ];

    var dlg = document.createElement('dialog');
    dlg.id = 'floorNavDialog';

    var nav = document.createElement('div');
    nav.id = 'floorNavUI';

    FLOORS.forEach(function(floor) {
      var isActive = floor.label === current;
      var btn = document.createElement('button');
      btn.className = isActive ? 'fn-btn fn-active' : 'fn-btn';
      btn.textContent = floor.label;
      btn.title = 'Piso ' + floor.label;
      if (!isActive) {
        btn.onclick = function(e) { e.preventDefault(); go(baseUrl + floor.path + '/'); };
      }
      nav.appendChild(btn);
    });

    var sep = document.createElement('div');
    sep.className = 'fn-sep';
    nav.appendChild(sep);

    var home = document.createElement('button');
    home.className = 'fn-home';
    home.innerHTML = '&#8962;';
    home.title = 'Página principal';
    home.addEventListener('click', function(e) { e.preventDefault(); go(homeUrl); });
    nav.appendChild(home);

    dlg.appendChild(nav);

    var lbl = document.createElement('div');
    lbl.id = 'floorNavLabel';
    lbl.textContent = 'Blue ' + current;
    dlg.appendChild(lbl);

    document.body.appendChild(dlg);
    dlg.showModal();
    dlg.addEventListener('cancel', function(e) { e.preventDefault(); });
  }

  var tries = 0;
  function tryBuild() {
    if (document.getElementById('floorNavDialog')) return;
    build();
    if (++tries < 12) setTimeout(tryBuild, 500);
  }
  tryBuild();

  try {
    new MutationObserver(function() {
      if (!document.getElementById('floorNavDialog')) build();
    }).observe(document.body, { childList: true });
  } catch(e) {}

})();
