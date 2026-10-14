import http from 'k6/http';
import { sleep } from 'k6';
const API = 'http://localhost:3050/api';
export const options = { vus: Number(__ENV.VUS), duration: '20s', summaryTrendStats: ['avg','med','p(95)','max'] };
export function setup() {
  return { token: http.post(`${API}/auth/login`, JSON.stringify({ email: 'admin@todo.com', password: 'admin123' }), { headers: { 'Content-Type': 'application/json' } }).json('accessToken') };
}
export default function (d) {
  http.get(`${API}/todo`, { headers: { Authorization: `Bearer ${d.token}` } });
  sleep(Number(__ENV.PAUSA || 0.5));
}
