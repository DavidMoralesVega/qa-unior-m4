// 04 · Prueba de picos (spike test)
// Tráfico normal y, de golpe, una avalancha
// (abren las inscripciones, sale un anuncio...).
// ¿Sobrevive al golpe? ¿Se recupera cuando pasa?
// Ejecutar:  k6 run 04-picos.js
import http from 'k6/http';
import { check, sleep } from 'k6';

const API = __ENV.API || 'http://localhost:3050/api';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const options = {
  stages: [
    { duration: '10s', target: 20 }, // tráfico normal
    { duration: '5s', target: 400 }, // ¡pico! de 20 a 400 VUs en 5 segundos
    { duration: '20s', target: 400 }, // el pico se mantiene
    { duration: '5s', target: 20 }, // cae de golpe
    { duration: '15s', target: 20 }, // ¿se recuperó?
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    'http_req_duration{name:login}': ['p(95)<500'],
    'http_req_duration{name:listar}': ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const login = http.post(
    `${API}/auth/login`,
    JSON.stringify({ email: 'admin@todo.com', password: 'admin123' }),
    { headers: JSON_HEADERS, tags: { name: 'login' } },
  );
  check(login, { 'login 201': (r) => r.status === 201 });

  const lista = http.get(`${API}/todo`, {
    headers: { Authorization: `Bearer ${login.json('accessToken')}` },
    tags: { name: 'listar' },
  });
  check(lista, { 'listar tareas 200': (r) => r.status === 200 });

  sleep(1);
}
