# E06. Plan de gestión y aseguramiento de la calidad

> **Plantilla:** Formatos 05 + Formatos 06 (6.6: cronograma) · **Estado:** borrador v0.1 (18/11/2026) · **Fuente de verdad:** este archivo.
> Los valores de P01–P05 se calculan al cierre (E12) con los datos de Trello y Git; aquí solo se fijan las metas.

| Campo | Valor |
|---|---|
| Código del entregable | E06 |
| Sistema evaluado | CV Lectura — Sistema web de RRHH con lectura automática de CVs |
| Responsable de calidad | Giancarlos Ormeño |
| Fecha / versión del plan | 18/11/2026 · v0.1 (borrador) |

## 6.1 Objetivo del plan

Organizar cómo se **previenen** (aseguramiento) y se **detectan** (control) los problemas de calidad de CV Lectura, para que el producto llegue a la evaluación oficial con los 24 requisitos de E05 verificables y con evidencia de cada resultado.

Resultados que se buscan:

- Un producto desplegado en producción que se pueda medir contra los umbrales congelados de E05.
- Un proceso trazable: cada requisito llega a sus casos de prueba, defectos, métricas y acciones de mejora (RQ → CP → DEF → M → AM), con su evidencia (EV).
- Mejora continua con el ciclo **PHVA** (planificar, hacer, verificar, actuar) en cada acción de mejora, volviendo a medir después de aplicarla.

El plan sigue el proceso de evaluación de ISO/IEC 25040:2024 (definir, diseñar, planificar, ejecutar y concluir la evaluación) y toma como referencia el enfoque a procesos y la mejora continua de ISO 9001:2026, sin buscar certificación (E04).

## 6.2 Alcance y responsabilidades

| Actividad de calidad | Responsable | Participantes | Registro / evidencia generada |
|---|---|---|---|
| Planificación de la calidad (PLAN, E05, E06, E07) | Giancarlos Ormeño | Todo el equipo (revisión) | `docs/PLAN.md`, entregables E05–E07, etiqueta `umbrales-v1.0` |
| Desarrollo y pruebas automatizadas | Giancarlos Ormeño | — | Historial de Git, ejecuciones del CI, reportes de Vitest y Playwright |
| Revisión de código antes de integrar a `main` | Giancarlos Ormeño (autorrevisión con lista de verificación) | — | Lista de verificación en el mensaje del commit o del *pull request* |
| Ejecución de casos de prueba manuales | Raquel Montes, Hermy Salcedo, Nancy Vilcas y Paul Carretero | Giancarlos Ormeño (soporte) | Fichas de CP con capturas propias (E09) |
| Formato de CV para el dataset (cv-31 a cv-34) | Raquel, Hermy, Nancy y Paul (uno cada uno) | — | Su CV como modelo de diseño; el PDF ficticio y su respuesta esperada se generan |
| Prueba de tareas, SUS y revisión cronometrada | Giancarlos Ormeño (facilitador) | Los 4 integrantes + 2 o 3 personas externas | Hojas de observación, cuestionarios y hoja de tiempos |
| Mediciones oficiales (extracción, tiempos, k6, ZAP, disponibilidad) | Giancarlos Ormeño | — | Reportes exportados en `evidencias/` |
| Registro y seguimiento de defectos | Giancarlos Ormeño | Quien detecta el defecto lo reporta | Registro de defectos (E10) |
| Gestión del cronograma | Giancarlos Ormeño | Todo el equipo | Tablero de Trello |

## 6.3 Objetivos y metas de calidad

**Del producto:** son los 24 requisitos de E05 (no se repiten aquí). **Del proceso** (S11):

| Objetivo | Indicador | Meta / umbral | Método de medición | Frecuencia |
|---|---|---|---|---|
| Cumplir las actividades planificadas | P01 Cumplimiento de actividades = actividades realizadas / planificadas × 100 | ≥ 90 % | Tarjetas de Trello en "Hecho" frente a las planificadas | Semanal (cada viernes) y al cierre |
| Cumplir los plazos | P02 Cumplimiento de plazos = tareas terminadas a tiempo / tareas programadas × 100 | ≥ 85 % | Fecha de cierre de cada tarjeta frente a su fecha límite | Semanal y al cierre |
| Conocer el avance de las pruebas | P03 % de pruebas aprobadas = aprobadas / ejecutadas × 100 | Sin meta (indicador informativo; no es "calidad total") | Resumen de E09 | Al cierre de cada ciclo de ejecución |
| Conocer la densidad de defectos | P04 Tasa de defectos = defectos registrados / CP ejecutados | Sin meta (informativo) | Registro de E10 | Al cierre de cada ciclo |
| Limitar el retrabajo | P05 % de retrabajo = commits de corrección / commits totales × 100 (aproximación declarada) | ≤ 20 % | Historial de Git en el periodo de evaluación | Al cierre |

## 6.4 Actividades de aseguramiento (preventivas)

| Actividad preventiva | Procedimiento | Momento / frecuencia | Responsable | Evidencia |
|---|---|---|---|---|
| Revisión de requisitos | Cada RQ se revisa contra la cadena característica → criterio → indicador → meta → método y debe tener un CP asociado | Antes de congelar E05 (22/11) | Giancarlos Ormeño; equipo revisa el Word | E05 v1.0 y etiqueta `umbrales-v1.0` |
| Congelamiento de umbrales | Las metas y las reglas de comparación se fijan antes de medir | 22/11/2026 | Giancarlos Ormeño | Etiqueta Git `umbrales-v1.0` |
| Arquitectura por capas | Dominio y aplicación sin dependencias de Next.js, Supabase u OpenAI; ESLint bloquea las importaciones prohibidas | En cada commit | Giancarlos Ormeño | Configuración de ESLint y registro del CI |
| Desarrollo guiado por pruebas en el núcleo | La fórmula de puntaje y los casos de uso se escriben con su prueba primero | Durante el desarrollo | Giancarlos Ormeño | Historial de Git y suites de Vitest |
| Mínimo privilegio en la base de datos | RLS en todas las tablas y en el bucket de CVs; permisos explícitos por rol; pruebas de seguridad antes de cada cambio de esquema | En cada migración | Giancarlos Ormeño | Migraciones en `supabase/migrations/` y pruebas de integración |
| Autorrevisión de código con lista de verificación | Antes de integrar a `main`: ¿pasa el CI?, ¿cada cambio tiene prueba?, ¿no hay secretos?, ¿respeta la regla de capas?, ¿los textos al usuario son claros? | En cada integración a `main` | Giancarlos Ormeño | Lista en el commit o *pull request*. **Limitación declarada:** no hay un segundo revisor técnico |
| Datos de prueba ficticios | Respuesta esperada escrita antes que el PDF; correos `@example.com`; ningún dato personal real | Al generar el dataset | Giancarlos Ormeño | `dataset/README.md` |
| Secretos fuera del repositorio | Claves solo en `.env.local` y en Vercel; contraseña privada para las cuentas de producción | Permanente | Giancarlos Ormeño | `.gitignore` y configuración de Vercel |

## 6.5 Actividades de control (detectivas)

| Actividad de control | Criterio aplicado | Método | Responsable | Registro |
|---|---|---|---|---|
| Integración continua | ESLint sin errores, TypeScript sin errores, pruebas unitarias aprobadas y cobertura ≥ 80 % (RQ-MAN-01, RQ-MAN-03) | GitHub Actions en cada *push* y *pull request* a `main` | Automático; revisa Giancarlos Ormeño | Pestaña "Actions" de GitHub y artefacto de cobertura |
| Pruebas de integración y seguridad de la BD | 0 accesos indebidos (RQ-SEG-01) | Vitest contra Supabase (dev y prod) | Giancarlos Ormeño | Reporte de Vitest |
| Pruebas E2E | 100 % de CP aprobados en 4 navegadores (RQ-FUN-04, RQ-FLE-01) | Playwright contra producción | Giancarlos Ormeño | Reporte HTML de Playwright |
| Casos de prueba manuales | Resultado esperado de cada ficha (E08) | Ejecución por los integrantes con captura | Raquel, Hermy, Nancy y Paul | Fichas de E09 |
| Medición de la extracción | Umbrales de RQ-FUN-01, RQ-FUN-02 y RQ-COM-01 | Script comparador, 3 corridas en producción | Giancarlos Ormeño | Reportes del comparador |
| Análisis estático | 0 issues bloqueantes o críticos (RQ-MAN-02) | SonarQube Community | Giancarlos Ormeño | Captura del panel |
| Escaneo de seguridad y carga | RQ-SEG-02 y RQ-DES-02 | OWASP ZAP y k6 contra producción | Giancarlos Ormeño | Reportes de ZAP y k6 |
| Monitoreo de disponibilidad | ≥ 99 % (RQ-FIA-02) | UptimeRobot cada 5 min a `/api/salud` | Giancarlos Ormeño | Reporte del monitor |
| Seguimiento del cronograma | P01 y P02 (6.3) | Revisión del tablero de Trello | Giancarlos Ormeño | Tablero de Trello |

## 6.6 Herramientas y recursos

| Herramienta / recurso | Uso | Responsable | Disponibilidad / observaciones |
|---|---|---|---|
| GitHub (repositorio público) | Control de versiones, historial y etiquetas | Giancarlos Ormeño | https://github.com/GiancarlosDev-10/CV_LECTURA; `docs/curso/` excluido |
| GitHub Actions | Integración continua | Giancarlos Ormeño | Plan gratuito; configurado en `.github/workflows/ci.yml` |
| Trello | Cronograma y seguimiento de actividades (P01, P02) | Giancarlos Ormeño | Una tarjeta por entregable y tarea, con fecha límite |
| Vercel | Despliegue de producción (región São Paulo) | Giancarlos Ormeño | Plan gratuito; despliegue automático desde `main` |
| Supabase (dev y prod) | Base de datos, autenticación, archivos y RLS | Giancarlos Ormeño | Plan gratuito; dos proyectos en São Paulo |
| OpenAI | Extracción de datos del CV | Giancarlos Ormeño | Se compra saldo recién para medir; antes se usa el extractor simulado |
| Vitest, Playwright, k6, OWASP ZAP, SonarQube Community, ESLint | Pruebas y análisis | Giancarlos Ormeño | Gratuitos; k6, ZAP y SonarQube se ejecutan desde la PC |
| UptimeRobot | Monitoreo de disponibilidad | Giancarlos Ormeño | Plan gratuito; **monitor pendiente de crear** (límite 24/11/2026) |
| Dataset de 40 CVs ficticios | Datos de prueba | Giancarlos Ormeño; CVs 31–34 del equipo | 36 de 40 generados; faltan los 4 del equipo |
| Integrantes del equipo | CP manuales, usabilidad y revisión cronometrada | Cada integrante | Sesión conjunta de 1 hora como contingencia |

## 6.7 Gestión de cambios y no conformidades

**Cambios en los requisitos o umbrales.** Después del 22/11/2026, E05 no se edita en silencio. Cada cambio se registra en una tabla de control de cambios al final de E05 con: fecha, requisito afectado, valor anterior, valor nuevo, motivo y quién lo aprueba (el equipo). El cambio genera una nueva versión (v1.1, v1.2…) y una nueva etiqueta Git. Un umbral **nunca** se cambia para que un requisito pase.

**Defectos.** Siguen el flujo de gestión de incidentes de ITIL visto en S07:

1. **Registro:** quien detecta el defecto lo anota en E10 con código DEF-NNN, pasos para reproducir, resultado esperado y real, y evidencia.
2. **Clasificación:** severidad según el impacto en el usuario y prioridad según impacto × urgencia.
3. **Asignación:** al responsable de desarrollo.
4. **Resolución:** corrección en un commit que menciona el DEF y su prueba de regresión.
5. **Cierre:** se vuelve a ejecutar el CP que lo detectó; si pasa, el defecto se cierra con la evidencia.

**Desviaciones del plan.** Si una actividad se atrasa, se registra en Trello y se decide en la revisión semanal si se reprograma, se reduce el alcance o se declara como limitación en E12.

**Requisitos que no cumplen.** Generan un hallazgo y, si corresponde, una acción de mejora (AM-NN) con ciclo PHVA en E13: planificar la corrección, hacerla, **volver a medir** y estandarizar. Se informan los resultados antes y después.

## 6.8 Cronograma de evaluación

| Actividad | Responsable | Fecha inicio | Fecha fin | Estado |
|---|---|---|---|---|
| Plan del proyecto (PLAN v1.0) | Giancarlos Ormeño | 13/11/2026 | 13/11/2026 | Hecho |
| Repositorio, CI y Supabase dev | Giancarlos Ormeño | 13/11/2026 | 14/11/2026 | Hecho |
| Núcleo (dominio, puntaje, casos de uso) con pruebas | Giancarlos Ormeño | 14/11/2026 | 16/11/2026 | Hecho |
| Supabase prod y despliegue en Vercel | Giancarlos Ormeño | 15/11/2026 | 24/11/2026 | Hecho (15/11) |
| Pantallas de reclutador y postulante (M1–M6) | Giancarlos Ormeño | 16/11/2026 | 24/11/2026 | En proceso |
| Dataset de prueba (40 CVs) | Giancarlos Ormeño | 17/11/2026 | 18/11/2026 | Hecho |
| CVs con el formato de cada integrante (cv-31 a cv-34) | Raquel, Hermy, Nancy y Paul | 19/11/2026 | 19/11/2026 | Hecho |
| Monitor de disponibilidad | Giancarlos Ormeño | 18/11/2026 | 24/11/2026 | Hecho (22/11/2026 15:24) |
| Borradores E01–E04 | Giancarlos Ormeño | 18/11/2026 | 20/11/2026 | Hecho (v0.1) |
| Borradores E05–E08 | Giancarlos Ormeño | 18/11/2026 | 27/11/2026 | En proceso |
| Congelamiento de umbrales (E05 v1.0, `umbrales-v1.0`) | Equipo | 22/11/2026 | 22/11/2026 | Hecho |
| Pruebas E2E, script comparador y script de medición | Giancarlos Ormeño | 20/11/2026 | 27/11/2026 | Hecho (22/11/2026) |
| Ejecución: automatizadas, ZAP, k6, 3 corridas de extracción | Giancarlos Ormeño | 27/11/2026 | 04/12/2026 | Hecho (22/11/2026), adelantado; falta SonarQube |
| Ejecución de CP manuales | Raquel, Hermy, Nancy y Paul | 28/11/2026 | 03/12/2026 | Pendiente |
| Prueba de tareas, SUS y revisión cronometrada | Equipo + externos | 28/11/2026 | 03/12/2026 | Pendiente |
| E09, E10 y E11 (primera medición) | Giancarlos Ormeño | 30/11/2026 | 04/12/2026 | Borrador v0.1 (22/11/2026), con los automatizados |
| Acciones de mejora y segunda medición | Giancarlos Ormeño | 04/12/2026 | 09/12/2026 | Hecho para DEF-001, DEF-002 y DEF-004 (22/11/2026) |
| Fin del periodo de monitoreo de disponibilidad | Giancarlos Ormeño | — | 08/12/2026 | En curso |
| E12 y E13 (antes y después) | Giancarlos Ormeño | 04/12/2026 | 09/12/2026 | Pendiente |
| Congelamiento del código, E14 y anexos | Equipo | 09/12/2026 | 11/12/2026 | Pendiente |
| **Entrega del expediente** | Equipo | — | 11/12/2026 | Pendiente |
| Diapositivas, ensayo y **sustentación** | Equipo | 11/12/2026 | 18/12/2026 | Pendiente |

## 6.9 Aprobación del plan

| Campo | Valor |
|---|---|
| Elaborado por | Giancarlos Ormeño (responsable de calidad) |
| Revisado por | Raquel Montes, Hermy Salcedo, Nancy Vilcas y Paul Carretero |
| Fecha de aprobación | 22/11/2026, junto con E05 v1.0 |
