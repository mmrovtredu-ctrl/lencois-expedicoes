import { useEffect, type RefObject } from 'react';

/** Abre/fecha um <dialog> modal conforme `open` (foco preso e Esc nativos). */
export function useDialog(ref: RefObject<HTMLDialogElement | null>, open: boolean) {
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [ref, open]);

  useKeyboardAware(ref, open);
}

/** Diferença mínima de altura (px) para considerar que o teclado virtual está aberto. */
const KEYBOARD_MIN = 150;
const FIELD = 'input, textarea, select';

/**
 * Teclado do celular:
 * - O <dialog> passa a ocupar só a área visível (visualViewport), acima do teclado.
 *   No iPhone a página não encolhe quando o teclado abre; sem isso o campo fica escondido.
 * - Com o teclado aberto, a classe .kb-open esconde o rodapé (total + botões) para sobrar
 *   espaço ao campo. O rodapé volta quando o teclado fecha.
 * - O campo em foco é centralizado na área rolável.
 * - "Próximo" / Enter do teclado pula para o campo seguinte.
 */
function useKeyboardAware(ref: RefObject<HTMLDialogElement | null>, open: boolean) {
  useEffect(() => {
    const d = ref.current;
    const vv = window.visualViewport;
    if (!d || !open) return;

    let base = vv?.height ?? window.innerHeight;
    let raf = 0;

    const centerFocused = () => {
      const el = document.activeElement as HTMLElement | null;
      if (el && d.contains(el) && el.matches(FIELD)) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    };

    const apply = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = vv?.height ?? window.innerHeight;
        const top = vv?.offsetTop ?? 0;
        // Teclado fechado: atualiza a altura de referência (ex.: girou a tela).
        if (h > base) base = h;
        const kb = base - h > KEYBOARD_MIN;
        d.style.setProperty('--vv-h', `${Math.round(h)}px`);
        d.style.setProperty('--vv-top', `${Math.round(top)}px`);
        d.classList.toggle('kb-open', kb);
        if (kb) centerFocused();
      });
    };

    const onFocusIn = (e: FocusEvent) => {
      if ((e.target as Element).matches?.(FIELD)) setTimeout(centerFocused, 320);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLInputElement;
      if (e.key !== 'Enter' || t.tagName !== 'INPUT' || t.type === 'submit') return;
      e.preventDefault();
      const fields = Array.from(d.querySelectorAll<HTMLInputElement>('input:not([type=hidden]):not([disabled])'));
      const next = fields[fields.indexOf(t) + 1];
      if (next) next.focus();
      else t.blur(); // último campo: fecha o teclado e o rodapé volta
    };

    apply();
    vv?.addEventListener('resize', apply);
    vv?.addEventListener('scroll', apply);
    window.addEventListener('resize', apply);
    d.addEventListener('focusin', onFocusIn);
    d.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      vv?.removeEventListener('resize', apply);
      vv?.removeEventListener('scroll', apply);
      window.removeEventListener('resize', apply);
      d.removeEventListener('focusin', onFocusIn);
      d.removeEventListener('keydown', onKeyDown);
      d.classList.remove('kb-open');
    };
  }, [ref, open]);
}

/** Clique no fundo escurecido fecha o diálogo. */
export function closeOnBackdrop(e: React.MouseEvent<HTMLDialogElement>, onClose: () => void) {
  if (e.target === e.currentTarget) onClose();
}
