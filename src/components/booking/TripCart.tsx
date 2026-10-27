import { useRef } from 'react';
import { AlertTriangle, ChevronRight, Pencil, Trash2, X } from 'lucide-react';
import {
  booking,
  buildMessage,
  conflictsFor,
  findTarget,
  formatDate,
  hasChildrenToConfirm,
  itemTotal,
  useBooking,
} from '../../lib/booking';
import { formatBRL } from '../../lib/format';
import { whatsappLink } from '../../lib/whatsapp';
import { WhatsAppIcon } from '../Icons';
import { closeOnBackdrop, useDialog } from './useDialog';

/** Fecha o roteiro e rola até os passeios (o <dialog> aberto trava a rolagem da página). */
function goToTours(e: React.MouseEvent) {
  e.preventDefault();
  booking.closeCart();
  requestAnimationFrame(() => document.getElementById('passeios')?.scrollIntoView({ behavior: 'smooth' }));
}

const plural = (n: number) => `${n} ${n === 1 ? 'passeio' : 'passeios'}`;

/** Barra fixa "Meu roteiro" — aparece quando há passeios escolhidos. */
export function TripBar({ hidden }: { hidden: boolean }) {
  const { items, open, cartOpen } = useBooking();
  const total = items.reduce((s, i) => s + itemTotal(i), 0);
  const visible = items.length > 0 && !hidden && !open && !cartOpen;
  return (
    <div className={`trip-bar${visible ? ' is-visible' : ''}`} aria-hidden={!visible}>
      <button type="button" className="trip-bar__btn" onClick={() => booking.openCart()} tabIndex={visible ? 0 : -1}>
        <span className="trip-bar__count" aria-hidden="true">
          {items.length}
        </span>
        <span className="trip-bar__text">
          <strong>Meu roteiro</strong>
          <small>
            {plural(items.length)} · {formatBRL(total)}
          </small>
        </span>
        <span className="trip-bar__cta">
          <span className="trip-bar__cta-long">Revisar e enviar</span>
          <span className="trip-bar__cta-short">Enviar</span> <ChevronRight size={18} aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}

/** Revisão do roteiro: edita, remove, avisa conflito de horário e envia tudo numa mensagem. */
export function TripCart() {
  const { items, contact, cartOpen } = useBooking();
  const ref = useRef<HTMLDialogElement>(null);
  useDialog(ref, cartOpen);

  const conflicts = conflictsFor(items);
  const total = items.reduce((s, i) => s + itemTotal(i), 0);
  const pending = items.some(hasChildrenToConfirm);
  const message = buildMessage(items, contact);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="roteiro-titulo"
      onClose={() => booking.closeCart()}
      onClick={(e) => closeOnBackdrop(e, () => booking.closeCart())}
    >
      <div className="sheet__panel">
        <header className="sheet__head">
          <div>
            <p className="sheet__eyebrow">Sem pagamento agora</p>
            <h2 id="roteiro-titulo" className="sheet__title">
              Meu roteiro
            </h2>
            <p className="sheet__meta">A equipe confirma vagas e combina o pagamento pelo WhatsApp.</p>
          </div>
          <button type="button" className="sheet__close" onClick={() => booking.closeCart()} aria-label="Fechar">
            <X size={22} aria-hidden="true" />
          </button>
        </header>

        <div className="sheet__body">
          {items.length === 0 ? (
            <div className="trip-empty">
              <p>Seu roteiro está vazio.</p>
              <a className="btn btn--blue" href="#passeios" onClick={goToTours}>
                Ver passeios
              </a>
            </div>
          ) : (
            <>
              <ol className="trip-list">
                {items.map((i) => {
                  const t = findTarget(i);
                  if (!t) return null;
                  const clash = conflicts.get(i.key);
                  return (
                    <li key={i.key} className="trip-item">
                      <div className="trip-item__main">
                        <p className="trip-item__date">{formatDate(i.date)}</p>
                        <h3 className="trip-item__name">{t.label}</h3>
                        <p className="trip-item__people">
                          {t.isVehicle ? `${i.vehicles} quadriciclo${i.vehicles > 1 ? 's' : ''} · ` : ''}
                          {i.adults} adulto{i.adults > 1 ? 's' : ''}
                          {i.children ? ` + ${i.children} criança${i.children > 1 ? 's' : ''}` : ''}
                        </p>
                        {clash ? (
                          <p className="trip-item__warn">
                            <AlertTriangle size={15} aria-hidden="true" />
                            <span>Horário bate com {clash.join(', ')} no mesmo dia.</span>
                          </p>
                        ) : null}
                      </div>
                      <div className="trip-item__side">
                        <p className="trip-item__price">{formatBRL(itemTotal(i))}</p>
                        <div className="trip-item__tools">
                          <button
                            type="button"
                            onClick={() => booking.open({ kind: i.kind, id: i.id }, i.key)}
                            aria-label={`Editar ${t.label}`}
                          >
                            <Pencil size={17} aria-hidden="true" />
                          </button>
                          <button type="button" onClick={() => booking.remove(i.key)} aria-label={`Remover ${t.label}`}>
                            <Trash2 size={17} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <a className="trip-more" href="#passeios" onClick={goToTours}>
                + Adicionar outro passeio
              </a>

              <div className="field">
                <label className="field-title" htmlFor="roteiro-nome">
                  Seu nome <small>(opcional)</small>
                </label>
                <input
                  id="roteiro-nome"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Como podemos te chamar?"
                  value={contact.name}
                  onChange={(e) => booking.setContact({ name: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="field-title" htmlFor="roteiro-hospedagem">
                  Hospedagem em Barreirinhas <small>(opcional)</small>
                </label>
                <input
                  id="roteiro-hospedagem"
                  type="text"
                  autoComplete="off"
                  placeholder="Nome da pousada ou hotel"
                  value={contact.pickup}
                  onChange={(e) => booking.setContact({ pickup: e.target.value })}
                />
              </div>
            </>
          )}
        </div>

        {items.length ? (
          <footer className="sheet__foot">
            <div className="sheet__total">
              <span className="sheet__total-label">Total estimado</span>
              <span className="sheet__total-value">{formatBRL(total)}</span>
              <span className="sheet__total-note">{pending ? '+ crianças (a confirmar)' : plural(items.length)}</span>
            </div>
            <div className="sheet__actions">
              <a className="btn btn--wa btn--lg btn--block" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={19} />
                <span>Enviar roteiro pelo WhatsApp</span>
              </a>
              <button
                type="button"
                className="btn btn--ghost btn--block"
                onClick={() => {
                  if (confirm('Remover todos os passeios do roteiro?')) booking.clear();
                }}
              >
                Limpar roteiro
              </button>
            </div>
          </footer>
        ) : null}
      </div>
    </dialog>
  );
}
