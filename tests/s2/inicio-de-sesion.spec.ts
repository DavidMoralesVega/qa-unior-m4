import { test, expect } from '@playwright/test';
import { usuario } from '../datos';
import { PaginaLogin } from '../paginas/pagina-login';
import { Rediseno } from './rediseno';

/**
 * Los mismos cinco casos, con Page Object. La prueba dice QUÉ hace el usuario;
 * CÓMO se encuentra cada campo lo sabe PaginaLogin.
 */
test.describe('Con POM · inicio de sesión', () => {
  let login: PaginaLogin;

  test.beforeEach(async ({ page }) => {
    await Rediseno.aplicar(page);
    login = new PaginaLogin(page);
    await login.abrir();
  });

  test('DWS-LOG-001 · contraseña incorrecta', async () => {
    await login.ingresar(usuario.email, 'Clave999');

    await expect(login.mensajeError).toContainText('Login was unsuccessful');
  });

  test('DWS-LOG-002 · email no registrado', async () => {
    await login.ingresar('superadmin@test.com', 'Test123');

    await expect(login.mensajeError).toContainText('No customer account found');
  });

  test('DWS-LOG-003 · campos vacíos', async () => {
    await login.ingresar('', '');

    await expect(login.mensajeError).toContainText('Login was unsuccessful');
  });

  test('DWS-LOG-004 · credenciales válidas', async () => {
    await login.ingresar(usuario.email, usuario.clave);

    await expect(login.enlaceSalir).toBeVisible();
  });

  test('DWS-LOG-005 · cerrar sesión', async ({ page }) => {
    await login.ingresar(usuario.email, usuario.clave);
    await login.enlaceSalir.click();

    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
  });
});
