import { Ship } from 'lucide-react';
import type { PrivateTour } from '../types/tour';
import { formatBRL } from '../lib/format';
import { SmartImage } from './SmartImage';
import { BookButton } from './booking/BookButton';

export function PrivateTourCard({ tour }: { tour: PrivateTour }) {
  const titleId = `${tour.id}-titulo`;
  return (
    <article className="private-card" id={tour.id} aria-labelledby={titleId}>
      <div className="private-card__visual">
        <SmartImage image={tour.image} sizes="(min-width: 1024px) 560px, 92vw" />
        <div className="private-card__info">
          <h3 id={titleId} className="private-card__title">
            <span className="sr-only">Passeio privativo: </span>
            {tour.name}
          </h3>
          {tour.capacity ? (
            <p className="private-card__capacity">
              <Ship size={17} aria-hidden="true" />
              {tour.capacity}
            </p>
          ) : null}
          <p className="private-card__price">
            <span className="private-card__value">{formatBRL(tour.price)}</span>
            <span className="private-card__label">valor do passeio privativo</span>
          </p>
        </div>
      </div>

      <div className="private-card__actions">
        <BookButton
          target={{ kind: 'private', id: tour.id }}
          fallbackMessage={tour.message(formatBRL(tour.price))}
          variant="wa"
        >
          Reservar privativo
        </BookButton>
        {tour.relatedTourId ? (
          <a className="private-card__link" href={`#passeio-${tour.relatedTourId}`}>
            Ver o roteiro do circuito
          </a>
        ) : null}
      </div>
      <span className="private-card__shade" aria-hidden="true" />
    </article>
  );
}
