# E14. Informe final ejecutivo y presentación de sustentación

> **Plantilla:** Formatos 14 + anexos A, B y C · **Estado:** borrador v0.1 (22/11/2026) · **Fuente de verdad:** este archivo.
> El guion (14.3) es una propuesta: la asignación de temas y los tiempos (20 minutos en total) se ajustan con el equipo y con la duración que confirme el docente. Las cifras marcadas como pendientes se completan con las mediciones del equipo antes del 11/12/2026.

| Campo | Valor |
|---|---|
| Código del entregable | E14 |
| Título del proyecto | Evaluación de la calidad de un sistema web de RRHH con lectura automática de CVs según ISO/IEC 25010:2023 |
| Sistema evaluado | CV Lectura (https://cv-lectura.vercel.app) |
| Integrantes | Giancarlos Ormeño, Raquel Montes, Hermy Salcedo, Nancy Vilcas y Paul Carretero |
| Fecha | 22/11/2026 (borrador). Entrega: 11/12/2026. Sustentación: 18/12/2026 |

## 14.1 Síntesis del proyecto

**El sistema.** CV Lectura ayuda a un área de Recursos Humanos a revisar postulaciones. El reclutador publica una oferta con sus requisitos; el postulante sube su CV en PDF con su consentimiento; el sistema extrae los datos con inteligencia artificial (OpenAI), calcula un puntaje con una fórmula fija y ordena a los candidatos. El reclutador decide, con el PDF a la vista y un aviso de que el puntaje es solo un apoyo.

**El objetivo de la evaluación.** Determinar si el sistema es lo bastante exacto, rápido, seguro y respetuoso de los datos personales para ese uso, con el modelo ISO/IEC 25010:2023.

**El trabajo realizado.**

1. Se diagnosticó el sistema y se eligió el modelo de calidad (E01–E03) con sus normas de referencia (E04).
2. Se definieron 24 requisitos de calidad con metas numéricas y se **congelaron antes de medir** con una etiqueta de Git (E05, 22/11/2026).
3. Se planificaron la gestión de la calidad y las pruebas (E06, E07) y se diseñaron 52 casos de prueba (E08).
4. Se midió en producción dos veces: antes y después de corregir lo encontrado (E09, E11), con 6 corridas de 38 CVs ficticios, pruebas automatizadas en 4 navegadores, carga y escaneo de seguridad.
5. Se registraron 7 defectos (E10), se aplicaron 5 acciones de mejora con su verificación (E13) y se redactó el informe final (E12).

## 14.2 Resultados que se comunicarán

| Mensaje / resultado clave | Dato que lo sustenta | Evidencia que se mostrará | Integrante responsable |
|---|---|---|---|
| La IA extrae bien los datos de los CVs | 96,7 % de campos correctos (meta ≥ 90 %); F1 0,988 en habilidades e idiomas (meta ≥ 0,85) | Reporte del comparador de una corrida (EV-06) | Giancarlos Ormeño |
| Medir sirvió para encontrar y corregir problemas reales | 1.ª medición: 85,7 % por PDFs que no se guardaban (DEF-001); corregido: 96,7 % | Tabla antes/después de E13 | Giancarlos Ormeño |
| Un CV con texto oculto ya no puede subir su puntaje | Antes: +10 puntos (100 frente a 90). Después: 0 | Ficha DEF-002 y consulta de puntajes (EV-13) | Nancy Vilcas (ejecuta CP-047) |
| Ninguna falla perjudica al postulante | 100 % de los CVs fallidos en revisión manual y sin puntaje (18 de 18 y 6 de 6) | Consulta de estados (EV-13) | Nancy Vilcas |
| El sistema es rápido | 95 % de los CVs procesados en menos de 4,9 s (meta ≤ 15 s); 297 ms con 10 usuarios | Resumen de k6 (EV-08) | Giancarlos Ormeño |
| Los datos personales están protegidos | 0 alertas altas en ZAP; 100 % con consentimiento; accesos indebidos: pendiente de CP manuales | Reporte de ZAP (EV-10) y fichas de CP-041 a CP-046 | Paul Carretero |
| Las funciones básicas funcionan para cada usuario | CP manuales de M1, M2 y M3 (pendiente) | Fichas con capturas | Raquel Montes y Hermy Salcedo |
| El sistema es fácil de usar y ahorra tiempo | SUS, tareas sin ayuda y reducción del tiempo (pendiente) | Hojas de observación y tiempos | Giancarlos Ormeño (facilitador) |

## 14.3 Guion de sustentación

| Orden | Tema a exponer | Contenido principal | Responsable | Tiempo estimado |
|---|---|---|---|---|
| 1 | El sistema y el problema | Qué hace CV Lectura, para quién y por qué su calidad importa (afecta el acceso de una persona a un empleo) | Raquel Montes | 2 min |
| 2 | Modelo y normas | ISO/IEC 25010:2023 frente a McCall, Boehm y FURPS; normas de apoyo (E03, E04) | Raquel Montes | 2 min |
| 3 | Requisitos y metas | 24 requisitos verificables; metas congeladas antes de medir (E05) | Hermy Salcedo | 2 min |
| 4 | Plan de pruebas y casos | Estrategia, 52 casos, quién ejecutó qué; casos de M3 ejecutados | Hermy Salcedo | 3 min |
| 5 | Medición de la extracción y del puntaje | Cómo se midió (6 corridas en producción), resultados y desempeño | Giancarlos Ormeño | 3 min |
| 6 | Defectos y acciones de mejora | DEF-001 y DEF-002; ciclo PHVA; antes y después (E10, E13) | Nancy Vilcas | 3 min |
| 7 | Seguridad y privacidad | ZAP, RLS, consentimiento, eliminación de datos y registro de vistas; casos ejecutados | Paul Carretero | 3 min |
| 8 | Conclusión y limitaciones | Valoración por característica, regla de decisión y limitaciones (E12) | Giancarlos Ormeño | 2 min |
| — | Preguntas | Ver 14.5 | Todos | Según el docente |

## 14.4 Demostración del sistema

El sistema **no se presenta en vivo**: la evaluación se centra en el expediente y en el método de calidad. En su lugar, cada integrante muestra las evidencias de lo que ejecutó:

- **Funciones (M1–M6):** el reporte HTML de Playwright (EV-12), con las 20 pruebas aprobadas en Chromium, Firefox, WebKit y móvil, y las capturas de los casos manuales.
- **Extracción con IA:** un reporte del comparador con los datos esperados y obtenidos de cada CV (EV-06).
- **Inyección:** cv-37 frente a cv-02, antes (puntaje 100 frente a 90) y después (90 y 90) (EV-13).
- **Seguridad:** el reporte de ZAP antes y después (EV-09, EV-10).
- **Disponibilidad:** el panel de UptimeRobot con el porcentaje del periodo (EV-14 y su cierre al 08/12/2026).

## 14.5 Preguntas y respuestas del equipo

| Pregunta del docente / evaluador | Respuesta sustentada | Dato o evidencia de respaldo |
|---|---|---|
| ¿Cómo saben que no ajustaron las metas a los resultados? | Las metas se congelaron con la etiqueta Git `umbrales-v1.0` antes de la primera medición oficial. Git guarda la fecha y el contenido, y cualquier cambio posterior pasaría por el control de cambios de E05 5.9, que no tiene cambios | Etiqueta `umbrales-v1.0` (22/11/2026); E05 5.9 |
| ¿Por qué la exactitud se midió con CVs ficticios? | Para no tratar datos personales reales sin necesidad (Ley N.° 29733) y para conocer la respuesta correcta de antemano. Los diseños imitan CVs reales de Word, Google Docs y Canva, y 4 usan el formato del CV de cada integrante | `dataset/README.md`; limitación declarada en E12 12.8 |
| ¿Por qué 3 corridas? | Un modelo de IA no es 100 % determinista. Se informa el promedio y la desviación; la desviación fue de solo 0,3 puntos | E11, M01 |
| Si la primera medición no cumplía, ¿por qué dicen que el sistema cumple? | Porque se siguió el ciclo de mejora: se registró el defecto, se corrigió su causa y se volvió a medir con la misma meta. Se informan ambos resultados | E10, E13 13.4 |
| ¿Qué pasa si la IA falla o se equivoca? | Si falla, el CV va a revisión manual sin puntaje, nunca con 0 (100 % en producción). Si se equivoca, el reclutador ve el PDF junto a los datos y un aviso de que el puntaje es solo un apoyo | M22; RQ-SOP-02 |
| ¿Por qué ISO/IEC 25010:2023 y no McCall o FURPS? | Es la edición vigente, incluye Seguridad y Seguridad operacional (clave en un sistema que afecta el acceso al empleo) y tiene medidas asociadas en ISO/IEC 25023 | E03 |
| ¿Hubo errores críticos? | SonarQube encontró 2 issues críticos, pero en la herramienta de medición, que no se despliega; no afectaron al usuario ni a los resultados (se recalcularon y dieron igual). Se corrigieron y el segundo análisis dio 0 | DEF-007, EV-16 |
| ¿Qué riesgos quedan? | Otras formas de ocultar texto, la falta de CSP y errores menores de la IA en 6 de 170 campos. Están registrados con su acción propuesta | E12 12.6, E13 13.5 |
| ¿Cuánto costó usar OpenAI? | Alrededor de 1 centavo de dólar por corrida de 36 CVs, unos 6 a 10 centavos en total | Panel de uso de OpenAI (por adjuntar) |

## 14.6 Declaración del equipo

Declaramos que los resultados, mediciones y evidencias incluidos en el expediente corresponden a las actividades realizadas por el equipo.

| Campo | Valor |
|---|---|
| Representante del equipo | Giancarlos Ormeño |
| Firmas de integrantes | Giancarlos Ormeño · Raquel Montes · Hermy Salcedo · Nancy Vilcas · Paul Carretero |
| Fecha | Por firmar (11/12/2026) |

## ANEXO A. Lista de control de entregables

| N.° | Entregable | Incluido | Revisado | Ubicación / páginas | Observaciones |
|---|---|---|---|---|---|
| E01 | Documento de identificación y diagnóstico | Sí | Pendiente | `docs/expediente/E01-*` | Borrador v0.1 |
| E02 | Matriz de características y dimensiones | Sí | Pendiente | `docs/expediente/E02-*` | Borrador v0.1 |
| E03 | Selección y aplicación del modelo | Sí | Pendiente | `docs/expediente/E03-*` | Borrador v0.1 |
| E04 | Normas y estándares | Sí | Pendiente | `docs/expediente/E04-*` | Borrador v0.1 |
| E05 | Matriz de evaluación ISO/IEC 25010 | Sí | Pendiente | `docs/expediente/E05-*` | v1.0 congelada el 22/11/2026 |
| E06 | Plan de gestión y aseguramiento | Sí | Pendiente | `docs/expediente/E06-*` | Borrador v0.1 |
| E07 | Plan de pruebas | Sí | Pendiente | `docs/expediente/E07-*` | Borrador v0.1 |
| E08 | Casos de prueba | Sí | Pendiente | `docs/expediente/E08-*` | 52 casos |
| E09 | Ejecución y evidencias | Sí | Pendiente | `docs/expediente/E09-*` | Faltan los CP manuales |
| E10 | Defectos e incidencias | Sí | Pendiente | `docs/expediente/E10-*` | 7 defectos |
| E11 | Métricas e indicadores | Sí | Pendiente | `docs/expediente/E11-*` | 15 de 23 métricas medidas |
| E12 | Informe final de evaluación | Sí | Pendiente | `docs/expediente/E12-*` | Conclusión provisional |
| E13 | Acciones correctivas y mejora | Sí | Pendiente | `docs/expediente/E13-*` | 5 acciones verificadas, 4 propuestas |
| E14 | Informe ejecutivo y sustentación | Sí | Pendiente | `docs/expediente/E14-*` | Este documento |

## ANEXO B. Índice de evidencias

| Código | Nombre del archivo | Tipo de evidencia | Entregable relacionado | Descripción / qué demuestra | Ubicación |
|---|---|---|---|---|---|
| EV-01 | `unitarias.txt` | Reporte de pruebas | E09, E11 | 92 pruebas unitarias aprobadas | `docs/evidencias/automatizadas/` |
| EV-02 | `integracion.txt` | Reporte de pruebas | E09, E11 | 27 pruebas de integración y seguridad aprobadas | `docs/evidencias/automatizadas/` |
| EV-03 | `cobertura.txt` | Reporte de cobertura | E11 | 97,69 % de líneas del núcleo | `docs/evidencias/automatizadas/` |
| EV-04 | `lint.txt` | Registro de análisis estático | E11 | 0 violaciones de la regla de capas | `docs/evidencias/automatizadas/` |
| EV-05 | `prod-corrida-1` a `-3`, `primera-medicion-resumen.txt` | Datos de medición | E09–E13 | Primera medición de la extracción | `dataset/corridas/` |
| EV-06 | `prod-corrida-4` a `-6`, `segunda-medicion-resumen.txt` | Datos de medición | E09–E13 | Segunda medición, después de las mejoras | `dataset/corridas/` |
| EV-07 | `k6-salida.txt`, `k6-resumen.json` | Reporte de carga | E09, E11 | Carga, primera medición | `docs/evidencias/carga/` |
| EV-08 | `k6-salida-2.txt`, `k6-resumen-2.json` | Reporte de carga | E09, E11, E13 | Carga, segunda medición | `docs/evidencias/carga/` |
| EV-09 | `zap-base-prod.html` / `.json` | Reporte de seguridad | E09, E10 | ZAP, primera medición | `docs/evidencias/seguridad/` |
| EV-10 | `zap-base-prod-2.html` / `.json` | Reporte de seguridad | E09, E12, E13 | ZAP, segunda medición | `docs/evidencias/seguridad/` |
| EV-11 | `e2e/reporte/index.html` | Reporte de pruebas E2E | E09, E11 | Playwright en 4 perfiles, primera medición | `docs/evidencias/e2e/` |
| EV-12 | `e2e/reporte-2/index.html` | Reporte de pruebas E2E | E09, E11, E13 | Playwright, segunda medición | `docs/evidencias/e2e/` |
| EV-13 | `consultas-prod-2026-11-22.txt` | Consulta a la BD | E09–E13 | Consentimiento, estados, motivos y puntajes con inyección | `docs/evidencias/sql/` |
| EV-14 | `2026-11-22-uptimerobot-panel.png`, `-detalle.png` | Capturas | E09, E11 | Inicio del monitor de disponibilidad | `docs/evidencias/disponibilidad/` |
| EV-15 | `local-4o-mini-prueba1` a `-3` | Datos de preparación | E10, E13 | Corridas locales que detectaron y corrigieron DEF-003 | `docs/evidencias/preparacion/` |
| EV-16 | `issues-*.json`, `medidas-*.json` | Análisis estático | E09–E13 | SonarQube Cloud, 1.ª y 2.ª medición | `docs/evidencias/sonarqube/` |

Las evidencias de los casos manuales (capturas de cada integrante) se agregan como EV-17 en adelante.

## ANEXO C. Referencias bibliográficas

| Autor / organismo | Título de la fuente | Año / edición | Editorial / sitio | URL / datos bibliográficos | Fecha de consulta |
|---|---|---|---|---|---|
| ISO/IEC | Systems and software engineering — SQuaRE — Product quality model (ISO/IEC 25010) | 2023 | ISO | https://www.iso.org/standard/78176.html | 18/11/2026 |
| ISO/IEC | Systems and software engineering — SQuaRE — Quality-in-use model (ISO/IEC 25019) | 2023 | IEC Webstore | https://webstore.iec.ch/en/publication/90105 | 18/11/2026 |
| ISO/IEC | Systems and software engineering — SQuaRE — Guide to SQuaRE (ISO/IEC 25000) | 2014 | ISO | https://www.iso.org/standard/64764.html | 18/11/2026 |
| ISO/IEC | Systems and software engineering — SQuaRE — Quality requirements framework (ISO/IEC 25030) | 2019 | ISO | https://www.iso.org/standard/72116.html | 18/11/2026 |
| ISO/IEC | Systems and software engineering — SQuaRE — Measurement of system and software product quality (ISO/IEC 25023) | 2016 | ISO | https://www.iso.org/standard/35747.html | 18/11/2026 |
| ISO/IEC | Systems and software engineering — SQuaRE — Quality evaluation framework (ISO/IEC 25040) | 2024 | iTeh Standards (vista previa) | https://cdn.standards.iteh.ai/samples/83467/6f61102971184ae6a08ae4f28d431d08/ISO-IEC-25040-2024.pdf | 18/11/2026 |
| ISO/IEC | Information security management systems — Requirements (ISO/IEC 27001) | 2022 | ISO | https://www.iso.org/standard/27001 | 18/11/2026 |
| ISO | Quality management systems — Requirements (ISO 9001) | 2026 | ISO | https://www.iso.org/standard/9001 | 18/11/2026 |
| Congreso de la República del Perú | Ley N.° 29733, Ley de Protección de Datos Personales | 2011 | SMV | https://www.smv.gob.pe/Uploads/Ley_29733_vigente_2025.pdf | 18/11/2026 |
| Ministerio de Justicia y Derechos Humanos | Decreto Supremo N.° 016-2024-JUS, Reglamento de la Ley N.° 29733 | 2024 (vigente desde el 31/03/2025) | gob.pe | https://www.gob.pe/institucion/anpd/campañas/128319-nuevo-reglamento-de-proteccion-de-datos-personales | 18/11/2026 |
| OWASP Foundation | OWASP Top 10 | 2025 | owasp.org | https://owasp.org/Top10/2025/ | 18/11/2026 |
| OWASP Foundation | Application Security Verification Standard (ASVS) | 5.0.0 (2025) | owasp.org | https://asvs.owasp.org/ | 18/11/2026 |
| OWASP Foundation (GenAI Security Project) | OWASP Top 10 for LLM Applications — LLM01:2025 Prompt Injection | 2025 | genai.owasp.org | https://genai.owasp.org/llm-top-10/ | 22/11/2026 |
| W3C | Web Content Accessibility Guidelines (WCAG) | 2.2 (2023) | w3.org | https://www.w3.org/TR/WCAG22/ | 18/11/2026 |
| IETF | RFC 9110 HTTP Semantics; RFC 8446 TLS 1.3 | 2022; 2018 | RFC Editor | https://www.rfc-editor.org/ | 18/11/2026 |
| Vercel | Next.js Documentation — Data Security y Server Actions (protección CSRF) | 16.4 | nextjs.org | Guías `data-security` y `server-actions` incluidas en el paquete `next` 16.4.6 | 22/11/2026 |
| ZAP (Checkmarx) | ZAP — Automation Framework | 2.17.0 | zaproxy.org | https://www.zaproxy.org/docs/automate/automation-framework/ | 22/11/2026 |
| SonarSource | SonarQube Cloud Documentation — Automatic analysis | 2026 | sonarsource.com | https://docs.sonarsource.com/sonarqube-cloud/advanced-setup/automatic-analysis/ | 22/11/2026 |
| Grafana Labs | k6 Documentation | v2.4.0 | grafana.com | https://grafana.com/docs/k6/latest/ | 22/11/2026 |
| Microsoft | Playwright Documentation | 1.65 | playwright.dev | https://playwright.dev/docs/intro | 22/11/2026 |
| Cortez Camacho, J. R. | Material de clase S01–S11, Calidad de Software y Sistemas | 2026 | IESTP Gilda Liliana Ballivián Rosado | — | 18/11/2026 |

## Verificación final antes de presentar

| Punto | Estado al 22/11/2026 |
|---|---|
| Los 14 entregables están completados o se ha justificado lo que no aplica | En borrador; E09–E14 esperan los CP manuales |
| Todos los entregables se refieren al mismo sistema y versión evaluada | Sí: producción, commits registrados en cada evidencia |
| Los requisitos y criterios de aceptación son verificables | Sí (E05 v1.0) |
| El modelo y las normas están identificados con su edición o año | Sí (E04, Anexo C) |
| Los planes de calidad y de pruebas corresponden al alcance real | Sí (E06, E07 actualizados al 22/11/2026) |
| Los casos de prueba incluyen pasos, datos y resultados esperados | Sí (E08) |
| Los resultados ejecutados están registrados y tienen evidencia | Sí para los automatizados (E09, Anexo B) |
| Los defectos están identificados y vinculados con acciones de mejora | Sí (E10 ↔ E13) |
| Las métricas incluyen fórmula, datos, resultado e interpretación | Sí (E11) |
| El informe final se basa en los resultados registrados | Sí; conclusión provisional (E12) |
| Las referencias y anexos están completos y ordenados | Sí; se revisan las ediciones antes de entregar |
| El equipo está preparado para sustentar sus decisiones y resultados | Pendiente (ensayo) |
