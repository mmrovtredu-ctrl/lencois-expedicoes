import { useEffect, useState } from 'react';
import { ANALYTICS_ENABLED, getConsent, setConsent, type Consent } from '../lib/analytics';

/** Aviso de cookies (LGPD). Só aparece se houver GA4/Pixel configurado e a pessoa ainda não escolheu. */
export function ConsentBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (ANALYTICS_ENABLED && getConsent() === null) setShow(true);
  }, []);
  if (!show) return null;

  const choose = (c: Consent) => {
    setConsent(c);
    setShow(false);
  };

  return (
    <div className="consent" role="region" aria-label="Aviso de cookies">
      <p>
        Usamos cookies para medir visitas e melhorar o site e os anúncios. Você pode aceitar ou recusar — o site funciona
        igual.
      </p>
      <div className="consent__actions">
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => choose('denied')}>
          Recusar
        </button>
        <button type="button" className="btn btn--blue btn--sm" onClick={() => choose('granted')}>
          Aceitar
        </button>
      </div>
    </div>
  );
}
