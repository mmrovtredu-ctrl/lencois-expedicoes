import { useEffect, type RefObject } from 'react';

/** Abre/fecha um <dialog> modal conforme `open` (foco preso e Esc nativos). */
export function useDialog(ref: RefObject<HTMLDialogElement | null>, open: boolean) {
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [ref, open]);
}

/** Clique no fundo escurecido fecha o diálogo. */
export function closeOnBackdrop(e: React.MouseEvent<HTMLDialogElement>, onClose: () => void) {
  if (e.target === e.currentTarget) onClose();
}
