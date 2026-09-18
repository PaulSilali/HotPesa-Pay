import { expect, test } from '@playwright/test';

const journeyPath = '/journey/demo-nairobi-cbd-westlands';

test('happy path confirms only after trusted Mock M-Pesa evidence', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(journeyPath);

  await expect(page.getByRole('heading', { name: 'Confirm your journey fare' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Nairobi CBD → Westlands' })).toBeVisible();
  await expect(page.locator('.fare-block strong')).toHaveText(/80\.00/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect((await page.getByRole('button', { name: /Pay/ }).boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await page.getByLabel('Sandbox phone number').fill('+254700000101');
  await page.getByLabel('Demo outcome').selectOption('confirmed');
  await page.getByRole('button', { name: /Pay/ }).click();

  await expect(page.getByText('Waiting for provider confirmation')).toBeVisible();
  await expect(page.getByText('Payment confirmed')).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText('Trusted server-side Mock M-Pesa evidence confirmed this fare.')).toBeVisible();

  await page.goto('http://127.0.0.1:4174');
  await expect(page.getByRole('heading', { name: 'Payment attempts' })).toBeVisible();
  await expect(page.getByText('Confirmed', { exact: true }).first()).toBeVisible();
  await expect(page.locator('body')).not.toContainText('+254700000101');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('failure path presents an explicit failed state', async ({ page }) => {
  await page.goto(journeyPath);
  await page.getByLabel('Sandbox phone number').fill('+254700000102');
  await page.getByLabel('Demo outcome').selectOption('failed');
  await page.getByRole('button', { name: /Pay/ }).click();

  await expect(page.getByText('Payment failed')).toBeVisible({ timeout: 5_000 });
  await expect(page.getByText('Mock M-Pesa reported that this payment did not complete.')).toBeVisible();
});

test('duplicate callback is idempotent and visible in the admin audit', async ({ page }) => {
  await page.goto(journeyPath);
  await page.getByLabel('Sandbox phone number').fill('+254700000103');
  await page.getByLabel('Demo outcome').selectOption('duplicate-callback');
  await page.getByRole('button', { name: /Pay/ }).click();

  await expect(page.getByText('Payment confirmed')).toBeVisible({ timeout: 5_000 });
  await page.goto('http://127.0.0.1:4174');
  await expect(page.getByText('duplicate-callback', { exact: true })).toBeVisible();
  await expect(page.getByText('payment.provider-evidence-duplicate', { exact: true })).toBeVisible();
});
