import type { Tour } from '../types/tour';

/**
 * Passeios individuais.
 * - Descrições, horários e roteiros: Material 1 (Portfólio de passeios).
 * - Preços: Material 2 (Descritivo de roteiros). Não altere sem confirmação da agência.
 */
export const TOURS: Tour[] = [
  {
    id: 'lagoa-azul',
    name: 'Circuito Lagoa Azul',
    image: {
      src: '/images/tours/lagoa-azul.webp',
      width: 560,
      height: 420,
      alt: 'Turista de chapéu sentada à beira de uma lagoa azul entre as dunas',
    },
    summary:
      'Balsa pelo Rio Preguiças, trilha de areia pelo cerrado e caminhada pelas principais lagoas e dunas.',
    schedule: 'Saída às 9h, retorno a Barreirinhas às 13h',
    slot: { start: 9, end: 13 },
    highlights: [
      'Travessia de balsa pelo Rio Preguiças',
      'Cerca de 45 min de trilha até as dunas',
      'Lagoa Azul, Lagoa da Esmeralda e Lagoa do Peixe',
    ],
    itinerary: [
      'O trajeto começa com a travessia de balsa pelo Rio Preguiças, de apenas 3 minutos.',
      'Em seguida, o carro percorre uma trilha de areia de cerca de 45 minutos, cortando a vegetação do cerrado até a chegada às dunas.',
      'Descemos do veículo e fazemos uma caminhada de 5 a 10 minutos para conhecer as principais lagoas e dunas. Entre elas, destacam-se a Lagoa Azul, a Lagoa da Esmeralda e a Lagoa do Peixe.',
    ],
    price: 160,
    unit: 'pessoa',
    message: (p) =>
      `Olá! Conheci o site da Lençóis Expedições e gostaria de consultar a disponibilidade do Circuito Lagoa Azul, no valor de ${p}.`,
  },
  {
    id: 'lagoa-bonita',
    name: 'Circuito Lagoa Bonita',
    image: {
      src: '/images/tours/lagoa-bonita.webp',
      width: 432,
      height: 324,
      alt: 'Turista sentada na areia das dunas ao pôr do sol',
    },
    summary:
      'Subida de uma duna de 40 metros, mergulho nas lagoas cristalinas e pôr do sol do alto da primeira duna.',
    schedule: 'Saída às 14h, retorno a Barreirinhas às 19h',
    slot: { start: 14, end: 19 },
    highlights: [
      'Cerca de 1h de trilha em veículo 4x4',
      'Subida por escada em duna de 40 m',
      'Pôr do sol na primeira duna',
    ],
    itinerary: [
      'O trajeto começa com a travessia de balsa pelo Rio Preguiças. Depois, o carro segue por cerca de 1 hora de trilha de areia, em veículo 4x4, até o parque.',
      'No ponto inicial, o visitante sobe por uma escada uma duna de aproximadamente 40 metros de altura e, em seguida, faz uma caminhada pelas principais lagoas.',
      'Depois de bons mergulhos nas águas cristalinas, antes do entardecer, voltamos à primeira duna para apreciar o pôr do sol.',
    ],
    price: 160,
    unit: 'pessoa',
    message: (p) =>
      `Olá! Gostaria de consultar a disponibilidade do Circuito Lagoa Bonita, no valor de ${p}.`,
  },
  {
    id: 'atins',
    name: 'Circuito Atins',
    image: {
      src: '/images/tours/atins.webp',
      width: 543,
      height: 407,
      alt: 'Praticantes de kitesurf no mar ao entardecer, em Atins',
    },
    summary:
      'Da foz do Rio Preguiças, onde o rio encontra o Atlântico, até o mar e as lagoas do Canto do Atins.',
    schedule: 'Saída às 8h30, retorno a Barreirinhas às 17h',
    slot: { start: 8.5, end: 17 },
    highlights: [
      'Foz do Rio Preguiças',
      'Canto do Atins, início do Parque Nacional',
      'Mar e lagoas, com parada para mergulho',
    ],
    itinerary: [
      'O trajeto começa com a travessia de balsa pelo Rio Preguiças. O carro segue por uma trilha de areia de cerca de 1h30 até a Foz do Rio Preguiças, onde se vê o encontro do rio com o Oceano Atlântico.',
      'São mais 15 minutos de 4x4 até o Canto do Atins, início do Parque Nacional dos Lençóis Maranhenses, com parada para almoço em restaurante (opções: Sra. Luzia ou Sr. Antônio).',
      'Depois, visitamos de veículo o mar e as lagoas do parque, onde ficam algumas das lagoas mais bonitas e maiores para banho, com parada para mergulho.',
    ],
    price: 230,
    unit: 'pessoa',
    message: (p) =>
      `Olá! Gostaria de saber a disponibilidade do Circuito Atins, no valor de ${p}.`,
  },
  {
    id: 'cabure',
    name: 'Circuito Caburé',
    image: {
      src: '/images/tours/cabure.webp',
      width: 432,
      height: 324,
      alt: 'Vista aérea da faixa de areia de Caburé, entre o rio e o mar',
    },
    summary:
      'Descida do Rio Preguiças em lancha voadeira, com paradas em Vassouras, Mandacaru e na praia de Caburé.',
    schedule: 'Saída às 8h30, retorno a Barreirinhas às 15h30',
    slot: { start: 8.5, end: 15.5 },
    highlights: [
      'Vassouras e os Pequenos Lençóis',
      'Farol Preguiças, em Mandacaru',
      'Banho de rio ou de mar em Caburé',
    ],
    itinerary: [
      'Embarque em lancha voadeira na orla da cidade, descendo o Rio Preguiças e conhecendo alguns pontos turísticos.',
      'Primeira parada: Vassouras, para visitar os Pequenos Lençóis Maranhenses e conhecer a fauna local. A região se destaca pela grande quantidade de macacos e é ponto de apoio para consumo de bebidas e comidas.',
      'Segunda parada: povoado de Mandacaru, pequena comunidade de pescadores, onde é possível subir no Farol Preguiças e ter uma vista panorâmica dos Lençóis Maranhenses, do Rio Preguiças e do Oceano Atlântico.',
      'Por último, a praia de Caburé, para almoçar e tomar banho de rio ou de mar.',
    ],
    notes: ['Almoço não incluído no pacote.'],
    price: 150,
    unit: 'pessoa',
    message: (p) =>
      `Olá! Tenho interesse no passeio de Caburé, no valor de ${p}. Poderiam me passar mais informações sobre a disponibilidade?`,
  },
  {
    id: 'quadriciclo',
    name: 'Quadriciclo nos Pequenos Lençóis',
    image: {
      src: '/images/tours/quadriciclo.webp',
      width: 516,
      height: 387,
      alt: 'Turista sobre um quadriciclo vermelho nas dunas ao entardecer',
    },
    summary:
      'Você pilota pelos Pequenos Lençóis e pela costa até a praia de Caburé, depois das instruções do guia.',
    schedule: 'Saída às 8h30, retorno a Barreirinhas às 16h',
    slot: { start: 8.5, end: 16 },
    highlights: [
      'Até 2 pessoas por quadriciclo',
      'Cerca de 2h30 de percurso',
      'Chegada a Caburé por volta das 12h',
    ],
    itinerary: [
      'O quadriciclo leva no máximo duas pessoas. Antes do passeio, o guia passa as instruções de pilotagem e, quando todos estão aptos a conduzir, saímos em fila.',
      'O percurso, de cerca de 2h30, passa pelos Pequenos Lençóis e pela costa litorânea até a praia de Caburé, com chegada por volta das 12h.',
      'Em Caburé há parada para almoço, e o banho de mar e de rio também faz parte da aventura.',
    ],
    notes: [
      'Almoço em Caburé não incluído no pacote.',
      'Leve água e lanche para consumir durante o percurso.',
    ],
    price: 650,
    unit: 'quadriciclo',
    unitDetail: 'até 2 pessoas por veículo',
    message: (p) =>
      `Olá! Tenho interesse no passeio de quadriciclo pelos Pequenos Lençóis, no valor de ${p}. Gostaria de consultar a disponibilidade.`,
  },
  {
    id: 'cardosa',
    name: 'Boia Cross em Cardosa',
    image: {
      src: '/images/tours/cardosa.webp',
      width: 600,
      height: 450,
      alt: 'Grupo flutuando em boias no Rio Formiga, cercado de vegetação',
    },
    summary: 'Flutuação de boia pelas águas cristalinas do Rio Formiga, no povoado de Cardosa.',
    schedule: 'Saída às 8h30, retorno a Barreirinhas às 13h',
    slot: { start: 8.5, end: 13 },
    highlights: [
      'Cerca de 1h20 de 4x4 até Cardosa',
      'Descida de boia de cerca de 1h',
      'Rio calmo, sem correntezas fortes',
    ],
    itinerary: [
      'O passeio começa em veículo 4x4, com percurso de cerca de 1h20 até o povoado Cardosa.',
      'Lá, pegamos as boias para a flutuação no Rio Formiga, de águas cristalinas: banho refrescante e uma ótima opção para mergulho.',
      'A descida pelo rio dura em média 1 hora e é calma, sem correntezas fortes.',
    ],
    price: 120,
    unit: 'pessoa',
    message: (p) =>
      `Olá! Gostaria de consultar a disponibilidade do Boia Cross em Cardosa, no valor de ${p}.`,
  },
  {
    id: 'santo-amaro',
    name: 'Santo Amaro',
    image: {
      src: '/images/tours/santo-amaro.webp',
      width: 480,
      height: 360,
      alt: 'Placas de madeira indicando lagoas de Santo Amaro, como a Lagoa da Gaivota',
    },
    summary:
      'Rali de 4x4 sobre as dunas pelos circuitos de Santo Amaro e Betânia, passando por várias lagoas.',
    schedule: 'Busca nas pousadas a partir das 8h, retorno por volta das 19h às 19h30',
    slot: { start: 8, end: 19.5 },
    highlights: [
      'Lagoas do Peixe, da Andorinha e da Gaivota',
      'Circuito Betânia: lagoas do Toco, da Ilha e da Piscina',
      'Pôr do sol, se houver e o grupo quiser',
    ],
    itinerary: [
      'A partir das 8h, buscamos os visitantes nas pousadas e hotéis de Barreirinhas. O deslocamento até Santo Amaro leva cerca de 1h30.',
      'Em Santo Amaro, paramos no restaurante para reservar o almoço e seguimos para a primeira lagoa, com um pequeno rali de 4x4 por cima das dunas, de 10 a 15 minutos. Lagoas visitadas: Lagoa do Peixe, Lagoa da Andorinha e Lagoa da Gaivota.',
      'Depois, o rali continua pelo circuito Betânia, com cerca de 20 minutos até a próxima lagoa. Lagoas visitadas: Lagoa do Toco, Lagoa da Ilha e Lagoa da Piscina.',
      'O almoço costuma ser no vilarejo de Betânia, por volta das 12h30 às 13h. Depois de um descanso, o passeio continua pelas demais lagoas, aguardando o pôr do sol, se houver e se o grupo quiser.',
      'Retorno a Barreirinhas por volta das 19h às 19h30. O horário pode variar um pouco conforme a saída de Santo Amaro.',
    ],
    notes: [
      'As lagoas visitadas podem mudar de nome e de ordem conforme a estação. A equipe sempre leva o grupo às melhores lagoas de cada circuito.',
    ],
    price: 280,
    unit: 'pessoa',
    message: (p) =>
      `Olá! Tenho interesse no passeio de Santo Amaro, no valor de ${p}. Poderiam me informar a disponibilidade?`,
  },
];
