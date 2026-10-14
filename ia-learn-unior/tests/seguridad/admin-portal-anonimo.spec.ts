// spec: specs/plan-learn-unior.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Acceso protegido sin sesión', () => {
  test('Acceso directo a /admin/portal sin sesión redirige a inicio de sesión', async ({ page }) => {
    // 1. Con contexto limpio (sin sesión), navegar directamente a /admin/portal
    await page.goto('/admin/portal');

    // 2. Esperar la redirección y observar URL y contenido
    await expect(page).toHaveURL('https://learn-unior.web.app/iniciar-sesion');
    await expect(page).toHaveTitle('Iniciar sesión · Plataforma UNIOR');
    await expect(page.getByRole('heading', { name: 'Iniciar sesión', level: 1 })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Correo electrónico' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Contraseña' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible();

    // No debe mostrarse contenido administrativo ni mensajes de acceso denegado
    await expect(page.getByText(/acceso denegado|no autorizado/i)).toHaveCount(0);

    // 3. Pulsar Atrás en el navegador
    await page.goBack();

    // No se vuelve a exponer contenido de /admin/portal
    await expect(page).not.toHaveURL(/\/admin\/portal/);
  });
});
