import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { adminFoundation } from './foundation.js';

const root = document.querySelector<HTMLElement>('#root');
if (!root) throw new Error('Admin application root is missing');

createRoot(root).render(
  <StrictMode>
    <main>
      <h1>HotPesa admin</h1>
      <p>{adminFoundation.scope}</p>
    </main>
  </StrictMode>,
);
