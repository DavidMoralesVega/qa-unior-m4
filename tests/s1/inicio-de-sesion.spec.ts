import { test, expect } from '@playwright/test';
import { usuario } from '../datos';

/**
 * Inicio de sesión en Demo Web Shop.
 * Son los casos DWS-LOG-001 a 005 del QA Web Challenge del Módulo III,
 * escritos por un compañero, traducidos uno a uno:
 *
 *   Precondiciones     → beforeEach
 *   Datos              → constantes
 *   Pasos              → acciones (goto, fill, click)
 *   Resultado esperado → expect
 */
test.describe('Inicio de sesión', () => {
  test.beforeEach(async ({ page }) => {
    // Precondición: sin sesión iniciada, en la página de login.
    await page.goto('/login');
  });

  test('DWS-LOG-001 · contraseña incorrecta', async ({ page }) => {
    await page.getByLabel('Email:').fill(usuario.email);
    await page.getByLabel('Password:').fill('Clave999');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.getByText('Login was unsuccessful')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('DWS-LOG-002 · email no registrado', async ({ page }) => {
    await page.getByLabel('Email:').fill('superadmin@test.com');
    await page.getByLabel('Password:').fill('Test123');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.getByText('No customer account found')).toBeVisible();
  });

  test('DWS-LOG-003 · campos vacíos', async ({ page }) => {
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.getByText('Login was unsuccessful')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log out' })).toBeHidden();
  });

  test('DWS-LOG-004 · credenciales válidas', async ({ page }) => {
    await page.getByLabel('Email:').fill(usuario.email);
    await page.getByLabel('Password:').fill(usuario.clave);
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.getByRole('link', { name: usuario.email })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
  });

  test('DWS-LOG-005 · cerrar sesión y volver atrás', async ({ page }) => {
    await page.getByLabel('Email:').fill(usuario.email);
    await page.getByLabel('Password:').fill(usuario.clave);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByRole('link', { name: 'Log out' }).click();
    await page.goBack();
    await page.reload();

    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
    await expect(page.getByRole('link', { name: usuario.email })).toBeHidden();
  });
});
