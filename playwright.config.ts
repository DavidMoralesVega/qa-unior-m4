import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración del proyecto del Módulo IV.
 * Lo que en el Módulo III era la «Test Environment Setup» del STLC vive acá:
 * a qué sistema se apunta, con qué navegador y qué evidencia se guarda.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'https://demowebshop.tricentis.com',
    // La evidencia que antes se capturaba a mano, ahora sale sola cuando algo falla.
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    // La precondición «usuario registrado» se cumple una sola vez, antes de todo.
    { name: 'preparacion', testMatch: /preparacion\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['preparacion'],
    },
  ],
});
