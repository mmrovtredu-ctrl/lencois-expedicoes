import { useEffect, type RefObject } from 'react';
import { clamp01, easeOutCubic, registerFx, varWriter } from '../lib/scrollEngine';

/**
 * enter   → --enter: 0 quando o topo do elemento entra pela base da tela, 1 logo depois.
 *           Tem um pequeno atraso pela posição horizontal (efeito cascata entre colunas).
 * leave   → --leave: 0 com o elemento no topo, 1 quando ele saiu por cima (hero).
 * through → --shift: -1 entrando por baixo, 0 no centro, 1 saindo por cima (parallax).
 */
export type FxMode = 'enter' | 'leave' | 'through';

export function useScrollFx(ref: RefObject<HTMLElement | null>, mode: FxMode) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = varWriter(el);
    return registerFx({
      el,
      read(vh, vw) {
        const r = el.getBoundingClientRect();
        if (mode === 'enter') {
          const stagger = (r.left / Math.max(vw, 1)) * vh * 0.07;
          const t = clamp01((vh - r.top - stagger) / (vh * 0.34));
          return () => set('--enter', easeOutCubic(t));
        }
        if (mode === 'leave') {
          const t = clamp01(-r.top / Math.max(r.height, 1));
          return () => set('--leave', t);
        }
        const t = clamp01((vh - r.top) / (vh + r.height));
        return () => set('--shift', t * 2 - 1);
      },
    });
  }, [ref, mode]);
}
