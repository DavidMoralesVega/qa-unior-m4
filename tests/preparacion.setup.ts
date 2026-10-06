import { test as setup, expect } from '@playwright/test';
import { usuario } from './datos';

/**
 * Precondición de los casos DWS-LOG-001, 004 y 005: «Usuario registrado».
 * Si la cuenta ya existe, la tienda lo dice y seguimos: la precondición se cumple igual.
 */
setup('existe el usuario de prueba', async ({ page }) => {
  await page.goto('/register');
  await page.getByLabel('Male', { exact: true }).check();
  await page.getByLabel('First name:').fill(usuario.nombre);
  await page.getByLabel('Last name:').fill(usuario.apellido);
  await page.getByLabel('Email:').fill(usuario.email);
  await page.getByLabel('Password:', { exact: true }).fill(usuario.clave);
  await page.getByLabel('Confirm password:').fill(usuario.clave);
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(
    page.getByText(/Your registration completed|The specified email already exists/),
  ).toBeVisible();
});
