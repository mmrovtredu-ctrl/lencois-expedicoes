import { useEffect, useRef, useState } from 'react';
import type { ImageAsset } from '../types/tour';

interface Props {
  image: ImageAsset;
  className?: string;
  eager?: boolean;
  sizes?: string;
}

/** Imagem com dimensões explícitas (sem CLS), lazy loading e fallback se falhar. */
export function SmartImage({ image, className, eager = false, sizes }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // A imagem pode falhar antes da hidratação; confere o estado ao montar.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <span className={`img-fallback ${className ?? ''}`} role="img" aria-label={image.alt}>
        <span>Imagem indisponível</span>
      </span>
    );
  }

  return (
    <img
      ref={ref}
      src={image.src}
      width={image.width}
      height={image.height}
      alt={image.alt}
      sizes={sizes}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
