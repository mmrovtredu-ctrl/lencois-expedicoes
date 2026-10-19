import { useRef } from 'react';
import { Phone } from 'lucide-react';
import { SITE } from '../data/site';
import { useScrollFx } from '../hooks/useScrollFx';
import { WhatsAppLink } from '../components/WhatsAppLink';
import { InstagramIcon } from '../components/Icons';

export function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  useScrollFx(ref, 'through');

  return (
    <section id="contato" className="contact" ref={ref} aria-labelledby="contato-titulo">
      <div className="contact__media" aria-hidden="true">
        <picture>
          <source media="(min-width: 768px)" srcSet="/images/hero/cta-desktop.webp" width={1400} height={863} />
          <img src="/images/hero/cta-mobile.webp" width={480} height={600} alt="" loading="lazy" decoding="async" />
        </picture>
      </div>
      <div className="contact__shade" aria-hidden="true" />

      <div className="container contact__content">
        <h2 id="contato-titulo" className="contact__title">
          Os Lençóis Maranhenses esperam por você
        </h2>
        <p className="contact__lead">Escolha seu passeio e fale com a nossa equipe para planejar sua próxima experiência.</p>
        <WhatsAppLink size="lg">Conversar pelo WhatsApp</WhatsAppLink>

        <ul className="contact__channels">
          <li>
            <a href={`tel:${SITE.phoneE164}`}>
              <Phone size={18} aria-hidden="true" />
              {SITE.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
              <InstagramIcon size={18} />
              {SITE.instagramHandle}
              <span className="sr-only"> (abre o Instagram em nova aba)</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
