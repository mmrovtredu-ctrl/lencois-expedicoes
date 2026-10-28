# Analytics, SEO e segurança — Lençóis Expedições

Corrige os 4 apontamentos do radar da Incuca:

| Apontamento | O que foi feito | Precisa de você? |
|---|---|---|
| Sem GA4 / Tag Manager | GA4 no `<head>` com Consent Mode v2 + eventos do funil | **Sim**: criar a propriedade e colar o ID na Vercel |
| "Quem visita e não chama, some" | Meta Pixel (remarketing) + eventos de lead | **Sim**: ID do Pixel (opcional) |
| Sem `sitemap.xml` | `sitemap.xml` gerado no build + `robots.txt` | Enviar no Search Console |
| Sem cabeçalhos de segurança | `vercel.json` com HSTS, CSP, X-Frame-Options etc. | Não |

---

## 1. Google Analytics 4

### Criar a propriedade
1. Acesse <https://analytics.google.com> → **Administrador** → **Criar** → **Propriedade**.
2. Nome: `Lençóis Expedições`, fuso `(GMT-03:00) Fortaleza`, moeda `Real (BRL)`.
3. **Fluxo de dados** → **Web** → URL `https://www.lencoisexpedicoes.com.br`.
4. Copie o **ID da métrica** (`G-XXXXXXXXXX`).

Documentação: <https://support.google.com/analytics/answer/9304153>

### Configurar na Vercel
Dashboard: **Projeto `lencois-expedicoes` → Settings → Environment Variables**

| Nome | Valor | Ambientes |
|---|---|---|
| `VITE_GA4_ID` | `G-XXXXXXXXXX` | Production, Preview |

Ou pela CLI:

```bash
npm i -g vercel
vercel login
vercel link                      # escolher o time "Testes" e o projeto lencois-expedicoes
vercel env add VITE_GA4_ID production
vercel env add VITE_GA4_ID preview
vercel --prod                    # novo deploy para aplicar (variáveis VITE_ entram no build)
```

> As variáveis `VITE_*` são lidas **no build**. Sem um novo deploy, o site não muda.

### Marcar conversões no GA4
GA4 → **Administrador → Eventos** → marque como **evento-chave**:
- `generate_lead` — enviou o roteiro pelo WhatsApp (principal)
- `contact_whatsapp` — clicou em qualquer outro botão de WhatsApp

Eventos que o site envia:

| Evento GA4 | Evento Meta | Quando |
|---|---|---|
| `view_item` | `ViewContent` | Abriu o formulário de reserva de um passeio |
| `add_to_cart` | `AddToCart` | Adicionou passeio ao "Meu roteiro" |
| `begin_checkout` | `InitiateCheckout` | Abriu o "Meu roteiro" |
| `generate_lead` | `Lead` | Enviou o roteiro (nome/e-mail válidos) para o WhatsApp |
| `contact_whatsapp` | `Contact` | Clicou em outro link de WhatsApp |

Nenhum dado pessoal (nome, e-mail, CPF) é enviado para GA4 ou Meta — só passeio e valor.

---

## 2. Remarketing ("quem visita e não chama")

Isso não é bug; é falta de **público de remarketing**. Com o Pixel e o GA4 rodando:

1. **Meta Pixel**: <https://business.facebook.com/events_manager2> → **Conectar fonte de dados → Web → Meta Pixel** → copie o ID (só números).
2. Vercel → Environment Variables: `VITE_META_PIXEL_ID` = `123456789012345` → novo deploy.
3. Públicos sugeridos (Gerenciador de Anúncios → Públicos → Público personalizado → Site):
   - Visitou o site nos últimos 30 dias **e não** disparou `Lead`.
   - Disparou `AddToCart` nos últimos 14 dias **e não** disparou `Lead` (abandonou o roteiro — o mais quente).
4. GA4 → Administrador → **Públicos**: mesmos critérios, para usar no Google Ads.

Docs: <https://www.facebook.com/business/help/952192354843755> · <https://support.google.com/analytics/answer/9267572>

---

## 3. Consentimento (LGPD)

- `public/boot.js` define o **Consent Mode v2** com tudo **negado** até a pessoa aceitar.
- O GA4 ainda envia sinais sem cookies (modelagem do Google); com o aceite, mede normalmente.
- O Meta Pixel **só carrega depois do aceite**.
- O aviso só aparece se houver GA4 ou Pixel configurado. A escolha fica em `localStorage` (`le-consent-v1`).

Doc: <https://developers.google.com/tag-platform/security/guides/consent>

> Recomendado: uma página simples de **Política de Privacidade** (o site agora coleta nome, e-mail e CPF opcional e usa cookies). Posso montar.

---

## 4. Sitemap e Search Console

Arquivos gerados no build:
- `https://www.lencoisexpedicoes.com.br/sitemap.xml` (data do último deploy)
- `https://www.lencoisexpedicoes.com.br/robots.txt`

Enviar ao Google:
1. <https://search.google.com/search-console> → **Adicionar propriedade → Domínio** → `lencoisexpedicoes.com.br`.
2. Verificação por **registro TXT**: HostGator → Domínios → Configurar domínio → **Zona de DNS → Adicionar registro**
   - Tipo `TXT`, Nome `lencoisexpedicoes.com.br.`, Valor `google-site-verification=...` (o que o Google mostrar).
3. Após verificar: **Sitemaps** → enviar `sitemap.xml`.

---

## 5. Cabeçalhos de segurança (`vercel.json`)

| Cabeçalho | Valor | Para quê |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Força HTTPS |
| `Content-Security-Policy` | só scripts do próprio site, Google Tag e Meta | Bloqueia script injetado (XSS) |
| `X-Frame-Options` | `DENY` | Impede o site dentro de iframe (clickjacking) |
| `X-Content-Type-Options` | `nosniff` | Navegador não "adivinha" tipo de arquivo |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Não vaza URL completa para outros sites |
| `Permissions-Policy` | câmera, microfone, localização etc. desligados | Reduz superfície de ataque |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isola a aba |

Para a CSP funcionar sem `'unsafe-inline'`, o script que rodava inline no `index.html` foi para `public/boot.js`.

**Ao adicionar um serviço externo novo** (chat, mapa, vídeo do YouTube, outro pixel), inclua o domínio na diretiva certa da CSP em `vercel.json` (`script-src`, `connect-src`, `img-src` ou `frame-src`), senão ele é bloqueado. Erros aparecem no console do navegador como `Refused to load ... Content Security Policy`.

### Conferir depois do deploy

```bash
# cabeçalhos
curl -sI https://www.lencoisexpedicoes.com.br | grep -iE "strict-transport|content-security|x-frame|x-content|referrer|permissions"

# sitemap e robots (esperado: 200)
curl -s -o /dev/null -w "%{http_code}\n" https://www.lencoisexpedicoes.com.br/sitemap.xml
curl -s -o /dev/null -w "%{http_code}\n" https://www.lencoisexpedicoes.com.br/robots.txt

# GA4 no HTML (esperado: aparece o G-...)
curl -s https://www.lencoisexpedicoes.com.br | grep -o "gtag/js?id=G-[A-Z0-9]*"
```

Ferramentas online:
- Cabeçalhos: <https://securityheaders.com/?q=https://www.lencoisexpedicoes.com.br> (meta: nota **A**)
- GA4 em tempo real: GA4 → **Relatórios → Tempo real** (abra o site em outra aba e aceite os cookies)
- Pixel: extensão **Meta Pixel Helper** no Chrome

---

## 6. Rodar localmente

```bash
npm ci
cp .env.example .env.local   # preencha os IDs (opcional)
npm run dev                  # http://localhost:5173
npm run build                # gera dist/ com HTML pré-renderizado, sitemap.xml e robots.txt
npx vite preview             # serve o dist/ em http://localhost:4173
```
