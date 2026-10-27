/**
 * Previsão do tempo para Barreirinhas via Open-Meteo (sem chave, chamada direto do navegador).
 * Atenção: o plano gratuito da Open-Meteo é para uso não comercial. Para site de empresa,
 * avalie o plano pago (open-meteo.com/en/pricing) ou remova o bloco de previsão.
 */
const LAT = -2.7469;
const LON = -42.8264;

const URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
  '&current=temperature_2m,wind_speed_10m,weather_code' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
  '&timezone=America%2FFortaleza&forecast_days=7';

export type Sky = 'sun' | 'partly' | 'cloud' | 'fog' | 'rain' | 'storm';

export interface DayForecast {
  date: string;
  sky: Sky;
  max: number;
  min: number;
  rain: number;
}

export interface Weather {
  now: { temp: number; wind: number; sky: Sky };
  days: DayForecast[];
}

/** Código WMO → ícone simplificado. */
export function skyFromCode(code: number): Sky {
  if (code === 0) return 'sun';
  if (code <= 2) return 'partly';
  if (code === 3) return 'cloud';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 95) return 'storm';
  return 'rain';
}

export const SKY_LABEL: Record<Sky, string> = {
  sun: 'Sol',
  partly: 'Sol com nuvens',
  cloud: 'Nublado',
  fog: 'Neblina',
  rain: 'Chuva',
  storm: 'Tempestade',
};

const CACHE_KEY = 'le-weather-v1';
const CACHE_MS = 30 * 60 * 1000;

export async function fetchWeather(signal?: AbortSignal): Promise<Weather> {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) {
      const { at, data } = JSON.parse(raw) as { at: number; data: Weather };
      if (Date.now() - at < CACHE_MS) return data;
    }
  } catch {
    /* sem cache */
  }

  const res = await fetch(URL, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const j = await res.json();
  const data: Weather = {
    now: {
      temp: Math.round(j.current.temperature_2m),
      wind: Math.round(j.current.wind_speed_10m),
      sky: skyFromCode(j.current.weather_code),
    },
    days: (j.daily.time as string[]).map((date, i) => ({
      date,
      sky: skyFromCode(j.daily.weather_code[i]),
      max: Math.round(j.daily.temperature_2m_max[i]),
      min: Math.round(j.daily.temperature_2m_min[i]),
      rain: j.daily.precipitation_probability_max[i] ?? 0,
    })),
  };
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* ok */
  }
  return data;
}
