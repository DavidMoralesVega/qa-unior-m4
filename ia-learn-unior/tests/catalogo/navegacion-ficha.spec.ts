// spec: specs/plan-learn-unior.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Catálogo y fichas de programas', () => {
  test('Navegación del catálogo a la ficha y regreso', async ({ page }) => {
    const verProgramas = page.getByRole('link', { name: 'Ver programa' });
    const todosLosProgramas = page.getByRole('link', { name: 'Todos los programas' });
    const urlFicha = /\/programa\/ciencia-de-datos-e-inteligencia-artificial$/;
    const urlCatalogo = /\/programas\/?$/;

    // 1. Abrir /programas y hacer clic en 'Ver programa' de la tarjeta 'Ciencia de Datos e Inteligencia Artificial'
    await page.goto('/programas');
    await expect(page.getByRole('heading', { name: 'Programas de posgrado' })).toBeVisible();
    await page.locator('mat-card').filter({ hasText: 'Ciencia de Datos e Inteligencia Artificial' }).getByRole('link', { name: 'Ver programa' }).click();
    await expect(page).toHaveURL(urlFicha);

    // 2. Esperar a que desaparezca 'Cargando el programa…' (el indicador puede ser muy breve)
    await expect(page.getByText('Cargando el programa…')).toBeHidden();
    await expect(page).toHaveTitle('Ciencia de Datos e Inteligencia Artificial · UNIOR');
    await expect(todosLosProgramas).toBeVisible();
    await expect(todosLosProgramas).toHaveAttribute('href', '/programas');

    // 3. Hacer clic en 'Todos los programas'
    await todosLosProgramas.click();
    await expect(page).toHaveURL(urlCatalogo);
    await expect(verProgramas).toHaveCount(6);

    // 4. Repetir con la navegación 'Programas' de la cabecera
    await verProgramas.first().click();
    await expect(page).toHaveURL(urlFicha);
    await expect(page.getByText('Cargando el programa…')).toBeHidden();
    await expect(page).toHaveTitle('Ciencia de Datos e Inteligencia Artificial · UNIOR');
    await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Programas' }).click();
    await expect(page).toHaveURL(urlCatalogo);
    await expect(verProgramas).toHaveCount(6);

    // 4. Repetir con el botón Atrás del navegador desde la ficha
    await verProgramas.first().click();
    await expect(page).toHaveURL(urlFicha);
    await expect(page.getByText('Cargando el programa…')).toBeHidden();
    await page.goBack();
    await expect(page).toHaveURL(urlCatalogo);
    await expect(verProgramas).toHaveCount(6);
  });
});
