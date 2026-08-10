/* ============================================================
   auth-guard.js
   Protezione client-side per pagine riservate del sito:
   materiali.html, classe.html, classe_sql.html, ecc.

   Inserire in ogni pagina riservata, prima di </head> oppure prima di </body>:
   <script src="auth-guard.js"></script>
   ============================================================ */
(function () {
  'use strict';

  var AUTH_DOMAIN = '@lscortese.com';
  var AUTH_MAX_AGE_MS = 8 * 60 * 60 * 1000; // sessione valida 8 ore
  var LOGIN_PAGE = 'index.html';

  function denyAccess() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var currentUrl = currentPage + window.location.search + window.location.hash;

    sessionStorage.setItem('authReturnTo', currentUrl);

    document.documentElement.innerHTML =
      '<head>' +
      '<meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
      '<title>Accesso riservato</title>' +
      '<style>' +
      'body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;' +
      'font-family:Inter,Arial,sans-serif;background:#f1f5f9;color:#0f172a;padding:24px}' +
      '.box{max-width:520px;background:#fff;border-radius:22px;padding:30px;box-shadow:0 20px 50px rgba(15,23,42,.15);text-align:center}' +
      'h1{font-size:1.7rem;margin:0 0 12px;color:#0b3b75}' +
      'p{line-height:1.55;color:#475569}' +
      'a{display:inline-block;margin-top:16px;background:#0b3b75;color:#fff;text-decoration:none;padding:12px 18px;border-radius:14px;font-weight:700}' +
      '</style>' +
      '</head>' +
      '<body><div class="box">' +
      '<h1>Area riservata</h1>' +
      '<p>Per accedere a questa pagina devi effettuare il login con un account istituzionale <strong>@lscortese.com</strong>.</p>' +
      '<a href="' + LOGIN_PAGE + '?login=required&next=' + encodeURIComponent(currentUrl) + '#didattica">Accedi con Google</a>' +
      '</div></body>';

    setTimeout(function () {
      window.location.replace(LOGIN_PAGE + '?login=required&next=' + encodeURIComponent(currentUrl) + '#didattica');
    }, 1800);
  }

  function isAuthorized() {
    var raw = localStorage.getItem('adinolfiAuth');
    if (!raw) return false;

    try {
      var auth = JSON.parse(raw);
      var email = String(auth.email || '').toLowerCase();
      var ts = Number(auth.ts || 0);

      return email.endsWith(AUTH_DOMAIN) && Date.now() - ts < AUTH_MAX_AGE_MS;
    } catch (e) {
      return false;
    }
  }

  if (!isAuthorized()) {
    localStorage.removeItem('adinolfiAuth');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('authEmail');
    sessionStorage.removeItem('authName');
    denyAccess();
  }
})();