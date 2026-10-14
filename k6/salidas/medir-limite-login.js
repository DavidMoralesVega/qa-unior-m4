import http from 'k6/http';
import { sleep } from 'k6';
const API = 'http://localhost:3050/api';
export const options = { stages: [{duration:'5s', target: Number(__ENV.VUS)},{duration:'20s', target: Number(__ENV.VUS)}], summaryTrendStats: ['avg','med','p(95)','max'] };
export default function () {
  http.post(`${API}/auth/login`, JSON.stringify({ email: 'admin@todo.com', password: 'admin123' }), { headers: { 'Content-Type': 'application/json' } });
  sleep(1);
}
