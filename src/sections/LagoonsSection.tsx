import { useEffect, useState, type CSSProperties } from 'react';
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSun, Droplets, Sun, Wind } from 'lucide-react';
import { LAGOON_LEVELS, MONTHS_LONG, MONTHS_SHORT, lagoonStatus } from '../data/lagoons';
import { fetchWeather, SKY_LABEL, type Sky, type Weather } from '../lib/weather';
import { parseISO, weekdayShort } from '../lib/booking';
import { WhatsAppLink } from '../components/WhatsAppLink';

const SKY_ICON: Record<Sky, typeof Sun> = {
  sun: Sun,
  partly: CloudSun,
  cloud: Cloud,
  fog: CloudFog,
  rain: CloudRain,
  storm: CloudLightning,
};

const ASK_MESSAGE =
  'Olá! Vim pelo site da Lençóis Expedições. Como estão as lagoas essa semana? Quero escolher a melhor data para o passeio.';

function SkyIcon({ sky, size = 22 }: { sky: Sky; size?: number }) {
  const Icon = SKY_ICON[sky];
  return <Icon size={size} aria-hidden="true" />;
}

function useWeather() {
  const [w, setW] = useState<Weather | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const ctrl = new AbortController();
    fetchWeather(ctrl.signal)
      .then(setW)
      .catch((e) => {
        if (e?.name !== 'AbortError') setFailed(true);
      });
    return () => ctrl.abort();
  }, []);
  return { w, failed };
}

export function LagoonsSection() {
  // Mês atual só no navegador (o HTML é pré-renderizado no build).
  const [current, setCurrent] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    const m = new Date().getMonth();
    setCurrent(m);
    setSelected(m);
  }, []);

  const { w, failed } = useWeather();
  const shown = selected ?? 6; // sem JS: mostra julho (pico) como referência
  const st = lagoonStatus(shown);
  const isCurrent = shown === current;

  return (
    <section id="lagoas" className="section section--ocean lagoons" aria-labelledby="lagoas-titulo">
      <div className="container">
        <header className="section-head">
          <div>
            <p className="eyebrow">Antes de escolher a data</p>
            <h2 id="lagoas-titulo" className="section-title">
              Como estão as lagoas
            </h2>
          </div>
          <div className="section-head__aside">
            <p className="section-lead">
              As lagoas enchem com as chuvas do começo do ano e vão secando no segundo semestre. Veja o nível
              esperado no mês da sua viagem e a previsão do tempo em Barreirinhas.
            </p>
          </div>
        </header>

        <div className="lagoons__grid">
          {/* Nível do mês */}
          <article className={`level-card level-card--${st.tone}`} aria-live="polite">
            <p className="level-card__when">{isCurrent ? 'Este mês' : 'Em'} · {MONTHS_LONG[shown]}</p>
            <div className="level-gauge" style={{ '--level': st.level } as CSSProperties}>
              <span className="level-gauge__water" aria-hidden="true" />
              <span className="level-gauge__value">
                {st.level}
                <small>%</small>
              </span>
            </div>
            <p className="level-card__label">
              <Droplets size={18} aria-hidden="true" />
              {st.label}
            </p>
            <p className="level-card__hint">{st.hint}</p>
            <WhatsAppLink variant="light" size="sm" block message={ASK_MESSAGE}>
              Perguntar como estão hoje
            </WhatsAppLink>
          </article>

          {/* Ano todo */}
          <div className="year-card">
            <h3 className="year-card__title">Nível estimado ao longo do ano</h3>
            <p className="year-card__sub">Toque em um mês para ver os detalhes.</p>
            <div className="year-chart" role="group" aria-label="Nível estimado das lagoas por mês">
              {LAGOON_LEVELS.map((lv, m) => (
                <button
                  key={m}
                  type="button"
                  className={`year-bar year-bar--${lagoonStatus(m).tone}${m === shown ? ' is-selected' : ''}${
                    m === current ? ' is-current' : ''
                  }`}
                  style={{ '--h': lv } as CSSProperties}
                  aria-pressed={m === shown}
                  aria-label={`${MONTHS_LONG[m]}: ${lv}%`}
                  onClick={() => setSelected(m)}
                >
                  <span className="year-bar__val" aria-hidden="true">
                    {lv}
                  </span>
                  <span className="year-bar__col" aria-hidden="true" />
                  <span className="year-bar__mo" aria-hidden="true">
                    {MONTHS_SHORT[m]}
                  </span>
                </button>
              ))}
            </div>
            <ul className="year-legend">
              <li className="is-high">Cheias: mai a ago</li>
              <li className="is-mid">Boas: mar, abr, set, out</li>
              <li className="is-low">Mais baixas: nov a fev</li>
            </ul>
            <p className="year-card__note">
              Estimativa pela média de chuvas da região, não é medição ao vivo. Anos mais secos ou chuvosos mudam o
              nível. Para a situação real da semana, pergunte à equipe.
            </p>
          </div>

          {/* Previsão */}
          {failed ? null : (
            <div className="forecast" aria-busy={!w}>
              <div className="forecast__now">
                <h3 className="forecast__title">Tempo em Barreirinhas</h3>
                {w ? (
                  <p className="forecast__current">
                    <SkyIcon sky={w.now.sky} size={30} />
                    <span className="forecast__temp">{w.now.temp}°</span>
                    <span className="forecast__meta">
                      {SKY_LABEL[w.now.sky]}
                      <span>
                        <Wind size={14} aria-hidden="true" /> {w.now.wind} km/h
                      </span>
                    </span>
                  </p>
                ) : (
                  <p className="forecast__loading">Carregando previsão…</p>
                )}
              </div>
              <ol className="forecast__days">
                {(w?.days ?? Array.from({ length: 7 }, () => null)).map((d, i) =>
                  d ? (
                    <li key={d.date} className="forecast__day">
                      <span className="forecast__wd">{i === 0 ? 'hoje' : weekdayShort(parseISO(d.date))}</span>
                      <SkyIcon sky={d.sky} />
                      <span className="sr-only">{SKY_LABEL[d.sky]}</span>
                      <span className="forecast__range">
                        <strong>{d.max}°</strong> {d.min}°
                      </span>
                      <span className={`forecast__rain${d.rain >= 50 ? ' is-wet' : ''}`}>
                        <CloudRain size={13} aria-hidden="true" />
                        {d.rain}%<span className="sr-only"> de chance de chuva</span>
                      </span>
                    </li>
                  ) : (
                    <li key={i} className="forecast__day is-skeleton" aria-hidden="true" />
                  ),
                )}
              </ol>
              <p className="forecast__src">Previsão: Open-Meteo · atualiza a cada 30 min</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
