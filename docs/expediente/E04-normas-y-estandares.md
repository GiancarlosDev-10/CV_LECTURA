# E04. Documento de normas y estándares aplicables

> **Plantilla:** Formatos 03 · **Estado:** borrador v0.1 (18/11/2026) · **Fuente de verdad:** este archivo. Ediciones verificadas el 18/11/2026.

| Campo | Valor |
|---|---|
| Código del entregable | E04 |
| Sistema evaluado | CV Lectura — Sistema web de RRHH con lectura automática de CVs |
| Equipo | Giancarlos Ormeño, Raquel Montes, Hermy Salcedo, Nancy Vilcas y Paul Carretero |
| Fecha | 18/11/2026 |

## 4.1 Propósito

Se revisan normas y estándares para que la evaluación use **criterios reconocidos y no opiniones**: el modelo de calidad, la forma de redactar requisitos, las medidas y el proceso de evaluación salen de la familia ISO/IEC 25000 (SQuaRE). También se revisan porque el sistema procesa **datos personales**, y en el Perú eso está regulado por una ley de cumplimiento obligatorio, distinta de las normas voluntarias.

Se distinguen tres tipos de referencia (S04 y S05):

- **Norma:** establece requisitos, directrices o criterios formalizados por un organismo de normalización (por ejemplo, ISO/IEC 25010). Es voluntaria salvo que una ley o contrato la exija.
- **Estándar:** especificación o práctica común que facilita la uniformidad y la compatibilidad; puede venir de consorcios o comunidades (por ejemplo, W3C, IETF, OWASP).
- **Ley o reglamento:** disposición jurídica de cumplimiento obligatorio en su ámbito (Ley N.° 29733).

## 4.2 Normas y estándares identificados

| Norma / estándar y edición | Organismo emisor | Propósito / alcance | Aspecto pertinente | Aplicación en el proyecto | Fuente consultada |
|---|---|---|---|---|---|
| ISO/IEC 25010:2023 | ISO e IEC (JTC 1/SC 7) | Modelo de calidad del producto de software y sistemas | 9 características y sus subcaracterísticas | Modelo de evaluación (E02, E03, E05) | iso.org; vista previa oficial |
| ISO/IEC 25019:2023 | ISO e IEC (JTC 1/SC 7) | Modelo de calidad en uso | Beneficio (incluye usabilidad), ausencia de riesgo, aceptabilidad | Referencia parcial para la prueba de tareas, el SUS y el ahorro de tiempo | iso.org; ficha de IEC Webstore |
| ISO/IEC 25000:2014 | ISO e IEC (JTC 1/SC 7) | Guía de la familia SQuaRE | Organización de las normas y términos comunes | Marco general del expediente | iso.org (confirmada en revisión periódica) |
| ISO/IEC 25030:2019 | ISO e IEC (JTC 1/SC 7) | Marco para requisitos de calidad | Cómo definir requisitos de calidad verificables usando el modelo 25010 | Redacción de los 24 requisitos de calidad (E05) | iso.org |
| ISO/IEC 25023:2016 | ISO e IEC (JTC 1/SC 7) | Medidas de calidad del producto | Medidas cuantitativas por característica y subcaracterística | Equivalencia de cada métrica M01–M23 (E11). La norma está marcada "en revisión" por ISO, pero la edición 2016 sigue vigente | iso.org |
| ISO/IEC 25040:2024 | ISO e IEC (JTC 1/SC 7) | Proceso de evaluación de la calidad | Cinco pasos: definir, diseñar, planificar, ejecutar y concluir la evaluación | Estructura del plan de evaluación y del informe final (E05, E06, E12) | iso.org; vista previa oficial |
| ISO/IEC 27001:2022 | ISO e IEC | Sistema de gestión de seguridad de la información (SGSI) | Controles de acceso, registro de eventos, gestión de riesgos | Referencia para los controles de acceso por rol, RLS y registro de vistas. **No se implementa un SGSI ni se certifica** | iso.org |
| ISO 9001:2026 (publicada el 16/09/2026; reemplaza a la edición 2015) | ISO (TC 176) | Sistema de gestión de la calidad | Enfoque a procesos, PHVA y mejora continua | Referencia para el plan de gestión de calidad y las acciones de mejora (E06, E13). **No se certifica** | iso.org |
| Ley N.° 29733, Ley de Protección de Datos Personales, y su Reglamento (D.S. N.° 016-2024-JUS, vigente desde el 31/03/2025) | Congreso de la República del Perú; Ministerio de Justicia y Derechos Humanos (ANPD) | Protección de datos personales en el Perú | Consentimiento, finalidad, derechos ARCO, seguridad, flujo transfronterizo | Consentimiento obligatorio y versionado por oferta, "Eliminar mis datos", control de acceso, aviso de que los datos se alojan en São Paulo (Brasil) | gob.pe (ANPD y MINJUS) |
| OWASP Top 10:2025 | OWASP Foundation (comunidad) | Riesgos más críticos de seguridad en aplicaciones web | Control de acceso roto, inyección, fallas de autenticación, manejo de condiciones excepcionales | Diseño de los casos de seguridad (accesos indebidos, inyección de instrucciones, fallas de la IA) | owasp.org/Top10/2025 |
| OWASP ASVS 5.0.0 (mayo de 2025) | OWASP Foundation (comunidad) | Requisitos verificables de seguridad de aplicaciones | Requisitos de control de acceso, validación de archivos y registro | Lista de verificación para los casos de seguridad; análisis dinámico con OWASP ZAP | asvs.owasp.org |
| WCAG 2.2 | W3C | Accesibilidad del contenido web | Contraste mínimo y uso del color (no transmitir información solo con color) | Paleta con contraste verificado y puntaje siempre acompañado de su número | w3.org |
| HTTP (RFC 9110) y TLS 1.3 (RFC 8446) | IETF | Semántica de HTTP y comunicación cifrada | Comunicación segura entre navegador, servidor y servicios | El sistema solo se sirve por HTTPS (Vercel) | rfc-editor.org |
| ITIL 4 y COBIT 2019 | PeopleCert (AXELOS); ISACA | Buenas prácticas de gestión de servicios y gobierno de TI | Gestión de incidentes y defectos; controles | Flujo de defectos de E10: registro, clasificación (impacto × urgencia), asignación, resolución y cierre | Material de clase S07 |
| CMMI y ciclo PHVA (PDCA) | ISACA (CMMI Institute); ciclo de Deming | Madurez de procesos y mejora continua | Niveles de madurez; planificar, hacer, verificar, actuar | Autoevaluación del proceso del proyecto (E06) y ciclo de cada acción de mejora (E13) | Material de clase S11 |

## 4.3 Análisis de aplicabilidad

**Obligatoria.** Solo la **Ley N.° 29733 y su Reglamento** es de cumplimiento obligatorio, porque el sistema trata datos personales de postulantes. Aunque el proyecto usa solo datos ficticios, el diseño se hace como si fueran reales: consentimiento informado ligado a la oferta (principio de finalidad), eliminación de datos por el titular, acceso restringido y aviso del flujo transfronterizo.

**Aplicadas como base del método de evaluación (voluntarias).** ISO/IEC 25010:2023 (modelo), 25030 (requisitos), 25023 (medidas) y 25040 (proceso). Son el núcleo del expediente y se aplican de forma directa, citando su edición.

**Aplicadas como estándares técnicos.** OWASP Top 10 y ASVS (diseño de las pruebas de seguridad), WCAG 2.2 (contraste y uso del color) e IETF (HTTPS). Se usan como listas de verificación, no para declarar conformidad total.

**Solo como referencia.** ISO/IEC 27001, ISO 9001, ITIL, COBIT y CMMI. El proyecto no implementa un sistema de gestión ni busca certificación; se toman prácticas puntuales (control de acceso, registro, gestión de defectos, mejora continua) y se declara así.

## 4.4 Consideraciones y límites

- **Acceso a las normas:** las normas ISO completas son de pago. Se trabaja con las fichas oficiales, las vistas previas oficiales y el material del curso. Por eso **no se citan códigos de medidas de ISO/IEC 25023** sin haberlos verificado contra el texto de la norma.
- **Implementar no es certificar:** usar prácticas de ISO/IEC 27001 o ISO 9001 no permite afirmar que el sistema o el equipo estén certificados.
- **Calidad en uso parcial:** ISO/IEC 25019:2023 se aplica solo en lo que se puede medir con la muestra disponible (tareas completadas, SUS y ahorro de tiempo).
- **Cumplimiento legal:** el proyecto no es una auditoría de cumplimiento de la Ley N.° 29733; demuestra controles técnicos alineados con sus principios. No se inscribe un banco de datos ante la ANPD porque no se tratan datos reales.
- **Ediciones:** se revisan antes de la entrega final, porque ISO marcó ISO/IEC 25023:2016 para revisión.
- **Pruebas de seguridad:** OWASP ZAP y las pruebas de carga se ejecutan **solo contra el despliegue propio** y con carga baja.

## 4.5 Referencias

| Autor / organismo | Título | Edición / año | URL / editorial | Fecha de consulta |
|---|---|---|---|---|
| ISO/IEC | Systems and software engineering — SQuaRE — Product quality model (ISO/IEC 25010) | 2023 | https://www.iso.org/standard/78176.html | 18/11/2026 |
| ISO/IEC | Systems and software engineering — SQuaRE — Quality-in-use model (ISO/IEC 25019) | 2023 | https://webstore.iec.ch/en/publication/90105 | 18/11/2026 |
| ISO/IEC | Systems and software engineering — SQuaRE — Guide to SQuaRE (ISO/IEC 25000) | 2014 | https://www.iso.org/standard/64764.html | 18/11/2026 |
| ISO/IEC | Systems and software engineering — SQuaRE — Quality requirements framework (ISO/IEC 25030) | 2019 | https://www.iso.org/standard/72116.html | 18/11/2026 |
| ISO/IEC | Systems and software engineering — SQuaRE — Measurement of system and software product quality (ISO/IEC 25023) | 2016 | https://www.iso.org/standard/35747.html | 18/11/2026 |
| ISO/IEC | Systems and software engineering — SQuaRE — Quality evaluation framework (ISO/IEC 25040) | 2024 | https://cdn.standards.iteh.ai/samples/83467/6f61102971184ae6a08ae4f28d431d08/ISO-IEC-25040-2024.pdf (vista previa) | 18/11/2026 |
| ISO/IEC | Information security, cybersecurity and privacy protection — Information security management systems — Requirements (ISO/IEC 27001) | 2022 | https://www.iso.org/standard/27001 | 18/11/2026 |
| ISO | Quality management systems — Requirements (ISO 9001) | 2026 | https://www.iso.org/standard/9001 | 18/11/2026 |
| Congreso de la República del Perú | Ley N.° 29733, Ley de Protección de Datos Personales | 2011 | https://www.smv.gob.pe/Uploads/Ley_29733_vigente_2025.pdf | 18/11/2026 |
| Ministerio de Justicia y Derechos Humanos | Decreto Supremo N.° 016-2024-JUS, Reglamento de la Ley N.° 29733 | 2024 (vigente desde 31/03/2025) | https://www.gob.pe/institucion/anpd/campañas/128319-nuevo-reglamento-de-proteccion-de-datos-personales | 18/11/2026 |
| OWASP Foundation | OWASP Top 10 | 2025 | https://owasp.org/Top10/2025/ | 18/11/2026 |
| OWASP Foundation | Application Security Verification Standard (ASVS) | 5.0.0 (2025) | https://asvs.owasp.org/ | 18/11/2026 |
| W3C | Web Content Accessibility Guidelines (WCAG) | 2.2 (2023) | https://www.w3.org/TR/WCAG22/ | 18/11/2026 |
| IETF | RFC 9110 HTTP Semantics; RFC 8446 TLS 1.3 | 2022; 2018 | https://www.rfc-editor.org/ | 18/11/2026 |
| Cortez Camacho, J. R. | Material de clase S01–S11, Calidad de Software y Sistemas | 2026 | IESTP Gilda Liliana Ballivián Rosado | 18/11/2026 |
