# qa-unior-m4

Repositorio del curso del **Módulo IV · Automatización avanzada de QA y pruebas de rendimiento**
(DFSQA-04) del Diplomado en Desarrollo de Aplicaciones Full Stack, UNIOR.

Pruebas automatizadas con [Playwright](https://playwright.dev) y TypeScript contra
[Demo Web Shop](https://demowebshop.tricentis.com). El proyecto crece cada sesión.

## Requisitos

- Node.js 20 o mayor (`node -v`)
- Git (`git --version`)

## Cómo correrlo

```bash
git clone https://github.com/DavidMoralesVega/qa-unior-m4.git
cd qa-unior-m4
npm install
npx playwright install chromium
npx playwright test
```

Debe terminar en `15 passed`. Una prueba aparece con ✘ a propósito: muestra el error del modo
estricto y está marcada con `test.fail()`.

| Comando | Qué hace |
|---|---|
| `npm test` | corre todas las pruebas |
| `npm run test:ui` | abre el modo interactivo con la traza de cada paso |
| `npm run report` | abre el reporte HTML de la última ejecución |
| `npm run codegen` | graba acciones en la tienda y escribe el código |

## Estructura

```
playwright.config.ts      configuración: entorno, navegadores, evidencia
tests/
├─ datos.ts               usuario de prueba
├─ preparacion.setup.ts   crea el usuario antes de todo
└─ s1/                    sesión 1: login, selectores, carrito
```
