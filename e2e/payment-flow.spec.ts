import { expect, test } from '@playwright/test';

interface Trip { id: string; publicCode: string; }

async function startTrip(page: import('@playwright/test').Page): Promise<Trip> {
  const response = await page.request.post('http://127.0.0.1:3000/api/v1/journey-sessions/trips', {
    headers: { 'x-tenant-id': 'tenant-demo-sacco' },
    data: { conductorId: 'conductor-demo', vehicleId: 'vehicle-demo-kaa-000d', routeId: 'route-cbd-westlands', directionId: 'direction-cbd-westlands' },
  });
  expect(response.ok()).toBeTruthy();
  return response.json() as Promise<Trip>;
}

async function closeTrip(page: import('@playwright/test').Page, trip: Trip): Promise<void> {
  const response = await page.request.post(`http://127.0.0.1:3000/api/v1/journey-sessions/trips/${trip.id}/close`, {
    headers: { 'x-tenant-id': 'tenant-demo-sacco', 'x-workforce-id': 'conductor-demo', 'x-role': 'conductor' }, data: {},
  });
  expect(response.ok()).toBeTruthy();
}

async function openQuotedJourney(page: import('@playwright/test').Page, trip: Trip): Promise<void> {
  await page.goto(`/journey/${trip.publicCode}`);
  await expect(page.getByRole('heading', { name: 'Nairobi CBD to Westlands' })).toBeVisible();
  await page.getByLabel('Destination').selectOption('stage-westlands');
  await expect(page.locator('#fare-quote')).toContainText('80.00');
  await expect(page.getByRole('button', { name: 'Request sandbox prompt' })).toBeEnabled();
}

test('happy path confirms only after trusted Mock M-Pesa evidence', async ({ page }) => {
  const trip = await startTrip(page);
  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openQuotedJourney(page, trip);
    await page.getByLabel('Sandbox phone number').fill('+254700000101');
    await page.getByLabel('Demo outcome').selectOption('confirmed');
    await page.getByRole('button', { name: 'Request sandbox prompt' }).click();
    await expect(page.getByText('Payment confirmed')).toBeVisible({ timeout: 5_000 });
    await page.goto('http://127.0.0.1:4174');
    await expect(page.getByText('Confirmed', { exact: true }).first()).toBeVisible();
  } finally { await closeTrip(page, trip); }
});

test('failure path presents an explicit failed state', async ({ page }) => {
  const trip = await startTrip(page);
  try {
    await openQuotedJourney(page, trip);
    await page.getByLabel('Sandbox phone number').fill('+254700000102');
    await page.getByLabel('Demo outcome').selectOption('failed');
    await page.getByRole('button', { name: 'Request sandbox prompt' }).click();
    await expect(page.getByText('Payment failed')).toBeVisible({ timeout: 5_000 });
  } finally { await closeTrip(page, trip); }
});

test('duplicate callback is idempotent and visible in the admin audit', async ({ page }) => {
  const trip = await startTrip(page);
  try {
    await openQuotedJourney(page, trip);
    await page.getByLabel('Sandbox phone number').fill('+254700000103');
    await page.getByLabel('Demo outcome').selectOption('duplicate-callback');
    await page.getByRole('button', { name: 'Request sandbox prompt' }).click();
    await expect(page.getByText('Payment confirmed')).toBeVisible({ timeout: 5_000 });
    await page.goto('http://127.0.0.1:4174');
    await expect(page.getByText('payment.provider-evidence-duplicate', { exact: true })).toBeVisible();
  } finally { await closeTrip(page, trip); }
});

test('generated active journey is unavailable after authorized closure', async ({ page }) => {
  const trip = await startTrip(page);
  try {
    expect(trip.publicCode).toMatch(/^journey_[a-z0-9]{32}$/);
    await openQuotedJourney(page, trip);
  } finally { await closeTrip(page, trip); }
  await page.goto(`/journey/${trip.publicCode}`);
  await expect(page.getByText('Journey unavailable.')).toBeVisible();
});
