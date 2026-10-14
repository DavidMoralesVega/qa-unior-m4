import { test, expect } from '@playwright/test';

// La prueba semilla: el punto de partida que el agente usa para abrir la app.
test('semilla', async ({ page }) => {
  await page.goto('/programas');
  await expect(page.getByRole('heading', { name: 'Programas de posgrado' })).toBeVisible();
});
