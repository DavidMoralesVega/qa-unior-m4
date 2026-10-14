// spec: specs/plan-learn-unior.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Catálogo y fichas de programas', () => {
  test('Carga del catálogo y listado de los 6 programas', async ({ page }) => {
    // 1. Abrir https://learn-unior.web.app/programas con sesión limpia.
    await page.goto('/programas');
    await expect(page).toHaveTitle('Programas de posgrado · UNIOR');
    await expect(page.getByRole('heading', { level: 1, name: 'Programas de posgrado' })).toBeVisible();
    await expect(page.getByText('Oferta 2026')).toBeVisible();
    await expect(
      page.getByText('Diplomados abiertos a profesionales con grado de licenciatura. Cada programa indica su modalidad, su carga horaria y la inversión total.')
    ).toBeVisible();

    // 2. Revisar las tarjetas del listado (heading nivel 2 en cada una).
    const main = page.getByRole('main');
    await expect(main.getByRole('heading', { level: 2 })).toHaveCount(6);
    await expect(main.getByRole('link', { name: 'Ver programa' })).toHaveCount(6);

    const programas = [
      { titulo: 'Ciencia de Datos e Inteligencia Artificial', categoria: 'Tecnología', detalle: '400 horas académicas · Modalidad Híbrida', precio: 'Bs 6.500', url: '/programa/ciencia-de-datos-e-inteligencia-artificial' },
      { titulo: 'Educación Superior y Docencia Universitaria', categoria: 'Educación', detalle: '320 horas académicas · Modalidad Virtual', precio: 'Bs 4.900', url: '/programa/educacion-superior-y-docencia-universitaria' },
      { titulo: 'Full Stack Development & Advanced QA Automation', categoria: 'Tecnología', detalle: '480 horas académicas · Modalidad Virtual', precio: 'Bs 7.000', url: '/programa/full-stack-development-qa-automation' },
      { titulo: 'Gerencia y Gestión de Proyectos', categoria: 'Gestión', detalle: '360 horas académicas · Modalidad Presencial', precio: 'Bs 5.800', url: '/programa/gestion-de-proyectos' },
      { titulo: 'Marketing Digital y Comercio Electrónico', categoria: 'Gestión', detalle: '280 horas académicas · Modalidad Virtual', precio: 'Bs 4.500', url: '/programa/marketing-digital-y-comercio-electronico' },
      { titulo: 'Salud Pública y Epidemiología', categoria: 'Salud', detalle: '380 horas académicas · Modalidad Híbrida', precio: 'Bs 6.200', url: '/programa/salud-publica-y-epidemiologia' },
    ];

    for (const programa of programas) {
      const tarjeta = main
        .locator('mat-card')
        .filter({ has: page.getByRole('heading', { level: 2, name: programa.titulo, exact: true }) });
      await expect(tarjeta.getByRole('heading', { level: 2, name: programa.titulo, exact: true })).toBeVisible();
      await expect(tarjeta.getByText(programa.categoria, { exact: true })).toBeVisible();
      await expect(tarjeta.getByText(programa.detalle, { exact: true })).toBeVisible();
      await expect(tarjeta.getByText(programa.precio, { exact: true })).toBeVisible();
      await expect(tarjeta.getByRole('link', { name: 'Ver programa' })).toHaveAttribute('href', programa.url);
    }

    // 3. Buscar controles de búsqueda o filtros (textbox, combobox, chips) en la página.
    await expect(page.getByRole('textbox')).toHaveCount(0);
    await expect(page.getByRole('combobox')).toHaveCount(0);
    await expect(page.getByRole('searchbox')).toHaveCount(0);

    // 4. Revisar cabecera y pie.
    await expect(page.getByRole('link', { name: 'Inicio · UNIOR' })).toHaveAttribute('href', '/inicio');
    const navegacion = page.getByRole('navigation', { name: 'Principal' });
    await expect(navegacion.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/inicio');
    await expect(navegacion.getByRole('link', { name: 'Programas' })).toHaveAttribute('href', '/programas');
    await expect(page.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/iniciar-sesion');

    const pie = page.getByRole('contentinfo');
    await expect(pie.getByText('Universidad Privada de Oruro · Dirección de Posgrado')).toBeVisible();
    await expect(pie.getByText('Oruro, Bolivia')).toBeVisible();
  });
});
