/* floor-navigator.js v9 */
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

    var current = cfg.getAttribute('data-floor') || 'G';
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

    /* Dialog para el nav lateral — escapa transforms del viewer */
    var dlg = document.createElement('dialog');
    dlg.id = 'floorNavDialog';

    var nav = document.createElement('div');
    nav.id = 'floorNavUI';

    FLOORS.forEach(function(f) {
      var isActive = f.label === current;
      var btn = document.createElement('button');
      btn.className = isActive ? 'fn-btn fn-active' : 'fn-btn';
      btn.textContent = f.label;
      if (!isActive) {
        btn.onclick = function(e) { e.preventDefault(); go(baseUrl + f.path + '/'); };
      }
      nav.appendChild(btn);
    });

    dlg.appendChild(nav);
    document.body.appendChild(dlg);
    dlg.show();

    /* Home — directo en body, fuera del dialog */
    var homeBtn = document.createElement('button');
    homeBtn.id = 'floorNavHome';
    homeBtn.className = 'fn-home';
    homeBtn.textContent = 'Home';
    homeBtn.onclick = function(e) { e.preventDefault(); go(homeUrl); };
    document.body.appendChild(homeBtn);
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
      if (!document.getElementById('floorNavDialog')) {
        /* Limpiar home huérfano si existe */
        var old = document.getElementById('floorNavHome');
        if (old) old.parentNode.removeChild(old);
        build();
      }
    }).observe(document.body, { childList: true });
  } catch(e) {}

})();
