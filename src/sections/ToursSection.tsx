import { TOURS } from '../data/tours';
import { TourCard } from '../components/TourCard';

export function ToursSection() {
  return (
    <section id="passeios" className="section section--white tours" aria-labelledby="passeios-titulo">
      <div className="container">
        <header className="section-head">
          <h2 id="passeios-titulo" className="section-title">
            Escolha seu próximo destino
          </h2>
          <div className="section-head__aside">
            <p className="section-lead">Conheça os circuitos e encontre a experiência ideal para sua viagem.</p>
            <p className="section-note">Valores por pessoa, exceto o quadriciclo, cobrado por veículo.</p>
          </div>
        </header>

        <div className="tours__grid">
          {TOURS.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
