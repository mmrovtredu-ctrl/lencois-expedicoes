import { Plus } from 'lucide-react';
import { FAQ as ITEMS } from '../data/faq';
import { WhatsAppLink } from './WhatsAppLink';

/** Perguntas frequentes com <details>: abre/fecha por teclado e leitor de tela sem JS. */
export function FAQ() {
  return (
    <section id="duvidas" className="section section--sand faq" aria-labelledby="duvidas-titulo">
      <div className="container faq__layout">
        <div className="faq__intro">
          <h2 id="duvidas-titulo" className="section-title">
            Perguntas frequentes
          </h2>
          <p className="section-lead">Ficou alguma dúvida que não está aqui? A equipe responde pelo WhatsApp.</p>
          <WhatsAppLink variant="blue">Tirar uma dúvida</WhatsAppLink>
        </div>
        <div className="faq__list">
          {ITEMS.map((item) => (
            <details key={item.question} className="faq__item" name="faq">
              <summary>
                <span>{item.question}</span>
                <Plus size={20} aria-hidden="true" className="faq__icon" />
              </summary>
              <div className="faq__answer">
                {item.answer.map((a) => (
                  <p key={a}>{a}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
