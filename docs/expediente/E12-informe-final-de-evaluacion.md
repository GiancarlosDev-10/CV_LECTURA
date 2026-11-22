# E12. Informe final de evaluación de calidad

> **Plantilla:** Formatos 12 · **Estado:** borrador v0.1 (22/11/2026) · **Fuente de verdad:** este archivo.
> Redactado con los resultados disponibles al 22/11/2026 (E09–E11). Las valoraciones marcadas como **provisionales** dependen de mediciones pendientes (casos manuales del equipo, usabilidad y disponibilidad al 08/12/2026) y se cierran antes de la entrega del 11/12/2026, sin cambiar las metas.

| Campo | Valor |
|---|---|
| Código del entregable | E12 |
| Sistema / versión evaluada | CV Lectura — Sistema web de RRHH con lectura automática de CVs, en producción (https://cv-lectura.vercel.app). 1.ª medición: commit `e1ac215`. 2.ª medición, después de las acciones de mejora: commit `3312f07` |
| Equipo evaluador | Giancarlos Ormeño (desarrollo, calidad y pruebas automatizadas); Raquel Montes, Hermy Salcedo, Nancy Vilcas y Paul Carretero (pruebas manuales y usabilidad) |
| Fecha | 22/11/2026 (borrador) |

## 12.1 Resumen ejecutivo

**Propósito.** Evaluar si CV Lectura, un sistema que lee CVs en PDF con inteligencia artificial y ordena a los postulantes con un puntaje, tiene la calidad necesaria para apoyar a un área de Recursos Humanos sin perjudicar a los postulantes ni exponer sus datos personales.

**Método.** Se aplicó el modelo de calidad del producto ISO/IEC 25010:2023 y, en parte, el de calidad en uso ISO/IEC 25019:2023, siguiendo el proceso de evaluación de ISO/IEC 25040:2024. Se definieron 24 requisitos de calidad con metas numéricas, que se **congelaron antes de medir** (etiqueta Git `umbrales-v1.0`, 22/11/2026). Las mediciones se hicieron en producción: 6 corridas de extracción con 38 CVs ficticios cada una, pruebas unitarias, de integración y de extremo a extremo en 4 navegadores, una prueba de carga y un escaneo de seguridad.

**Resultados principales.** Después de las acciones de mejora, el sistema extrae correctamente el **96,7 %** de los datos clave de los CVs (meta ≥ 90 %), procesa cada CV en **menos de 5 s** en el 95 % de los casos (meta ≤ 15 s), responde en **menos de 0,3 s** con 10 usuarios a la vez y no tiene vulnerabilidades de riesgo alto. La primera medición encontró dos defectos importantes que se corrigieron: 4 CVs que no se podían guardar (DEF-001) y un CV con texto oculto que subía su puntaje de 90 a 100 (DEF-002). Ningún CV fallido recibió puntaje 0.

**Conclusión (provisional).** Las características medidas por completo (Eficiencia del desempeño, Mantenibilidad, Flexibilidad, Compatibilidad y Seguridad operacional) son **satisfactorias**. Adecuación funcional, Seguridad, Fiabilidad, Capacidad de interacción y Calidad en uso tienen todos sus requisitos medidos en "Cumple", pero les falta al menos una medición. La conclusión de aptitud para el uso previsto se emitirá cuando terminen esas mediciones (12.7).

## 12.2 Objetivos y alcance de evaluación

**Objetivos.**

1. Determinar si la extracción con IA y el puntaje son lo bastante exactos para apoyar la decisión del reclutador.
2. Comprobar que los datos personales están protegidos y que el postulante puede ejercer sus derechos (Ley N.° 29733).
3. Comprobar que una falla nunca perjudica al postulante.
4. Medir el tiempo de respuesta y la estabilidad en producción.
5. Identificar defectos, corregirlos y verificar la mejora con una segunda medición.

**Componentes incluidos.** Los módulos M1 Autenticación y roles, M2 Ofertas, M3 Postulación, M4 Extracción con IA, M5 Puntaje y ranking, y M6 Privacidad; la interfaz web, las Server Actions, la base de datos con seguridad a nivel de filas (RLS), el bucket privado de CVs, la integración con OpenAI y el despliegue en Vercel.

**Exclusiones.** Las subcaracterísticas no evaluadas y su motivo están en E05 5.4 (por ejemplo, la utilización de recursos, porque Vercel y Supabase no dan acceso a métricas de infraestructura). Tampoco se evalúan CVs reales: el dataset es ficticio para no tratar datos personales.

**Condiciones.** Producción en la región São Paulo; modelo `gpt-4o-mini-2024-07-18` con temperatura 0; umbrales de E05 v1.0.

## 12.3 Referencias y modelo aplicado

- **Modelo:** ISO/IEC 25010:2023 (9 características del producto), elegido frente a McCall, Boehm y FURPS en E03 por ser la norma vigente, incluir Seguridad y Seguridad operacional, y tener medidas asociadas (ISO/IEC 25023:2016). Para la experiencia del usuario se usa en parte ISO/IEC 25019:2023.
- **Proceso:** ISO/IEC 25040:2024 (definir, diseñar, planificar, ejecutar y concluir la evaluación) y ISO/IEC 25030:2019 para redactar requisitos verificables.
- **Seguridad y privacidad:** OWASP Top 10:2025, OWASP ASVS 5.0.0, OWASP Top 10 for LLM Applications 2025 (LLM01:2025 Prompt Injection) y la Ley N.° 29733 con su Reglamento (D.S. N.° 016-2024-JUS).
- **Gestión:** ISO 9001:2026 (ciclo PHVA) e ITIL 4 (gestión de defectos).
- **Criterios:** los 24 requisitos, metas, reglas de comparación y escala de valoración de E05 v1.0. El detalle de cada norma, con su fuente, está en E04 y en el Anexo C de E14.

## 12.4 Método de evaluación

| Técnica | Herramienta (versión) | Qué midió | Muestra / condiciones |
|---|---|---|---|
| Medición de exactitud | Script de medición con Playwright + script comparador (reglas de E05 5.5) | Campos correctos, F1, tiempo por CV, inyección | 38 CVs × 3 corridas por medición, postulados desde un navegador real en producción |
| Pruebas unitarias | Vitest 5.1 | Puntaje, normalización, falla segura, eliminación de datos | 92 pruebas |
| Pruebas de integración y seguridad | Vitest contra Supabase dev | RLS, Storage, procesamiento completo | 27 pruebas |
| Pruebas de extremo a extremo | Playwright 1.65 | Flujos de M1–M6, consentimiento, eliminación, registro de vistas | 5 pruebas × 4 perfiles (Chromium, Firefox, WebKit, móvil) |
| Prueba de carga | k6 v2.4.0 | Tiempo de respuesta y errores | 10 usuarios virtuales durante 2 min |
| Escaneo de vulnerabilidades | OWASP ZAP 2.17.0 (escaneo base, pasivo) | Alertas por riesgo | 46 URLs |
| Análisis estático | ESLint, cobertura de Vitest, SonarQube Cloud (análisis automático) | Regla de capas, cobertura del núcleo, issues graves | Todo el código (5 988 líneas) |
| Consultas a la BD | Supabase (clave de servicio, solo lectura) | Consentimiento, estados, motivos, puntajes | 228 postulaciones de producción |
| Monitoreo | UptimeRobot (cada 5 min a `/api/salud`) | Disponibilidad | 22/11/2026 15:24 – 08/12/2026 |
| Pruebas manuales y de usabilidad | Fichas de E08, SUS, cronómetro | Funciones, seguridad, usabilidad y ahorro de tiempo | 26 casos y 6–7 participantes (pendiente) |

Cada requisito se decide **solo con la medición oficial en producción** y su evidencia (E05 5.7). Las corridas locales de preparación sirvieron para ajustar el extractor antes de congelar los umbrales, no para decidir.

## 12.5 Resultados por característica

Valoración según E05 5.6: **Satisfactoria** si todos sus requisitos cumplen; **con observaciones** si todos los de prioridad A cumplen pero alguno M o B no; **No satisfactoria** si algún requisito A no cumple o no se midió. Resultado de la 2.ª medición (entre paréntesis, la 1.ª cuando cambió).

| Característica / subcaracterística | Criterios evaluados | Resultado / métrica | Cumplimiento | Hallazgo / evidencia |
|---|---|---|---|---|
| **Adecuación funcional** / corrección | RQ-FUN-01 (A), RQ-FUN-02 (A), RQ-FUN-03 (A) | M01 96,7 % (85,7 %); M02 0,988 (0,919); M03 100 % | Cumple (FUN-01 no cumplía en la 1.ª) | DEF-001 corregido; DEF-005 y DEF-006 abiertos y aceptados · EV-05, EV-06, EV-01 |
| Adecuación funcional / completitud | RQ-FUN-04 (A) | M04 pendiente; CP-024 aprobado | Pendiente | Falta ejecutar 16 CP manuales funcionales |
| → **Valoración** | | | **Provisional: pendiente de RQ-FUN-04** | |
| **Eficiencia del desempeño** / comportamiento temporal | RQ-DES-01 (A), RQ-DES-02 (M) | M05 p95 4,9 s (4,7 s); M06 p95 297 ms y 0 % errores | Cumple | EV-05 a EV-08 |
| → **Valoración** | | | **Satisfactoria** | |
| **Seguridad** / confidencialidad, integridad, responsabilidad, autenticidad | RQ-SEG-01 (A), SEG-02 (A), SEG-03 (A), SEG-04 (A), SEG-05 (M), SEG-06 (A) | M08 0 alertas altas; M09 100 %; M12 0 campos y 0 pts (1 campo y +10 pts); M07, M10 y M11 pendientes (100 % en lo automatizado) | Cumplen los medidos (SEG-06 no cumplía en la 1.ª) | DEF-002 y DEF-004 corregidos · EV-02, EV-09, EV-10, EV-13 |
| → **Valoración** | | | **Provisional: pendiente de RQ-SEG-01, SEG-04 y SEG-05** | |
| **Fiabilidad** / tolerancia a fallos y disponibilidad | RQ-FIA-01 (M), RQ-FIA-02 (M) | M13 100 % y 0 caídas; M14 en curso | FIA-01 cumple; FIA-02 pendiente | EV-01, EV-14 |
| → **Valoración** | | | **Provisional: pendiente de RQ-FIA-02** | |
| **Mantenibilidad** / capacidad de prueba, analizabilidad, modularidad | RQ-MAN-01 (M), MAN-02 (B), MAN-03 (M) | M15 97,69 %; M16 0 críticos (2 en la 1.ª); M17 0 violaciones | Cumple (MAN-02 no cumplía en la 1.ª) | DEF-007 corregido · EV-03, EV-04, EV-16 |
| → **Valoración** | | | **Satisfactoria** | |
| **Capacidad de interacción** / aprendizaje, operabilidad, satisfacción | RQ-INT-01 (M), RQ-INT-02 (M) | M18 y M19 pendientes | Pendiente | CP-048, CP-049 |
| → **Valoración** | | | **Provisional: pendiente** | |
| **Flexibilidad** / adaptabilidad | RQ-FLE-01 (B) | M20 100 % en 4 perfiles | Cumple | EV-11, EV-12 |
| → **Valoración** | | | **Satisfactoria** | |
| **Compatibilidad** / interoperabilidad | RQ-COM-01 (B) | M21 100 % de respuestas válidas | Cumple | EV-13 |
| → **Valoración** | | | **Satisfactoria** | |
| **Seguridad operacional** / funcionamiento seguro ante fallos y advertencia | RQ-SOP-01 (A), RQ-SOP-02 (M) | M22 100 % (18 de 18 y 6 de 6); aviso "El puntaje es un apoyo, no una decisión" presente en el ranking | Cumple | La falla segura funcionó ante un fallo real (DEF-001) · EV-13, EV-11 (la prueba E2E verifica el aviso en los 4 perfiles) |
| → **Valoración** | | | **Satisfactoria** | CP-040 (manual) lo confirmará |
| **Calidad en uso** (ISO/IEC 25019) / beneficio | RQ-VAL-01 (A) | M23 pendiente | Pendiente | CP-050 |
| → **Valoración** | | | **Provisional: pendiente** | |

## 12.6 Hallazgos y riesgos

| ID | Hallazgo / defecto | Impacto | Severidad / prioridad | Evidencia |
|---|---|---|---|---|
| DEF-001 | Postulaciones que no se guardaban por caracteres nulos en el texto del PDF | 4 de 34 postulantes sin evaluación automática; no se perdieron ni expusieron datos. **Cerrado** | Alta / Alta | E10, EV-05, EV-06 |
| DEF-002 | Instrucciones ocultas en el CV alteraban los datos y el puntaje (+10 puntos) | Un postulante podía mejorar su posición en el ranking con texto invisible. **Cerrado**, con riesgo residual | Alta / Alta | E10, EV-13 |
| DEF-003 | Años de experiencia mal calculados por la IA | Detectado en preparación, antes de medir. **Cerrado** | Media / Alta | E10, EV-15 |
| DEF-004 | Faltaban cabeceras de seguridad HTTP | Exposición a clickjacking y a revelar la tecnología del servidor. **Cerrado en parte**: falta la CSP | Baja / Media | E10, EV-09, EV-10 |
| DEF-005 | Nivel educativo técnico clasificado como universitario (3 CVs) | El postulante puede recibir más puntaje en educación del que corresponde; el reclutador lo ve junto al PDF. **Abierto, aceptado** | Baja / Baja | E10, EV-06 |
| DEF-006 | Años de experiencia con desvío mayor a ± 0,5 (3 CVs) | Igual que DEF-005. **Abierto, aceptado** | Baja / Baja | E10, EV-06 |
| R-01 | Alerta media de ZAP "Absence of Anti-CSRF Tokens" en los formularios de ingreso y registro | Riesgo bajo: son Server Actions de Next.js, que solo aceptan POST y rechazan solicitudes cuyo `Origin` no coincide con el `Host` (documentación de Next.js, guía de Server Actions) | Baja / Baja | EV-10 |
| R-02 | Alerta media de ZAP "Cross-Domain Misconfiguration" | Solo en archivos estáticos públicos (`/_next/static/`: CSS, JS y fuentes), que no contienen datos personales | Baja / Baja | EV-10 |
| R-03 | Alerta media de ZAP: no hay política de seguridad de contenido (CSP) | Menos defensa en profundidad frente a scripts inyectados; no se encontró ninguna vía de inyección de scripts | Media / Media | EV-10; acción AM-05 en E13 |
| R-04 | Inyección con técnicas no cubiertas (texto blanco de tamaño normal, texto detrás de imágenes) | Podría volver a alterar la extracción | Media / Media | DEF-002; acción AM-06 en E13 |
| DEF-007 | 2 issues críticos de SonarQube en la herramienta de medición | Ninguno para el usuario (código no desplegado) ni para M01 y M02 (recalculados sin cambios). **Cerrado** | Baja / Media | E10, EV-16 |
| R-05 | Dependencia de servicios en plan gratuito (Vercel, Supabase, OpenAI) | Pausas o límites del proveedor fuera del control del equipo; se mide con M14 | Media / Baja | EV-14 |

**No hay defectos de severidad crítica.**

## 12.7 Conclusión global

No se calcula una nota ni un porcentaje de calidad total (E05 5.7, S09). La conclusión se basa en la valoración de cada característica (12.5):

- **Con los datos al 22/11/2026, ningún requisito medido queda en "No cumple".** Los tres que fallaron en la primera medición (RQ-FUN-01, RQ-SEG-06 y RQ-MAN-02) se corrigieron con acciones de mejora y la segunda medición lo comprobó con la misma meta.
- **Satisfactorias:** Eficiencia del desempeño, Mantenibilidad, Flexibilidad, Compatibilidad y Seguridad operacional.
- **Provisionales:** Adecuación funcional, Seguridad, Fiabilidad, Capacidad de interacción y Calidad en uso, porque les falta al menos una medición.

**Regla de decisión (E05 5.7).** El sistema se declarará **apto para el uso previsto** si Adecuación funcional, Eficiencia del desempeño y Seguridad no quedan "No satisfactorias" y no hay defectos críticos abiertos. Hoy se cumplen dos de esas tres condiciones con certeza (Eficiencia satisfactoria y ningún defecto crítico). Las otras dos dependen de RQ-FUN-04, RQ-SEG-01 y RQ-SEG-04, que se deciden con los casos manuales del equipo. Si esos casos aprueban, el sistema será apto para el uso previsto.

> Al cerrar las mediciones pendientes, reemplazar esta sección con la conclusión definitiva y la valoración final de cada característica.

## 12.8 Limitaciones

- **Muestra:** 34 CVs ficticios para la exactitud (30 generados en 8 estilos y 4 con el formato del CV de cada integrante). Representan diseños comunes, pero no todos los que existen; con CVs reales los resultados pueden variar.
- **Modelo de IA:** la exactitud vale para `gpt-4o-mini-2024-07-18` con temperatura 0. Otro modelo o versión exige volver a medir.
- **Tiempo:** las dos mediciones se hicieron el mismo día; no hay datos de comportamiento durante semanas, salvo la disponibilidad.
- **Seguridad:** el escaneo de ZAP es pasivo y sin sesión; no reemplaza una prueba de penetración. Las pruebas de RLS se ejecutan contra el entorno de desarrollo, con las mismas migraciones que producción.
- **Carga:** 10 usuarios virtuales navegando, sin subida de CVs simultánea.
- **Usabilidad:** la muestra prevista es de 6 a 7 personas, suficiente para detectar problemas, pero no para generalizar.
- **Independencia:** el desarrollador también diseñó y ejecutó las pruebas automatizadas. Para reducir el sesgo, las metas se congelaron antes de medir y los casos manuales los ejecutan otros integrantes.
- **Plataforma:** Vercel y Supabase son servicios gestionados, sin acceso a métricas de infraestructura (E05 5.4).
