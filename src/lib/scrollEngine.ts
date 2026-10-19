/**
 * Motor de rolagem único e leve.
 * - Um só listener de scroll (passivo) + um requestAnimationFrame por quadro.
 * - Só calcula elementos perto da viewport (IntersectionObserver).
 * - Fase de leitura (getBoundingClientRect) separada da fase de escrita (CSS vars),
 *   evitando layout thrashing.
 * - Escreve apenas variáveis CSS; os efeitos usam transform/opacity (GPU).
 */

type Writer = () => void;

export interface FxItem {
  el: Element;
  /** Lê medidas e devolve uma função que escreve os valores. */
  read: (vh: number, vw: number) => Writer | void;
}

const isBrowser = typeof window !== 'undefined';
const records = new Map<Element, { item: FxItem; visible: boolean }>();
const frameListeners = new Set<(scrollY: number) => void>();
let io: IntersectionObserver | null = null;
let scheduled = false;
let started = false;

function frame() {
  scheduled = false;
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const writers: Writer[] = [];
  for (const rec of records.values()) {
    if (!rec.visible) continue;
    const w = rec.item.read(vh, vw);
    if (w) writers.push(w);
  }
  for (const w of writers) w();
  const y = window.scrollY;
  for (const cb of frameListeners) cb(y);
}

export function schedule() {
  if (!isBrowser || scheduled) return;
  scheduled = true;
  requestAnimationFrame(frame);
}

function start() {
  if (started || !isBrowser) return;
  started = true;
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const rec = records.get(e.target);
        if (rec) rec.visible = e.isIntersecting;
      }
      schedule();
    },
    { rootMargin: '30% 0px 30% 0px' },
  );
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
}

export function motionAllowed(): boolean {
  return isBrowser && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Registra um efeito de rolagem. Não faz nada se o usuário pediu menos movimento. */
export function registerFx(item: FxItem): () => void {
  if (!motionAllowed()) return () => {};
  start();
  records.set(item.el, { item, visible: false });
  io!.observe(item.el);
  schedule();
  return () => {
    io?.unobserve(item.el);
    records.delete(item.el);
  };
}

/** Callback por quadro de rolagem (ex.: estado do cabeçalho). */
export function onScrollFrame(cb: (scrollY: number) => void): () => void {
  start();
  frameListeners.add(cb);
  schedule();
  return () => {
    frameListeners.delete(cb);
  };
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/** Escreve uma CSS var só quando o valor muda (menos recálculo de estilo). */
export function varWriter(el: HTMLElement) {
  const cache: Record<string, number> = {};
  return (name: string, value: number) => {
    const v = Math.round(value * 1000) / 1000;
    if (cache[name] === v) return;
    cache[name] = v;
    el.style.setProperty(name, String(v));
  };
}
