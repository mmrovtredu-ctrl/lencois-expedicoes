# Lençóis Expedições — site oficial

Site de página única (React + TypeScript + Vite) para a Agência Lençóis Expedições: passeios individuais e privativos nos Lençóis Maranhenses, com reserva iniciada pelo WhatsApp.

## Rodar e publicar

```bash
npm install
npm run dev       # desenvolvimento em http://localhost:5173
npm run build     # gera dist/ (com HTML pré-renderizado)
npm run preview   # serve o dist/ em http://localhost:4173
```

**Vercel:** importe o repositório; framework "Vite", build `npm run build`, saída `dist`. Não precisa de backend nem de variáveis de ambiente.

O `build` faz três coisas: checa os tipos (`tsc -b`), gera o bundle do navegador e pré-renderiza o HTML de toda a página (`scripts/prerender.mjs`). O conteúdo aparece antes do JavaScript carregar, o que melhora o LCP, o SEO e a prévia do link no WhatsApp e nas redes sociais.

## Onde mudar o quê

| O quê | Arquivo |
|---|---|
| Telefone, WhatsApp, Instagram, domínio | `src/data/site.ts` |
| Passeios individuais (textos, horários, preços, mensagens) | `src/data/tours.ts` |
| Passeios privativos (preços, mensagens) | `src/data/privateTours.ts` |
| Perguntas frequentes | `src/data/faq.ts` |
| Galeria e legendas | `src/data/gallery.ts` |
| Link do WhatsApp (`wa.me` + `encodeURIComponent`) | `src/lib/whatsapp.ts` |
| Cores, tipografia, efeitos | `src/styles/index.css` (tokens no topo) |

Os preços ficam só nos arquivos de dados. As mensagens do WhatsApp e as respostas do FAQ leem o valor de lá, então não há preço duplicado.

## Estrutura

```
src/
  components/   Header, MobileMenu, Hero, TourCard, PrivateTourCard, TourGallery (+ lightbox),
                ReservationSteps, FAQ, WhatsAppButton (flutuante), WhatsAppLink, SmartImage, Footer, Icons
  sections/     AboutSection, ToursSection, PrivateToursSection, ExperiencesSection, ContactSection
  data/         site, tours, privateTours, faq, gallery
  hooks/        useScrollFx (efeitos de rolagem), useTilt (inclinação no mouse), useSections
  lib/          scrollEngine (motor de rolagem), whatsapp, format (R$)
  types/        tour.ts
  App.tsx · main.tsx · entry-server.tsx
public/
  images/       hero, tours, private, gallery, logo (WebP, extraídas dos PDFs da agência)
  favicon.png · apple-touch-icon.png · icon-512.png · og-image.jpg
scripts/prerender.mjs
```

## Efeitos 3D e desempenho

- Um único listener de scroll passivo + um `requestAnimationFrame` por quadro, lendo só os elementos perto da tela (IntersectionObserver). Os efeitos usam apenas `transform` e `opacity`. Não há biblioteca de animação.
- **Hero:** a foto avança e inclina enquanto duas camadas de duna sobem em velocidades diferentes.
- **Passeios:** cada card sobe de um plano inclinado; no desktop, inclina levemente seguindo o mouse.
- **Privativos:** pilha 3D. O card fica preso no topo, o próximo desliza por cima e o anterior recua e escurece. No desktop, a lista de valores ao lado destaca o card ativo.
- **Galeria e contato:** parallax dentro da moldura.
- **Botão flutuante do WhatsApp:** só aparece quando nenhum outro botão de WhatsApp está na tela. No celular, também some enquanto a pessoa rola para baixo lendo, para não cobrir texto.
- Com "reduzir movimento" ativado no sistema, ou sem JavaScript, a página fica estática e completa.
- Medido em celular emulado (CPU 4× mais lenta, rede ~1,6 Mbps): FCP ≈ 0,8 s, LCP ≈ 1,6 s, CLS = 0.

## Fontes do conteúdo

- **Descrições, roteiros e horários:** Portfólio de passeios (2023).
- **Preços individuais:** Descritivo de roteiros (2026).
- **Preços privativos:** Tabela de preços 2026, com Caburé (lancha de 12 lugares) alterado para R$ 1.200,00.
- Não foram publicados CNPJ nem endereço.

### Divergências entre os materiais (confirmar com a agência)

O descritivo de 2026 traz horários diferentes do portfólio de 2023. O site segue o portfólio, como pedia o briefing:

| Passeio | Portfólio 2023 (no site) | Descritivo 2026 |
|---|---|---|
| Lagoa Azul | Saída 9h, retorno 13h; lagoas Azul, Esmeralda e do Peixe | Saída a partir de 8h30, retorno ~12h30; não cita a Lagoa do Peixe |
| Lagoa Bonita | Saída 14h, retorno a Barreirinhas 19h | Saída a partir de 13h30; às 18h o carro leva o grupo **até Atins** (~19h30) |

## Imagens

Todas as fotos vêm dos PDFs da agência. A maior tem cerca de 720 px de largura, então a foto do hero e a do contato ficam suaves em telas grandes. Para a versão final, peça os originais em alta resolução (≥ 2000 px) e substitua os arquivos em `public/images/` mantendo os mesmos nomes. Se mudar as proporções, atualize `width`/`height` nos arquivos de dados.
