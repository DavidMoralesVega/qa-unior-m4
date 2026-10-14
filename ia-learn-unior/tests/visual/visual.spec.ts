import { test, expect } from '@playwright/test';
import { romperSiSePide } from '../apoyo/romper';

// Regresión visual: la primera vez guarda una foto de referencia; después compara contra ella.
test('visual · catálogo', async ({ page }) => {
  await page.goto('/programas');
  await expect(page.getByRole('heading', { level: 2 })).toHaveCount(6);
  await romperSiSePide(page);
  await expect(page).toHaveScreenshot('catalogo.png', { fullPage: true });
});

test('visual · inicio de sesión', async ({ page }) => {
  await page.goto('/iniciar-sesion');
  await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible();
  await romperSiSePide(page);
  await expect(page).toHaveScreenshot('inicio-de-sesion.png');
});
