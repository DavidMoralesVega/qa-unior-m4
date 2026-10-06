import { test, expect } from '@playwright/test';

/**
 * Unidad 2 · selectores avanzados, esperas y aserciones sobre la categoría Books.
 * Cada test muestra una técnica; los nombres dicen cuál.
 */
test.describe('Catálogo de libros', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/books');
  });

  test('hasText busca en toda la tarjeta: atrapa más de lo que parece', async ({ page }) => {
    // Hay otro libro llamado «Copy of Computing and Internet EX».
    const ambiguo = page.locator('.product-item').filter({ hasText: 'Computing and Internet' });
    await expect(ambiguo).toHaveCount(2);
  });

  test('filtrar la tarjeta por su título y actuar dentro de ella', async ({ page }) => {
    const libro = page
      .locator('.product-item')
      .filter({ has: page.getByRole('heading', { name: 'Computing and Internet', exact: true }) });

    await expect(libro.locator('.actual-price')).toHaveText('10.00');
    await libro.getByRole('button', { name: 'Add to cart' }).click();

    await expect(page.getByRole('link', { name: 'Shopping cart (1)' })).toBeVisible();
  });

  test('exact: «Fiction» no es «Fiction EX»', async ({ page }) => {
    const parecido = page.getByRole('heading', { name: 'Fiction' });
    const exacto = page.getByRole('heading', { name: 'Fiction', exact: true });
    await expect(parecido).toHaveCount(2);
    await expect(exacto).toHaveCount(1);

    const libro = page.locator('.product-item').filter({ has: exacto });
    await expect(libro.locator('.actual-price')).toHaveText('24.00');
  });

  test('contar elementos: la categoría muestra seis libros', async ({ page }) => {
    await expect(page.locator('.product-item')).toHaveCount(6);
  });

  test('esperar una respuesta de red al agregar al carrito', async ({ page }) => {
    const libro = page
      .locator('.product-item')
      .filter({ has: page.getByRole('heading', { name: 'Computing and Internet', exact: true }) });

    const respuesta = page.waitForResponse((r) => r.url().includes('/addproducttocart/'));
    await libro.getByRole('button', { name: 'Add to cart' }).click();
    expect((await respuesta).status()).toBe(200);
  });

  test('aserciones blandas: reportar todo lo que falla, no solo lo primero', async ({ page }) => {
    const libro = page
      .locator('.product-item')
      .filter({ has: page.getByRole('heading', { name: 'Computing and Internet', exact: true }) });

    await expect.soft(libro.locator('.old-price')).toHaveText('30.00');
    await expect.soft(libro.locator('.actual-price')).toHaveText('10.00');
    await expect.soft(libro.getByRole('button', { name: 'Add to cart' })).toBeEnabled();
  });

  test('buscar y esperar a que cambie la URL', async ({ page }) => {
    // El buscador no tiene etiqueta accesible: es el caso en que se recurre al id.
    await page.locator('#small-searchterms').fill('computer');
    await page.getByRole('button', { name: 'Search' }).click();

    await page.waitForURL(/\/search\?q=computer/);
    await expect(page.locator('.product-item').first()).toBeVisible();
  });
});

test('modo estricto: un localizador ambiguo falla a propósito', async ({ page }) => {
  test.fail(); // se espera que falle: así se ve el error en el reporte
  await page.goto('/books');
  await page.getByRole('button', { name: 'Add to cart' }).click({ timeout: 3000 });
});
