import type { Page } from '@playwright/test';

// Solo para la demo de clase: con ROMPER=1 simula un «cambio de diseño» descuidado,
// sin tocar la app en producción. Cambia el color del botón principal y le quita
// el nombre accesible al botón de ingresar.
export async function romperSiSePide(page: Page) {
  if (!process.env.ROMPER) return;
  await page.addStyleTag({
    content: `.mat-mdc-unelevated-button, a[mat-flat-button], .mdc-button--unelevated
      { background: #9aa0a6 !important; color: #c8ccd0 !important; }`,
  });
  await page.evaluate(() => {
    const boton = [...document.querySelectorAll('button')].find(b => b.textContent?.includes('Ingresar'));
    if (boton) boton.innerHTML = '<span aria-hidden="true" class="mat-icon material-icons">login</span>';
  });
}
