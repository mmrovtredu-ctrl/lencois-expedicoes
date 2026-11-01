import type { ReactNode } from 'react';
import { MapPin } from 'lucide-react';
import {
  CONTACT_FIELDS,
  formatCPF,
  formatPhone,
  validateContact,
  type ContactErrors,
  type ContactField,
  type TripContact,
} from '../../lib/booking';

interface Props {
  /** Prefixo dos ids (o formulário aparece no diálogo de reserva e no roteiro). */
  idPrefix: string;
  contact: TripContact;
  errors: ContactErrors;
  onChange: (patch: Partial<TripContact>) => void;
  title?: ReactNode;
}

/** Nome e local de embarque obrigatórios; telefone, e-mail, CPF e endereço opcionais. */
export function ContactFields({ idPrefix, contact, errors, onChange, title }: Props) {
  const id = (k: ContactField) => `${idPrefix}-${k}`;
  const a11y = (k: ContactField) => ({
    id: id(k),
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `${id(k)}-erro` : undefined,
  });
  const err = (k: ContactField) =>
    errors[k] ? (
      <p className="field-error" id={`${id(k)}-erro`}>
        {errors[k]}
      </p>
    ) : null;
  const label = (k: ContactField, text: string, required?: boolean) => (
    <label className="field-label" htmlFor={id(k)}>
      {text} {required ? <span className="req">*</span> : <small>(opcional)</small>}
    </label>
  );

  return (
    <fieldset className="contact-fields">
      <legend className="field-title">{title ?? 'Seus dados'}</legend>
      <p className="field-help contact-fields__req">
        <span className="req">*</span> obrigatório
      </p>

      <div className="field">
        {label('name', 'Nome completo', true)}
        <input
          {...a11y('name')}
          enterKeyHint="next"
          type="text"
          autoComplete="name"
          required
          placeholder="Seu nome e sobrenome"
          value={contact.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
        {err('name')}
      </div>

      <div className="field">
        {label('pickup', 'Local de embarque', true)}
        <div className="input-icon">
          <MapPin size={18} aria-hidden="true" />
          <input
            {...a11y('pickup')}
          enterKeyHint="next"
            type="text"
            autoComplete="off"
            required
            placeholder="Pousada, hotel ou endereço em Barreirinhas"
            value={contact.pickup}
            onChange={(e) => onChange({ pickup: e.target.value })}
          />
        </div>
        {err('pickup')}
        {!errors.pickup ? <p className="field-help">Onde a equipe vai te buscar no dia do passeio.</p> : null}
      </div>

      <div className="field-row">
        <div className="field">
          {label('phone', 'Telefone / WhatsApp')}
          <input
            {...a11y('phone')}
          enterKeyHint="next"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(98) 99999-9999"
            maxLength={15}
            value={contact.phone}
            onChange={(e) => onChange({ phone: formatPhone(e.target.value) })}
          />
          {err('phone')}
        </div>
        <div className="field">
          {label('email', 'E-mail')}
          <input
            {...a11y('email')}
          enterKeyHint="next"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="voce@email.com"
            value={contact.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
          {err('email')}
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          {label('cpf', 'CPF')}
          <input
            {...a11y('cpf')}
          enterKeyHint="next"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="000.000.000-00"
            maxLength={14}
            value={contact.cpf}
            onChange={(e) => onChange({ cpf: formatCPF(e.target.value) })}
          />
          {err('cpf')}
        </div>
        <div className="field">
          {label('address', 'Endereço')}
          <input
            {...a11y('address')}
            enterKeyHint="done"
            type="text"
            autoComplete="street-address"
            placeholder="Rua, número, cidade/UF"
            value={contact.address}
            onChange={(e) => onChange({ address: e.target.value })}
          />
          {err('address')}
        </div>
      </div>
      <p className="field-help">CPF agiliza o cadastro do passeio e não fica salvo no site.</p>
    </fieldset>
  );
}

/** Valida, mostra erros e leva o foco ao primeiro campo com problema. Retorna true se ok. */
export function checkContact(
  contact: TripContact,
  idPrefix: string,
  root: HTMLElement | null,
  setErrors: (e: ContactErrors) => void,
) {
  const errs = validateContact(contact);
  setErrors(errs);
  const first = CONTACT_FIELDS.find((k) => errs[k]);
  if (!first) return true;
  const el = root?.querySelector<HTMLInputElement>(`#${idPrefix}-${first}`);
  el?.focus({ preventScroll: true });
  el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  return false;
}
