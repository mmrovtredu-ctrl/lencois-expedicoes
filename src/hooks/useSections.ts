import { useEffect, useState } from 'react';

/** Seção que cruza o meio da tela — para destacar o item ativo do menu. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/** true enquanto algum dos elementos estiver visível. */
export function useAnyVisible(ids: readonly string[], initial = true) {
  const [visible, setVisible] = useState(initial);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const state = new Map<Element, boolean>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) state.set(e.target, e.isIntersecting);
      setVisible([...state.values()].some(Boolean));
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return visible;
}
