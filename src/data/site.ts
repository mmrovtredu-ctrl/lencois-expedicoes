/** Dados de contato e identidade. Altere aqui e o site inteiro acompanha. */
export const SITE = {
  name: 'Lençóis Expedições',
  fullName: 'Agência Lençóis Expedições',
  base: 'Barreirinhas, Maranhão',
  url: 'https://www.lencoisexpedicoes.com.br',
  phoneDisplay: '(98) 99608-2222',
  phoneE164: '+5598996082222',
  /** Formato internacional sem espaços, parênteses ou traços (wa.me). */
  whatsappNumber: '5598996082222',
  instagramHandle: '@agencia.lencois.expedicoes',
  instagramUrl: 'https://www.instagram.com/agencia.lencois.expedicoes/',
  logo: {
    src: '/images/logo/logo-lencois-expedicoes.webp',
    width: 480,
    height: 225,
    alt: 'Agência Lençóis Expedições',
  },
} as const;

export const NAV_ITEMS = [
  { id: 'inicio', label: 'Início' },
  { id: 'passeios', label: 'Passeios' },
  { id: 'privativos', label: 'Privativos' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'contato', label: 'Contato' },
] as const;
