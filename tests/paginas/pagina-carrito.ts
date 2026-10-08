import { type Page, type Locator } from '@playwright/test';

/** Page Object de la página del carrito. */
export class PaginaCarrito {
  readonly page: Page;
  readonly filas: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filas = page.locator('.cart-item-row');
  }

  async abrir() {
    await this.page.goto('/cart');
  }

  fila(nombre: string) {
    return this.filas.filter({ has: this.page.getByRole('link', { name: nombre, exact: true }) });
  }
}
