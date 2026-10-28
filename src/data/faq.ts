import type { FaqItem } from '../types/tour';
import { TOURS } from './tours';
import { PRIVATE_TOURS } from './privateTours';
import { formatBRL } from '../lib/format';

const listPt = (items: string[]) =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;

const quad = TOURS.find((t) => t.id === 'quadriciclo')!;

export const FAQ: FaqItem[] = [
  {
    question: 'Quais passeios estão disponíveis?',
    answer: [
      `Passeios individuais: ${listPt(TOURS.map((t) => t.name))}.`,
      `Passeios privativos: ${listPt(PRIVATE_TOURS.map((t) => t.name))}.`,
    ],
  },
  {
    question: 'Qual é a diferença entre passeios individuais e privativos?',
    answer: [
      'Nos passeios individuais, o valor é cobrado por pessoa. A exceção é o quadriciclo, cobrado por veículo.',
      'Nos privativos, o passeio é só para o seu grupo e tem um valor único por roteiro, conforme a tabela. No Caburé, o privativo é feito em lancha de 12 lugares. Para capacidade e condições dos demais privativos, fale com a equipe.',
    ],
  },
  {
    question: 'O que está incluído no passeio de Caburé?',
    answer: [
      'O roteiro é feito em lancha voadeira pelo Rio Preguiças, com paradas em Vassouras (Pequenos Lençóis e fauna local), no povoado de Mandacaru, onde é possível subir no Farol Preguiças, e na praia de Caburé, para banho de rio ou de mar.',
      'Para outros detalhes do pacote, consulte a equipe pelo WhatsApp.',
    ],
  },
  {
    question: 'O almoço está incluído no passeio de Caburé?',
    answer: [
      'Não. O almoço na praia de Caburé não está incluído no pacote. Em Vassouras há ponto de apoio para consumo de bebidas e comidas.',
    ],
  },
  {
    question: 'Quantas pessoas podem ir no quadriciclo?',
    answer: [
      `No máximo duas pessoas por quadriciclo. O valor de ${formatBRL(quad.price)} é por quadriciclo, não por pessoa.`,
    ],
  },
  {
    question: 'Os nomes e a ordem das lagoas podem mudar?',
    answer: [
      'Sim. As lagoas visitadas podem mudar de nome e de ordem de acordo com a estação. A equipe sempre leva o grupo às melhores lagoas de cada circuito.',
    ],
  },
  {
    question: 'Como consultar disponibilidade e reservar?',
    answer: [
      'Toque em “Escolher data e reservar” no passeio, escolha o dia e quantas pessoas vão. Você pode adicionar vários passeios ao seu roteiro e, no fim, informa nome e e-mail (CPF é opcional).',
      'Ao enviar, a conversa abre no WhatsApp com tudo já escrito: passeios, datas, pessoas e valor estimado. Nada é cobrado no site — a equipe confirma as vagas e combina o pagamento por lá.',
    ],
  },
  {
    question: 'Qual a melhor época para ver as lagoas cheias?',
    answer: [
      'As lagoas enchem com as chuvas do começo do ano e costumam estar mais cheias de maio a agosto. De novembro a fevereiro ficam mais baixas, e a equipe leva o grupo às que estiverem melhores.',
      'Veja a estimativa mês a mês na seção “Como estão as lagoas” e pergunte à equipe como estão na semana da sua viagem.',
    ],
  },
  {
    question: 'Formas de pagamento, cancelamento, hospedagem e transporte',
    answer: [
      'Essas condições são combinadas diretamente com a equipe. Fale pelo WhatsApp para saber como funciona no seu caso.',
    ],
  },
];
