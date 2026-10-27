/**
 * Nível estimado das lagoas por mês (0–100).
 * NÃO é medição: é uma curva média baseada no ciclo de chuvas da região
 * (chuvas de janeiro a maio, lagoas mais cheias de junho a agosto, secando até dezembro).
 * Ano com pouca ou muita chuva desloca a curva. Ajuste aqui se a agência tiver dados melhores.
 */
export const LAGOON_LEVELS = [20, 30, 45, 65, 80, 92, 95, 85, 70, 50, 35, 25] as const;

export const MONTHS_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'] as const;
export const MONTHS_LONG = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const;

export type LagoonTone = 'low' | 'mid' | 'high';

export interface LagoonStatus {
  level: number;
  tone: LagoonTone;
  label: string;
  hint: string;
}

/** Status textual do mês (0 = janeiro). */
export function lagoonStatus(month: number): LagoonStatus {
  const level = LAGOON_LEVELS[month];
  if (level >= 80)
    return {
      level,
      tone: 'high',
      label: 'Lagoas cheias',
      hint: 'Melhor época: lagoas grandes, azuis e ótimas para banho.',
    };
  if (level >= 45)
    return {
      level,
      tone: 'mid',
      label: 'Várias lagoas com água',
      hint: 'Boa época: muitas lagoas com água para banho.',
    };
  return {
    level,
    tone: 'low',
    label: 'Lagoas mais baixas',
    hint: 'Período mais seco: menos lagoas cheias. A equipe leva o grupo às que estiverem melhores.',
  };
}
