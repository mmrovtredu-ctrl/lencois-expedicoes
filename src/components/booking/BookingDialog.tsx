import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Check, Clock, Droplets, MapPin, X } from 'lucide-react';
import {
  booking,
  findTarget,
  formatDate,
  hasChildrenToConfirm,
  itemTotal,
  lagoonHintFor,
  nextDays,
  sameDayCombos,
  toISO,
  todayISO,
  useBooking,
  weekdayShort,
  buildMessage,
  type BookingItem,
} from '../../lib/booking';
import { formatBRL } from '../../lib/format';
import { whatsappLink } from '../../lib/whatsapp';
import { WhatsAppIcon } from '../Icons';
import { Counter } from './Counter';
import { closeOnBackdrop, useDialog } from './useDialog';

const QUICK_DAYS = 14;
const MAX_PEOPLE = 30;

/** Formulário de reserva de um passeio: data → pessoas → hospedagem → roteiro ou WhatsApp. */
export function BookingDialog() {
  const { open, items, contact } = useBooking();
  const ref = useRef<HTMLDialogElement>(null);
  useDialog(ref, !!open);

  const target = open ? findTarget(open) : null;
  const editing = open?.editKey ? items.find((i) => i.key === open.editKey) : undefined;

  const [date, setDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [vehicles, setVehicles] = useState(1);
  const [dateError, setDateError] = useState(false);
  const [added, setAdded] = useState(false);

  // Reinicia o formulário a cada abertura (ou carrega o item em edição).
  useEffect(() => {
    if (!open) return;
    setDate(editing?.date ?? '');
    setAdults(editing?.adults ?? 2);
    setChildren(editing?.children ?? 0);
    setVehicles(editing?.vehicles ?? 1);
    setDateError(false);
    setAdded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open?.id, open?.kind, open?.editKey]);

  const quick = useMemo(() => (open ? nextDays(QUICK_DAYS) : []), [open]);

  if (!open || !target) return <dialog ref={ref} className="sheet" aria-label="Reserva" />;

  const isVehicle = target.isVehicle;
  const maxPeople = isVehicle ? vehicles * 2 : (target.maxPeople ?? MAX_PEOPLE);
  const people = adults + children;
  const draft: Omit<BookingItem, 'key'> = { kind: open.kind, id: open.id, date, adults, children, vehicles };
  const total = itemTotal(draft);
  const lagoon = lagoonHintFor(open, date);
  const titleId = 'reserva-dialogo-titulo';

  // Mantém pessoas dentro da capacidade (quadriciclo: 2 por veículo).
  const setVehiclesSafe = (n: number) => {
    setVehicles(n);
    const cap = n * 2;
    if (adults + children > cap) {
      const a = Math.min(adults, cap);
      setAdults(Math.max(1, a));
      setChildren(Math.max(0, cap - Math.max(1, a)));
    }
  };

  const requireDate = () => {
    if (date) return true;
    setDateError(true);
    ref.current?.querySelector<HTMLElement>('.date-pick')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return false;
  };

  const add = () => {
    if (!requireDate()) return;
    booking.upsert(draft, editing?.key);
    if (editing) booking.openCart();
    else setAdded(true);
  };

  const directLink = whatsappLink(buildMessage([{ ...draft, key: 'x' }], contact));
  const combos = added ? sameDayCombos(open.id, open.kind) : [];

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby={titleId}
      onClose={() => booking.close()}
      onClick={(e) => closeOnBackdrop(e, () => booking.close())}
    >
      <div className="sheet__panel">
        <header className="sheet__head">
          <div>
            <p className="sheet__eyebrow">{target.kind === 'private' ? 'Passeio privativo' : 'Reservar passeio'}</p>
            <h2 id={titleId} className="sheet__title">
              {target.kind === 'private' ? target.privateTour?.name : target.name}
            </h2>
            <p className="sheet__meta">
              <Clock size={15} aria-hidden="true" />
              {target.schedule}
            </p>
          </div>
          <button type="button" className="sheet__close" onClick={() => booking.close()} aria-label="Fechar">
            <X size={22} aria-hidden="true" />
          </button>
        </header>

        {added ? (
          <div className="sheet__body sheet__done" role="status">
            <span className="sheet__done-icon" aria-hidden="true">
              <Check size={28} />
            </span>
            <h3>Adicionado ao seu roteiro</h3>
            <p>
              {target.label} · {formatDate(date)}
            </p>
            {combos.length ? (
              <div className="combos">
                <p className="combos__title">Dá para fazer no mesmo dia:</p>
                <ul>
                  {combos.slice(0, 3).map((c) => (
                    <li key={c.id}>
                      <button type="button" onClick={() => booking.open({ kind: 'tour', id: c.id })}>
                        <span>{c.name}</span>
                        <small>{c.schedule.split(',')[0]}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="sheet__actions">
              <button type="button" className="btn btn--blue btn--lg btn--block" onClick={() => booking.openCart()}>
                Ver meu roteiro e enviar
              </button>
              <button type="button" className="btn btn--ghost btn--block" onClick={() => booking.close()}>
                Continuar escolhendo passeios
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="sheet__body">
              {/* 1. Data */}
              <fieldset className={`date-pick${dateError && !date ? ' has-error' : ''}`}>
                <legend className="field-title">
                  <span className="field-step">1</span> Qual dia?
                </legend>
                <div className="date-pick__chips" role="listbox" aria-label="Próximos dias">
                  {quick.map((d) => {
                    const iso = toISO(d);
                    const sel = iso === date;
                    return (
                      <button
                        key={iso}
                        type="button"
                        role="option"
                        aria-selected={sel}
                        className={`date-chip${sel ? ' is-selected' : ''}`}
                        onClick={() => {
                          setDate(iso);
                          setDateError(false);
                        }}
                      >
                        <span className="date-chip__wd">{iso === todayISO() ? 'hoje' : weekdayShort(d)}</span>
                        <span className="date-chip__day">{d.getDate()}</span>
                        <span className="date-chip__mo">{d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                      </button>
                    );
                  })}
                </div>
                <label className="date-pick__other">
                  <CalendarDays size={18} aria-hidden="true" />
                  <span>Outra data:</span>
                  <input
                    type="date"
                    min={todayISO()}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setDateError(false);
                    }}
                  />
                </label>
                {dateError && !date ? <p className="field-error">Escolha a data do passeio.</p> : null}
                {date ? <p className="date-pick__chosen">{formatDate(date)}</p> : null}
                {lagoon ? (
                  <p className={`lagoon-tip lagoon-tip--${lagoon.tone}`}>
                    <Droplets size={16} aria-hidden="true" />
                    <span>
                      <strong>{lagoon.label}</strong> nesse mês (estimativa ~{lagoon.level}%). {lagoon.hint}
                    </span>
                  </p>
                ) : null}
              </fieldset>

              {/* 2. Pessoas */}
              <fieldset className="people-pick">
                <legend className="field-title">
                  <span className="field-step">2</span> Quantas pessoas?
                </legend>
                {isVehicle ? (
                  <Counter
                    label="Quadriciclos"
                    hint={`${formatBRL(target.price)} cada · até 2 pessoas`}
                    value={vehicles}
                    min={1}
                    max={10}
                    onChange={setVehiclesSafe}
                  />
                ) : null}
                <Counter
                  label="Adultos"
                  hint={target.kind === 'tour' && !isVehicle ? `${formatBRL(target.price)} por pessoa` : undefined}
                  value={adults}
                  min={1}
                  max={Math.max(1, maxPeople - children)}
                  onChange={setAdults}
                />
                <Counter
                  label="Crianças"
                  hint={target.kind === 'tour' && !isVehicle ? 'Valor confirmado pela equipe' : undefined}
                  value={children}
                  min={0}
                  max={Math.max(0, maxPeople - adults)}
                  onChange={setChildren}
                />
                {people >= maxPeople ? (
                  <p className="field-note">
                    {isVehicle
                      ? 'Cada quadriciclo leva até 2 pessoas. Adicione outro veículo para mais gente.'
                      : target.maxPeople
                        ? `Capacidade máxima: ${target.maxPeople} pessoas (${target.capacity?.toLowerCase()}).`
                        : 'Grupo grande? Fale com a equipe para combinar.'}
                  </p>
                ) : null}
              </fieldset>

              {/* 3. Hospedagem */}
              <div className="field">
                <label className="field-title" htmlFor="reserva-hospedagem">
                  <span className="field-step">3</span> Onde vai se hospedar? <small>(opcional)</small>
                </label>
                <div className="input-icon">
                  <MapPin size={18} aria-hidden="true" />
                  <input
                    id="reserva-hospedagem"
                    type="text"
                    autoComplete="off"
                    placeholder="Nome da pousada ou hotel"
                    value={contact.pickup}
                    onChange={(e) => booking.setContact({ pickup: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <footer className="sheet__foot">
              <div className="sheet__total">
                <span className="sheet__total-label">
                  {target.kind === 'private' ? 'Valor do privativo' : 'Total estimado'}
                </span>
                <span className="sheet__total-value">{formatBRL(total)}</span>
                {hasChildrenToConfirm(draft) ? (
                  <span className="sheet__total-note">+ crianças (a confirmar)</span>
                ) : (
                  <span className="sheet__total-note">Sem pagamento agora</span>
                )}
              </div>
              <div className="sheet__actions">
                <button type="button" className="btn btn--blue btn--lg btn--block" onClick={add}>
                  {editing ? 'Salvar alterações' : 'Adicionar ao meu roteiro'}
                </button>
                {!editing ? (
                  <a
                    className="btn btn--wa btn--block"
                    href={directLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!requireDate()) e.preventDefault();
                    }}
                  >
                    <WhatsAppIcon size={18} />
                    <span>Reservar só este pelo WhatsApp</span>
                  </a>
                ) : null}
              </div>
            </footer>
          </>
        )}
      </div>
    </dialog>
  );
}
