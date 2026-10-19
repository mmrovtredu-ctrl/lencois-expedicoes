export interface ImageAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/** Unidade de cobrança do passeio individual. */
export type PriceUnit = 'pessoa' | 'quadriciclo';

export interface Tour {
  id: string;
  name: string;
  image: ImageAsset;
  /** Resumo curto exibido no card. */
  summary: string;
  /** Horário documentado no material (portfólio de passeios). */
  schedule: string;
  highlights: string[];
  /** Roteiro completo, reorganizado a partir do material original. */
  itinerary: string[];
  /** Observações importantes (ex.: almoço não incluído). */
  notes?: string[];
  price: number;
  unit: PriceUnit;
  /** Complemento da unidade, exibido abaixo do preço. */
  unitDetail?: string;
  /** Mensagem do WhatsApp. Recebe o preço já formatado com a unidade. */
  message: (priceWithUnit: string) => string;
}

export interface PrivateTour {
  id: string;
  name: string;
  /** Capacidade documentada (apenas Caburé). */
  capacity?: string;
  price: number;
  image: ImageAsset;
  /** Passeio individual correspondente, para consulta do roteiro. */
  relatedTourId?: string;
  message: (price: string) => string;
}

export interface GalleryItem {
  id: string;
  caption: string;
  image: ImageAsset;
  /** Ocupa duas linhas na grade (fotos verticais). */
  tall?: boolean;
  /** Ocupa duas colunas na grade (fotos horizontais de destaque). */
  wide?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string[];
}
