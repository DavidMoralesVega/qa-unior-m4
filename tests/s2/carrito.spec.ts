import { test, expect } from '@playwright/test';
import { PaginaCatalogo } from '../paginas/pagina-catalogo';
import { PaginaCarrito } from '../paginas/pagina-carrito';

/** La tarea de la sesión 1, reescrita con Page Objects: se lee como un caso de prueba manual. */
test.describe('Carrito', () => {
  let catalogo: PaginaCatalogo;

  test.beforeEach(async ({ page }) => {
    catalogo = new PaginaCatalogo(page);
    await catalogo.abrir();
  });

  test('DWS-CAR-002 · agregar dos libros distintos', async () => {
    await catalogo.agregarAlCarrito('Computing and Internet');
    await expect(catalogo.carritoCon(1)).toBeVisible();

    await catalogo.agregarAlCarrito('Fiction');
    await expect(catalogo.carritoCon(2)).toBeVisible();
  });

  test('DWS-CAR-003 · el precio de «Fiction» es 24.00', async () => {
    await expect(catalogo.precio('Fiction')).toHaveText('25.00');
  });

  test('DWS-CAR-004 · el libro aparece dentro del carrito', async ({ page }) => {
    await catalogo.agregarAlCarrito('Computing and Internet');
    await expect(catalogo.carritoCon(1)).toBeVisible();

    const carrito = new PaginaCarrito(page);
    await carrito.abrir();
    await expect(carrito.filas).toHaveCount(1);
    await expect(carrito.fila('Computing and Internet')).toBeVisible();
  });
});
