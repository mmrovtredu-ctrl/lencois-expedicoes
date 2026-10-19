import { useRef } from 'react';
import { Clock, Info } from 'lucide-react';
import type { Tour } from '../types/tour';
import { formatBRL, priceWithUnit, UNIT_LABEL } from '../lib/format';
import { useScrollFx } from '../hooks/useScrollFx';
import { useTilt } from '../hooks/useTilt';
import { SmartImage } from './SmartImage';
import { WhatsAppLink } from './WhatsAppLink';

export function TourCard({ tour }: { tour: Tour }) {
  const wrapRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  useScrollFx(wrapRef, 'enter');
  useTilt(innerRef);

  const titleId = `passeio-${tour.id}-titulo`;

  return (
    <article className="tour-card" id={`passeio-${tour.id}`} ref={wrapRef} aria-labelledby={titleId}>
      <div className="tour-card__inner" ref={innerRef}>
        <div className="tour-card__media">
          <SmartImage image={tour.image} sizes="(min-width: 1080px) 360px, (min-width: 700px) 45vw, 92vw" />
        </div>

        <div className="tour-card__body">
          <h3 id={titleId} className="tour-card__title">
            {tour.name}
          </h3>

          <p className="price">
            <span className="price__value">{formatBRL(tour.price)}</span>
            <span className="price__unit">
              {UNIT_LABEL[tour.unit]}
              {tour.unitDetail ? <span className="price__detail">{tour.unitDetail}</span> : null}
            </span>
          </p>

          <p className="tour-card__schedule">
            <Clock size={16} aria-hidden="true" />
            <span>{tour.schedule}</span>
          </p>

          <p className="tour-card__summary">{tour.summary}</p>

          <ul className="tour-card__highlights">
            {tour.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>

          {tour.notes?.map((n) => (
            <p className="tour-card__note" key={n}>
              <Info size={15} aria-hidden="true" />
              <span>{n}</span>
            </p>
          ))}

          <details className="tour-card__details">
            <summary>Ver roteiro completo</summary>
            <div className="tour-card__itinerary">
              {tour.itinerary.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </details>

          <WhatsAppLink
            variant="blue"
            block
            className="tour-card__cta"
            message={tour.message(priceWithUnit(tour.price, tour.unit))}
          >
            Consultar disponibilidade
          </WhatsAppLink>
        </div>
      </div>
    </article>
  );
}
