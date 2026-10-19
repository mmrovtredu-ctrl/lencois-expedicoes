import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

/** Usado só no build (scripts/prerender.mjs) para gerar o HTML estático. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
