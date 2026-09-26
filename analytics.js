/* Analytics sito — GA4
 * Inserire il proprio Measurement ID al posto di G-YZMC5220WD.
 * Non vengono inviati URL/testi inseriti dall'utente.
 */
(function () {
  const GA_MEASUREMENT_ID = 'G-YZMC5220WD';
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-YZMC5220WD') return;

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  window.siteAnalytics = {
    track: function (eventName, params) {
      if (typeof window.gtag === 'function') window.gtag('event', eventName, params || {});
    }
  };

  document.addEventListener('click', function (event) {
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    let eventName = null;
    if (href === 'qrcode.html') eventName = 'qrcode_open';
    else if (href === 'agenda.html') eventName = 'agenda_open';
    else if (/^(materiali|classe|classe_sql)\.html/.test(href)) eventName = 'didactic_resource_open';
    else if (href === 'login.html') eventName = 'reserved_area_open';
    else if (href === 'glossario.html') eventName = 'glossary_open';
    if (eventName) window.siteAnalytics.track(eventName);
  });
})();
