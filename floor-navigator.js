/* floor-navigator.js v5 */
(function() {

  function go(url) {
    /* El viewer puede correr dentro de un iframe — intentar navegar el top */
    try { window.top.location.href = url; return; } catch(e) {}
    try { window.parent.location.href = url; return; } catch(e) {}
    window.location.href = url;
  }

  function build() {
    /* Evitar duplicados */
    if (document.getElementById('floorNavUI')) return;

    /* Leer config del HTML del pin */
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

    /* Crear nav desde cero y meterlo en body — NO mover el del pin */
    var nav = document.createElement('div');
    nav.id = 'floorNavUI';

    FLOORS.forEach(function(f) {
      var isActive = f.label === current;
      var btn = document.createElement('button');
      btn.className = isActive ? 'fn-btn fn-active' : 'fn-btn';
      btn.textContent = f.label;
      if (!isActive) {
        btn.onclick = function() { go(baseUrl + f.path + '/'); };
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
    home.onclick = function() { go(homeUrl); };
    nav.appendChild(home);

    var lbl = document.createElement('div');
    lbl.id = 'floorNavLabel';
    lbl.textContent = 'Blue ' + current;

    /* Append al body del documento — fuera de cualquier popup del pin */
    document.body.appendChild(nav);
    document.body.appendChild(lbl);
  }

  /* Intentos progresivos — el fn-cfg puede no estar listo de inmediato */
  var attempts = 0;
  function tryBuild() {
    if (document.getElementById('floorNavUI')) return;
    build();
    attempts++;
    if (attempts < 10) setTimeout(tryBuild, 500);
