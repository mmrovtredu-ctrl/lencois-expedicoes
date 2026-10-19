import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/manrope';
import '@fontsource-variable/inter';
import './styles/index.css';
import App from './App';
import { motionAllowed } from './lib/scrollEngine';

// Efeitos de rolagem só com JS ativo e sem "reduzir movimento".
if (motionAllowed()) document.documentElement.classList.add('fx');

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// HTML pré-renderizado no build → hidrata; em `npm run dev` → renderiza.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
