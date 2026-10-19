import { useEffect, useState } from 'react';
import { NAV_ITEMS, SITE } from '../data/site';
import { InstagramIcon } from './Icons';
import { WhatsAppLink } from './WhatsAppLink';

export function Footer() {
  // HTML pré-renderizado sai com o ano do build; no navegador, troca pelo ano atual.
  const [year, setYear] = useState(__BUILD_YEAR__);
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer id="rodape" className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <img src={SITE.logo.src} width={SITE.logo.width} height={SITE.logo.height} alt={SITE.fullName} loading="lazy" decoding="async" />
          <p>
            Passeios pelos Lençóis Maranhenses a partir de Barreirinhas, no Maranhão: lagoas, dunas, rio e praia, em
            roteiros individuais e privativos.
          </p>
        </div>

        <nav aria-label="Rodapé" className="site-footer__nav">
          <h2 className="site-footer__heading">Navegação</h2>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__contact">
          <h2 className="site-footer__heading">Atendimento</h2>
          <WhatsAppLink>Falar no WhatsApp</WhatsAppLink>
          <a className="site-footer__insta" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
            <InstagramIcon size={18} />
            {SITE.instagramHandle}
            <span className="sr-only"> (abre o Instagram em nova aba)</span>
          </a>
        </div>
      </div>
      <div className="container site-footer__legal">
        <p>
          © {year} {SITE.fullName}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
