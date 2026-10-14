# qa-learn-unior

Pruebas de la plataforma de posgrado **https://learn-unior.web.app** (Angular 22, Módulo I).
Módulo IV · Automatización avanzada de QA · UNIOR.

## Sesión 4 · agentes de IA

```bash
npm install
npx playwright test          # 4 passed
```

- `tests/seed.spec.ts` — la prueba semilla: el punto de partida de los agentes.
- `specs/plan-learn-unior.md` — el plan que escribió el agente **planner**.
- `tests/catalogo/`, `tests/seguridad/` — las pruebas que escribió el agente **generator**.
- `.claude/agents/` y `.mcp.json` — los agentes, creados con `npx playwright init-agents --loop=claude`.
- `salidas/` — lo que respondió cada agente en el ensayo del 12/10/2026.

Ramas: `main` tiene todo terminado; `en-vivo` tiene solo la semilla y los agentes, para hacer la demo desde cero.
