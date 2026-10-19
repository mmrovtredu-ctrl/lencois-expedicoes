import { useEffect, type RefObject } from 'react';
import { motionAllowed } from '../lib/scrollEngine';

/** Inclinação 3D que acompanha o mouse. Só em telas com mouse (não afeta toque). */
export function useTilt(ref: RefObject<HTMLElement | null>, maxDeg = 5) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let raf = 0;
    let x = 0.5;
    let y = 0.5;
    const apply = () => {
      raf = 0;
      el.style.setProperty('--tilt-x', `${((0.5 - y) * maxDeg).toFixed(2)}deg`);
      el.style.setProperty('--tilt-y', `${((x - 0.5) * maxDeg * 1.4).toFixed(2)}deg`);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = (e.clientX - r.left) / r.width;
      y = (e.clientY - r.top) / r.height;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, maxDeg]);
}
