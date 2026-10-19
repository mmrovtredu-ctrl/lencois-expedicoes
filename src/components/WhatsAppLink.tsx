import type { ReactNode } from 'react';
import { whatsappLink } from '../lib/whatsapp';
import { WhatsAppIcon } from './Icons';

interface Props {
  message?: string;
  children: ReactNode;
  variant?: 'wa' | 'blue' | 'light' | 'outline-light';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  className?: string;
  onClick?: () => void;
}

/** Botão/link padrão para abrir o WhatsApp com mensagem pré-preenchida. */
export function WhatsAppLink({
  message,
  children,
  variant = 'wa',
  size = 'md',
  block = false,
  className = '',
  onClick,
}: Props) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn--${variant} btn--${size}${block ? ' btn--block' : ''} ${className}`}
      onClick={onClick}
    >
      <WhatsAppIcon size={size === 'sm' ? 16 : 19} />
      <span>{children}</span>
      <span className="sr-only"> (abre o WhatsApp em nova aba)</span>
    </a>
  );
}
