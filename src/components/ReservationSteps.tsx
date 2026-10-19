import { WhatsAppLink } from './WhatsAppLink';

const STEPS = [
  {
    title: 'Escolha seu passeio',
    text: 'Compare os roteiros, os horários e os valores dos passeios individuais e privativos.',
  },
  {
    title: 'Fale com a equipe pelo WhatsApp',
    text: 'Consulte a disponibilidade e alinhe os detalhes da sua data.',
  },
  {
    title: 'Receba as orientações',
    text: 'A agência envia as orientações para você dar continuidade à reserva.',
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
