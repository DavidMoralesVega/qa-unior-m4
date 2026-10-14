// 05 · Un umbral que falla A PROPÓSITO
// La misma API, poca carga, pero un criterio imposible: p95 < 1 ms.
// k6 hace todas las peticiones, pinta el umbral en rojo y termina con código 99.
// Eso es lo que hace que un pipeline de CI se ponga en rojo.
// Ejecutar:  k6 run 05-umbral-que-falla.js ; echo "código de salida: $?"
import http from 'k6/http';
import { check, sleep } from 'k6';

const API = __ENV.API || 'http://localhost:3050/api';

export const options = {
  vus: 5,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<1'], // imposible: nadie responde en menos de 1 ms
    http_req_failed: ['rate<0.01'], // este sí se cumple
  },
};

export function setup() {
  const login = http.post(
    `${API}/auth/login`,
    JSON.stringify({ email: 'admin@todo.com', password: 'admin123' }),
    { headers: { 'Content-Type': 'application/json' } },
  );
  return { token: login.json('accessToken') };
}

export default function (datos) {
  const res = http.get(`${API}/todo`, {
    headers: { Authorization: `Bearer ${datos.token}` },
  });
  check(res, { 'listar tareas 200': (r) => r.status === 200 });
  sleep(0.5);
}
