import '../../../packages/design-tokens/src/theme.css';
import './admin.css';
import { StrictMode, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { AuditEventV1, PaymentAttemptV1 } from '@hotpesa/contracts';
import { AdminApi } from './api.js';
import { statusLabel } from './status.js';

const api = new AdminApi(import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:3000');

function App() {
  const [payments, setPayments] = useState<readonly PaymentAttemptV1[]>([]);
  const [events, setEvents] = useState<readonly AuditEventV1[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>();

  const refresh = useCallback(async () => {
    try {
      const [nextPayments, nextEvents] = await Promise.all([api.payments(), api.auditEvents()]);
      setPayments(nextPayments);
      setEvents(nextEvents);
      setError(undefined);
      setLastUpdated(new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch {
      setError('The local HotPesa API is unavailable. Start it and refresh this page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => void refresh(), 1_500);
    return () => window.clearInterval(interval);
  }, [refresh]);

  const runAction = async (payment: PaymentAttemptV1, action: 'reconcile' | 'expire' | 'conflict') => {
    try {
      await api.mockAction(payment.id, action);
      await refresh();
    } catch {
      setError(`Could not run ${action} for this development payment.`);
    }
  };

  const count = (status: PaymentAttemptV1['status']) => payments.filter((payment) => payment.status === status).length;

  return (
    <>
      <a className="skip-link" href="#operations">Skip to payment operations</a>
      <header className="admin-header">
        <a className="brand" href="/" aria-label="HotPesa Pay operations home">
          <span className="brand-mark" aria-hidden="true">H</span>
          <span>HotPesa Operations</span>
        </a>
        <div className="header-actions">
          <span className="environment-badge">Mock M-Pesa · Development</span>
          <button className="refresh-button" type="button" onClick={() => void refresh()} disabled={loading}>Refresh</button>
        </div>
      </header>
      <main className="admin-shell" id="operations">
        <section className="admin-intro" aria-labelledby="admin-title">
          <div><p className="eyebrow">Payment operations</p><h1 id="admin-title">Provider evidence, without guesswork.</h1></div>
          <p>Monitor sandbox attempts and redacted audit events. Pending is never presented as paid.</p>
        </section>
        {error ? <div className="alert" role="alert">{error}</div> : null}
        <p className="sync-note">{loading ? 'Loading operations data…' : `Last refreshed ${lastUpdated ?? 'just now'}`}</p>
        <section className="metric-grid" aria-label="Payment summary">
          <Metric label="Total attempts" value={payments.length} />
          <Metric label="Pending" value={count('pending')} tone="neutral" />
          <Metric label="Confirmed" value={count('confirmed')} tone="success" />
          <Metric label="Needs attention" value={count('failed') + count('expired') + count('review-required')} tone="warning" />
        </section>
        <section className="panel" aria-labelledby="payments-title">
          <div className="panel-heading"><div><p className="section-label">Current read model</p><h2 id="payments-title">Payment attempts</h2></div><span>{payments.length} total</span></div>
          <div className="table-wrap">
            <table>
              <caption className="visually-hidden">Mock M-Pesa payment attempts</caption>
              <thead><tr><th>Attempt</th><th>Fare</th><th>Scenario</th><th>Status</th><th>Updated</th><th>Demo action</th></tr></thead>
              <tbody>
                {payments.length === 0 ? <tr><td colSpan={6} className="empty-cell">No attempts yet. Open the passenger journey URL to create one.</td></tr> : payments.map((payment) => (
                  <tr key={payment.id}>
                    <td data-label="Attempt"><code>{payment.id.slice(0, 8)}</code><small>{payment.maskedPhoneNumber}</small></td>
                    <td data-label="Fare">KES {(payment.amountMinor / 100).toFixed(2)}<small>{payment.fareVersionId}</small></td>
                    <td data-label="Scenario">{payment.scenario}</td>
                    <td data-label="Status"><StatusBadge status={payment.status} /></td>
                    <td data-label="Updated">{new Date(payment.updatedAt).toLocaleTimeString('en-KE')}</td>
                    <td data-label="Demo action"><PaymentActions payment={payment} onAction={runAction} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="panel" aria-labelledby="events-title">
          <div className="panel-heading"><div><p className="section-label">Redacted structured log</p><h2 id="events-title">Audit events</h2></div><span>{events.length} total</span></div>
          <ol className="event-list">
            {events.length === 0 ? <li className="empty-cell">No audit events yet.</li> : events.slice(0, 30).map((event) => (
              <li key={event.id}>
                <span className="event-dot" aria-hidden="true"></span>
                <div><strong>{event.type}</strong><small>Attempt {event.paymentAttemptId.slice(0, 8)} · {new Date(event.occurredAt).toLocaleTimeString('en-KE')}</small></div>
                <code>{formatDetails(event.details)}</code>
              </li>
            ))}
          </ol>
        </section>
        <section className="state-legend" aria-labelledby="legend-title">
          <h2 id="legend-title">State language</h2>
          <div>{(['created', 'initiating', 'pending', 'confirmed', 'failed', 'expired', 'review-required'] as const).map((status) => <StatusBadge key={status} status={status} />)}</div>
        </section>
      </main>
    </>
  );
}

function Metric({ label, value, tone = 'default' }: { label: string; value: number; tone?: string }) {
  return <article className={`metric metric-${tone}`}><span>{label}</span><strong>{value}</strong></article>;
}

function StatusBadge({ status }: { status: PaymentAttemptV1['status'] }) {
  return <span className={`status-badge badge-${status}`}>{statusLabel(status)}</span>;
}

function PaymentActions({ payment, onAction }: { payment: PaymentAttemptV1; onAction: (payment: PaymentAttemptV1, action: 'reconcile' | 'expire' | 'conflict') => Promise<void> }) {
  if (payment.status === 'pending') return <div className="action-group"><button type="button" onClick={() => void onAction(payment, 'reconcile')}>Reconcile</button><button type="button" onClick={() => void onAction(payment, 'expire')}>Expire</button></div>;
  if (payment.status === 'confirmed' || payment.status === 'failed' || payment.status === 'expired') return <button type="button" onClick={() => void onAction(payment, 'conflict')}>Inject conflict</button>;
  return <span className="not-available">—</span>;
}

function formatDetails(details: AuditEventV1['details']): string {
  return Object.entries(details).map(([key, value]) => `${key}=${String(value)}`).join(' · ') || 'No details';
}

const root = document.querySelector<HTMLElement>('#root');
if (!root) throw new Error('Admin application root is missing');
createRoot(root).render(<StrictMode><App /></StrictMode>);
