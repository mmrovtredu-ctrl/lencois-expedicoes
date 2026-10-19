import { useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { NAV_ITEMS, SITE } from '../data/site';
import { onScrollFrame } from '../lib/scrollEngine';
import { useActiveSection } from '../hooks/useSections';
import { WhatsAppLink } from './WhatsAppLink';

const SECTION_IDS = ['inicio', 'sobre', 'passeios', 'privativos', 'experiencias', 'reserva', 'duvidas', 'contato'] as const;

interface Props {
  menuOpen: boolean;
  onOpenMenu: () => void;
}

export function Header({ menuOpen, onOpenMenu }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const last = useRef(false);
  const active = useActiveSection(SECTION_IDS);

  useEffect(
    () =>
      onScrollFrame((y) => {
        const next = y > 24;
        if (next !== last.current) {
          last.current = next;
          setScrolled(next);
        }
      }),
    [],
  );

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container site-header__bar">
        <a href="#inicio" className="site-header__logo">
          <img
            src={SITE.logo.src}
            width={SITE.logo.width}
            height={SITE.logo.height}
            alt={`${SITE.fullName} — voltar ao início`}
            decoding="async"
          />
        </a>

        <nav aria-label="Principal" className="site-header__nav">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <WhatsAppLink size="sm" className="site-header__cta">
          Consultar passeios
        </WhatsAppLink>

        <button
          type="button"
          className="site-header__menu-btn"
          aria-label="Abrir menu"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          onClick={onOpenMenu}
        >
          <Menu size={24} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
