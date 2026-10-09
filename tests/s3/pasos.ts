import { expect } from '@playwright/test';
import { createBdd, test as base } from 'playwright-bdd';
import { usuario } from '../datos';
import { PaginaLogin } from '../paginas/pagina-login';
import { PaginaCatalogo } from '../paginas/pagina-catalogo';
import { PaginaCarrito } from '../paginas/pagina-carrito';

/**
 * Los Page Objects de la sesión 2 llegan a cada paso como fixtures:
 * el paso pide «login» o «catalogo» y Playwright se lo entrega listo.
 */
export const test = base.extend<{
  login: PaginaLogin;
  catalogo: PaginaCatalogo;
  carrito: PaginaCarrito;
}>({
  login: async ({ page }, use) => use(new PaginaLogin(page)),
  catalogo: async ({ page }, use) => use(new PaginaCatalogo(page)),
  carrito: async ({ page }, use) => use(new PaginaCarrito(page)),
});

const { Given, When, Then } = createBdd(test);

// ── Inicio de sesión ─────────────────────────────────────────────

Given('que estoy en la página de inicio de sesión', async ({ login }) => {
  await login.abrir();
});

When('ingreso con el usuario de prueba', async ({ login }) => {
  await login.ingresar(usuario.email, usuario.clave);
});

When('ingreso con el email {string} y la clave {string}', async ({ login }, email: string, clave: string) => {
  await login.ingresar(email, clave);
});

When('cierro la sesión', async ({ login }) => {
  await login.enlaceSalir.click();
});

Then('veo el enlace {string}', async ({ page }, nombre: string) => {
  await expect(page.getByRole('link', { name: nombre, exact: true })).toBeVisible();
});

Then('veo el error {string}', async ({ login }, mensaje: string) => {
  await expect(login.mensajeError).toContainText(mensaje);
});

// ── Carrito ──────────────────────────────────────────────────────

Given('que estoy en la categoría Books', async ({ catalogo }) => {
  await catalogo.abrir();
});

When('agrego {string} al carrito', async ({ page, catalogo }, libro: string) => {
  await catalogo.agregarAlCarrito(libro);
  // El botón trabaja por detrás (AJAX): se espera el aviso verde antes del paso siguiente.
  await expect(page.locator('#bar-notification')).toContainText('added to your shopping cart');
});

Then('el carrito tiene {int} producto(s)', async ({ catalogo }, cantidad: number) => {
  await expect(catalogo.carritoCon(cantidad)).toBeVisible();
});

When('abro el carrito', async ({ carrito }) => {
  await carrito.abrir();
});

Then('el carrito contiene {string}', async ({ carrito }, libro: string) => {
  await expect(carrito.fila(libro)).toBeVisible();
});

Then('el precio de {string} es {string}', async ({ catalogo }, libro: string, precio: string) => {
  await expect(catalogo.precio(libro)).toHaveText(precio);
});

// ── Búsqueda (lo escribió «el cliente» en clase) ─────────────────

When('busco {string}', async ({ page }, texto: string) => {
  // El buscador no tiene etiqueta accesible: se usa su id.
  await page.locator('#small-searchterms').fill(texto);
  await page.getByRole('button', { name: 'Search' }).click();
});

Then('veo {string} en los resultados', async ({ page }, producto: string) => {
  await expect(page.locator('.product-item').getByRole('link', { name: producto, exact: true })).toBeVisible();
});

Then('veo el texto {string}', async ({ page }, texto: string) => {
  await expect(page.getByText(texto)).toBeVisible();
});
