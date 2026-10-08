import { type Page } from '@playwright/test';

/**
 * Simula el rediseño que llega sin aviso: el botón «Log in» ahora dice «Sign in».
 * Intercepta la página real de la tienda y le cambia ese texto antes de que llegue al navegador.
 * Solo se activa con la variable REDISENO:  REDISENO=1 npx playwright test tests/s2
 */
export class Rediseno {
  static async aplicar(page: Page) {
    if (!process.env.REDISENO) return;
    // Que el clic que no encuentra el botón falle a los 5 s y no a los 30; cargar la página sigue con 30 s.
    page.setDefaultNavigationTimeout(30_000);
    page.setDefaultTimeout(5_000);
    await page.route('**/login', async (route) => {
      const respuesta = await route.fetch();
      const html = await respuesta.text();
      await route.fulfill({
        response: respuesta,
        body: html.replace('value="Log in"', 'value="Sign in"'),
      });
    });
  }
}
