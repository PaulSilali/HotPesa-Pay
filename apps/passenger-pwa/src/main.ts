import '../../../packages/design-tokens/src/theme.css';
import './passenger.css';
import type { JourneySessionV1, MockPaymentScenario, PaymentAttemptV1 } from '@hotpesa/contracts';
import { ApiError, HotPesaApi } from './api.js';
import { paymentStatusView } from './payment-status.js';
import { sessionCodeFromLocation } from './session-code.js';
import { createIdempotencyKey } from './idempotency-key.js';

const app = requiredElement<HTMLElement>('#app');

const api = new HotPesaApi(import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:3000');
const publicCode = sessionCodeFromLocation(window.location);

app.innerHTML = `
  <a class="skip-link" href="#main-content">Skip to payment</a>
  <header class="site-header">
    <a class="brand" href="/journey/demo-nairobi-cbd-westlands" aria-label="HotPesa Pay home">
      <span class="brand-mark" aria-hidden="true">H</span>
      <span>HotPesa Pay</span>
    </a>
    <span class="environment-badge">Mock M-Pesa · Development</span>
  </header>
  <main class="passenger-shell" id="main-content">
    <section class="intro" aria-labelledby="page-title">
      <p class="eyebrow">Account-free fare payment</p>
      <h1 id="page-title">Confirm your journey fare</h1>
      <p class="intro-copy">Review the route and fixed fare before requesting a sandbox M-Pesa prompt.</p>
    </section>
    <div id="journey-root" aria-live="polite" aria-busy="true">
      <div class="loading-card"><span class="spinner" aria-hidden="true"></span>Loading journey…</div>
    </div>
  </main>
  <footer>Phase 0 sandbox · HotPesa never stores fare value or acts as a wallet.</footer>
`;

const journeyRoot = requiredElement<HTMLElement>('#journey-root');

void loadJourney();

async function loadJourney(): Promise<void> {
  if (!publicCode) {
    renderPageError('This journey link is incomplete.', 'Open the full QR or short URL supplied for the journey.');
    return;
  }
  try {
    const journey = await api.journey(publicCode);
    renderJourney(journey);
  } catch (error) {
    renderPageError('Journey unavailable.', errorMessage(error));
  }
}

function renderJourney(journey: JourneySessionV1): void {
  journeyRoot.removeAttribute('aria-busy');
  journeyRoot.innerHTML = `
    <div class="payment-layout">
      <section class="journey-card" aria-labelledby="journey-heading">
        <div class="route-symbol" aria-hidden="true"><span></span><i></i><span></span></div>
        <div>
          <p class="section-label">Your journey</p>
          <h2 id="journey-heading">${escapeHtml(journey.routeLabel)}</h2>
          <dl class="journey-details">
            <div><dt>Vehicle</dt><dd>${escapeHtml(journey.vehicleLabel)}</dd></div>
            <div><dt>Operator</dt><dd>${escapeHtml(journey.saccoLabel)}</dd></div>
            <div><dt>Fare version</dt><dd>${escapeHtml(journey.fare.fareVersionId)}</dd></div>
          </dl>
        </div>
        <div class="fare-block"><span>Approved fare</span><strong id="quoted-fare">Select a destination</strong></div>
      </section>
      <section class="pay-card" aria-labelledby="payment-heading">
        <p class="section-label">Mock M-Pesa</p>
        <h2 id="payment-heading">Request a sandbox prompt</h2>
        <p class="helper">Use synthetic Kenyan-format data only. A request is not proof of payment.</p>
        <form id="payment-form" novalidate>
          <label for="destination-stage">Destination</label>
          <select id="destination-stage" name="destinationStageId" required>
            <option value="">Select destination</option>
            ${(journey.route?.directions[0]?.stages ?? []).map((stage) => `<option value="${escapeHtml(stage.id)}">${escapeHtml(stage.name)}</option>`).join('')}
          </select>
          <p class="field-help" id="fare-quote">Select a destination to obtain the server-calculated fare.</p>
          <label for="phone-number">Sandbox phone number</label>
          <input id="phone-number" name="phoneNumber" type="tel" inputmode="tel" autocomplete="tel"
            value="+254700000001" pattern="\\+254(7|1)[0-9]{8}" aria-describedby="phone-help" required />
          <span class="field-help" id="phone-help">Format: +2547XXXXXXXX. The server retains a masked value only.</span>
          <label for="scenario">Demo outcome</label>
          <select id="scenario" name="scenario">
            <option value="confirmed">Confirmed</option>
            <option value="failed">Failed</option>
            <option value="delayed">Delayed confirmation</option>
            <option value="duplicate-callback">Duplicate callback</option>
            <option value="missing-callback">Missing callback</option>
          </select>
          <button class="primary-button" type="submit" disabled>Choose a destination</button>
        </form>
        <div id="payment-status" class="status-region" aria-live="polite" aria-atomic="true"></div>
      </section>
    </div>
  `;

  const form = document.querySelector<HTMLFormElement>('#payment-form');
  form?.addEventListener('submit', (event) => void submitPayment(event, journey));
  form?.querySelector<HTMLSelectElement>('#destination-stage')?.addEventListener('change', (event) => void quoteDestination(event, journey, form));
}

async function quoteDestination(event: Event, journey: JourneySessionV1, form: HTMLFormElement): Promise<void> {
  const destinationStageId = (event.currentTarget as HTMLSelectElement).value;
  const quoteRoot = requiredElement<HTMLElement>('#fare-quote');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!destinationStageId) return;
  quoteRoot.textContent = 'Calculating approved fare…';
  if (submit) submit.disabled = true;
  try {
    const quote = await api.quote(journey.publicCode, destinationStageId);
    form.dataset.quoteAmountMinor = String(quote.amountMinor);
    quoteRoot.textContent = `Approved fare: ${new Intl.NumberFormat('en-KE', { style: 'currency', currency: quote.currency }).format(quote.amountMinor / 100)}.`;
    const fare = document.querySelector<HTMLElement>('#quoted-fare');
    if (fare) fare.textContent = new Intl.NumberFormat('en-KE', { style: 'currency', currency: quote.currency }).format(quote.amountMinor / 100);
    if (submit) { submit.disabled = false; submit.textContent = 'Request sandbox prompt'; }
  } catch (error) { quoteRoot.textContent = errorMessage(error); }
}

async function submitPayment(event: SubmitEvent, journey: JourneySessionV1): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  if (!form.reportValidity()) return;
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const data = new FormData(form);
  const phoneNumber = String(data.get('phoneNumber') ?? '');
  const scenario = String(data.get('scenario') ?? '') as MockPaymentScenario;
  const destinationStageId = String(data.get('destinationStageId') ?? '');
  const quotedAmountMinor = Number(form.dataset.quoteAmountMinor ?? 0);
  if (!destinationStageId || !form.dataset.quoteAmountMinor) return;
  setFormDisabled(form, true);
  if (submit) submit.textContent = 'Requesting prompt…';
  renderStatus({ status: 'initiating' });

  try {
    let payment = await api.initiate(
      { journeySessionId: journey.id, destinationStageId, phoneNumber, scenario },
      createIdempotencyKey(),
    );
    renderStatus(payment);
    payment = await pollUntilSettled(payment);
    renderStatus(payment);
  } catch (error) {
    renderRequestError(errorMessage(error));
  } finally {
    setFormDisabled(form, false);
    if (submit) submit.textContent = `Pay ${new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(quotedAmountMinor / 100)}`;
  }
}

async function pollUntilSettled(initial: PaymentAttemptV1): Promise<PaymentAttemptV1> {
  let payment = initial;
  for (let poll = 0; poll < 24 && ['created', 'initiating', 'pending'].includes(payment.status); poll += 1) {
    await wait(300);
    payment = await api.payment(payment.id);
    renderStatus(payment);
  }
  return payment;
}

function renderStatus(payment: Pick<PaymentAttemptV1, 'status'> & Partial<PaymentAttemptV1>): void {
  const root = document.querySelector<HTMLElement>('#payment-status');
  if (!root) return;
  const view = paymentStatusView(payment.status);
  root.innerHTML = `
    <section class="status-card status-${view.tone}" data-state="${payment.status}" role="status">
      <span class="status-icon" aria-hidden="true">${view.icon}</span>
      <div><strong>${view.heading}</strong><p>${view.detail}</p></div>
    </section>
    ${payment.status === 'pending' && payment.scenario === 'missing-callback' ? `<button class="secondary-button" id="reconcile-button" type="button">Run provider status check</button>` : ''}
  `;
  const reconcile = document.querySelector<HTMLButtonElement>('#reconcile-button');
  reconcile?.addEventListener('click', async () => {
    if (!payment.id) return;
    reconcile.disabled = true;
    reconcile.textContent = 'Checking trusted provider status…';
    try {
      renderStatus(await api.reconcile(payment.id));
    } catch (error) {
      renderRequestError(errorMessage(error));
    }
  });
}

function renderRequestError(detail: string): void {
  const root = document.querySelector<HTMLElement>('#payment-status');
  if (!root) return;
  root.innerHTML = `<section class="status-card status-danger" role="alert"><span class="status-icon" aria-hidden="true">!</span><div><strong>Request not completed</strong><p>${escapeHtml(detail)}</p></div></section>`;
}

function renderPageError(heading: string, detail: string): void {
  journeyRoot.removeAttribute('aria-busy');
  journeyRoot.innerHTML = `<section class="page-error" role="alert"><p class="section-label">Journey link</p><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(detail)}</p></section>`;
}

function setFormDisabled(form: HTMLFormElement, disabled: boolean): void {
  for (const control of form.elements) (control as HTMLInputElement | HTMLButtonElement).disabled = disabled;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof TypeError) return 'The local HotPesa service could not be reached. Check the network connection and try again.';
  if (error instanceof Error) return 'The passenger page could not complete that action. Refresh the page and try again.';
  return 'The passenger page could not complete that action. Try again.';
}

function escapeHtml(value: string): string {
  const element = document.createElement('span');
  element.textContent = value;
  return element.innerHTML;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function requiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Required application element is missing: ${selector}`);
  return element;
}
