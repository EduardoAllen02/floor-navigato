/* floor-navigator.js - lee el HTML del pin y lo mueve al body */
(function() {

  function activate() {
    var nav = document.getElementById('floorNavUI');
    var cfg = document.getElementById('fn-cfg');
    if (!nav || !cfg) return;

    /* Si ya está en el body directo, no hacer nada */
    if (nav.parentNode === document.body && nav._fn_ready) return;

    var baseUrl = cfg.getAttribute('data-base') || '';
    var homeUrl = cfg.getAttribute('data-home') || '#';

    /* Mover el nav del contenedor del pin al body */
    document.body.appendChild(nav);
    nav._fn_ready = true;

    /* Mover también el label si existe */
    var lbl = document.getElementById('floorNavLabel');
    if (lbl) document.body.appendChild(lbl);

    /* Agregar listeners a cada botón de piso */
    var btns = nav.querySelectorAll('.fn-btn');
    for (var i = 0; i < btns.length; i++) {
      (function(btn) {
        if (btn.classList.contains('fn-active')) return;
        var path = btn.getAttribute('data-path');
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          window.location.href = baseUrl + path + '/';
        });
      })(btns[i]);
    }

    /* Listener botón home */
    var home = document.getElementById('fn-home');
    if (home) {
      home.addEventListener('click', function(e) {
        e.stopPropagation();
        window.location.href = homeUrl;
      });
    }

    /* MutationObserver: si React elimina el nav, volver a moverlo */
    try {
      var mo = new MutationObserver(function() {
        if (!document.getElementById('floorNavUI')) {
          nav._fn_ready = false;
          activate();
        }
      });
      mo.observe(document.body, { childList: true });
    } catch(e) {}
  }

  activate();
  setTimeout(activate, 500);
  setTimeout(activate, 1500);
  setTimeout(activate, 3000);

})();
