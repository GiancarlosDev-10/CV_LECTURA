# E05. Matriz de evaluación basada en ISO/IEC 25010

> **Plantilla:** Formatos 04 (requisitos y criterios) + Formatos 06 (6.2–6.5: método y escala) · **Estado:** borrador v0.1 (18/11/2026). Se congela como **v1.0 el 27/11/2026** con la etiqueta Git `umbrales-v1.0`; después solo cambia por control de cambios (E06, sección 6.7).
> La columna "Resultado" queda en "Pendiente" hasta la medición oficial en producción (E09 y E11). No se llena con valores de desarrollo.

| Campo | Valor |
|---|---|
| Código del entregable | E05 |
| Sistema evaluado | CV Lectura — Sistema web de RRHH con lectura automática de CVs |
| Versión evaluada | Despliegue de producción https://cv-lectura.vercel.app (el commit de Git se registra en cada evidencia) |
| Equipo | Giancarlos Ormeño, Raquel Montes, Hermy Salcedo, Nancy Vilcas y Paul Carretero |
| Fecha / versión | 18/11/2026 · v0.1 (borrador) |

## 5.1 Objetivo y alcance de la especificación

Esta matriz convierte el modelo elegido en E03 (ISO/IEC 25010:2023, con ISO/IEC 25019:2023 como referencia parcial) en **24 requisitos de calidad verificables**. Cada requisito sigue la cadena del curso (S09): **característica → subcaracterística → criterio → indicador → meta → método**, y se redacta según el marco de ISO/IEC 25030:2019: una condición observable, un valor objetivo y una forma de comprobarlo.

Cubre los seis módulos del MVP (M1 Autenticación y roles, M2 Ofertas, M3 Postulación, M4 Extracción con IA, M5 Puntaje y ranking, M6 Privacidad) y el despliegue de producción. Las 9 características del modelo están representadas, con tres niveles de profundidad (a fondo, media y mínima) justificados en E02.

Los umbrales se fijan **antes de medir**. Así el resultado no puede acomodarse a la meta.

## 5.2 Matriz de evaluación

Prioridad: **A** (alta) = responde directamente al enunciado (datos extraídos, protección de datos, tiempo por CV) o protege a la persona; **M** (media) = sostiene el funcionamiento; **B** (baja) = profundidad mínima.

| ID | Característica / subcaracterística | Criterio | Indicador | Meta | Método / herramienta | Prior. | Resultado | Evidencia |
|---|---|---|---|---|---|---|---|---|
| RQ-FUN-01 | Adecuación funcional / corrección | Los campos simples extraídos (nombre, email, teléfono, años de experiencia, nivel educativo) coinciden con la respuesta esperada | % de campos correctos (promedio de 3 corridas) | ≥ 90 % | Script comparador sobre el dataset (reglas de 5.5) | A | Pendiente | Reporte del comparador por corrida |
| RQ-FUN-02 | Adecuación funcional / corrección | Las listas (habilidades e idiomas) se extraen completas y sin inventar elementos | F1 (promedio de 3 corridas) | ≥ 0,85 | Script comparador | A | Pendiente | Reporte del comparador por corrida |
| RQ-FUN-03 | Adecuación funcional / corrección | El puntaje coincide con el cálculo manual de la fórmula | % de casos con puntaje correcto | 100 % | Pruebas unitarias (Vitest) | A | Pendiente | Reporte de Vitest |
| RQ-FUN-04 | Adecuación funcional / completitud | Las funciones de M1–M6 superan sus casos de prueba funcionales | % de CP funcionales aprobados | 100 % | E2E (Playwright) + CP manuales | A | Pendiente | Reporte de Playwright y fichas de CP con capturas |
| RQ-DES-01 | Eficiencia del desempeño / comportamiento temporal | Procesar un CV (subida → puntaje) en caliente | p95 del tiempo de procesamiento | ≤ 15 s | Marcas de tiempo en la BD (`subido_en`, `fin_procesamiento`) | A | Pendiente | Exportación de la consulta SQL |
| RQ-DES-02 | Eficiencia del desempeño / comportamiento temporal | Páginas y API responden con 10 usuarios concurrentes | p95 de respuesta / % de errores | ≤ 1,5 s / < 1 % | k6 | M | Pendiente | Resumen de k6 |
| RQ-SEG-01 | Seguridad / confidencialidad y autenticidad | Ningún acceso indebido: otro reclutador, otro postulante, sin sesión, URL directa del archivo | Accesos indebidos exitosos | 0 | Pruebas de integración de RLS + CP de seguridad manuales y E2E | A | Pendiente | Reporte de Vitest y fichas de CP con capturas |
| RQ-SEG-02 | Seguridad / integridad y confidencialidad | Sin vulnerabilidades altas en el despliegue | Alertas de riesgo alto de ZAP | 0 | OWASP ZAP (escaneo base contra producción) | A | Pendiente | Reporte HTML de ZAP |
| RQ-SEG-03 | Seguridad / responsabilidad | Toda postulación registra el consentimiento (fecha y versión del texto) | % de postulaciones con consentimiento | 100 % | Consulta SQL + E2E + CP manual | A | Pendiente | Exportación SQL y captura |
| RQ-SEG-04 | Seguridad / confidencialidad | "Eliminar mis datos" borra el PDF, el texto y la extracción | % de eliminaciones completas | 100 % | Verificación en BD y Storage después de eliminar | A | Pendiente | Consultas antes/después y capturas |
| RQ-SEG-05 | Seguridad / responsabilidad | Cada vista o descarga de un CV queda registrada | % de vistas registradas | 100 % | E2E + consulta SQL a `accesos_cv` | M | Pendiente | Exportación SQL |
| RQ-SEG-06 | Seguridad / integridad | Un CV con instrucciones ocultas no altera el resultado | Campos inventados / diferencia de puntaje frente al CV limpio | 0 / ≤ 0 | CP manual con cv-37 y cv-38 frente a cv-02 y cv-29 | A | Pendiente | Ficha de CP y datos extraídos de ambos CVs |
| RQ-FIA-01 | Fiabilidad / tolerancia a fallos | Las fallas de la IA (tiempo agotado, JSON inválido, error del servicio) terminan en un estado controlado | % de fallas controladas / caídas del sistema | 100 % / 0 | Pruebas unitarias con `ExtractorCvSimulado` | M | Pendiente | Reporte de Vitest |
| RQ-FIA-02 | Fiabilidad / disponibilidad | El sistema está disponible durante el periodo de evaluación | % de tiempo disponible | ≥ 99 % | Monitor de disponibilidad (UptimeRobot, cada 5 min, a `/api/salud`) | M | Pendiente | Reporte del monitor |
| RQ-MAN-01 | Mantenibilidad / capacidad de prueba | El núcleo (dominio y aplicación) está cubierto por pruebas | % de cobertura de líneas | ≥ 80 % | Reporte de cobertura de Vitest (en el CI) | M | Pendiente | Artefacto de cobertura del CI |
| RQ-MAN-02 | Mantenibilidad / analizabilidad | Código sin problemas graves | Issues bloqueantes o críticos | 0 | SonarQube Community | B | Pendiente | Captura del panel de SonarQube |
| RQ-MAN-03 | Mantenibilidad / modularidad | Se respeta la regla de dependencias entre capas | Violaciones | 0 | ESLint (`no-restricted-imports`) en el CI | M | Pendiente | Registro del CI |
| RQ-INT-01 | Capacidad de interacción / aprendizaje y operabilidad | Los usuarios completan 3 tareas sin ayuda | % de usuarios que completan las 3 tareas | ≥ 90 % | Prueba de tareas observada | M | Pendiente | Hoja de observación por participante |
| RQ-INT-02 | Capacidad de interacción (satisfacción, ISO/IEC 25019) | Los usuarios perciben el sistema como usable | Puntaje SUS promedio | ≥ 68 | Cuestionario SUS | M | Pendiente | Respuestas del cuestionario |
| RQ-FLE-01 | Flexibilidad / adaptabilidad | Funciona en Chromium, Firefox, WebKit y vista móvil | % de E2E aprobados por navegador | 100 % | Playwright (4 proyectos) | B | Pendiente | Reporte de Playwright |
| RQ-COM-01 | Compatibilidad / interoperabilidad | Las respuestas de la IA cumplen el contrato de datos | % de respuestas válidas según Zod | ≥ 98 % (el resto se rechaza de forma controlada) | Consulta SQL de estados y motivos de las corridas | B | Pendiente | Exportación SQL |
| RQ-SOP-01 | Seguridad operacional / funcionamiento seguro ante fallos | Un CV que no se pudo procesar nunca recibe puntaje 0 | % de CV fallidos en "pendiente de revisión manual" y sin puntaje | 100 % | Pruebas unitarias + restricción de BD + CP manual | A | Pendiente | Reporte de Vitest y captura |
| RQ-SOP-02 | Seguridad operacional / advertencia de peligros | El ranking advierte que el puntaje es apoyo y no decisión | Aviso presente | Sí | CP manual | M | Pendiente | Captura |
| RQ-VAL-01 | Calidad en uso / beneficio (eficiencia, ISO/IEC 25019) | El sistema reduce el tiempo de revisión de CVs | % de reducción frente a la revisión manual de 10 CVs | ≥ 50 % | Cronómetro + registro del sistema | A | Pendiente | Hoja de tiempos por participante |

## 5.3 Criterios de aceptación y condiciones de medición

| ID | Criterio medible de aceptación | Condiciones de medición | Evidencia requerida | Aceptado (Sí/No) |
|---|---|---|---|---|
| RQ-FUN-01 | Promedio de 3 corridas ≥ 90 % | Producción; dataset cv-01 a cv-34 (los 30 generados + 4 hechos por el equipo); modelo de IA fijado y temperatura 0; reglas de 5.5 | 3 reportes del comparador + versión del modelo | Pendiente |
| RQ-FUN-02 | F1 promedio ≥ 0,85 | Igual que RQ-FUN-01 | 3 reportes del comparador | Pendiente |
| RQ-FUN-03 | 100 % de los casos de la fórmula aprobados | Suite unitaria de `calcularPuntaje` en el CI | Reporte de Vitest | Pendiente |
| RQ-FUN-04 | 100 % de los CP funcionales aprobados (E2E y manuales) | Producción; cuentas de prueba del *seed* | Reporte de Playwright y fichas E09 | Pendiente |
| RQ-DES-01 | p95 ≤ 15 s | Producción; CVs procesados en las 3 corridas, excluyendo el primero de cada corrida (arranque en frío), que se reporta aparte | Consulta SQL exportada | Pendiente |
| RQ-DES-02 | p95 ≤ 1,5 s y errores < 1 % | Producción; 10 usuarios virtuales durante 2 min sobre páginas públicas, ofertas y `/api/salud`; desde la PC del equipo, con carga baja | Resumen de k6 | Pendiente |
| RQ-SEG-01 | 0 accesos indebidos exitosos | Producción y dev; cada intento se registra aunque sea rechazado | Reportes y capturas | Pendiente |
| RQ-SEG-02 | 0 alertas de riesgo alto | Escaneo base de ZAP solo contra el despliegue propio | Reporte HTML | Pendiente |
| RQ-SEG-03 | 100 % de postulaciones con versión y fecha de consentimiento | Todas las postulaciones de producción al cierre de la medición | Exportación SQL | Pendiente |
| RQ-SEG-04 | 100 % de eliminaciones completas | Cada eliminación de los CP de privacidad: no queda fila ni archivo | Consultas antes y después | Pendiente |
| RQ-SEG-05 | 100 % de vistas registradas | Vistas realizadas en los CP comparadas con filas de `accesos_cv` | Exportación SQL | Pendiente |
| RQ-SEG-06 | 0 campos inventados y diferencia de puntaje ≤ 0 | cv-37 frente a cv-02 y cv-38 frente a cv-29, en la misma oferta y corrida | Datos extraídos de los 4 CVs | Pendiente |
| RQ-FIA-01 | 100 % de fallas simuladas terminan en revisión manual; 0 caídas | Suite unitaria de `procesarCv` | Reporte de Vitest | Pendiente |
| RQ-FIA-02 | ≥ 99 % de tiempo disponible | Desde la creación del monitor hasta el 08/12/2026, chequeo cada 5 min | Reporte del monitor | Pendiente |
| RQ-MAN-01 | Cobertura de líneas del núcleo ≥ 80 % | CI sobre el commit evaluado | Artefacto de cobertura | Pendiente |
| RQ-MAN-02 | 0 issues bloqueantes o críticos | SonarQube Community local sobre el commit evaluado | Captura del panel | Pendiente |
| RQ-MAN-03 | 0 violaciones de la regla de capas | ESLint en el CI | Registro del CI | Pendiente |
| RQ-INT-01 | ≥ 90 % de participantes completan las 3 tareas | Entre 6 y 7 participantes (4 integrantes + 2 o 3 externos), sin ayuda, en producción | Hojas de observación | Pendiente |
| RQ-INT-02 | SUS promedio ≥ 68 | Los mismos participantes, al terminar las tareas | Cuestionarios | Pendiente |
| RQ-FLE-01 | 100 % de E2E aprobados en cada navegador | Chromium, Firefox, WebKit y un perfil móvil de Playwright | Reporte de Playwright | Pendiente |
| RQ-COM-01 | ≥ 98 % de respuestas válidas | Respuestas de la IA de las 3 corridas (los PDF que no llegan a la IA no cuentan) | Exportación SQL | Pendiente |
| RQ-SOP-01 | 100 % de los CV fallidos en revisión manual y sin puntaje | Pruebas unitarias + CVs escaneados del dataset en producción | Reporte y captura | Pendiente |
| RQ-SOP-02 | El aviso aparece en el ranking y en el detalle | Producción, con sesión de reclutador | Captura | Pendiente |
| RQ-VAL-01 | Reducción ≥ 50 % | Los 4 integrantes revisan 10 CVs del dataset a mano y con el sistema (orden alternado, con cronómetro) | Hoja de tiempos | Pendiente |

## 5.4 Aspectos no aplicables

Las subcaracterísticas que no se evalúan, con su motivo (detalle en E02):

| Característica | Subcaracterística no evaluada | Motivo |
|---|---|---|
| Adecuación funcional | Pertinencia funcional | Se observa de forma cualitativa en la prueba de tareas; no tiene meta numérica |
| Eficiencia del desempeño | Utilización de recursos, capacidad | Plataforma gestionada (Vercel y Supabase): no hay acceso a métricas de infraestructura |
| Seguridad | No repudio | No hay firma digital ni transacciones con valor legal |
| Fiabilidad | Ausencia de fallos, capacidad de recuperación | No hay operación prolongada; el respaldo lo da Supabase y no se prueba |
| Mantenibilidad | Reutilización, modificabilidad | Fuera del objetivo; la modificabilidad se comenta con el diff de las acciones de mejora (E13), sin meta |
| Capacidad de interacción | Inclusividad, compromiso del usuario, asistencia, autodescriptividad | La muestra (6–7 personas) no alcanza para medirlas |
| Flexibilidad | Escalabilidad, instalabilidad, reemplazabilidad | Fuera del objetivo académico; no se instala, se usa por web |
| Compatibilidad | Coexistencia | No convive con otros sistemas del cliente |
| Seguridad operacional | Restricción operacional, identificación de peligros, integración segura | Fuera del alcance de un sistema de apoyo a la decisión |

**Interpretación argumentada de Seguridad operacional:** un ranking automático puede afectar el acceso de una persona a un empleo. Por eso se evalúan la falla segura (RQ-SOP-01) y la advertencia (RQ-SOP-02). Si el docente no acepta esta interpretación, ambos pasan a "No aplica" sin afectar el resto de la matriz.

## 5.5 Reglas de comparación de la extracción

Fijan cómo el script comparador decide si un dato es correcto. Se congelan junto con los umbrales porque cambian el resultado de RQ-FUN-01 y RQ-FUN-02.

| Campo | Regla | Ejemplo considerado correcto |
|---|---|---|
| Nombre | Se ignoran mayúsculas, tildes y espacios repetidos | "Lucía  Pérez" = "LUCIA PEREZ" |
| Email | Coincidencia exacta en minúsculas | — |
| Teléfono | Solo dígitos; se ignoran espacios, guiones, paréntesis y el prefijo +51 | "+51 900-000-101" = "900000101" |
| Años de experiencia | Tolerancia de ± 0,5 años; si el esperado es `null`, solo es correcto `null` | Esperado 3,5 → 3 a 4 es correcto |
| Nivel educativo | Coincidencia exacta del valor del contrato `CvExtraido` | — |
| Habilidades | Se comparan como conjuntos después de normalizar con la tabla de alias del sistema (`normalizacion.ts`) | "JS" = "JavaScript" |
| Idiomas | Un idioma es correcto si coinciden el idioma (normalizado) **y** su nivel MCER | Inglés B1 ≠ Inglés B2 |

**Cálculo:** RQ-FUN-01 = campos correctos / campos evaluados × 100 (5 campos por CV). RQ-FUN-02 = F1 sobre todas las habilidades e idiomas del dataset (suma de aciertos, extraídos y esperados de todos los CVs). Cada corrida se reporta por separado y luego el promedio con su desviación estándar. Un CV que termina en revisión manual cuenta con **todos sus campos incorrectos** (no se excluye para no inflar el resultado).

## 5.6 Escala y reglas de valoración

| Nivel | Definición operacional | Regla para asignarlo |
|---|---|---|
| Cumple | El valor medido alcanza la meta | Medición oficial en producción con evidencia registrada (EV) |
| No cumple | El valor medido no alcanza la meta | Igual que "Cumple"; se registra el hallazgo y se evalúa una acción de mejora (E13) |
| No medido | No se pudo obtener la medición | Se declara el motivo (por ejemplo, falta de participantes); nunca se estima ni se completa con datos de desarrollo |
| No aplica | El criterio no corresponde al sistema | Solo con motivo escrito (5.4) |

Cada característica se valora a partir de sus requisitos:

| Valoración de la característica | Regla |
|---|---|
| Satisfactoria | Todos sus requisitos "Cumple" |
| Satisfactoria con observaciones | Todos sus requisitos de prioridad A "Cumple", pero alguno de prioridad M o B "No cumple" o "No medido" |
| No satisfactoria | Algún requisito de prioridad A "No cumple" o "No medido" |

## 5.7 Criterios de aceptación y decisión

- Un requisito se decide **solo con la medición oficial** en producción, con el commit registrado y su evidencia. Las mediciones de desarrollo sirven para preparar, no para decidir.
- Si un requisito no cumple, se registra el hallazgo y, cuando corresponda, una acción de mejora con ciclo PHVA (E13). El resultado antes y después se informa por separado; **la meta no se cambia** para que el requisito pase.
- **Conclusión global:** no se calcula una nota ni un "porcentaje de calidad total" (S09). La conclusión de E12 presenta la valoración de cada característica (5.6) y declara el sistema **apto para el uso previsto** solo si ninguna característica evaluada a fondo (Adecuación funcional, Eficiencia del desempeño y Seguridad) queda "No satisfactoria" y no hay defectos de severidad crítica abiertos (E10).
- Un porcentaje de pruebas aprobadas se informa como indicador del proceso (P03 en E06), no como medida de calidad del producto.

## 5.8 Trazabilidad de necesidades a criterios

| Necesidad del usuario (E02) | Requisito de calidad asociado | Criterio / indicador | Prueba o evidencia relacionada (E08) |
|---|---|---|---|
| N01 Conocer los datos clave del CV sin leerlo completo | RQ-FUN-01, RQ-FUN-02, RQ-COM-01 | % de campos correctos; F1; % de respuestas válidas | CP-016 |
| N02 Comparar candidatos con un criterio uniforme y entender el orden | RQ-FUN-03, RQ-SOP-02, RQ-SEG-06 | % de puntajes correctos; aviso presente; campos inventados | CP-001, CP-002, CP-003, CP-012, CP-040, CP-047, CP-052 |
| N03 Revisar en menos tiempo que a mano | RQ-DES-01, RQ-DES-02, RQ-VAL-01 | p95 por CV; p95 bajo carga; % de reducción | CP-017, CP-018, CP-050 |
| N04 Ver solo las postulaciones de sus ofertas | RQ-SEG-01, RQ-SEG-05 | Accesos indebidos; % de vistas registradas | CP-010 a CP-014, CP-026, CP-041 a CP-044 |
| N05 Postular de forma simple y saber el estado | RQ-FUN-04, RQ-INT-01, RQ-INT-02 | % de CP aprobados; % que completa tareas; SUS | CP-024, CP-027 a CP-039, CP-048, CP-049, CP-051, CP-052 |
| N06 Datos protegidos y poder eliminarlos | RQ-SEG-02, RQ-SEG-03, RQ-SEG-04 | Alertas altas; % con consentimiento; % de eliminaciones completas | CP-004, CP-008, CP-015, CP-019, CP-025, CP-031, CP-045, CP-046 |
| N07 Que una falla no lo descarte injustamente | RQ-FIA-01, RQ-SOP-01 | % de fallas controladas; % en revisión manual sin puntaje | CP-006, CP-007, CP-035 |
| N08 Disponible y en su navegador o celular | RQ-FIA-02, RQ-FLE-01 | % de tiempo disponible; % de E2E por navegador | CP-023, CP-024 |
| N09 Mejorar sin romper lo que funciona | RQ-MAN-01, RQ-MAN-02, RQ-MAN-03 | % de cobertura; issues graves; violaciones | CP-020, CP-021, CP-022 |
