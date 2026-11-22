# E09. Ejecución de pruebas y evidencias

> **Plantilla:** Formatos 09 · **Estado:** borrador v0.1 (22/11/2026) · **Fuente de verdad:** este archivo.
> Este borrador registra la ejecución de los casos automatizados (CP-001 a CP-026). Los casos manuales del equipo (CP-027 a CP-052) se agregan a 9.2 cuando cada integrante los ejecute, con sus capturas. CP-023 (disponibilidad, hasta el 08/12) sigue en curso.

| Campo | Valor |
|---|---|
| Código del entregable | E09 |
| Sistema / versión | CV Lectura en producción (https://cv-lectura.vercel.app). Primera medición: commit `e1ac215`. Segunda medición, después de las acciones de mejora: commit `3312f07` |
| Responsable de la ejecución | Giancarlos Ormeño (casos automatizados) |
| Periodo de ejecución | 22/11/2026 (automatizados); manuales del equipo: pendiente |
| Umbrales aplicados | E05 v1.0, congelados el 22/11/2026 (etiqueta Git `umbrales-v1.0`) antes de la primera medición oficial |
| Modelo de IA | `gpt-4o-mini-2024-07-18`, temperatura 0 |

## 9.1 Resumen de ejecución

| Casos planificados | Ejecutados | Aprobados | Fallidos | Bloqueados / pendientes | Porcentaje de aprobación |
|---|---|---|---|---|---|
| 52 | 24 | 24 | 0 | 28 (26 manuales, CP-023 y CP-026) | 100 % de los ejecutados (91,7 % en la primera ejecución: 22 de 24) |

- **Primera ejecución:** 22 de 24 aprobados. CP-016 falló porque RQ-FUN-01 dio 85,7 % frente a la meta de 90 % (causa: DEF-001); en esa misma ejecución se detectó DEF-002 (RQ-SEG-06). CP-022 falló con 2 issues críticos de SonarQube en la herramienta de medición (DEF-007).
- **Re-ejecución después de las acciones de mejora:** CP-016 aprobado (96,7 %) y CP-022 aprobado (0 críticos). Se repitieron también CP-017, CP-018, CP-019 y CP-024 sobre la versión corregida para comprobar que nada se rompió.
- El porcentaje de aprobación es un indicador del proceso (P03, E06), no una medida de la calidad del producto (E05 5.7).

## 9.2 Registro de ejecución

| ID caso | Fecha / hora | Ejecutor | Resultado esperado | Resultado obtenido | Estado | Código de evidencia |
|---|---|---|---|---|---|---|
| CP-001 a CP-008 | 22/11/2026 16:48 | Giancarlos Ormeño | 100 % de las pruebas unitarias aprobadas | 92 de 92 pruebas aprobadas (9 archivos) | Aprobado | EV-01 |
| CP-009 a CP-015 | 22/11/2026 16:48 | Giancarlos Ormeño | Procesamiento correcto y 0 accesos indebidos exitosos (Supabase dev) | 27 de 27 pruebas de integración aprobadas | Aprobado | EV-02 |
| CP-016 (1.ª) | 22/11/2026 15:40–15:54 | Giancarlos Ormeño | Promedio de 3 corridas: campos ≥ 90 %, F1 ≥ 0,85, respuestas válidas ≥ 98 % | Campos 85,7 % ± 0,3; F1 0,919 ± 0,022; respuestas válidas 100 % (108 de 108); 12 CVs sin guardar (DEF-001) | **Fallido** | EV-05, EV-13 |
| CP-016 (2.ª) | 22/11/2026 16:02–16:13 | Giancarlos Ormeño | Igual que la 1.ª | Campos 96,7 % ± 0,3; F1 0,988 ± 0,000; respuestas válidas 100 % (108 de 108) | Aprobado | EV-06, EV-13 |
| CP-017 (1.ª y 2.ª) | 22/11/2026 | Giancarlos Ormeño | p95 de `fin_procesamiento − subido_en` ≤ 15 s | 1.ª: p95 = 4,7 s (114 CVs). 2.ª: p95 = 4,9 s (114 CVs); máximo 6,0 s | Aprobado | EV-05, EV-06 |
| CP-018 (1.ª) | 22/11/2026 15:56 | Giancarlos Ormeño | p95 ≤ 1,5 s y errores < 1 % con 10 usuarios durante 2 min | p95 = 299 ms; 0 % de errores (3 015 solicitudes) | Aprobado | EV-07 |
| CP-018 (2.ª) | 22/11/2026 16:40 | Giancarlos Ormeño | Igual que la 1.ª | p95 = 297 ms; 0 % de errores (3 030 solicitudes) | Aprobado | EV-08 |
| CP-019 (1.ª) | 22/11/2026 15:59 | Giancarlos Ormeño | 0 alertas de riesgo alto (escaneo base, pasivo) | 0 altas; 4 tipos de alerta media, 2 baja y 3 informativas (46 URLs) | Aprobado | EV-09 |
| CP-019 (2.ª) | 22/11/2026 16:13 | Giancarlos Ormeño | Igual que la 1.ª | 0 altas; 3 tipos de alerta media, 0 baja y 3 informativas | Aprobado | EV-10 |
| CP-020 | 22/11/2026 16:48 | Giancarlos Ormeño | Cobertura de líneas del núcleo ≥ 80 % | 97,69 % de líneas (98,06 % de sentencias) | Aprobado | EV-03 |
| CP-021 | 22/11/2026 16:48 | Giancarlos Ormeño | 0 violaciones de la regla de capas | `npm run lint` sin errores ni advertencias | Aprobado | EV-04 |
| CP-022 (1.ª) | 22/11/2026 17:03 | Giancarlos Ormeño | 0 issues bloqueantes o críticos | 0 bloqueantes y **2 críticos** (`scripts/comparador/compararExtraccion.ts`, herramienta de medición; DEF-007). 19 issues en total, 23 435 líneas analizadas (incluía reportes HTML generados) | **Fallido** | EV-16 |
| CP-022 (2.ª) | 22/11/2026 17:16 | Giancarlos Ormeño | Igual que la 1.ª | 0 bloqueantes y 0 críticos; 10 issues mayores o menores; 5 988 líneas de código; duplicación 0 % | Aprobado | EV-16 |
| CP-023 | Desde 22/11/2026 15:24 | Giancarlos Ormeño | ≥ 99 % disponible al 08/12/2026 | Monitor en marcha (100 % al iniciar) | Pendiente (en curso) | EV-14 |
| CP-024 (1.ª) | 22/11/2026 15:59 | Giancarlos Ormeño | 100 % de los flujos aprobados en los 4 perfiles | 20 de 20 aprobados (Chromium, Firefox, WebKit y móvil), después de corregir 2 pruebas mal escritas (INC-002) | Aprobado | EV-11 |
| CP-024 (2.ª) | 22/11/2026 16:41 | Giancarlos Ormeño | Igual que la 1.ª | 20 de 20 aprobados | Aprobado | EV-12 |
| CP-025 | 22/11/2026 16:50 | Giancarlos Ormeño | 100 % de las postulaciones con consentimiento | 228 de 228 postulaciones de producción con versión y fecha de consentimiento | Aprobado | EV-13 |
| CP-026 | — | Giancarlos Ormeño | Cada vista tiene su fila en `accesos_cv` | Parcial: las 8 vistas hechas por CP-024 quedaron registradas; falta cruzar las de CP-041 y CP-050 | Pendiente | EV-11, EV-12 |
| CP-027 a CP-052 | — | Equipo (según E08) | Según cada ficha de E08 | Pendiente de ejecución por cada integrante | Pendiente | — |

## 9.3 Incidencias durante la ejecución

| ID incidencia | Caso relacionado | Descripción | Impacto en la prueba | Acción tomada | Estado |
|---|---|---|---|---|---|
| INC-001 | CP-016 | El script de medición elegía el PDF antes de que la página terminara de cargar (hidratación de React); el formulario no registraba el archivo y la postulación no se enviaba. Se detectó en el primer intento de la corrida 1 | Primer intento de la corrida 1 anulado (3 usuarios creados, ninguna postulación). No afecta resultados: se borraron sus datos antes de la corrida válida | El script espera la carga completa y verifica que el archivo quedó seleccionado (commit `e1ac215`). Se repitió la corrida 1 | Cerrada |
| INC-002 | CP-024 | 2 pruebas E2E fallaban en los 4 perfiles por errores de la prueba, no del sistema: un texto que aparece dos veces en la página y una verificación que se adelantaba al borrado | 8 de 20 pruebas fallidas en el primer intento | Se corrigieron los localizadores y la espera; 20 de 20 aprobadas | Cerrada |
| INC-003 | CP-016 | Producción procesó la postulación de un usuario de ensayo creado para diagnosticar INC-001 | Ninguno: se eliminó antes de la corrida válida y no figura en los resultados | Se borraron el usuario, su postulación y su archivo; se verificó que no quedaran postulaciones recientes | Cerrada |
| INC-004 | CP-019 | El primer intento de ZAP no arrancó (ZAP debe ejecutarse desde su carpeta de instalación) | Ninguno: no llegó a escanear | Se ejecutó desde su carpeta con Java 21 | Cerrada |
| INC-005 | CP-022 | El primer análisis de SonarQube Cloud incluyó archivos que no son código: los reportes HTML generados por Playwright y ZAP, los documentos y el dataset (23 435 líneas, 19 % de duplicación, casi toda entre los dos reportes de Playwright) | Inflaba líneas, duplicación y fiabilidad; no cambiaba los 2 críticos, que están en código real | Se agregó `.sonarcloud.properties` con `sonar.exclusions=docs/**,dataset/**,coverage/**` (commit `0dec3a2`). La meta no cambió | Cerrada |

## 9.4 Análisis de resultados

**Patrones de fallos.** Los dos defectos del producto aparecieron en el módulo **M4 (extracción con IA)**, en la frontera entre el PDF y los demás componentes:

- **DEF-001:** algunos PDFs (estilo `cambria-barras`) traen caracteres nulos (U+0000) que PostgreSQL rechaza al guardar. Afectó a 4 de 34 CVs del alcance en las 3 corridas (cv-05, cv-07, cv-08 y cv-32), con el mismo resultado en las tres, así que es un defecto determinista y no una variación del modelo. La **falla segura funcionó**: esos CVs quedaron en revisión manual y sin puntaje (RQ-SOP-01), en lugar de recibir un 0.
- **DEF-002:** el CV con instrucciones ocultas en texto blanco de 1 pt (cv-37) logró que el modelo agregara "Inglés C2", y el puntaje subió de 90 a 100. cv-38, el otro CV con inyección, no se alteró en ninguna corrida. El resultado muestra que las reglas del prompt no bastan para un modelo pequeño: protegen en un caso y no en el otro.

**Módulos con mayor incidencia.** M4 concentra los defectos del producto. M1, M2, M3, M5 y M6 aprobaron sus pruebas automatizadas y E2E sin defectos. Las incidencias de proceso (INC-001 y INC-002) estuvieron en los scripts de prueba, no en el sistema. El análisis estático (CP-022) solo encontró issues críticos en la herramienta de medición, que no se despliega (DEF-007); en el código del sistema no hubo ninguno.

**Antes y después.** Con las acciones de mejora (E13), RQ-FUN-01 pasó de 85,7 % a 96,7 %, la diferencia de puntaje por inyección pasó de +10 a 0 y los tipos de alerta de ZAP bajaron de 9 a 6, sin empeorar el tiempo por CV (p95 de 4,7 a 4,9 s, muy por debajo de 15 s) ni la carga (p95 de 299 a 297 ms).

**Limitaciones de las pruebas.**

- La exactitud se midió con 34 CVs ficticios generados en 8 estilos más 4 con el formato del CV de cada integrante; CVs reales con diseños muy distintos podrían dar otros resultados.
- El filtro de DEF-002 descarta el texto de menos de 4 pt, pero no detecta texto blanco de tamaño normal ni texto oculto detrás de imágenes.
- El escaneo de ZAP es pasivo y sin sesión: no prueba ataques activos ni las páginas que requieren ingresar.
- La carga con k6 usa 10 usuarios virtuales con una sola sesión de postulante; no incluye subida de CVs.
- Las pruebas de integración (CP-009 a CP-015) se ejecutan contra Supabase dev, que tiene las mismas migraciones que producción.
- SonarQube Cloud se usa con su análisis automático, que no calcula la cobertura (esta se mide con Vitest, CP-020).
- Al 22/11 faltan los casos manuales del equipo, la prueba de usabilidad y el cierre del periodo de disponibilidad.

## 9.5 Evidencias

| Código | Nombre del archivo / captura | Qué demuestra | Caso relacionado | Ubicación / anexo |
|---|---|---|---|---|
| EV-01 | `unitarias.txt` | 92 pruebas unitarias aprobadas | CP-001 a CP-008 | `docs/evidencias/automatizadas/` |
| EV-02 | `integracion.txt` | 27 pruebas de integración y seguridad (RLS, Storage) aprobadas | CP-009 a CP-015 | `docs/evidencias/automatizadas/` |
| EV-03 | `cobertura.txt` | Cobertura del núcleo: 97,69 % de líneas | CP-020 | `docs/evidencias/automatizadas/` |
| EV-04 | `lint.txt` | ESLint sin violaciones de la regla de capas | CP-021 | `docs/evidencias/automatizadas/` |
| EV-05 | `prod-corrida-1` a `-3` (`.json` y `.reporte.md`) y `primera-medicion-resumen.txt` | Primera medición de la extracción y tiempos por CV | CP-016, CP-017 | `dataset/corridas/` |
| EV-06 | `prod-corrida-4` a `-6` y `segunda-medicion-resumen.txt` | Segunda medición, después de las acciones de mejora | CP-016, CP-017 | `dataset/corridas/` |
| EV-07 | `k6-salida.txt`, `k6-resumen.json` | Carga con 10 usuarios, primera medición | CP-018 | `docs/evidencias/carga/` |
| EV-08 | `k6-salida-2.txt`, `k6-resumen-2.json` | Carga con 10 usuarios, segunda medición | CP-018 | `docs/evidencias/carga/` |
| EV-09 | `zap-base-prod.html` / `.json` | Escaneo base de ZAP 2.17.0, primera medición | CP-019 | `docs/evidencias/seguridad/` |
| EV-10 | `zap-base-prod-2.html` / `.json` | Escaneo base de ZAP, segunda medición | CP-019 | `docs/evidencias/seguridad/` |
| EV-11 | `reporte/index.html` | Reporte de Playwright: 20 de 20 en 4 perfiles, primera medición | CP-024, CP-026 | `docs/evidencias/e2e/` |
| EV-12 | `reporte-2/index.html` | Reporte de Playwright, segunda medición | CP-024, CP-026 | `docs/evidencias/e2e/` |
| EV-13 | `consultas-prod-2026-11-22.txt` | Consentimiento, estados y motivos, respuestas válidas y puntaje con inyección | CP-016, CP-025 | `docs/evidencias/sql/` |
| EV-14 | `2026-11-22-uptimerobot-panel.png`, `2026-11-22-uptimerobot-detalle.png` | Inicio del monitor de disponibilidad (cada 5 min a `/api/salud`) | CP-023 | `docs/evidencias/disponibilidad/` |
| EV-15 | `local-4o-mini-prueba1` a `-3` | Corridas de preparación (no oficiales) que detectaron DEF-003 | — (preparación) | `docs/evidencias/preparacion/` |
| EV-16 | `issues-1-2a202e0.json`, `medidas-1-2a202e0.json`, `issues-2-0dec3a2.json`, `medidas-2-0dec3a2.json` | SonarQube Cloud (análisis automático), 1.ª y 2.ª medición, descargadas de su API pública | CP-022 | `docs/evidencias/sonarqube/` y https://sonarcloud.io/project/overview?id=GiancarlosDev-10_CV_LECTURA |
