import { WhatsAppLink } from './WhatsAppLink';

const STEPS = [
  {
    title: 'Monte seu roteiro',
    text: 'Escolha os passeios, as datas e quantas pessoas vão. O total aparece na hora.',
  },
  {
    title: 'Envie pelo WhatsApp',
    text: 'A mensagem já vai pronta com tudo o que você escolheu. Sem pagamento no site.',
  },
  {
    title: 'Receba a confirmação',
    text: 'A equipe confirma as vagas e combina o pagamento e os detalhes com você.',
  },
];

export function ReservationSteps() {
  return (
    <section id="reserva" className="section section--white steps" aria-labelledby="reserva-titulo">
      <div className="container">
        <h2 id="reserva-titulo" className="section-title steps__title">
          Reserve seu passeio em poucos passos
        </h2>
        <ol className="steps__list">
          {STEPS.map((s, i) => (
            <li key={s.title} className="steps__item">
              <span className="steps__num" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="steps__name">{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="steps__cta">
          <WhatsAppLink size="lg">Falar com a equipe</WhatsAppLink>
        </div>
      </div>
    </section>
  );
}
