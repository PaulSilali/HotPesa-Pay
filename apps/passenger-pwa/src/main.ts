import { passengerFoundation } from './foundation.js';

const app = document.querySelector<HTMLElement>('#app');
if (!app) throw new Error('Passenger application root is missing');

app.textContent = passengerFoundation.accountRequired
  ? 'Passenger application'
  : 'HotPesa passenger foundation';
