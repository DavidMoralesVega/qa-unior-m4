// 07 · Tarea, plan B: carga con umbrales contra quickpizza
// quickpizza.grafana.com es el sitio de práctica oficial de k6.
// Es de otros: POCOS usuarios.
// Ejecutar:  k6 run 07-quickpizza.js
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = __ENV.BASE || 'https://quickpizza.grafana.com';

export const options = {
  stages: [
    { duration: '10s', target: 5 }, // subir de 0 a 5 VUs
    { duration: '20s', target: 5 }, // mantener 5 VUs
    { duration: '5s', target: 0 }, // bajar a 0
  ],
  thresholds: {
    // Está en internet, no en esta máquina: el umbral es más holgado que en el NestJS
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  // 1) Ruta pública: la lista de nombres de pizza
  const nombres = http.get(`${BASE}/api/names`);
  check(nombres, {
    'nombres responde 200': (r) => r.status === 200,
    'trae nombres': (r) => r.json('names').length > 0,
  });

  // 2) Pedir una pizza recomendada (el token de ejemplo de la documentación de k6)
  const pizza = http.post(
    `${BASE}/api/pizza`,
    JSON.stringify({
      maxCaloriesPerSlice: 1000,
      mustBeVegetarian: false,
      minNumberOfToppings: 2,
      maxNumberOfToppings: 5,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'token abcdef0123456789',
      },
    },
  );
  check(pizza, {
    'pizza responde 200': (r) => r.status === 200,
    'la pizza tiene nombre': (r) => !!r.json('pizza.name'),
  });

  sleep(1);
}
