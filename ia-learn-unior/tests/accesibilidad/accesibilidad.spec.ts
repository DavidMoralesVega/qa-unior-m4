import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { romperSiSePide } from '../apoyo/romper';

// Revisa cada página con axe: las reglas de accesibilidad WCAG 2.1, niveles A y AA.
const paginas = [
  { nombre: 'catálogo', ruta: '/programas', listo: 'Programas de posgrado' },
  { nombre: 'ficha', ruta: '/programa/full-stack-development-qa-automation', listo: 'Full Stack Development & Advanced QA Automation' },
  { nombre: 'inicio de sesión', ruta: '/iniciar-sesion', listo: 'Iniciar sesión' },
];

for (const pagina of paginas) {
  test(`accesibilidad · ${pagina.nombre}`, async ({ page }) => {
    await page.goto(pagina.ruta);
    await expect(page.getByRole('heading', { level: 1, name: pagina.listo })).toBeVisible();
    await romperSiSePide(page);

    const resultado = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    for (const v of resultado.violations) {
      console.log(`${pagina.nombre} · ${v.id} (${v.impact}) · ${v.nodes.length} elemento(s) · ${v.help}`);
    }
    expect(resultado.violations).toEqual([]);
  });
}
