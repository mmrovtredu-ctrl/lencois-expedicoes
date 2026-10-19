import type { PrivateTour } from '../types/tour';

/**
 * Passeios privativos — valores da Tabela de Preços 2026 (Material 3).
 * Única alteração solicitada: Caburé em lancha de 12 lugares = R$ 1.200,00 (antes R$ 1.100,00).
 * Não há preço privativo documentado para Santo Amaro, quadriciclo ou outros roteiros.
 */
export const PRIVATE_TOURS: PrivateTour[] = [
  {
    id: 'privativo-cabure',
    name: 'Caburé',
    capacity: 'Lancha de 12 lugares',
    price: 1200,
    relatedTourId: 'cabure',
    image: {
      src: '/images/private/cabure-lancha.webp',
      width: 450,
      height: 300,
      alt: 'Lancha com turistas navegando pelo rio',
    },
    message: (p) =>
      `Olá! Tenho interesse no passeio privativo de Caburé em lancha de 12 lugares, no valor de ${p}. Gostaria de consultar a disponibilidade.`,
  },
  {
    id: 'privativo-lagoa-azul',
    name: 'Lagoa Azul',
    price: 1100,
    relatedTourId: 'lagoa-azul',
    image: {
      src: '/images/private/lagoa-azul.webp',
      width: 576,
      height: 384,
      alt: 'Turista caminhando em lagoa de água cristalina segurando um lenço rosa',
    },
    message: (p) =>
      `Olá! Tenho interesse no passeio privativo da Lagoa Azul, no valor de ${p}. Gostaria de consultar a disponibilidade.`,
  },
  {
    id: 'privativo-lagoa-bonita',
    name: 'Lagoa Bonita',
    price: 1200,
    relatedTourId: 'lagoa-bonita',
    image: {
      src: '/images/private/lagoa-bonita.webp',
      width: 438,
      height: 292,
      alt: 'Pôr do sol sobre as dunas, com uma lagoa ao fundo',
    },
    message: (p) =>
      `Olá! Tenho interesse no passeio privativo da Lagoa Bonita, no valor de ${p}. Gostaria de consultar a disponibilidade.`,
  },
  {
    id: 'privativo-atins',
    name: 'Atins',
    price: 1600,
    relatedTourId: 'atins',
    image: {
      src: '/images/private/atins.webp',
      width: 442,
      height: 295,
      alt: 'Praia com barcos de pesca na areia e kitesurf ao fundo',
    },
    message: (p) =>
      `Olá! Tenho interesse no passeio privativo de Atins, no valor de ${p}. Gostaria de consultar a disponibilidade.`,
  },
  {
    id: 'privativo-cardosa',
    name: 'Cardosa',
    price: 900,
    relatedTourId: 'cardosa',
    image: {
      src: '/images/private/cardosa.webp',
      width: 520,
      height: 347,
      alt: 'Turistas descendo o rio em boias',
    },
    message: (p) =>
      `Olá! Tenho interesse no passeio privativo de Cardosa, no valor de ${p}. Gostaria de consultar a disponibilidade.`,
  },
];
