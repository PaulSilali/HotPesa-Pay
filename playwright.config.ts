import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome'],
  },
  webServer: [
    {
      command: 'pnpm --filter @hotpesa/api build && node services/api/dist/src/main.js',
      url: 'http://127.0.0.1:3000/health',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      env: {
        ...process.env,
        HOST: '127.0.0.1',
        PORT: '3000',
        CORS_ORIGINS: 'http://127.0.0.1:4173,http://127.0.0.1:4174',
        HOTPESA_STORE: 'memory',
      },
    },
    {
      command: 'pnpm --filter @hotpesa/passenger-pwa exec vite --host 127.0.0.1 --port 4173 --strictPort',
      url: 'http://127.0.0.1:4173/',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      env: {
        ...process.env,
        VITE_HOST: '127.0.0.1',
        VITE_API_URL: 'http://127.0.0.1:3000',
      },
    },
    {
      command: 'pnpm --filter @hotpesa/admin-web exec vite --host 127.0.0.1 --port 4174 --strictPort',
      url: 'http://127.0.0.1:4174',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      env: {
        ...process.env,
        VITE_HOST: '127.0.0.1',
        VITE_API_URL: 'http://127.0.0.1:3000',
      },
    },
  ],
});
