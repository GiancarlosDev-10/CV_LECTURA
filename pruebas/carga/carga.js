// CP-018 / RQ-DES-02: 10 usuarios concurrentes durante 2 minutos contra producción.
// Meta (E05): p95 de http_req_duration ≤ 1,5 s y http_req_failed < 1 %.
//   npx tsx pruebas/carga/sesion.ts
//   k6 run --summary-export=docs/evidencias/carga/k6-resumen.json pruebas/carga/carga.js
import http from "k6/http";
import { check, sleep } from "k6";

const BASE = "https://cv-lectura.vercel.app";
const cookies = JSON.parse(open("./.cookies.json"));
const cabeceraCookie = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

export const options = {
  vus: 10,
  duration: "2m",
  thresholds: {
    http_req_duration: ["p(95)<=1500"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function visitarPaginas() {
  const sinSesion = { redirects: 0 };
  const conSesion = { headers: { Cookie: cabeceraCookie }, redirects: 0 };

  check(http.get(`${BASE}/`, { ...sinSesion, tags: { pagina: "inicio" } }), { "inicio 200": (r) => r.status === 200 });
  check(http.get(`${BASE}/ingresar`, { ...sinSesion, tags: { pagina: "ingresar" } }), { "ingresar 200": (r) => r.status === 200 });
  check(http.get(`${BASE}/ofertas`, { ...conSesion, tags: { pagina: "ofertas" } }), { "ofertas 200": (r) => r.status === 200 });
  check(http.get(`${BASE}/mis-postulaciones`, { ...conSesion, tags: { pagina: "mis-postulaciones" } }), {
    "mis-postulaciones 200": (r) => r.status === 200,
  });
  check(http.get(`${BASE}/api/salud`, { ...sinSesion, tags: { pagina: "api-salud" } }), { "salud 200": (r) => r.status === 200 });
  sleep(1);
}
