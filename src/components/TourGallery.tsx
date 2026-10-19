import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryItem } from '../types/tour';
import { useScrollFx } from '../hooks/useScrollFx';
import { SmartImage } from './SmartImage';

function Tile({ item, onOpen }: { item: GalleryItem; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useScrollFx(ref, 'through');
  const cls = `gallery__item${item.tall ? ' gallery__item--tall' : ''}${item.wide ? ' gallery__item--wide' : ''}`;
  return (
    <li className={cls}>
      <button type="button" ref={ref} className="gallery__btn" onClick={onOpen} aria-haspopup="dialog">
        <span className="gallery__frame">
          <SmartImage image={item.image} sizes="(min-width: 1080px) 300px, 50vw" />
        </span>
        <span className="gallery__caption">{item.caption}</span>
        <span className="sr-only"> — ampliar foto</span>
      </button>
    </li>
  );
}

export function TourGallery({ items }: { items: GalleryItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const startX = useRef<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = useCallback(
    (dir: number) => setIndex((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, step]);

  const onPointerDown = (e: PointerEvent) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };

  const current = index === null ? null : items[index];

  return (
    <>
      <ul className="gallery">
        {items.map((item, i) => (
          <Tile key={item.id} item={item} onOpen={() => open(i)} />
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Foto ampliada"
        onClose={() => setIndex(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {current ? (
          <figure className="lightbox__figure" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
            <img
              key={current.id}
              src={current.image.src}
              width={current.image.width}
              height={current.image.height}
              alt={current.image.alt}
              className="lightbox__img"
            />
            <figcaption className="lightbox__caption">
              <span>{current.caption}</span>
              <span className="lightbox__count" aria-live="polite">
                {index! + 1} de {items.length}
              </span>
            </figcaption>
          </figure>
        ) : null}
        <button type="button" className="lightbox__btn lightbox__btn--close" onClick={close} aria-label="Fechar foto">
          <X size={24} aria-hidden="true" />
        </button>
        <button type="button" className="lightbox__btn lightbox__btn--prev" onClick={() => step(-1)} aria-label="Foto anterior">
          <ChevronLeft size={26} aria-hidden="true" />
        </button>
        <button type="button" className="lightbox__btn lightbox__btn--next" onClick={() => step(1)} aria-label="Próxima foto">
          <ChevronRight size={26} aria-hidden="true" />
        </button>
      </dialog>
    </>
  );
}
