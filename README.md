# CV Lectura — Sistema de RRHH con lectura automática de CVs

Proyecto final del curso **Calidad de Software y Sistemas** (VI ciclo, IESTP Gilda Liliana Ballivián Rosado).
El reclutador publica una oferta, el postulante sube su CV en PDF y el sistema extrae los datos con IA,
calcula un puntaje de compatibilidad con una fórmula determinista y genera un ranking.
La calidad del sistema se evalúa con **ISO/IEC 25010:2023**. El plan completo está en [docs/PLAN.md](docs/PLAN.md).

## Stack
Next.js 16 (App Router) + TypeScript · Supabase (PostgreSQL, Auth, Storage, RLS) · OpenAI (salida estructurada) · unpdf · Vitest · Playwright · Vercel

## Arquitectura (hexagonal + Clean Architecture pragmática)
```
src/
├── dominio/          entidades, puntaje y puertos (TypeScript puro)
├── aplicacion/       casos de uso (solo dependen del dominio)
├── infraestructura/  adaptadores: OpenAI, PDF, Supabase
├── composicion.ts    elige las implementaciones de los puertos
└── app/              presentación (Next.js)
```
La regla de dependencias se verifica con ESLint en cada ejecución del CI.

## Puesta en marcha (local)
1. `npm install`
2. Copia `.env.example` como `.env.local` y completa los datos del proyecto Supabase **dev**.
3. Aplica el esquema: `npx supabase login`, `npx supabase link --project-ref <ref-dev>` y `npx supabase db push`.
4. Datos de prueba: `SEED_PERMITIR=dev npm run seed`
5. `npm run dev`

## Comandos de calidad
| Comando | Qué hace |
|---|---|
| `npm run lint` | ESLint + regla de capas |
| `npm run typecheck` | Verificación de tipos |
| `npm test` | Pruebas unitarias |
| `npm run test:coverage` | Pruebas + cobertura del núcleo (umbral 80 %) |

Todos los datos de prueba son ficticios.
