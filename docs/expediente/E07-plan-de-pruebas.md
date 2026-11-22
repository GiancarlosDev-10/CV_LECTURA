# E07. Plan de pruebas de software

> **Plantilla:** Formatos 07 · **Estado:** borrador v0.1 (18/11/2026) · **Fuente de verdad:** este archivo.
> Versiones instaladas el 22/11/2026: k6 v2.4.0 y OWASP ZAP 2.17.0 (con Java 21). SonarQube Cloud (análisis automático, sin instalación) desde el 22/11/2026.

| Campo | Valor |
|---|---|
| Código del entregable | E07 |
| Sistema / versión | CV Lectura — despliegue de producción (el commit evaluado se registra en cada evidencia) |
| Responsable de pruebas | Giancarlos Ormeño |
| Entorno de pruebas | Producción: https://cv-lectura.vercel.app + Supabase `cv-lectura-prod` (São Paulo). Desarrollo: local + Supabase `cv-lectura-dev` |
| Fecha | 18/11/2026 |

## 7.1 Objetivos de prueba

1. Comprobar que las funciones de M1–M6 hacen lo que especifica E01 (RQ-FUN-04).
2. Medir la **exactitud de la extracción** con IA y la **corrección del puntaje** (RQ-FUN-01, RQ-FUN-02, RQ-FUN-03), que es lo que pide el enunciado.
3. Demostrar que los **datos personales están protegidos**: nadie accede a lo que no le corresponde, el consentimiento queda registrado, el titular puede eliminar sus datos y las vistas quedan registradas (RQ-SEG-01 a RQ-SEG-06).
4. Medir el **tiempo por CV** y la respuesta bajo carga (RQ-DES-01, RQ-DES-02).
5. Verificar que **una falla nunca perjudica al postulante**: todo error termina en revisión manual y sin puntaje (RQ-FIA-01, RQ-SOP-01).
6. Obtener la evidencia de los demás requisitos de E05 (mantenibilidad, interacción, flexibilidad, compatibilidad, disponibilidad y valor).

## 7.2 Alcance

**Incluido:**

- **Módulos:** M1 Autenticación y roles, M2 Ofertas (crear, editar sin postulaciones, cerrar y reabrir), M3 Postulación, M4 Extracción con IA, M5 Puntaje y ranking (incluida la decisión del reclutador), M6 Privacidad.
- **Usuarios:** reclutador y postulante, además del usuario sin sesión (para las pruebas de acceso indebido).
- **Componentes:** interfaz web, Server Actions y Route Handlers, base de datos con RLS, bucket privado de CVs, integración con OpenAI y despliegue en Vercel.

**Excluido:**

- Administrador (fuera de alcance del sistema, E01).
- PDFs escaneados con OCR: solo se prueba que se **rechazan de forma controlada**.
- Utilización de recursos y capacidad de la infraestructura (plataforma gestionada, E05 5.4).
- Envío de correos: la confirmación de email está desactivada en desarrollo por el límite de envíos del SMTP de Supabase.
- Pruebas de carga altas o de estrés: solo 10 usuarios concurrentes, para no afectar el plan gratuito.

## 7.3 Estrategia y tipos de pruebas

Las pruebas siguen la arquitectura por capas: el dominio se prueba con unitarias puras, la aplicación con dobles simulados, la infraestructura con integración contra Supabase y la presentación con E2E.

| Tipo de prueba | Objetivo | Módulo / componente | Técnica / herramienta | Criterio de aprobación |
|---|---|---|---|---|
| Unitaria | Fórmula de puntaje, alias, ranking, casos de uso | Dominio y aplicación (M3–M6) | Vitest; partición de equivalencia y valores límite | 100 % aprobadas; cobertura del núcleo ≥ 80 % |
| Unitaria con IA simulada | Tolerancia a fallos y falla segura | `procesarCv` (M4) | Vitest + `ExtractorCvSimulado` (tiempo agotado, error del servicio, JSON inválido) | 100 % de fallas en revisión manual |
| Integración | RLS, permisos por columna, bucket privado, procesamiento de punta a punta | Supabase (BD, Storage) | Vitest contra `cv-lectura-dev` y `cv-lectura-prod` | 0 accesos indebidos; 100 % aprobadas |
| E2E (funcional y de sistema) | Flujos completos de M1–M6 por rol | Interfaz web | Playwright en Chromium, Firefox, WebKit y perfil móvil | 100 % aprobadas en cada navegador |
| Funcional manual | Flujos y casos negativos vistos por un usuario | M1–M6 | Fichas de CP (E08) ejecutadas por los integrantes | Resultado esperado de cada ficha |
| Exactitud de la extracción | Campos y listas extraídas frente a la respuesta esperada | M4 | Script comparador, 3 corridas (reglas de E05 5.5) | ≥ 90 % de campos; F1 ≥ 0,85 |
| Seguridad | Acceso indebido (IDOR), sin sesión, URL directa, archivo falso, inyección de instrucciones, vulnerabilidades comunes | M1, M3, M5, M6 y despliegue | CP manuales (lista OWASP ASVS) + OWASP ZAP (escaneo base) | 0 accesos indebidos; 0 alertas altas |
| Desempeño | Tiempo por CV y respuesta bajo carga | M3–M5; páginas y API | Marcas de tiempo en BD (SQL) + k6 | p95 ≤ 15 s por CV; p95 ≤ 1,5 s y < 1 % de errores |
| Usabilidad | Aprendizaje, operabilidad y satisfacción | Flujos de postulante y reclutador | Prueba de 3 tareas observada + cuestionario SUS | ≥ 90 % completa; SUS ≥ 68 |
| Calidad en uso (valor) | Ahorro de tiempo frente a la revisión manual | Flujo del reclutador | Revisión de 10 CVs con cronómetro, a mano y con el sistema | Reducción ≥ 50 % |
| Análisis estático | Analizabilidad y modularidad | Todo el código | ESLint (regla de capas) en el CI + SonarQube Community | 0 violaciones; 0 issues bloqueantes o críticos |
| Disponibilidad | Tiempo en servicio | Producción | UptimeRobot a `/api/salud` cada 5 min | ≥ 99 % |
| Regresión | Que una corrección no rompa lo que ya funcionaba | Todo | CI en cada *push* + repetición del CP que detectó el defecto | CI en verde y CP aprobado |

## 7.4 Entorno y datos de prueba

| Elemento | Descripción / versión / configuración | Observaciones |
|---|---|---|
| Producción (entorno evaluado) | https://cv-lectura.vercel.app, Vercel región `gru1` (São Paulo), despliegue automático desde `main` | **Todas las mediciones oficiales se hacen aquí** |
| Base de datos y archivos | Supabase `cv-lectura-prod` (PostgreSQL, Auth, Storage con bucket privado y RLS), São Paulo | Migraciones idénticas a dev |
| Desarrollo | `npm run dev` en la PC + Supabase `cv-lectura-dev` | Solo para desarrollo y pruebas automatizadas |
| Aplicación | Next.js 16.4.6, React 19.3, TypeScript 5, Zod 4, unpdf 2 | Ver `package.json` |
| IA | OpenAI, modelo *mini* con versión exacta fijada y temperatura 0 | La versión se registra en cada postulación (`modelo_ia`) |
| Herramientas de prueba | Vitest 5.1, Playwright 1.65, k6 v2.4.0, OWASP ZAP 2.17.0, SonarQube Cloud | k6 y ZAP instalados el 22/11/2026; SonarQube Cloud por web, sin instalación |
| CI | GitHub Actions, Ubuntu, Node.js 24 | `.github/workflows/ci.yml` |
| Navegadores | Chromium, Firefox, WebKit (de Playwright) y perfil móvil | — |
| Cuentas de prueba | 2 reclutadores y 3 postulantes creados por el *seed* (`@example.com`) | En producción la contraseña es privada, no la publicada para dev |
| Ofertas | 3 ofertas del *seed*: Desarrollador Full Stack Junior, Analista de Datos, Asistente de Recursos Humanos | — |
| Dataset | 40 CVs ficticios (`dataset/`): 30 generados en 8 estilos, 4 con el formato del CV de cada integrante, 2 escaneados, 2 con inyección, 1 ejecutable renombrado y 1 de más de 5 MB | Respuesta esperada en `dataset/esperados/`; ningún dato personal real |
| Postulantes para medir | Un script de medición crea postulantes ficticios y sube los CVs del dataset (una postulación por postulante y oferta, como exige la BD) | Listo: `npm run medicion -- <N>` (`scripts/medicion-prod.ts`), postula desde un navegador real con Playwright |

## 7.5 Criterios de entrada y salida

| Tipo de criterio | Condición | Cómo se verificará |
|---|---|---|
| Entrada | Umbrales congelados | Existe la etiqueta Git `umbrales-v1.0` (22/11/2026) |
| Entrada | Despliegue estable en producción | CI en verde sobre el commit desplegado y `/api/salud` responde |
| Entrada | Dataset completo | 40 PDFs con su respuesta esperada (incluidos cv-31 a cv-34) |
| Entrada | Herramientas listas | Script comparador, script de medición y E2E ejecutados una vez en dev sin errores |
| Entrada | Fichas de CP entregadas a cada integrante | E08 v1.0 compartido con el equipo |
| Suspensión | Producción no disponible o un defecto crítico bloquea un flujo | Se detiene la ejecución afectada, se registra el DEF y se reanuda después de la corrección |
| Salida | Todos los CP planificados ejecutados | Cada CP de E08 tiene resultado en E09 (o "No ejecutado" con su motivo) |
| Salida | Defectos registrados y clasificados | Todo resultado distinto del esperado tiene su DEF en E10 |
| Salida | Métricas calculadas | M01–M23 con valor, fuente y evidencia en E11 |
| Salida | Sin defectos críticos abiertos | Registro de E10 al cierre (09/12/2026) |

## 7.6 Roles y cronograma

| Actividad | Responsable | Fecha prevista | Recursos | Estado |
|---|---|---|---|---|
| Pruebas unitarias y de integración | Giancarlos Ormeño | 14/11 – 27/11/2026 | Vitest, Supabase dev | Hecho: 92 unitarias y 27 de integración (22/11/2026) |
| Pruebas E2E con Playwright | Giancarlos Ormeño | 20/11 – 27/11/2026 | Playwright | Hecho: 5 pruebas en 4 perfiles (22/11/2026) |
| Script comparador y script de medición | Giancarlos Ormeño | 20/11 – 27/11/2026 | Node.js, dataset | Hecho (22/11/2026) |
| CVs con el formato de cada integrante (cv-31 a cv-34) | Raquel, Hermy, Nancy y Paul (aportan su CV como modelo) | 19/11/2026 | Generador del dataset | Hecho |
| Congelamiento de umbrales | Equipo | 22/11/2026 | E05 | Hecho |
| 3 corridas de extracción y tiempo por CV | Giancarlos Ormeño | 27/11 – 02/12/2026 | OpenAI, producción | Hecho, adelantado al 22/11/2026 (6 corridas: 2 mediciones) |
| CP manuales de M1 y M2 (7 casos) | Raquel Montes | 24/11 – 27/11/2026 | Fichas E08, producción | Pendiente |
| CP manuales de M3 | Hermy Salcedo | 24/11 – 27/11/2026 | Fichas E08, dataset | Pendiente |
| CP manuales de M4 y M5 | Nancy Vilcas | 24/11 – 27/11/2026 | Fichas E08, dataset | Pendiente |
| CP manuales de seguridad y privacidad | Paul Carretero | 24/11 – 27/11/2026 | Fichas E08, dos navegadores | Pendiente |
| Prueba de tareas, SUS y revisión cronometrada | Giancarlos Ormeño (facilitador) + equipo y 2 o 3 externos | 23/11 – 24/11/2026 | Cronómetro, cuestionario | Pendiente |
| ZAP, k6 y SonarQube | Giancarlos Ormeño | 01/12 – 04/12/2026 | PC del equipo | Hecho el 22/11/2026 (ZAP, k6 y SonarQube Cloud) |
| Repetición de pruebas tras las mejoras (segunda medición) | Giancarlos Ormeño | 04/12 – 09/12/2026 | Todas | Hecho para los automatizados (22/11/2026) |

## 7.7 Riesgos y contingencias

| Riesgo | Probabilidad / impacto | Respuesta prevista | Responsable |
|---|---|---|---|
| Integrantes no disponibles para sus CP | Media / medio | Fichas entregadas con anticipación; sesión conjunta de 1 hora; un CP sin ejecutar se declara "No ejecutado", no se completa | Giancarlos Ormeño |
| Variabilidad de las respuestas de la IA | Media / medio | Temperatura 0, versión fijada y 3 corridas con promedio y desviación | Giancarlos Ormeño |
| Arranque en frío de Vercel distorsiona el tiempo por CV | Media / medio | El primer CV de cada corrida se reporta aparte | Giancarlos Ormeño |
| Límite de uso o costo de OpenAI | Baja / bajo | Desarrollo con el extractor simulado; saldo comprado solo para medir | Giancarlos Ormeño |
| Mediciones hechas en local por error | Media / alto | Cada evidencia registra la URL y el commit; solo cuenta producción | Giancarlos Ormeño |
| ZAP o k6 afectan el plan gratuito | Baja / medio | Escaneo base (no activo agresivo) y solo 10 usuarios durante 2 min | Giancarlos Ormeño |
| Monitor de disponibilidad creado tarde | Alta / medio | Crear el monitor antes del 24/11; el periodo medido se declara con su fecha real de inicio | Giancarlos Ormeño |
| Pocos participantes para la usabilidad | Media / medio | Invitar a 2 o 3 externos; si son menos, se declara el tamaño real de la muestra | Giancarlos Ormeño |
| Pérdida de la cuenta de Supabase | Baja / alto | Migraciones y *seed* en el repositorio: el entorno se recrea en minutos | Giancarlos Ormeño |
