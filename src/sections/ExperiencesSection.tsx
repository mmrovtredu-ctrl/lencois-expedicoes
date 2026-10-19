import { GALLERY } from '../data/gallery';
import { TourGallery } from '../components/TourGallery';

export function ExperiencesSection() {
  return (
    <section id="experiencias" className="section section--sand experiences" aria-labelledby="experiencias-titulo">
      <div className="container">
        <header className="section-head">
          <h2 id="experiencias-titulo" className="section-title">
            Experiências e destinos
          </h2>
          <div className="section-head__aside">
            <p className="section-lead">Lagoas, dunas, rio, praia e povoados que fazem parte dos roteiros.</p>
            <p className="section-note">Toque em uma foto para ampliar.</p>
          </div>
        </header>
        <TourGallery items={GALLERY} />
      </div>
    </section>
  );
}
