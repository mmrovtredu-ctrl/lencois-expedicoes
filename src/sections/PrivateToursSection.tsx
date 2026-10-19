import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { PRIVATE_TOURS } from '../data/privateTours';
import { PrivateTourCard } from '../components/PrivateTourCard';
import { WhatsAppLink } from '../components/WhatsAppLink';
import { formatBRL } from '../lib/format';
import { clamp01, registerFx, varWriter } from '../lib/scrollEngine';

const OTHER_PRIVATE_MESSAGE =
  'Olá! Conheci o site da Lençóis Expedições e gostaria de consultar valores e disponibilidade de um passeio privativo para outro roteiro.';

/**
 * Pilha 3D: cada card fica preso no topo e o seguinte desliza por cima.
 * O card coberto recua (escala) e escurece — só transform e opacity.
 */
function useStack(ref: RefObject<HTMLDivElement | null>, onActive: (i: number) => void) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>('.stack-item'));
    const writers = items.map((el) => varWriter(el));
    let lastActive = -1;
    return registerFx({
      el: root,
      read() {
        const rects = items.map((el) => el.getBoundingClientRect());
        const covers = rects.map((r, i) => {
          const next = rects[i + 1];
          if (!next) return 0;
          return clamp01((r.bottom - next.top) / Math.max(r.height, 1));
        });
        return () => {
          covers.forEach((c, i) => writers[i]('--cover', c));
          let active = covers.findIndex((c) => c < 0.5);
          if (active < 0) active = items.length - 1;
          if (active !== lastActive) {
            lastActive = active;
            onActive(active);
          }
        };
      },
    });
  }, [ref, onActive]);
}

export function PrivateToursSection() {
  const stackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useStack(stackRef, setActive);

  return (
    <section id="privativos" className="section section--ocean private" aria-labelledby="privativos-titulo">
      <div className="container private__layout">
        <div className="private__intro">
          <h2 id="privativos-titulo" className="section-title">
            Uma experiência exclusiva para você
          </h2>
          <p className="section-lead">Explore os Lençóis Maranhenses com uma opção privativa para o seu grupo.</p>

          <nav aria-label="Valores dos passeios privativos" className="private__index">
            <ul>
              {PRIVATE_TOURS.map((t, i) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className={i === active ? 'is-active' : undefined}>
                    <span>
                      {t.name}
                      {t.capacity ? <small>{t.capacity}</small> : null}
                    </span>
                    <span className="private__index-price">{formatBRL(t.price)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="private__other">
            <p>Santo Amaro, quadriciclo ou outro roteiro privativo? Consulte valores e disponibilidade com a equipe.</p>
            <WhatsAppLink variant="outline-light" size="sm" message={OTHER_PRIVATE_MESSAGE}>
              Consultar outro roteiro
            </WhatsAppLink>
          </div>
        </div>

        <div className="private__stack" ref={stackRef}>
          {PRIVATE_TOURS.map((t, i) => (
            <div className="stack-item" key={t.id} style={{ '--i': i } as CSSProperties}>
              <PrivateTourCard tour={t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
