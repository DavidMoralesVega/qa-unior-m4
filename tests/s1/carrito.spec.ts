import { test, expect } from '@playwright/test';

/**
 * Lo que graba `npx playwright codegen` al agregar un libro al carrito,
 * más lo que codegen no escribe: el resultado esperado.
 */
test('DWS-CAR-001 · agregar un libro al carrito', async ({ page }) => {
  await page.goto('/');
  // ── grabado por codegen ──
  await page.getByRole('link', { name: 'Books' }).first().click();
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  // ── escrito a mano: el resultado esperado ──
  await expect(page.getByText('The product has been added to your shopping cart')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Shopping cart (1)' })).toBeVisible();
});
