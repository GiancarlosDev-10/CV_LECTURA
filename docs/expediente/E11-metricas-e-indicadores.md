# E11. Informe de medición mediante métricas e indicadores

> **Plantilla:** Formatos 11 · **Estado:** borrador v0.1 (22/11/2026) · **Fuente de verdad:** este archivo.
> Contiene la primera medición oficial y la segunda (después de las acciones de mejora de E13), ambas del 22/11/2026. Las métricas que dependen de los casos manuales del equipo, de la prueba de usabilidad, de SonarQube o del cierre del periodo de disponibilidad (08/12/2026) quedan como "Pendiente" y se completan cuando haya datos. Ninguna cifra de este informe se estimó: todas salen de una evidencia de E09.

| Campo | Valor |
|---|---|
| Código del entregable | E11 |
| Sistema evaluado | CV Lectura en producción (https://cv-lectura.vercel.app). 1.ª medición: commit `e1ac215`; 2.ª medición: commit `3312f07` |
| Periodo de medición | 22/11/2026 (1.ª y 2.ª medición). Disponibilidad: 22/11/2026 15:24 al 08/12/2026 |
| Responsable | Giancarlos Ormeño |
| Umbrales | E05 v1.0, etiqueta `umbrales-v1.0` (22/11/2026) |

## 11.1 Objetivo y método de medición

**Objetivo.** Obtener el valor de cada métrica M01–M23 de E05 (una por requisito con meta numérica; RQ-SOP-02 se verifica solo con su caso de prueba) y compararlo con su umbral congelado, para que E12 pueda valorar cada característica de la ISO/IEC 25010:2023.

**Condiciones de medición.**

- **Entorno:** producción (Vercel, región São Paulo + Supabase `cv-lectura-prod`), como exige E05 5.7. Las pruebas de integración de seguridad (CP-009 a CP-015) se ejecutan contra Supabase dev, que tiene las mismas migraciones.
- **Extracción con IA:** `gpt-4o-mini-2024-07-18`, temperatura 0. Cada medición son **3 corridas** del dataset completo (38 CVs que llegan a procesarse; alcance de M01 y M02: cv-01 a cv-34). Se informa el promedio y la desviación estándar muestral, porque el modelo no es 100 % determinista.
- **Ejecución realista:** el script de medición (`npm run medicion`) crea un postulante ficticio por CV y postula desde un navegador real (Playwright), con consentimiento, igual que una persona. El procesamiento ocurre en producción.
- **Comparación:** el script comparador (`npm run comparar`) aplica las reglas de E05 5.5. Un CV que queda en revisión manual cuenta con todos sus campos incorrectos.
- **Dos mediciones:** la 1.ª (corridas 1–3) mide el sistema tal como estaba al congelar los umbrales; la 2.ª (corridas 4–6) mide el sistema después de las acciones de mejora AM-01, AM-02 y AM-04 (E13). La meta nunca se cambió (E05 5.7).

## 11.2 Fichas de indicadores

### INDICADOR M01 — Exactitud de los campos simples

| Campo | Valor |
|---|---|
| Nombre del indicador | % de campos simples correctos |
| Característica / subcaracterística | Adecuación funcional / corrección (RQ-FUN-01) |
| Propósito | Saber si los datos clave que el reclutador ve sin abrir el CV son correctos (N01) |
| Definición y fórmula | campos correctos / campos evaluados × 100, sobre nombre, email, teléfono, años de experiencia y nivel educativo; promedio de 3 corridas ± desviación |
| Unidad de medida | Porcentaje |
| Fuente de datos | Reportes del comparador (EV-05, EV-06) |
| Muestra / número de mediciones | 34 CVs × 5 campos = 170 campos por corrida; 3 corridas por medición |
| Meta o umbral | ≥ 90 % |
| Resultado calculado | 1.ª: **85,7 % ± 0,3** (85,9; 85,3; 85,9). 2.ª: **96,7 % ± 0,3** (96,5; 96,5; 97,1) |
| Interpretación y limitaciones | La 1.ª no cumple porque 4 CVs no se guardaron (DEF-001) y cuentan con todos sus campos incorrectos. Corregido el defecto, cumple con 6,7 puntos de margen. Los errores que quedan están en años (DEF-006) y nivel educativo (DEF-005). Limitación: dataset ficticio de 34 CVs |

### INDICADOR M02 — Exactitud de las listas

| Campo | Valor |
|---|---|
| Nombre del indicador | F1 de habilidades e idiomas |
| Característica / subcaracterística | Adecuación funcional / corrección (RQ-FUN-02) |
| Propósito | Saber si las listas se extraen completas y sin inventar elementos |
| Definición y fórmula | F1 = 2·P·R / (P + R); P = correctas / extraídas; R = correctas / esperadas (con la tabla de alias del sistema) |
| Unidad de medida | Índice de 0 a 1 |
| Fuente de datos | Reportes del comparador (EV-05, EV-06) |
| Muestra / número de mediciones | 303 elementos esperados por corrida; 3 corridas por medición |
| Meta o umbral | ≥ 0,85 |
| Resultado calculado | 1.ª: **0,919 ± 0,022**. 2.ª: **0,988 ± 0,000** |
| Interpretación y limitaciones | Cumple en ambas. La mejora de la 2.ª viene de los 4 CVs que antes no se guardaban. La desviación 0 muestra que, con temperatura 0, las listas salen iguales en las 3 corridas |

### INDICADOR M03 — Corrección del puntaje

| Campo | Valor |
|---|---|
| Nombre del indicador | % de casos con puntaje correcto |
| Característica / subcaracterística | Adecuación funcional / corrección (RQ-FUN-03) |
| Propósito | Asegurar que la fórmula de puntaje calcula lo que dice E01 |
| Definición y fórmula | casos con puntaje igual al cálculo manual / casos evaluados × 100 |
| Unidad de medida | Porcentaje |
| Fuente de datos | Pruebas unitarias de `calcularPuntaje` y `normalizacion` (EV-01) |
| Muestra / número de mediciones | 39 pruebas (22 de la fórmula y 17 de normalización por alias), 1 ejecución |
| Meta o umbral | 100 % |
| Resultado calculado | **100 %** (39 de 39) |
| Interpretación y limitaciones | Cumple. Las pruebas comparan con cálculos hechos a mano; no prueban la exactitud de los datos de entrada, que mide M01 |

### INDICADOR M04 — Completitud funcional

| Campo | Valor |
|---|---|
| Nombre del indicador | % de CP funcionales aprobados |
| Característica / subcaracterística | Adecuación funcional / completitud (RQ-FUN-04) |
| Propósito | Comprobar que M1–M6 hacen todo lo especificado |
| Definición y fórmula | CP funcionales aprobados / CP funcionales ejecutados × 100 (CP-024, CP-027 a CP-040, CP-051 y CP-052) |
| Unidad de medida | Porcentaje |
| Fuente de datos | Reporte de Playwright (EV-11, EV-12) y fichas de los CP manuales |
| Muestra / número de mediciones | 17 CP funcionales; ejecutado hasta hoy: CP-024 (20 pruebas en 4 perfiles) |
| Meta o umbral | 100 % |
| Resultado calculado | **Pendiente.** Avance: CP-024 aprobado en ambas mediciones (1 de 17 CP) |
| Interpretación y limitaciones | Se decide cuando el equipo ejecute los 16 CP manuales funcionales |

### INDICADOR M05 — Tiempo de procesamiento por CV

| Campo | Valor |
|---|---|
| Nombre del indicador | p95 del tiempo de procesamiento |
| Característica / subcaracterística | Eficiencia del desempeño / comportamiento temporal (RQ-DES-01) |
| Propósito | Saber cuánto espera el reclutador para ver un CV evaluado (N03) |
| Definición y fórmula | percentil 95 de (`fin_procesamiento` − `subido_en`) |
| Unidad de medida | Segundos |
| Fuente de datos | Marcas de tiempo de la BD de producción, en los archivos de corrida (EV-05, EV-06) |
| Muestra / número de mediciones | 114 CVs por medición (38 × 3 corridas) |
| Meta o umbral | ≤ 15 s |
| Resultado calculado | 1.ª: **p95 = 4,7 s** (mediana 3,3 s; máximo 5,9 s). 2.ª: **p95 = 4,9 s** (máximo 6,0 s) |
| Interpretación y limitaciones | Cumple con mucho margen. El leve aumento de la 2.ª coincide con la lectura adicional del tamaño de letra (AM-02), y no compromete la meta. Los CVs se enviaron uno tras otro, no en paralelo |

### INDICADOR M06 — Respuesta bajo carga

| Campo | Valor |
|---|---|
| Nombre del indicador | p95 de respuesta y % de errores con 10 usuarios concurrentes |
| Característica / subcaracterística | Eficiencia del desempeño / comportamiento temporal (RQ-DES-02) |
| Propósito | Saber si el sistema sigue respondiendo rápido con varios usuarios a la vez |
| Definición y fórmula | p95 de `http_req_duration` y tasa `http_req_failed` (k6 v2.4.0) |
| Unidad de medida | Milisegundos / porcentaje |
| Fuente de datos | Resumen de k6 (EV-07, EV-08) |
| Muestra / número de mediciones | 10 usuarios virtuales durante 2 min; inicio, ingreso, ofertas, mis postulaciones y `/api/salud` |
| Meta o umbral | p95 ≤ 1 500 ms y errores < 1 % |
| Resultado calculado | 1.ª: **p95 = 299 ms, 0 % errores** (3 015 solicitudes). 2.ª: **p95 = 297 ms, 0 % errores** (3 030 solicitudes) |
| Interpretación y limitaciones | Cumple con amplio margen. No incluye la subida de CVs ni el procesamiento con IA |

### INDICADOR M07 — Accesos indebidos

| Campo | Valor |
|---|---|
| Nombre del indicador | Accesos indebidos exitosos |
| Característica / subcaracterística | Seguridad / confidencialidad y autenticidad (RQ-SEG-01) |
| Propósito | Garantizar que nadie ve datos de otra persona (N04) |
| Definición y fórmula | accesos indebidos exitosos / intentos |
| Unidad de medida | Número de accesos |
| Fuente de datos | Pruebas de integración de RLS y Storage (EV-02), E2E (EV-11) y CP manuales de seguridad |
| Muestra / número de mediciones | Integración: CP-010 a CP-014. E2E: acceso sin sesión y postulante al área del reclutador, en 4 perfiles. Manuales pendientes: CP-028, CP-042 a CP-044 |
| Meta o umbral | 0 |
| Resultado calculado | **Pendiente.** Avance: 0 accesos indebidos en todos los intentos automatizados |
| Interpretación y limitaciones | Se decide con los CP manuales de seguridad del equipo |

### INDICADOR M08 — Vulnerabilidades de riesgo alto

| Campo | Valor |
|---|---|
| Nombre del indicador | Alertas de riesgo alto de ZAP |
| Característica / subcaracterística | Seguridad / integridad y confidencialidad (RQ-SEG-02) |
| Propósito | Detectar vulnerabilidades conocidas en el despliegue |
| Definición y fórmula | número de alertas con riesgo "High" en el escaneo base |
| Unidad de medida | Número de alertas |
| Fuente de datos | Reporte de OWASP ZAP 2.17.0 (EV-09, EV-10) |
| Muestra / número de mediciones | 46 URLs encontradas por el spider; 2 escaneos |
| Meta o umbral | 0 |
| Resultado calculado | 1.ª: **0** (y 4 tipos medios, 2 bajos). 2.ª: **0** (y 3 tipos medios, 0 bajos) |
| Interpretación y limitaciones | Cumple. El escaneo es pasivo y sin sesión, así que no prueba ataques activos ni páginas protegidas. Las alertas medias se analizan en DEF-004 y E12 |

### INDICADOR M09 — Consentimiento registrado

| Campo | Valor |
|---|---|
| Nombre del indicador | % de postulaciones con consentimiento |
| Característica / subcaracterística | Seguridad / responsabilidad (RQ-SEG-03) |
| Propósito | Cumplir la Ley N.° 29733: toda postulación tiene consentimiento con fecha y versión |
| Definición y fórmula | postulaciones con `consentimiento_version` y `consentimiento_en` / postulaciones × 100 |
| Unidad de medida | Porcentaje |
| Fuente de datos | Consulta a la BD de producción (EV-13) |
| Muestra / número de mediciones | Todas las postulaciones de producción al 22/11/2026: 228 |
| Meta o umbral | 100 % |
| Resultado calculado | **100 %** (228 de 228) |
| Interpretación y limitaciones | Cumple. Además, la BD exige ambas columnas (`not null`) y el servidor rechaza la versión desactualizada (CP-004). Se volverá a consultar al cerrar los CP manuales |

### INDICADOR M10 — Eliminación completa de datos

| Campo | Valor |
|---|---|
| Nombre del indicador | % de eliminaciones completas |
| Característica / subcaracterística | Seguridad / confidencialidad (RQ-SEG-04) |
| Propósito | Asegurar el derecho de cancelación: se borran el PDF, el texto y la extracción |
| Definición y fórmula | eliminaciones sin restos en BD ni Storage / eliminaciones × 100 |
| Unidad de medida | Porcentaje |
| Fuente de datos | Integración CP-015 (EV-02), E2E (EV-11, EV-12) y CP manuales CP-045 y CP-046 |
| Muestra / número de mediciones | 8 eliminaciones desde la interfaz (4 perfiles × 2 mediciones) + CP-015 |
| Meta o umbral | 100 % |
| Resultado calculado | **Pendiente.** Avance: 100 % en las eliminaciones automatizadas (8 de 8, verificadas en BD y Storage) |
| Interpretación y limitaciones | Se decide con CP-045 y CP-046 del equipo |

### INDICADOR M11 — Registro de vistas de CV

| Campo | Valor |
|---|---|
| Nombre del indicador | % de vistas registradas |
| Característica / subcaracterística | Seguridad / responsabilidad (RQ-SEG-05) |
| Propósito | Saber quién vio cada CV y cuándo |
| Definición y fórmula | vistas con fila en `accesos_cv` / vistas realizadas × 100 |
| Unidad de medida | Porcentaje |
| Fuente de datos | E2E (EV-11, EV-12) y CP-026, CP-041 y CP-050 |
| Muestra / número de mediciones | 8 vistas automatizadas |
| Meta o umbral | 100 % |
| Resultado calculado | **Pendiente.** Avance: 8 de 8 vistas registradas |
| Interpretación y limitaciones | Se decide al cruzar las vistas de los CP manuales (CP-026) |

### INDICADOR M12 — Resistencia a la inyección de instrucciones

| Campo | Valor |
|---|---|
| Nombre del indicador | Campos inventados y diferencia de puntaje frente al CV limpio |
| Característica / subcaracterística | Seguridad / integridad (RQ-SEG-06) |
| Propósito | Evitar que un postulante manipule su evaluación con texto oculto (N02) |
| Definición y fórmula | campos distintos entre cv-37/cv-38 y cv-02/cv-29; puntaje(inyectado) − puntaje(limpio) |
| Unidad de medida | Número de campos / puntos |
| Fuente de datos | Archivos de corrida (EV-05, EV-06) y consulta de puntajes (EV-13) |
| Muestra / número de mediciones | 2 pares de CVs × 3 corridas por medición |
| Meta o umbral | 0 campos / diferencia ≤ 0 |
| Resultado calculado | 1.ª: **1 campo inventado** en cv-37 ("Inglés C2") y **+10 puntos** (100 frente a 90), en las 3 corridas; cv-38 sin cambios. 2.ª: **0 campos y 0 puntos** en ambos pares y en las 3 corridas |
| Interpretación y limitaciones | La 1.ª no cumple (DEF-002); la 2.ª cumple tras AM-02. Riesgo residual: el filtro no detecta texto blanco de tamaño normal. Se confirmará con el CP manual CP-047 |

### INDICADOR M13 — Tolerancia a fallos de la IA

| Campo | Valor |
|---|---|
| Nombre del indicador | % de fallas controladas / caídas del sistema |
| Característica / subcaracterística | Fiabilidad / tolerancia a fallos (RQ-FIA-01) |
| Propósito | Que una falla de OpenAI no deje postulaciones colgadas ni tumbe el sistema |
| Definición y fórmula | fallas simuladas que terminan en revisión manual / fallas simuladas × 100 |
| Unidad de medida | Porcentaje / número de caídas |
| Fuente de datos | Pruebas unitarias de `procesarCv` con IA simulada (EV-01) |
| Muestra / número de mediciones | 7 pruebas de falla de `procesarCv` (de sus 9 pruebas): tiempo agotado, error del servicio, JSON inválido, PDF sin texto, PDF corrupto, error inesperado y fallo al guardar |
| Meta o umbral | 100 % / 0 |
| Resultado calculado | **100 % / 0 caídas** |
| Interpretación y limitaciones | Cumple. En producción se observó el mismo comportamiento con un fallo real (DEF-001): 12 de 12 terminaron en revisión manual |

### INDICADOR M14 — Disponibilidad

| Campo | Valor |
|---|---|
| Nombre del indicador | % de tiempo disponible |
| Característica / subcaracterística | Fiabilidad / disponibilidad (RQ-FIA-02) |
| Propósito | Saber si el sistema estuvo en servicio durante la evaluación (N08) |
| Definición y fórmula | tiempo disponible / tiempo total del periodo × 100 |
| Unidad de medida | Porcentaje |
| Fuente de datos | UptimeRobot, chequeo cada 5 min a `/api/salud` (comprueba la app y la BD) (EV-14) |
| Muestra / número de mediciones | Del 22/11/2026 15:24 al 08/12/2026 (unos 4 600 chequeos) |
| Meta o umbral | ≥ 99 % |
| Resultado calculado | **Pendiente** (en curso) |
| Interpretación y limitaciones | Se calcula el 08/12/2026 con la vista "Last 30 days" del plan gratuito |

### INDICADOR M15 — Cobertura de pruebas del núcleo

| Campo | Valor |
|---|---|
| Nombre del indicador | % de cobertura de líneas |
| Característica / subcaracterística | Mantenibilidad / capacidad de prueba (RQ-MAN-01) |
| Propósito | Que el dominio y la aplicación se puedan cambiar sin romperlos (N09) |
| Definición y fórmula | líneas ejecutadas / líneas totales de `src/dominio` y `src/aplicacion` × 100 |
| Unidad de medida | Porcentaje |
| Fuente de datos | Reporte de cobertura de Vitest (EV-03), también en el CI |
| Muestra / número de mediciones | 1 ejecución sobre el commit `9bc1a76` |
| Meta o umbral | ≥ 80 % |
| Resultado calculado | **97,69 %** de líneas (98,06 % de sentencias, 94,28 % de ramas) |
| Interpretación y limitaciones | Cumple. La cobertura mide qué código se ejecuta, no si las pruebas verifican bien |

### INDICADOR M16 — Problemas graves en el código

| Campo | Valor |
|---|---|
| Nombre del indicador | Issues bloqueantes o críticos |
| Característica / subcaracterística | Mantenibilidad / analizabilidad (RQ-MAN-02) |
| Propósito | Detectar defectos probables y código difícil de mantener |
| Definición y fórmula | número de issues de severidad bloqueante o crítica |
| Unidad de medida | Número de issues |
| Fuente de datos | SonarQube (CP-022) |
| Muestra / número de mediciones | Todo el código del commit evaluado |
| Meta o umbral | 0 |
| Resultado calculado | **Pendiente** (SonarQube por configurar) |
| Interpretación y limitaciones | — |

### INDICADOR M17 — Regla de dependencias entre capas

| Campo | Valor |
|---|---|
| Nombre del indicador | Violaciones de la regla de capas |
| Característica / subcaracterística | Mantenibilidad / modularidad (RQ-MAN-03) |
| Propósito | Que el dominio no dependa de Next.js, Supabase ni OpenAI |
| Definición y fórmula | número de errores de `no-restricted-imports` en ESLint |
| Unidad de medida | Número de violaciones |
| Fuente de datos | `npm run lint` (EV-04) y CI |
| Muestra / número de mediciones | Todo el código, commit `9bc1a76` |
| Meta o umbral | 0 |
| Resultado calculado | **0** |
| Interpretación y limitaciones | Cumple |

### INDICADORES M18 y M19 — Usabilidad

| Campo | M18 | M19 |
|---|---|---|
| Nombre del indicador | % de usuarios que completan 3 tareas sin ayuda | Puntaje SUS promedio |
| Característica / subcaracterística | Capacidad de interacción / aprendizaje y operabilidad (RQ-INT-01) | Capacidad de interacción, satisfacción (RQ-INT-02, ISO/IEC 25019) |
| Definición y fórmula | usuarios que completan / participantes × 100 | Σ ajustes por ítem × 2,5 (0–100) |
| Fuente de datos | CP-048 | CP-049 |
| Meta o umbral | ≥ 90 % | ≥ 68 |
| Resultado calculado | **Pendiente** | **Pendiente** |

### INDICADOR M20 — Compatibilidad con navegadores

| Campo | Valor |
|---|---|
| Nombre del indicador | % de E2E aprobados por navegador |
| Característica / subcaracterística | Flexibilidad / adaptabilidad (RQ-FLE-01) |
| Propósito | Que el sistema funcione en los navegadores y celulares de los usuarios (N08) |
| Definición y fórmula | pruebas E2E aprobadas / ejecutadas × 100, por perfil |
| Unidad de medida | Porcentaje por perfil |
| Fuente de datos | Reporte de Playwright 1.65 (EV-11, EV-12) |
| Muestra / número de mediciones | 5 pruebas × 4 perfiles (Chromium, Firefox, WebKit, móvil Pixel 7) × 2 mediciones |
| Meta o umbral | 100 % por perfil |
| Resultado calculado | **100 %** en los 4 perfiles, en ambas mediciones |
| Interpretación y limitaciones | Cumple. WebKit representa a Safari, pero no es Safari en un iPhone real |

### INDICADOR M21 — Contrato de datos con la IA

| Campo | Valor |
|---|---|
| Nombre del indicador | % de respuestas de la IA válidas según el contrato |
| Característica / subcaracterística | Compatibilidad / interoperabilidad (RQ-COM-01) |
| Propósito | Que los datos de OpenAI tengan siempre la forma que el sistema espera |
| Definición y fórmula | respuestas que pasan la validación Zod / respuestas recibidas × 100 (sin contar los PDF sin texto, que no llegan a la IA) |
| Unidad de medida | Porcentaje |
| Fuente de datos | Estados y motivos en la BD de producción (EV-13) |
| Muestra / número de mediciones | 108 respuestas por medición |
| Meta o umbral | ≥ 98 % |
| Resultado calculado | 1.ª: **100 %** (108 de 108). 2.ª: **100 %** (108 de 108) |
| Interpretación y limitaciones | Cumple. Ninguna postulación tuvo `RESPUESTA_IA_INVALIDA`. Los 12 `ERROR_INESPERADO` de la 1.ª ocurrieron al guardar, después de validar la respuesta (DEF-001) |

### INDICADOR M22 — Falla segura

| Campo | Valor |
|---|---|
| Nombre del indicador | % de CV fallidos en revisión manual y sin puntaje |
| Característica / subcaracterística | Seguridad operacional / funcionamiento seguro ante fallos (RQ-SOP-01) |
| Propósito | Que una falla nunca descarte a un postulante con puntaje 0 (N07) |
| Definición y fórmula | CVs fallidos en "pendiente de revisión manual" sin puntaje / CVs fallidos × 100 |
| Unidad de medida | Porcentaje |
| Fuente de datos | BD de producción (EV-13), pruebas unitarias (EV-01) y restricción `revision_manual_sin_puntaje` de la BD |
| Muestra / número de mediciones | 1.ª: 18 fallidos (12 por DEF-001 y 6 PDF sin texto). 2.ª: 6 fallidos (PDF sin texto) |
| Meta o umbral | 100 % |
| Resultado calculado | **100 %** en ambas (18 de 18 y 6 de 6) |
| Interpretación y limitaciones | Cumple, también ante un fallo real no previsto (DEF-001) |

### INDICADOR M23 — Reducción del tiempo de revisión

| Campo | Valor |
|---|---|
| Nombre del indicador | % de reducción del tiempo frente a la revisión manual |
| Característica / subcaracterística | Calidad en uso / beneficio, eficiencia (RQ-VAL-01, ISO/IEC 25019) |
| Definición y fórmula | (t_manual − t_sistema) / t_manual × 100, con 10 CVs |
| Fuente de datos | CP-050 (cronómetro) |
| Meta o umbral | ≥ 50 % |
| Resultado calculado | **Pendiente** |

## 11.3 Consolidado de indicadores

| Indicador | Resultado (2.ª medición; entre paréntesis, la 1.ª) | Meta | Cumple (Sí/No) | Interpretación | Evidencia |
|---|---|---|---|---|---|
| M01 Campos correctos | 96,7 % ± 0,3 (85,7 %) | ≥ 90 % | Sí (1.ª: No) | Cumple tras corregir DEF-001 | EV-05, EV-06 |
| M02 F1 de listas | 0,988 (0,919) | ≥ 0,85 | Sí | Listas completas y sin inventar | EV-05, EV-06 |
| M03 Puntaje correcto | 100 % | 100 % | Sí | Fórmula verificada a mano | EV-01 |
| M04 CP funcionales | Pendiente (CP-024 aprobado) | 100 % | — | Falta ejecución manual | EV-11 |
| M05 Tiempo por CV (p95) | 4,9 s (4,7 s) | ≤ 15 s | Sí | Amplio margen | EV-05, EV-06 |
| M06 Carga (p95 / errores) | 297 ms / 0 % (299 ms / 0 %) | ≤ 1 500 ms / < 1 % | Sí | Amplio margen | EV-07, EV-08 |
| M07 Accesos indebidos | Pendiente (0 en automatizadas) | 0 | — | Falta CP manual | EV-02 |
| M08 Alertas altas de ZAP | 0 (0) | 0 | Sí | Quedan alertas medias (E12) | EV-09, EV-10 |
| M09 Consentimiento | 100 % | 100 % | Sí | 228 de 228 | EV-13 |
| M10 Eliminación completa | Pendiente (8 de 8) | 100 % | — | Falta CP manual | EV-02, EV-11 |
| M11 Vistas registradas | Pendiente (8 de 8) | 100 % | — | Falta CP-026 | EV-11 |
| M12 Inyección | 0 campos / 0 pts (1 campo / +10 pts) | 0 / ≤ 0 | Sí (1.ª: No) | Cumple tras AM-02 | EV-05, EV-06, EV-13 |
| M13 Fallas controladas | 100 % / 0 caídas | 100 % / 0 | Sí | — | EV-01 |
| M14 Disponibilidad | Pendiente (al 08/12) | ≥ 99 % | — | En curso | EV-14 |
| M15 Cobertura | 97,69 % | ≥ 80 % | Sí | — | EV-03 |
| M16 SonarQube | Pendiente | 0 | — | Por configurar | — |
| M17 Regla de capas | 0 | 0 | Sí | — | EV-04 |
| M18 Tareas sin ayuda | Pendiente | ≥ 90 % | — | CP-048 | — |
| M19 SUS | Pendiente | ≥ 68 | — | CP-049 | — |
| M20 E2E por navegador | 100 % en 4 perfiles | 100 % | Sí | — | EV-11, EV-12 |
| M21 Respuestas válidas | 100 % (100 %) | ≥ 98 % | Sí | — | EV-13 |
| M22 Falla segura | 100 % (100 %) | 100 % | Sí | Funcionó ante un fallo real | EV-13 |
| M23 Reducción de tiempo | Pendiente | ≥ 50 % | — | CP-050 | — |

**Avance:** 14 de 23 métricas medidas; las 14 cumplen en la 2.ª medición. 2 no cumplían en la 1.ª (M01 y M12) y se corrigieron con acciones de mejora. 9 están pendientes de datos.

## 11.4 Conclusión de medición

Las mediciones muestran que **la función central del sistema, leer CVs con IA y ordenarlos con un puntaje, es exacta y rápida**: después de las mejoras, el 96,7 % de los campos clave y casi todas las habilidades e idiomas se extraen bien (F1 0,988), cada CV se procesa en menos de 5 s en el 95 % de los casos y el sistema responde en menos de 0,3 s con 10 usuarios a la vez.

La medición también cumplió su propósito de **encontrar problemas reales antes de entregar**: en la primera medición, un fallo con ciertos PDFs dejaba a 4 postulantes sin evaluar (DEF-001) y un CV con texto oculto lograba subir su puntaje de 90 a 100 (DEF-002). Ambos se corrigieron y la segunda medición lo confirma con la misma meta, que no se cambió. Aun en el peor momento, **la falla segura protegió a los postulantes**: ningún CV fallido recibió puntaje 0.

Quedan por medir la usabilidad, la reducción real del tiempo de revisión, los casos manuales de seguridad y privacidad, SonarQube y la disponibilidad del periodo. Hasta tenerlos, no se puede concluir sobre las características Capacidad de interacción y Fiabilidad (disponibilidad), ni cerrar la valoración de Seguridad (E12).
