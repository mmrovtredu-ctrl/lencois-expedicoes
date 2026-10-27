import { Minus, Plus } from 'lucide-react';

interface Props {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}

/** Contador acessível: botões de 44px e valor anunciado ao leitor de tela. */
export function Counter({ label, hint, value, min, max, onChange }: Props) {
  return (
    <div className="counter">
      <div className="counter__text">
        <span className="counter__label">{label}</span>
        {hint ? <span className="counter__hint">{hint}</span> : null}
      </div>
      <div className="counter__ctrl" role="group" aria-label={label}>
        <button
          type="button"
          className="counter__btn"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Diminuir ${label.toLowerCase()}`}
        >
          <Minus size={18} aria-hidden="true" />
        </button>
        <output className="counter__value" aria-live="polite">
          {value}
        </output>
        <button
          type="button"
          className="counter__btn"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Aumentar ${label.toLowerCase()}`}
        >
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
