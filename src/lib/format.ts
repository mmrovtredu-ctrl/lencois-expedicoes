import type { PriceUnit } from '../types/tour';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

/** R$ 1.200,00 — com espaço comum (o Intl usa espaço não separável). */
export function formatBRL(value: number): string {
  return brl.format(value).replace(/ /g, ' ');
}

export const UNIT_LABEL: Record<PriceUnit, string> = {
  pessoa: 'por pessoa',
  quadriciclo: 'por quadriciclo',
};

/** "R$ 160,00 por pessoa" / "R$ 650,00 por quadriciclo" */
export function priceWithUnit(value: number, unit: PriceUnit): string {
  return `${formatBRL(value)} ${UNIT_LABEL[unit]}`;
}
