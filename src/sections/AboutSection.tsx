import { SmartImage } from '../components/SmartImage';

const WAYS = [
  { name: '4x4', text: 'pelas trilhas de areia e por cima das dunas' },
  { name: 'Lancha voadeira', text: 'descendo o Rio Preguiças até Caburé' },
  { name: 'Quadriciclo', text: 'pilotado por você nos Pequenos Lençóis' },
  { name: 'Boia', text: 'flutuando nas águas cristalinas do Rio Formiga' },
];

export function AboutSection() {
  return (
    <section id="sobre" className="section section--sand about" aria-labelledby="sobre-titulo">
      <div className="container about__grid">
        <div className="about__text">
          <h2 id="sobre-titulo" className="section-title">
            Sua próxima aventura começa aqui
          </h2>
          <p className="section-lead">
            A Lençóis Expedições leva você aos principais circuitos dos Lençóis Maranhenses a partir de Barreirinhas, no
            Maranhão: lagoas cristalinas entre as dunas, a descida do Rio Preguiças até Caburé, a foz do rio em Atins, a
            flutuação no Rio Formiga e as lagoas de Santo Amaro.
          </p>
          <p>
            Você escolhe entre passeios individuais, com valor por pessoa, e opções privativas para o seu grupo, com
            preços definidos.
          </p>

          <h3 className="about__subtitle">Como você vai explorar</h3>
          <ul className="about__ways">
            {WAYS.map((w) => (
              <li key={w.name}>
                <strong>{w.name}</strong> {w.text}
              </li>
            ))}
          </ul>

          <a href="#passeios" className="text-link">
            Ver passeios e valores
          </a>
        </div>

        <figure className="about__media">
          <SmartImage
            image={{
              src: '/images/gallery/sobre-lagoa.webp',
              width: 480,
              height: 640,
              alt: 'Turista flutuando em uma lagoa de água transparente sobre a areia',
            }}
            sizes="(min-width: 900px) 420px, 92vw"
          />
        </figure>
      </div>
    </section>
  );
}
