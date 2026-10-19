import { useEffect, useRef, type MouseEvent } from 'react';
import { X } from 'lucide-react';
import { NAV_ITEMS, SITE } from '../data/site';
import { motionAllowed } from '../lib/scrollEngine';
import { WhatsAppLink } from './WhatsAppLink';
import { InstagramIcon } from './Icons';

interface Props {
  open: boolean;
  onClose: () => void;
}

/** Menu mobile em <dialog>: foco preso, Esc fecha e o foco volta ao botão. */
export function MobileMenu({ open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const goTo = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    onClose();
    ref.current?.close();
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: motionAllowed() ? 'smooth' : 'auto' });
      history.replaceState(null, '', `#${id}`);
    });
  };

  return (
    <dialog
      ref={ref}
      id="menu-mobile"
      className="mobile-menu"
      aria-label="Menu"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mobile-menu__panel">
        <div className="mobile-menu__top">
          <img src={SITE.logo.src} width={SITE.logo.width} height={SITE.logo.height} alt={SITE.fullName} />
          <button type="button" className="mobile-menu__close" aria-label="Fechar menu" onClick={onClose}>
            <X size={24} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Menu principal">
          <ul className="mobile-menu__list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={(e) => goTo(e, item.id)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu__foot">
          <WhatsAppLink size="lg" block onClick={onClose}>
            Consultar passeios
          </WhatsAppLink>
          <a className="mobile-menu__insta" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
            <InstagramIcon size={18} />
            {SITE.instagramHandle}
            <span className="sr-only"> (abre o Instagram em nova aba)</span>
          </a>
        </div>
      </div>
    </dialog>
  );
}
