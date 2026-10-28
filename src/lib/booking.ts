import { useSyncExternalStore } from 'react';
import { TOURS } from '../data/tours';
import { PRIVATE_TOURS } from '../data/privateTours';
import { lagoonStatus } from '../data/lagoons';
import type { PrivateTour, TimeSlot, Tour } from '../types/tour';
import { formatBRL } from './format';
import { track } from './analytics';

/* =========================================================
   Reserva + "Meu roteiro"
   Tudo no navegador: nada é cobrado nem gravado em servidor.
   A reserva termina numa mensagem pronta no WhatsApp.
   ========================================================= */

export type BookingKind = 'tour' | 'private';

export interface BookingTarget {
  kind: BookingKind;
  id: string;
}

export interface BookingItem extends BookingTarget {
  key: string;
  /** AAAA-MM-DD (data local). */
  date: string;
  adults: number;
  children: number;
  /** Só quadriciclo: quantidade de veículos. */
  vehicles: number;
}

export interface TripContact {
  name: string;
  email: string;
  /** Opcional. Só vai na mensagem; não é salvo no navegador. */
  cpf: string;
  pickup: string;
}

interface State {
  items: BookingItem[];
  contact: TripContact;
  /** Passeio aberto no formulário de reserva. */
  open: (BookingTarget & { editKey?: string }) | null;
  cartOpen: boolean;
}

const STORAGE_KEY = 'le-roteiro-v1';
const EMPTY: State = { items: [], contact: { name: '', email: '', cpf: '', pickup: '' }, open: null, cartOpen: false };

let state: State = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items, contact: { ...state.contact, cpf: '' } }));
  } catch {
    /* modo privado / armazenamento bloqueado: o roteiro vale só nesta visita */
  }
}

/** Lê o roteiro salvo (uma vez, só no navegador) e descarta datas que já passaram. */
function hydrate() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as Partial<State>;
    const today = todayISO();
    const items = (saved.items ?? []).filter((i) => i && i.date >= today && findTarget(i));
    state = { ...state, items, contact: { ...EMPTY.contact, ...saved.contact } };
  } catch {
    /* ignora dado corrompido */
  }
}

function set(patch: Partial<State>, save = false) {
  state = { ...state, ...patch };
  if (save) persist();
  emit();
}

function subscribe(l: () => void) {
  hydrate();
  listeners.add(l);
  // Avisa quem montou depois da leitura do localStorage.
  queueMicrotask(l);
  return () => listeners.delete(l);
}

export function useBooking(): State {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => EMPTY,
  );
}

/* ---------- Ações ---------- */

export const booking = {
  open(target: BookingTarget, editKey?: string) {
    set({ open: { ...target, editKey }, cartOpen: false });
    const t = findTarget(target);
    if (t && !editKey)
      track('view_item', { currency: 'BRL', value: t.price, items: [{ item_id: target.id, item_name: t.name, price: t.price }] });
  },
  close() {
    set({ open: null });
  },
  openCart() {
    set({ cartOpen: true, open: null });
    if (state.items.length) track('begin_checkout', { currency: 'BRL', ...analyticsItems(state.items) });
  },
  closeCart() {
    set({ cartOpen: false });
  },
  upsert(item: Omit<BookingItem, 'key'>, key?: string) {
    const items = key
      ? state.items.map((i) => (i.key === key ? { ...item, key } : i))
      : [...state.items, { ...item, key: `${item.id}-${Date.now().toString(36)}` }];
    set({ items: sortItems(items) }, true);
    if (!key) track('add_to_cart', { currency: 'BRL', ...analyticsItems([{ ...item, key: '' }]) });
  },
  remove(key: string) {
    set({ items: state.items.filter((i) => i.key !== key) }, true);
  },
  clear() {
    set({ items: [] }, true);
  },
  setContact(patch: Partial<TripContact>) {
    set({ contact: { ...state.contact, ...patch } }, true);
  },
};

function sortItems(items: BookingItem[]) {
  return [...items].sort((a, b) => a.date.localeCompare(b.date) || slotOf(a).start - slotOf(b).start);
}

/* ---------- Dados do passeio ---------- */

export interface ResolvedTarget {
  kind: BookingKind;
  name: string;
  /** Nome curto para a mensagem e o carrinho. */
  label: string;
  price: number;
  schedule: string;
  slot: TimeSlot;
  isVehicle: boolean;
  maxPeople?: number;
  capacity?: string;
  tour?: Tour;
  privateTour?: PrivateTour;
}

const DEFAULT_SLOT: TimeSlot = { start: 8, end: 18 };

export function findTarget(t: BookingTarget): ResolvedTarget | null {
  if (t.kind === 'tour') {
    const tour = TOURS.find((x) => x.id === t.id);
    if (!tour) return null;
    return {
      kind: 'tour',
      name: tour.name,
      label: tour.name,
      price: tour.price,
      schedule: tour.schedule,
      slot: tour.slot,
      isVehicle: tour.unit === 'quadriciclo',
      tour,
    };
  }
  const p = PRIVATE_TOURS.find((x) => x.id === t.id);
  if (!p) return null;
  const related = TOURS.find((x) => x.id === p.relatedTourId);
  return {
    kind: 'private',
    name: `Privativo ${p.name}`,
    label: `${p.name} (privativo)`,
    price: p.price,
    schedule: related?.schedule ?? 'Horário combinado com a equipe',
    slot: related?.slot ?? DEFAULT_SLOT,
    isVehicle: false,
    maxPeople: p.maxPeople,
    capacity: p.capacity,
    privateTour: p,
  };
}

function slotOf(i: BookingTarget) {
  return findTarget(i)?.slot ?? DEFAULT_SLOT;
}

/** Total estimado. Crianças em passeio por pessoa ficam "a confirmar" (política não documentada). */
export function itemTotal(i: Pick<BookingItem, 'kind' | 'id' | 'adults' | 'vehicles'>): number {
  const t = findTarget(i);
  if (!t) return 0;
  if (t.kind === 'private') return t.price;
  if (t.isVehicle) return t.price * i.vehicles;
  return t.price * i.adults;
}

export function hasChildrenToConfirm(i: Pick<BookingItem, 'kind' | 'id' | 'children'>) {
  const t = findTarget(i);
  return !!t && t.kind === 'tour' && !t.isVehicle && i.children > 0;
}

/* ---------- Datas ---------- */

const pad = (n: number) => String(n).padStart(2, '0');
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => toISO(new Date());

export function parseISO(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const fmtLong = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
const fmtChipDay = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });

/** "sáb., 14/11/2026" */
export const formatDate = (iso: string) => {
  const d = iso ? parseISO(iso) : null;
  return d && !Number.isNaN(d.getTime()) ? fmtLong.format(d).replace('.,', ',') : 'a combinar';
};
export const weekdayShort = (d: Date) => fmtChipDay.format(d).replace('.', '');

export function nextDays(n: number, from = new Date()) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    return d;
  });
}

/* ---------- Conflitos e sugestões ---------- */

const overlaps = (a: TimeSlot, b: TimeSlot) => a.start < b.end && b.start < a.end;

/** Para cada item, os outros passeios do mesmo dia que batem de horário. */
export function conflictsFor(items: BookingItem[]) {
  const map = new Map<string, string[]>();
  for (const a of items) {
    const names = items
      .filter((b) => b.key !== a.key && b.date === a.date && overlaps(slotOf(a), slotOf(b)))
      .map((b) => findTarget(b)?.label ?? '');
    if (names.length) map.set(a.key, names);
  }
  return map;
}

/** Passeios individuais que cabem no mesmo dia (ex.: Lagoa Azul de manhã + Lagoa Bonita à tarde). */
export function sameDayCombos(id: string, kind: BookingKind): Tour[] {
  const t = findTarget({ id, kind });
  if (!t) return [];
  return TOURS.filter((x) => x.id !== (t.tour?.id ?? t.privateTour?.relatedTourId) && !overlaps(x.slot, t.slot));
}

/* ---------- Mensagem do WhatsApp ---------- */

function peopleText(i: BookingItem, t: ResolvedTarget) {
  const a = `${i.adults} ${i.adults === 1 ? 'adulto' : 'adultos'}`;
  const c = i.children ? ` + ${i.children} ${i.children === 1 ? 'criança' : 'crianças'}` : '';
  const v = t.isVehicle ? `${i.vehicles} ${i.vehicles === 1 ? 'quadriciclo' : 'quadriciclos'} · ` : '';
  return `${v}${a}${c}`;
}

function itemLines(i: BookingItem, n?: number) {
  const t = findTarget(i);
  if (!t) return [];
  const head = n ? `${n}) ${t.name}` : t.name;
  const price =
    formatBRL(itemTotal(i)) + (hasChildrenToConfirm(i) ? ' + valor das crianças a confirmar' : '');
  return [
    `*${head}*`,
    `Data: ${formatDate(i.date)}`,
    `Pessoas: ${peopleText(i, t)}`,
    `Valor estimado: ${price}`,
  ];
}

export function buildMessage(items: BookingItem[], contact: TripContact) {
  const lines: string[] = ['Olá! Vim pelo site da Lençóis Expedições e quero reservar:', ''];
  items.forEach((i, idx) => {
    lines.push(...itemLines(i, items.length > 1 ? idx + 1 : undefined), '');
  });
  if (items.length > 1) {
    const total = items.reduce((s, i) => s + itemTotal(i), 0);
    const pending = items.some(hasChildrenToConfirm);
    lines.push(`*Total estimado: ${formatBRL(total)}*${pending ? ' (sem o valor das crianças)' : ''}`, '');
  }
  if (contact.name.trim()) lines.push(`Nome: ${contact.name.trim()}`);
  if (contact.email.trim()) lines.push(`E-mail: ${contact.email.trim()}`);
  if (onlyDigits(contact.cpf).length === 11) lines.push(`CPF: ${formatCPF(contact.cpf)}`);
  if (contact.pickup.trim()) lines.push(`Hospedagem em Barreirinhas: ${contact.pickup.trim()}`);
  lines.push(items.length > 1 ? 'Podem confirmar a disponibilidade?' : 'Pode confirmar a disponibilidade?');
  return lines.join('\n');
}

/** Dica de lagoas para a data escolhida (só passeios que passam por lagoas). */
const LAGOON_TOURS = new Set(['lagoa-azul', 'lagoa-bonita', 'atins', 'santo-amaro']);
export function lagoonHintFor(target: BookingTarget, iso: string) {
  const t = findTarget(target);
  const baseId = t?.tour?.id ?? t?.privateTour?.relatedTourId;
  if (!baseId || !LAGOON_TOURS.has(baseId) || !iso) return null;
  return lagoonStatus(parseISO(iso).getMonth());
}

/* ---------- Dados do cliente ---------- */

export const onlyDigits = (s: string) => s.replace(/\D/g, '');

/** 000.000.000-00 enquanto digita. */
export function formatCPF(s: string) {
  const d = onlyDigits(s).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
}

/** Valida os dígitos verificadores do CPF. */
export function isValidCPF(s: string) {
  const d = onlyDigits(s);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(d[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === Number(d[9]) && calc(10) === Number(d[10]);
}

export const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

export type ContactErrors = Partial<Record<'name' | 'email' | 'cpf', string>>;

export function validateContact(c: TripContact): ContactErrors {
  const e: ContactErrors = {};
  if (c.name.trim().length < 3) e.name = 'Informe seu nome.';
  if (!c.email.trim()) e.email = 'Informe seu e-mail.';
  else if (!isValidEmail(c.email)) e.email = 'E-mail inválido. Confira o endereço.';
  if (onlyDigits(c.cpf).length > 0 && !isValidCPF(c.cpf)) e.cpf = 'CPF inválido. Confira os números ou deixe em branco.';
  return e;
}

/** Itens no formato de e-commerce do GA4 (value = total estimado). */
export function analyticsItems(items: BookingItem[]) {
  return {
    value: items.reduce((s, i) => s + itemTotal(i), 0),
    items: items.map((i) => {
      const t = findTarget(i);
      return { item_id: i.id, item_name: t?.name ?? i.id, price: itemTotal(i), quantity: 1, item_category: i.kind };
    }),
  };
}
