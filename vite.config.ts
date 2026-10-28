import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GA4: se VITE_GA4_ID existir, passa o ID ao /boot.js e carrega o gtag.js no <head>.
 * Fica no HTML pré-renderizado (é o que ferramentas de auditoria e o Google procuram).
 */
function analyticsHtml(gaId?: string): Plugin {
  return {
    name: 'analytics-html',
    transformIndexHtml(html) {
      if (!gaId || !/^G-[A-Z0-9]+$/.test(gaId)) return html.replace('<!--analytics-->', '');
      return html
        .replace('<script src="/boot.js"></script>', `<script src="/boot.js" data-ga="${gaId}"></script>`)
        .replace(
          '<!--analytics-->',
          `<link rel="preconnect" href="https://www.googletagmanager.com" />\n    <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>`,
        );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react(), analyticsHtml(env.VITE_GA4_ID)],
    define: {
      __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
    },
    build: {
      target: 'es2020',
      cssCodeSplit: false,
      assetsInlineLimit: 0,
    },
  };
});
