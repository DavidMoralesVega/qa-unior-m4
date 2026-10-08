import { test, expect } from '@playwright/test';
import { usuario } from '../datos';
import { Rediseno } from './rediseno';

/**
 * Los mismos casos de la sesión 1, escritos como ayer: cada prueba sabe cómo se
 * llama cada campo y cada botón. El botón «Log in» aparece cinco veces.
 */
test.describe('Sin POM · inicio de sesión', () => {
  test.beforeEach(async ({ page }) => {
    await Rediseno.aplicar(page);
    await page.goto('/login');
  });

  test('DWS-LOG-001 · contraseña incorrecta', async ({ page }) => {
    await page.getByLabel('Email:').fill(usuario.email);
    await page.getByLabel('Password:').fill('Clave999');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.getByText('Login was unsuccessful')).toBeVisible();
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
  });

  test('DWS-LOG-004 · credenciales válidas', async ({ page }) => {
    await page.getByLabel('Email:').fill(usuario.email);
    await page.getByLabel('Password:').fill(usuario.clave);
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
  });

  test('DWS-LOG-005 · cerrar sesión', async ({ page }) => {
    await page.getByLabel('Email:').fill(usuario.email);
    await page.getByLabel('Password:').fill(usuario.clave);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByRole('link', { name: 'Log out' }).click();

    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
  });
});
