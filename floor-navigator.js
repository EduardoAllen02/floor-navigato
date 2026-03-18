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

    /* Crear dialog — se renderiza en top layer, escapa cualquier transform */
    var dlg = document.createElement('dialog');
    dlg.id = 'floorNavDialog';

    /* Nav dentro del dialog */
    var nav = document.createElement('div');
    nav.id = 'floorNavUI';

      btn.className = isActive ? 'fn-btn fn-active' : 'fn-btn';
      btn.textContent = f.label;
      if (!isActive) {
        btn.onclick = function(e) { e.preventDefault(); go(baseUrl + f.path + '/'); };
      }
      nav.appendChild(btn);
    });

    sep.className = 'fn-sep';
    nav.appendChild(sep);

    var homeBtn = document.createElement('button');
    homeBtn.className = 'fn-home';
    homeBtn.innerHTML = '&#8962;';
    homeBtn.onclick = function(e) { e.preventDefault(); go(homeUrl); };
    nav.appendChild(homeBtn);

    dlg.appendChild(nav);

    /* Label */
    var lbl = document.createElement('div');
    lbl.id = 'floorNavLabel';
    lbl.textContent = 'Blue ' + current;
    dlg.appendChild(lbl);

    document.body.appendChild(dlg);

    /* showModal() → top layer, por encima de todo */
    dlg.showModal();

    /* Evitar que Esc cierre el dialog */
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
