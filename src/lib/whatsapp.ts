import { SITE } from '../data/site';

export const GENERIC_WHATSAPP_MESSAGE =
  'Olá! Conheci o site da Lençóis Expedições e gostaria de receber informações sobre os passeios disponíveis.';

/** Gera o link do WhatsApp com a mensagem pré-preenchida. Não depende de backend. */
export function whatsappLink(message: string = GENERIC_WHATSAPP_MESSAGE): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
