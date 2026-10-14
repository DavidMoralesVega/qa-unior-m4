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
npm test
```

Debe terminar en `40 passed` (`npm test` primero traduce los `.feature` con `bddgen`). Una prueba aparece con ✘ a propósito: muestra el error del modo
estricto y está marcada con `test.fail()`.

| Comando | Qué hace |
|---|---|
| `npm test` | corre todas las pruebas |
| `npm run test:ui` | abre el modo interactivo con la traza de cada paso |
| `npm run report` | abre el reporte HTML de la última ejecución |
| `npm run codegen` | graba acciones en la tienda y escribe el código |
| `npm run rediseno` | simula que el botón «Log in» pasó a llamarse «Sign in» (Mac y Linux) |

## Qué hay en cada sesión

| Sesión | Tema | Dónde está |
|---|---|---|
| 1 | Primeras pruebas: selectores, esperas, aserciones, reporte y traza | `tests/s1/` |
| 2 | Page Object Model (POM) y GitHub Actions | `tests/paginas/`, `tests/s2/`, `.github/workflows/playwright.yml` |
| 3 | BDD con Gherkin en español (playwright-bdd) | `tests/s3/` (`.feature` + `pasos.ts`) |
| 4 · 1.ª hora | La IA escribe y repara pruebas (agentes de Playwright) | `ia-learn-unior/` |
| 4 · 2.ª hora | Rendimiento con k6 contra una API NestJS | `k6/` + [api-tareas-k6-unior](https://github.com/DavidMoralesVega/api-tareas-k6-unior) |

Las guías de laboratorio paso a paso (PDF) están en Classroom.

## Estructura

```
playwright.config.ts      configuración: entorno, navegadores, evidencia
.github/workflows/        GitHub Actions: tienda (playwright.yml) e IA (ia-learn-unior.yml)
tests/
├─ datos.ts               usuario de prueba
├─ preparacion.setup.ts   crea el usuario antes de todo
├─ paginas/               Page Objects: login, catálogo, carrito
├─ s1/                    sesión 1: login, selectores, carrito
├─ s2/                    sesión 2: las mismas pruebas con POM, y el rediseño
└─ s3/                    sesión 3: escenarios en Gherkin y sus pasos
ia-learn-unior/           sesión 4: proyecto aparte contra https://learn-unior.web.app
k6/                       sesión 4: scripts de carga y las salidas reales del 13/10/2026
```

## Sesión 4 · La IA escribe la prueba (`ia-learn-unior/`)

Es un proyecto de Playwright aparte, contra la plataforma de posgrado https://learn-unior.web.app.

```bash
cd ia-learn-unior
npm install
npx playwright install chromium
npx playwright test
```

`tests/seed.spec.ts` es la semilla de los agentes; `specs/plan-learn-unior.md` es el plan que escribió
el agente *planner*; `tests/catalogo/` y `tests/seguridad/` las pruebas del *generator*; `salidas/` lo que
respondió cada agente. Los agentes se crean con `npx playwright init-agents --loop=claude` (Claude Code)
o `--loop=vscode` (GitHub Copilot en VS Code).

## Sesión 4 · Rendimiento con k6 (`k6/`)

1. Instale k6: https://grafana.com/docs/k6/latest/set-up/install-k6/
2. Levante la API de tareas (NestJS + Postgres) con Docker: ver
   [api-tareas-k6-unior](https://github.com/DavidMoralesVega/api-tareas-k6-unior).
3. Corra los scripts en orden:

```bash
cd k6
k6 run 01-humo.js            # 1 usuario: ¿la API responde?
k6 run 02-carga.js           # 30 usuarios con umbrales
k6 run 03-estres.js          # hasta 350 usuarios: ¿dónde se rompe?
k6 run 04-picos.js           # de 20 a 400 en segundos
k6 run 05-umbral-que-falla.js
k6 run 06-navegador.js       # k6 browser contra learn-unior
k6 run 07-quickpizza.js      # sin Docker: contra la API pública quickpizza.grafana.com
```

`k6/salidas/13-10/` tiene la salida real de cada script.

---

Docente: **David Morales Vega** · Diplomado en Desarrollo de Aplicaciones Full Stack · UNIOR · Dirección de Postgrado.
