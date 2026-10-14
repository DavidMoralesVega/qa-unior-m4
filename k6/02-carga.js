// 02 · Prueba de carga (load test)
// ¿Aguanta la API el tráfico ESPERADO de un día normal?
// Subimos poco a poco hasta 30 usuarios, los mantenemos y bajamos.
// Ejecutar:  k6 run 02-carga.js
import http from 'k6/http';
import { check, sleep } from 'k6';

const API = __ENV.API || 'http://localhost:3050/api';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const options = {
  // stages = la "rampa" de usuarios virtuales
  stages: [
    { duration: '15s', target: 30 }, // subir de 0 a 30 VUs
    { duration: '30s', target: 30 }, // mantener 30 VUs
    { duration: '10s', target: 0 }, // bajar a 0
  ],
  // thresholds = criterios de aceptación. Si no se cumplen, k6 termina con error.
  thresholds: {
    http_req_duration: ['p(95)<200'], // el 95 % de las peticiones en menos de 200 ms
    http_req_failed: ['rate<0.01'], // menos del 1 % de peticiones fallidas
    checks: ['rate>0.99'], // más del 99 % de los checks deben pasar
  },
};

// setup() corre UNA sola vez antes de la prueba.
// Lo que devuelve llega como parámetro a cada iteración.
export function setup() {
  // 1) El admin del seed inicia sesión (la API no tiene registro público:
  //    POST /api/users exige token)
  const admin = http.post(
    `${API}/auth/login`,
    JSON.stringify({ email: 'admin@todo.com', password: 'admin123' }),
    { headers: JSON_HEADERS },
  );
  const adminToken = admin.json('accessToken');

  // 2) El admin registra un usuario nuevo para esta prueba
  const email = `k6-${Date.now()}@test.com`;
  const password = 'clave123'; // mínimo 6 caracteres
  const registro = http.post(
    `${API}/users`,
    JSON.stringify({ email, name: 'Usuario k6', password }),
    { headers: { ...JSON_HEADERS, Authorization: `Bearer ${adminToken}` } },
  );
  check(registro, { 'registro responde 201': (r) => r.status === 201 });

  // 3) El usuario nuevo inicia sesión y obtenemos SU token
  const login = http.post(`${API}/auth/login`, JSON.stringify({ email, password }), {
    headers: JSON_HEADERS,
  });
  check(login, { 'login del usuario nuevo 201': (r) => r.status === 201 });

  return { token: login.json('accessToken') };
}

// Cada usuario virtual repite esta función mientras dure su etapa
export default function (datos) {
  const auth = { headers: { ...JSON_HEADERS, Authorization: `Bearer ${datos.token}` } };

  // Crear una tarea
  const creada = http.post(
    `${API}/todo`,
    JSON.stringify({ title: `Tarea k6 ${__VU}-${__ITER}`, description: 'creada por k6' }),
    auth,
  );
  check(creada, { 'crear tarea 201': (r) => r.status === 201 });

  // Listar tareas
  const lista = http.get(`${API}/todo`, auth);
  check(lista, { 'listar tareas 200': (r) => r.status === 200 });

  // Borrar la tarea creada (así la tabla no crece sin fin entre ejecuciones)
  if (creada.status === 201) {
    const borrada = http.del(`${API}/todo/${creada.json('id')}`, null, auth);
    check(borrada, { 'borrar tarea 200': (r) => r.status === 200 });
  }

  sleep(1);
}
