import { useEffect, useRef, useState } from 'react';
import { whatsappLink } from '../lib/whatsapp';
import { onScrollFrame } from '../lib/scrollEngine';
import { WhatsAppIcon } from './Icons';

/**
 * Botão flutuante do WhatsApp.
 * - Só aparece quando NENHUM outro botão de WhatsApp está na tela: não duplica a
 *   ação nem fica por cima dos botões dos cards, do hero, do contato e do rodapé.
 * - No celular/tablet (onde o conteúdo ocupa a largura toda), some enquanto a pessoa
 *   rola para baixo lendo e volta ao rolar para cima — assim não cobre texto.
 * - Some com o menu aberto.
 */
export function WhatsAppButton({ hidden }: { hidden: boolean }) {
  const [otherCtaVisible, setOtherCtaVisible] = useState(true);
  const [reading, setReading] = useState(false);
  const lastY = useRef(0);
  const lastReading = useRef(false);

  useEffect(() => {
    const narrow = window.matchMedia('(max-width: 1023px)');
    return onScrollFrame((y) => {
      const dy = y - lastY.current;
      if (Math.abs(dy) < 8) return;
      lastY.current = y;
      const next = narrow.matches && dy > 0;
      if (next !== lastReading.current) {
        lastReading.current = next;
        setReading(next);
      }
    });
  }, []);

  useEffect(() => {
    const links = Array.from(document.querySelectorAll('a[href^="https://wa.me/"]')).filter(
      (a) => !a.closest('.wa-float, .site-header, #menu-mobile'),
    );
    const onScreen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onScreen.add(e.target);
        else onScreen.delete(e.target);
      }
      setOtherCtaVisible(onScreen.size > 0);
    });
    links.forEach((a) => io.observe(a));
    return () => io.disconnect();
  }, []);

  const visible = !hidden && !otherCtaVisible && !reading;

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      className={`wa-float${visible ? ' is-visible' : ''}`}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <WhatsAppIcon size={28} />
      <span className="sr-only">Conversar pelo WhatsApp (abre em nova aba)</span>
    </a>
  );
}
