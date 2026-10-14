// 06 · k6 browser: rendimiento visto desde un navegador real (Chromium)
// Abre el catálogo de la app Angular y mide las Web Vitals (LCP, FCP, CLS, TTFB...).
// OJO: learn-unior.web.app es PRODUCCIÓN. Solo 1 usuario y pocas iteraciones.
// Ejecutar:  k6 run 06-navegador.js
import { browser } from 'k6/browser';
import { check } from 'k6';

export const options = {
  scenarios: {
    catalogo: {
      executor: 'shared-iterations',
      vus: 1, // un solo usuario: no se carga producción
      iterations: 3, // tres visitas al catálogo
      options: {
        browser: { type: 'chromium' }, // obligatorio para usar k6/browser
      },
    },
  },
  thresholds: {
    // Umbrales de Google para una "buena" experiencia
    browser_web_vital_lcp: ['p(75)<2500'], // Largest Contentful Paint < 2,5 s
    browser_web_vital_cls: ['p(75)<0.1'], // Cumulative Layout Shift < 0,1
    checks: ['rate==1.0'],
  },
};

export default async function () {
  const page = await browser.newPage();

  try {
    await page.goto('https://learn-unior.web.app/programas/', {
      waitUntil: 'networkidle',
    });

    // check del título de la pestaña
    const titulo = await page.title();
    // tarjetas del catálogo (mat-card con la clase program-card)
    const tarjetas = await page.locator('mat-card.program-card').count();
    const encabezado = await page.locator('h1').textContent();

    check(null, {
      'el título es "Programas de posgrado · UNIOR"': () =>
        titulo === 'Programas de posgrado · UNIOR',
      'el h1 dice "Programas de posgrado"': () =>
        encabezado.includes('Programas de posgrado'),
      'hay al menos 1 programa en el catálogo': () => tarjetas > 0,
    });

    console.log(`Título: ${titulo} · programas en el catálogo: ${tarjetas}`);
  } finally {
    await page.close();
  }
}
