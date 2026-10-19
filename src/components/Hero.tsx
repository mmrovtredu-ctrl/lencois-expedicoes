import { useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useScrollFx } from '../hooks/useScrollFx';
import { WhatsAppLink } from './WhatsAppLink';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useScrollFx(ref, 'leave');

  return (
    <section id="inicio" className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="hero__media">
        <picture>
          <source
            media="(min-width: 768px)"
            srcSet="/images/hero/hero-desktop-960.webp 960w, /images/hero/hero-desktop-1600.webp 1600w"
            sizes="100vw"
            width={1600}
            height={1169}
          />
          <img
            src="/images/hero/hero-mobile.webp"
            width={736}
            height={920}
            alt="Lagoas azuis entre dunas brancas nos Lençóis Maranhenses"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>
      <div className="hero__shade" aria-hidden="true" />

      <div className="container hero__content">
        <h1 id="hero-title" className="hero__title">
          Descubra a magia dos Lençóis Maranhenses
        </h1>
        <p className="hero__lead">
          Explore lagoas cristalinas, dunas impressionantes e experiências inesquecíveis com a Lençóis Expedições.
        </p>
        <div className="hero__actions">
          <a href="#passeios" className="btn btn--light btn--lg">
            Explorar passeios
          </a>
          <WhatsAppLink size="lg">
            Planejar minha viagem
          </WhatsAppLink>
        </div>
        <p className="hero__place">
          <MapPin size={16} aria-hidden="true" />
          Passeios a partir de Barreirinhas, Maranhão
        </p>
      </div>

      <svg className="dune dune--back" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 96C150 60 300 38 470 62s300 70 470 52 330-78 500-66V260H0Z" />
      </svg>
      <svg className="dune dune--front" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 118c210-8 380-62 600-54s360 66 560 60c120-4 210-24 280-40V260H0Z" />
      </svg>
    </section>
  );
}
