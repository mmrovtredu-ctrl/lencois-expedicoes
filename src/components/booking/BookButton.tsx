import type { ReactNode } from 'react';
import { CalendarCheck } from 'lucide-react';
import { booking, type BookingTarget } from '../../lib/booking';
import { whatsappLink } from '../../lib/whatsapp';

interface Props {
  target: BookingTarget;
  /** Mensagem usada se o JS não carregar (o link continua indo para o WhatsApp). */
  fallbackMessage: string;
  children: ReactNode;
  variant?: 'blue' | 'light' | 'wa';
  block?: boolean;
  className?: string;
}

/** Abre o formulário de reserva. Sem JS, vira um link comum para o WhatsApp. */
export function BookButton({ target, fallbackMessage, children, variant = 'blue', block, className = '' }: Props) {
  return (
    <a
      href={whatsappLink(fallbackMessage)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn--${variant} btn--md${block ? ' btn--block' : ''} ${className}`}
      aria-haspopup="dialog"
      data-book
      onClick={(e) => {
        e.preventDefault();
        booking.open(target);
      }}
    >
      <CalendarCheck size={19} aria-hidden="true" />
      <span>{children}</span>
    </a>
  );
}
