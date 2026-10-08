import { type Page, type Locator } from '@playwright/test';

/** Page Object de la categoría Books: las tarjetas de producto y el contador del carrito. */
export class PaginaCatalogo {
  readonly page: Page;
  readonly tarjetas: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tarjetas = page.locator('.product-item');
  }

  async abrir() {
    await this.page.goto('/books');
  }

  /** La tarjeta de un libro, buscada por su título exacto. */
  producto(nombre: string) {
    const titulo = this.page.getByRole('heading', { name: nombre, exact: true });
    return this.tarjetas.filter({ has: titulo });
  }

  precio(nombre: string) {
    return this.producto(nombre).locator('.actual-price');
  }

  async agregarAlCarrito(nombre: string) {
    await this.producto(nombre).getByRole('button', { name: 'Add to cart' }).click();
  }

  /** El enlace del encabezado, por ejemplo «Shopping cart (2)». */
  carritoCon(cantidad: number) {
    return this.page.getByRole('link', { name: `Shopping cart (${cantidad})` });
  }
}
