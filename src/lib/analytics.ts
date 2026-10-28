/**
 * Medição: GA4 (VITE_GA4_ID) e Meta Pixel (VITE_META_PIXEL_ID), ambos opcionais.
 * - GA4 é carregado no HTML (vite.config.ts) com Consent Mode v2 negado por padrão (public/boot.js).
 * - Meta Pixel só carrega DEPOIS do aceite de cookies.
 * Sem os IDs configurados, tudo aqui vira no-op.
 */

type Gtag = (...args: unknown[]) => void;
type Fbq = ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };

declare global {
  interface Window {
    gtag?: Gtag;
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

const GA_ID = import.meta.env.VITE_GA4_ID as string | undefined;
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
export const ANALYTICS_ENABLED = !!(GA_ID || PIXEL_ID);

const CONSENT_KEY = 'le-consent-v1';
export type Consent = 'granted' | 'denied';

export function getConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(c: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, c);
  } catch {
    /* ok */
  }
  window.gtag?.('consent', 'update', {
    analytics_storage: c,
    ad_storage: c,
    ad_user_data: c,
    ad_personalization: c,
  });
  if (c === 'granted') loadPixel();
}

let pixelLoaded = false;
/** Snippet oficial do Meta Pixel, sem script inline (compatível com a CSP). */
function loadPixel() {
  if (!PIXEL_ID || pixelLoaded || typeof window === 'undefined') return;
  pixelLoaded = true;
  const n: Fbq = function (...args: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const self = n as any;
    if (self.callMethod) self.callMethod(...args);
    else self.queue.push(args);
  } as Fbq;
  window.fbq = n;
  window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);
  n('init', PIXEL_ID);
  n('track', 'PageView');
}

/** Chamar uma vez no navegador: carrega o Pixel se o aceite já existe e mede cliques no WhatsApp. */
export function initAnalytics() {
  if (!ANALYTICS_ENABLED || typeof window === 'undefined') return;
  if (getConsent() === 'granted') loadPixel();

  // Qualquer link para o WhatsApp conta como contato (inclui botões fora do roteiro).
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="https://wa.me/"]');
      if (!a || a.hasAttribute('data-book') || a.hasAttribute('data-lead')) return;
      track('contact_whatsapp', { link_location: a.closest('section, header, footer')?.id || 'site' });
    },
    true,
  );
}

/* ---------- Eventos ---------- */

export interface TrackItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
}

const META_EVENT: Record<string, string> = {
  view_item: 'ViewContent',
  add_to_cart: 'AddToCart',
  begin_checkout: 'InitiateCheckout',
  generate_lead: 'Lead',
  contact_whatsapp: 'Contact',
};

export function track(event: string, params: Record<string, unknown> = {}) {
  if (!ANALYTICS_ENABLED || typeof window === 'undefined') return;
  window.gtag?.('event', event, params);
  const meta = META_EVENT[event];
  if (meta && window.fbq) {
    const { value, currency } = params as { value?: number; currency?: string };
    window.fbq('track', meta, value != null ? { value, currency: currency ?? 'BRL' } : {});
  }
}
