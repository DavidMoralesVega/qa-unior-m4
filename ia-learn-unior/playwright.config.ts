import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html'], ['allure-playwright']],
  // Las fotos de referencia se sacaron en macOS: en Linux (GitHub Actions) las letras salen distintas.
  ignoreSnapshots: !!process.env.CI,
  use: {
    baseURL: 'https://learn-unior.web.app',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
