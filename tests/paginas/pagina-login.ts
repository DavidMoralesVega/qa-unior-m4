import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object de la pantalla de inicio de sesión.
 * Lo que la prueba necesita saber de esta pantalla vive acá, en un solo lugar.
 * Si la pantalla cambia, se corrige este archivo y las pruebas no se tocan.
 */
export class PaginaLogin {
  readonly page: Page;
  readonly campoEmail: Locator;
  readonly campoClave: Locator;
  readonly botonEntrar: Locator;
  readonly mensajeError: Locator;
  readonly enlaceSalir: Locator;

  constructor(page: Page) {
    this.page = page;
    this.campoEmail = page.getByLabel('Email:');
    this.campoClave = page.getByLabel('Password:');
    this.botonEntrar = page.getByRole('button', { name: 'Log in' });
    this.mensajeError = page.locator('.validation-summary-errors');
    this.enlaceSalir = page.getByRole('link', { name: 'Log out' });
  }

  async abrir() {
    await this.page.goto('/login');
  }

  async ingresar(email: string, clave: string) {
    await this.campoEmail.fill(email);
    await this.campoClave.fill(clave);
    await this.botonEntrar.click();
  }
}
