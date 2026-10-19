// Injeta o HTML renderizado no dist/index.html: conteúdo visível antes do JS,
// melhor LCP e SEO, e prévia correta ao compartilhar o link.
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = resolve('dist');
const ssr = resolve('dist-ssr', 'entry-server.js');
const { render } = await import(pathToFileURL(ssr).href);

const file = resolve(dist, 'index.html');
const template = readFileSync(file, 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('Marcador <!--app-html--> não encontrado');
writeFileSync(file, template.replace('<!--app-html-->', render()));
rmSync(resolve('dist-ssr'), { recursive: true, force: true });
console.log('✓ HTML pré-renderizado em dist/index.html');
