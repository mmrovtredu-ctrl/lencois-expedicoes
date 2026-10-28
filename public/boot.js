/*
 * Roda antes da primeira pintura (arquivo externo para permitir CSP sem 'unsafe-inline').
 * 1) Liga os efeitos 3D (classe .fx), respeitando "reduzir movimento".
 * 2) Consent Mode v2 do Google: tudo NEGADO por padrão até a pessoa aceitar (LGPD).
 *    O GA4 ainda envia sinais sem cookies; com o aceite passa a medir normalmente.
 */
(function () {
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('fx');

  var ga = document.currentScript && document.currentScript.getAttribute('data-ga');
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  var saved = null;
  try {
    saved = localStorage.getItem('le-consent-v1');
  } catch (e) {}
  var granted = saved === 'granted' ? 'granted' : 'denied';

  window.gtag('consent', 'default', {
    analytics_storage: granted,
    ad_storage: granted,
    ad_user_data: granted,
    ad_personalization: granted,
    wait_for_update: 500,
  });
  if (ga) {
    window.gtag('js', new Date());
    window.gtag('config', ga);
  }
})();
