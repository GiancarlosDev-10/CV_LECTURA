# E03. Informe de selección y aplicación del modelo de calidad

> **Plantilla:** Formatos 02 (2.2–2.5) · **Estado:** borrador v0.1 (18/11/2026) · **Fuente de verdad:** este archivo.

| Campo | Valor |
|---|---|
| Código del entregable | E03 |
| Sistema evaluado | CV Lectura — Sistema web de RRHH con lectura automática de CVs |
| Equipo | Giancarlos Ormeño, Raquel Montes, Hermy Salcedo, Nancy Vilcas y Paul Carretero |
| Fecha | 18/11/2026 |

## 3.1 Modelos de calidad revisados

| Modelo / referencia | Enfoque | Características relevantes | Ventajas para este proyecto | Limitaciones |
|---|---|---|---|---|
| McCall (1977) | Factores de calidad del producto agrupados en operación, revisión y transición | Corrección, confiabilidad, eficiencia, integridad, usabilidad, mantenibilidad, facilidad de prueba, interoperabilidad | Separa claramente la operación del producto de su mantenimiento; "corrección" e "integridad" encajan con la extracción y la protección de datos | No trata la privacidad ni los servicios externos (IA); su terminología no es la que usa el curso hoy |
| Boehm (1978) | Utilidad general del software: utilidad tal como está, mantenibilidad y portabilidad | Confiabilidad, eficiencia, comprensibilidad, interoperabilidad, mantenibilidad | Pone el foco en que el software sea útil para el usuario | Jerarquía antigua; no cubre seguridad de la información ni calidad en uso |
| FURPS (Hewlett-Packard) | Clasificación de requisitos en cinco categorías | Funcionalidad, usabilidad, confiabilidad, rendimiento, soportabilidad | Sencillo y útil para clasificar requisitos de un proyecto pequeño | La seguridad queda dentro de "funcionalidad" y no se puede evaluar con el detalle que exige la Ley N.° 29733; no tiene subcaracterísticas normalizadas ni medidas asociadas |
| ISO/IEC 25010:2023 | Modelo internacional de calidad del producto (familia SQuaRE) | 9 características y sus subcaracterísticas, incluidas Seguridad (con responsabilidad y resistencia) y Seguridad operacional | Es la referencia que usa el curso (S09); se conecta con ISO/IEC 25023 (medidas), 25030 (requisitos) y 25040 (proceso de evaluación) | La norma completa es de pago; la calidad en uso pasó a ISO/IEC 25019:2023 y se trata como referencia parcial |

## 3.2 Modelo seleccionado

| Campo | Valor |
|---|---|
| Modelo seleccionado | Modelo de calidad del producto ISO/IEC 25010:2023, complementado de forma parcial con el modelo de calidad en uso ISO/IEC 25019:2023 |
| Norma / edición / año consultado | ISO/IEC 25010:2023 (publicada en noviembre de 2023; revisa el modelo de producto de la edición 2011). ISO/IEC 25019:2023 |
| Fuente oficial o bibliográfica | Ficha oficial de ISO (iso.org) y vistas previas oficiales de las normas; material de clase S09 "Modelos de calidad de productos de software" (docente José Ricardo Cortez Camacho). Ver referencias en E04 |

**Justificación de la selección.**

1. **Tipo de sistema:** es un sistema web que procesa datos personales y depende de un servicio de IA externo. ISO/IEC 25010:2023 es el único de los modelos revisados que separa la Seguridad en subcaracterísticas verificables (confidencialidad, integridad, responsabilidad, autenticidad, resistencia) y que incluye la Seguridad operacional, útil para argumentar el riesgo de un ranking automático sobre las personas.
2. **Alcance y objetivos:** el enunciado pide medir el porcentaje de datos extraídos, la protección de datos personales y el tiempo por CV. Estos tres puntos se ubican directamente en Adecuación funcional (corrección), Seguridad y Eficiencia del desempeño (comportamiento temporal).
3. **Medición:** la familia SQuaRE ofrece la cadena completa que exige el curso: requisitos de calidad (ISO/IEC 25030), medidas (ISO/IEC 25023) y proceso de evaluación (ISO/IEC 25040). McCall, Boehm y FURPS no tienen esa continuidad.
4. **Coherencia con el curso:** es el modelo y la edición que usa el docente (S09), con su terminología en español (por ejemplo, "Capacidad de interacción", "Flexibilidad" y "Seguridad operacional").

McCall, Boehm y FURPS no se descartan como conocimiento: sirven para explicar de dónde vienen las características (por ejemplo, la "corrección" de McCall es la base de la corrección funcional), pero no se usan para evaluar.

## 3.3 Aplicación del modelo

La evaluación sigue la cadena del curso: **característica → subcaracterística → criterio → indicador → meta → método**. Los criterios, indicadores y metas completos están en E05 (24 requisitos de calidad); aquí se resume dónde y cómo se evalúa cada característica.

| Característica / dimensión | Por qué es relevante | Parte del sistema donde se evaluará | Método o evidencia |
|---|---|---|---|
| Adecuación funcional (a fondo) | El enunciado pide el porcentaje de datos extraídos; el puntaje debe ser correcto | M4 Extracción, M5 Puntaje; M1–M6 para completitud | Script comparador sobre un dataset de 40 CVs ficticios (3 corridas); pruebas unitarias del puntaje; casos de prueba funcionales |
| Eficiencia del desempeño (a fondo) | El enunciado pide el tiempo por CV | M3–M5 (subida → puntaje); páginas y API | Marcas de tiempo en la base de datos (percentil 95); prueba de carga con k6 |
| Seguridad (a fondo) | Datos personales protegidos por la Ley N.° 29733 | M1 roles, M3 consentimiento, M6 privacidad, almacenamiento de los PDF | Casos de seguridad manuales y automatizados (accesos indebidos), OWASP ZAP, consultas SQL de consentimiento y registro de vistas, CVs con inyección de instrucciones |
| Fiabilidad (media) | La IA puede fallar; el sistema debe estar disponible | M4 Extracción; despliegue en producción | Pruebas unitarias con IA simulada (tiempo agotado, JSON inválido, error 500); monitor de disponibilidad |
| Mantenibilidad (media) | Las acciones de mejora deben aplicarse sin romper el sistema | Núcleo: capas de dominio y aplicación | Reporte de cobertura de Vitest, ESLint (regla de capas) en el CI, SonarQube |
| Capacidad de interacción (media) | Dos roles que deben usar el sistema sin capacitación | Flujos de postulación y de revisión del ranking | Prueba de 3 tareas con usuarios y cuestionario SUS |
| Flexibilidad (mínima) | Acceso desde distintos navegadores y celular | Todas las pantallas | Pruebas E2E con Playwright en Chromium, Firefox, WebKit y vista móvil |
| Compatibilidad (mínima) | Intercambio de datos con OpenAI y Supabase | Contrato JSON de la extracción | Registro de validación con Zod |
| Seguridad operacional (mínima, argumentada) | El ranking afecta el acceso de personas a un empleo | M4 falla segura; M5 advertencia | Pruebas que verifican que un CV fallido nunca recibe puntaje 0; caso de prueba de la advertencia |
| Calidad en uso (referencia ISO/IEC 25019) | La propuesta de valor es ahorrar tiempo de revisión | Flujo completo del reclutador | Revisión manual cronometrada de 10 CVs frente al sistema; SUS como indicador de satisfacción |

**Reglas que se aplican en toda la evaluación:**

- Los umbrales se congelan antes de medir (22/11/2026, etiqueta Git `umbrales-v1.0`) y solo cambian por control de cambios.
- Todas las mediciones oficiales se hacen en producción (https://cv-lectura.vercel.app), no en local.
- Un porcentaje de pruebas aprobadas no se presenta como "porcentaje de calidad total" (S09).
- Si un criterio no aplica, se escribe "No aplica" con su motivo.

## 3.4 Conclusión

ISO/IEC 25010:2023 permite evaluar CV Lectura de forma estructurada y no solo por opinión: cada característica se baja a criterios con indicador, meta y método, y cada resultado se respalda con una evidencia. Al priorizar Adecuación funcional, Eficiencia del desempeño y Seguridad, la evaluación responde directamente a lo que pide el enunciado. Y al apoyarse en la familia SQuaRE (25030, 25023 y 25040), los requisitos (E05), las métricas (E11) y el informe final (E12) quedan conectados con la misma referencia.
