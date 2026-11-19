# PLAN DEL PROYECTO — Sistema de RRHH con lectura automática de CVs

> **Estado:** v1.0 — APROBADO el 13/11/2026.
> **Repositorio:** https://github.com/GiancarlosDev-10/CV_LECTURA (público; `docs/curso/` excluido por `.gitignore`)
> **Curso:** Calidad de Software y Sistemas, VI ciclo. IESTP Gilda Liliana Ballivián Rosado. Docente: José Ricardo Cortez Camacho.
> **Entrega del expediente:** 11/12/2026. **Sustentación:** 18/12/2026.

---

## 1. Contexto y reglas del proyecto

### 1.1 Fuentes
| Fuente | Uso |
|---|---|
| Enunciado (proyecto N.° 1) | Nombre, propuesta de valor ("reduce las horas de revisión manual de CVs"), qué evaluar (% de datos extraídos, protección de datos personales, tiempo por CV). El stack que trae es solo una propuesta. |
| [Matriz_Entregables…docx](curso/Matriz_Entregables_Proyecto_Final_Calidad_Software.docx) | **Manda la numeración E01–E14** y la rúbrica de 20 puntos. |
| [Formatos_Entregables…docx](curso/Formatos_Entregables_Proyecto_Final_Calidad_Software.docx) | Son **solo plantillas** de contenido (ver la equivalencia en §14). |
| Clases S01–S11 (`D:\GILDA BALLIVIAN\VI CICLO\CALIDAD DE SOFTWARE`) | Terminología, cadena de evaluación, ejemplos de metas, gestión, ITIL/COBIT, procesos, CMMI y PHVA. |

### 1.2 Reglas del docente (obligatorias)
1. **No inventar datos, mediciones ni resultados.** Cada cifra sale de una ejecución real con evidencia (EV-xxx).
2. Si un criterio no aplica, se escribe **"No aplica" con su motivo**.
3. Coherencia entre requisitos, criterios, pruebas, métricas y resultados (trazabilidad, §12).
4. Las normas se citan con **edición y fuente verificada**.
5. Un % de pruebas aprobadas **no es** un % de "calidad total" (S09). No se da una nota global sin explicar el método.

### 1.3 Modelo de referencia
**ISO/IEC 25010:2023**, que es la edición que usa el docente (S09), con su terminología en español. La calidad en uso pasó a **ISO/IEC 25019:2023** (tres características: beneficio —que incluye la usabilidad—, ausencia de riesgo y aceptabilidad) y se trata como **referencia parcial** mediante la prueba de tareas y el SUS.

Familia SQuaRE que se citará: **25000** (guía), **25010** (modelo), **25019** (calidad en uso), **25023** (medidas de calidad del producto), **25030** (requisitos de calidad) y **25040** (proceso de evaluación).

### 1.4 Rúbrica (20 puntos) y dónde se gana cada criterio
| Criterio | Pts | Entregables que lo sostienen |
|---|---|---|
| Identificación y diagnóstico | 2 | E01 |
| Características y modelos | 2 | E02, E03 |
| Normas ISO y SQuaRE | 3 | E04, E05 (+ referencias 25023/25030/25040 en E06 y E11) |
| Planificación y gestión | 2 | E06 |
| **Diseño y ejecución de pruebas** | **4** | E07, E08, E09, E10 |
| **Métricas e indicadores** | **3** | E11 |
| Resultados y mejora | 2 | E12, E13 |
| Expediente y sustentación | 2 | E14 + anexos |

---

## 2. Equipo, roles y cronograma

### 2.1 Equipo (5 integrantes)
Los nombres figuran en el encabezado de cada entregable.

| Integrante | Rol en el proyecto | Participación verificable |
|---|---|---|
| Integrante 1: Giancarlos Ormeño | Desarrollador, responsable de calidad y analista de pruebas | Todo el desarrollo, pruebas automatizadas, mediciones y redacción |
| Integrantes 2–5: Raquel Montes, Hermy Salcedo, Nancy Vilcas y Paul Carretero | Ejecutores de pruebas manuales y usuarios de prueba | Cada uno: **4–6 CP manuales con sus propias capturas**, **1 CV hecho a mano** con su respuesta esperada, **prueba de tareas + SUS** y **revisión manual cronometrada** (RQ-VAL-01) |

Todos exponen en la sustentación: cada integrante explica lo que ejecutó.

### 2.2 Cronograma
| Semana | Fechas | Desarrollo | Expediente |
|---|---|---|---|
| 1 | 13/11 – 20/11 | Repo, CI, Supabase dev. **Prueba de concepto día 1 en local** (un PDF llega a JSON contra Supabase dev). Dominio y puntaje con pruebas. M1 autenticación, M2 ofertas | E01, E02, E03, E04 (borradores) |
| 2 | 20/11 – 27/11 | M3 postulación, M4 extracción, M5 ranking, M6 privacidad. **Despliegue a Vercel + Supabase prod a más tardar el 24/11**. Generación del dataset. Inicio del monitoreo de disponibilidad | E05 **(umbrales congelados el 27/11, etiqueta `umbrales-v1.0`)**, E06, E07, E08 |
| 3 | 27/11 – 04/12 | Ejecución: automatizadas, manuales del equipo, ZAP, k6, 3 corridas de extracción, prueba de usabilidad y revisión manual cronometrada | E09, E10, E11 (primera medición) |
| 4 | 04/12 – 09/12 | Acciones de mejora (AM) y **segunda medición** | E12, E13 (antes y después) |
| — | 09/12 – 11/12 | Congelamiento del código | E14, anexos A/B/C, revisión final, **entrega el 11/12** |
| — | 11/12 – 18/12 | — | Diapositivas, ensayo, guion por integrante, **sustentación el 18/12** |

> Quedan por dictarse los temas 7 (pruebas), 8 (métricas) y 9 (plan de calidad). Después de cada clase **se revisa este plan** para alinear la terminología del docente.

---

## 3. El sistema

### 3.1 Modelo de producto
**Postulación a oferta** (tipo LinkedIn Jobs o Bumeran): el reclutador publica una oferta, el postulante postula a esa oferta subiendo su CV en PDF, y el sistema extrae los datos, calcula el puntaje y ordena el ranking de **esa** oferta. Hay **un CV por postulación**, y el consentimiento queda ligado a la oferta (principio de finalidad, Ley 29733).

### 3.2 Roles
| Rol | Alta | Puede |
|---|---|---|
| Reclutador | Por *seed* (script) | Crear, editar (solo mientras no tenga postulaciones) y cerrar **sus** ofertas; ver ranking, desglose y CV **solo de sus ofertas** |
| Postulante | Registro propio | Ver ofertas abiertas, postular con consentimiento, ver sus postulaciones, **eliminar sus datos (ARCO)** |

**Administrador: fuera de alcance.** Su función (alta de reclutadores) se resuelve con el *seed*, y los derechos ARCO los ejerce el propio postulante. Se justifica en E01.

### 3.3 Módulos del MVP
| ID | Módulo | Alcance |
|---|---|---|
| M1 | Autenticación y roles | Login de reclutador, registro y login de postulante, control por rol |
| M2 | Ofertas | Habilidades obligatorias y deseables, años de experiencia, nivel educativo, idiomas (MCER) y **pesos** que suman 100 |
| M3 | Postulación | PDF de máximo 5 MB, validación de tipo real, **consentimiento obligatorio** versionado |
| M4 | Extracción con IA | PDF → texto (unpdf) → OpenAI con salida estructurada → validación Zod → estado |
| M5 | Puntaje y ranking | Fórmula determinista (§6), ranking con desglose y **advertencia** de apoyo a la decisión |
| M6 | Privacidad | Eliminar mis datos (PDF, texto y extracción) y registro de cada vista de CV |

**Fuera de alcance:** OCR de PDFs escaneados (se **rechazan** con mensaje claro, como caso negativo), CVs en Word, emails, entrevistas, panel de administración, banco de talento (mejora futura en E13).

### 3.4 Estados de una postulación
`recibida → procesando → procesada` | `→ pendiente_revision_manual`, cuando la extracción falla: **nunca se asigna puntaje 0** (falla segura).

---

## 4. Stack (solo TypeScript)

| Capa | Elección | Por qué (probar y medir) |
|---|---|---|
| Web y API | **Next.js 16 (App Router) + TypeScript** en **Vercel** | Un solo lenguaje y una sola cadena de pruebas |
| Datos, autenticación y archivos | **Supabase** (PostgreSQL + Auth + Storage + **RLS**), región **São Paulo**, en una cuenta nueva dedicada al proyecto con **2 proyectos: `cv-lectura-dev`** (desarrollo + CI) **y `cv-lectura-prod`** (entorno evaluado) | RLS como segunda barrera de seguridad. Marcas de tiempo consultables por SQL |
| Entorno de desarrollo | **Next.js local + Supabase dev en la nube** (sin Docker). Migraciones con `npx supabase` (versionadas en el repo). `npm run seed` reinicia los datos de prueba. Confirmación de email **desactivada en dev** | Entorno de pruebas reproducible sin instalar Docker ni WSL. Si hay que recrear la BD, migraciones + seed la levantan en minutos |
| Acceso a datos | `supabase-js` con tipos generados (**sin Prisma**, porque se saltaría la RLS) | — |
| PDF → texto | **unpdf** | Determinista, se prueba aparte del LLM |
| IA | **OpenAI** (modelo *mini*, versión exacta fijada, temperatura 0) + **Zod** | Salida validada; fallos registrados |
| Subida del PDF | **Directa del navegador a Supabase Storage** (bucket privado: RLS por carpeta del postulante, solo `application/pdf`, máx. 5 MB). El servidor luego verifica la **firma real** `%PDF-` antes de registrar la postulación | Evita el límite de ~4,5 MB por petición de Vercel y el de 1 MB de las Server Actions; tres capas de validación verificables por separado |
| Procesamiento | Asíncrono con `after()` de Next.js y marcas de tiempo en BD | Tiempo por CV medido desde la BD |
| Pruebas | Vitest + cobertura, Playwright (4 navegadores), k6, OWASP ZAP, ESLint, SonarQube Community | Cada herramienta genera un reporte que sirve de evidencia |
| Gestión | GitHub, **GitHub Actions**, **Trello** | Historial, CI y cumplimiento de plazos |
| Monitoreo | UptimeRobot (o similar, gratuito) | Disponibilidad (RQ-FIA-02) |

### 4.0 Entornos
| Entorno | App | Supabase | Uso |
|---|---|---|---|
| Dev | `npm run dev` (local) | `cv-lectura-dev` (`qbymvaranqjoduwmlyqg`, São Paulo) | Desarrollo y pruebas automatizadas |
| **Prod (evaluado)** | **https://cv-lectura.vercel.app** (Vercel, región `gru1` São Paulo; despliegue automático desde `main`) | `cv-lectura-prod` (`bgisdgiwgnetntasvctf`, São Paulo) | **Todas las mediciones oficiales** |

- Prod creado por CLI el 15/11/2026; migraciones idénticas a dev (incluido el refuerzo explícito de privilegios). Las 20 pruebas de integración pasan contra prod.
- Las cuentas de prueba de prod usan una **contraseña privada** (no la publicada para dev).

### 4.1 Diseño visual
Decidido con la muestra comparativa [docs/diseno/propuesta-visual.html](diseno/propuesta-visual.html).

| Elemento | Decisión |
|---|---|
| Tipografía | **Geist** (texto y títulos) y Geist Mono, con `next/font`; números tabulares en puntajes |
| Paleta | **Índigo**: primario `#4338CA` (7,90:1, AAA), acento `#0E7490`, neutros *slate* |
| Semánticos | éxito `#15803D`, aviso `#B45309`, error `#B91C1C`, información `#1D4ED8` (todos ≥ 5:1, AA) |
| Puntaje | Escala de **un solo color** (alto ≥ 80, medio 50–79, bajo < 50) **siempre con el número** (WCAG 1.4.1). Los puntajes bajos no van en rojo; el rojo se reserva para errores del sistema |
| Modo oscuro | Fuera de alcance (mejora futura en E13) |
| Tokens | `src/app/globals.css` (`@theme` de Tailwind v4) |

**Diferencia con el enunciado** (se justifica en E01): se mantienen Next.js, OpenAI, PostgreSQL y Vercel. **FastAPI (Python) y Render se reemplazan** por Route Handlers de Next.js para tener un solo lenguaje, una sola cadena de pruebas y un solo despliegue. **MarkItDown** queda como candidata de acción de mejora (AM) si la medición de extracción no alcanza el umbral.

OpenAI se compra **recién al medir**. Hasta entonces se usa `ExtractorCvSimulado`.

---

## 5. Arquitectura

**Arquitectura hexagonal (puertos y adaptadores), con el núcleo organizado en capas de dominio y aplicación según los principios de Clean Architecture**, en versión pragmática: los puertos existen **solo hacia lo externo**, los casos de uso son funciones y hay un único archivo de composición.

```
src/
├── dominio/            ← TS puro: sin Next, Supabase ni OpenAI
│   ├── entidades/          Oferta, Postulacion, CvExtraido
│   ├── puntaje/            calcularPuntaje(), tablaAlias, nivelesMcer
│   └── puertos/            ExtractorCv, LectorPdf, RepositorioPostulaciones, AlmacenArchivos
├── aplicacion/         ← casos de uso (solo dependen de dominio/)
│   ├── postularAOferta.ts
│   ├── procesarCv.ts
│   ├── generarRanking.ts
│   └── eliminarMisDatos.ts
├── infraestructura/    ← adaptadores que implementan los puertos
│   ├── openai/             ExtractorCvOpenAi + ExtractorCvSimulado
│   ├── pdf/                LectorPdfUnpdf
│   └── supabase/           repositorios, almacén de archivos, registro de accesos
├── composicion.ts      ← arma las dependencias a mano
└── app/                ← presentación (Next.js; el nombre lo exige el framework)
```

- **Regla de dependencias:** Presentación e Infraestructura → Aplicación → Dominio. Se controla con ESLint (`no-restricted-imports`) en el CI (RQ-MAN-03).
- **Pruebas por capa:** dominio con unitarias puras; aplicación con dobles simulados; infraestructura con integración contra Supabase de prueba; presentación con E2E.
- **Convención de nombres:** dominio en español (`calcularPuntaje`); los términos de librería quedan como los define la librería (`route.ts`, `page.tsx`).

---

## 6. Fórmula de puntaje (determinista, sin IA)

| Criterio | Peso por defecto | Cálculo |
|---|---|---|
| Habilidades obligatorias | 40 | cumplidas / requeridas × 40 |
| Habilidades deseables | 20 | cumplidas / deseables × 20 |
| Experiencia | 20 | mín(años del CV / años pedidos, 1) × 20 |
| Educación | 10 | 10 si alcanza el nivel; 5 si le falta un nivel; 0 si le faltan más |
| Idiomas | 10 | Proporción de idiomas que alcanzan el nivel MCER pedido × 10 |

- El reclutador puede ajustar los pesos (deben sumar 100).
- La coincidencia de habilidades se hace con una **tabla de alias** en código ("JS" = "JavaScript"). **La IA solo extrae; no puntúa.**
- Sin filtros eliminatorios. El ranking muestra el desglose por criterio.

---

## 7. Características ISO/IEC 25010:2023 evaluadas (9 de 9)

| Característica | Profundidad | Subcaracterísticas evaluadas | Subcaracterísticas excluidas (motivo) |
|---|---|---|---|
| Adecuación funcional | **A fondo** | Corrección, completitud | Pertinencia (se cubre de forma cualitativa en la prueba de tareas) |
| Eficiencia del desempeño | **A fondo** | Comportamiento temporal | Utilización de recursos y capacidad (plataforma gestionada, sin acceso a métricas de infraestructura) |
| Seguridad | **A fondo** | Confidencialidad, integridad, responsabilidad, autenticidad, resistencia (agregada en la edición 2023; se cubre con RQ-SEG-02 y RQ-SEG-06) | No repudio (no hay firma digital ni transacciones con valor legal) |
| Fiabilidad | Media | Tolerancia a fallos, disponibilidad | Ausencia de fallos y recuperación (sin operación prolongada; el respaldo lo da Supabase y no se prueba) |
| Mantenibilidad | Media | Capacidad de prueba, analizabilidad, modularidad | Reutilización y modificabilidad (modificabilidad: evidencia cualitativa con el diff de las AM) |
| Capacidad de interacción | Media | Capacidad de aprendizaje, operabilidad, protección contra errores del usuario | Inclusividad, compromiso, asistencia y autodescriptividad (sin muestra suficiente) |
| Flexibilidad | Mínima | Adaptabilidad (navegadores y móvil) | Escalabilidad, instalabilidad y reemplazabilidad (fuera del objetivo académico) |
| Compatibilidad | Mínima | Interoperabilidad (contratos JSON con OpenAI y Supabase) | Coexistencia (no convive con otros sistemas del cliente) |
| Seguridad operacional | Mínima, **interpretación argumentada** | Funcionamiento seguro ante fallos, advertencia de peligros | Restricción operacional, identificación de peligros, integración segura |

**Argumento de seguridad operacional:** un ranking automático afecta el acceso de una persona al empleo. Si el docente objeta esta interpretación, pasa a "No aplica" sin afectar el resto.

**Riesgo ético de sesgo de la IA:** se declara en E01 como riesgo, y se mitiga con la advertencia, la fórmula transparente y la decisión humana final.

---

## 8. Requisitos de calidad (24 RQ) — umbrales a congelar el 27/11

Formato del docente (S09): característica → subcaracterística → criterio → indicador → meta → método.

| RQ | Característica / subcaracterística | Criterio | Indicador | Meta | Método |
|---|---|---|---|---|---|
| RQ-FUN-01 | Adec. funcional / corrección | Los campos simples extraídos coinciden con la respuesta esperada (nombre, email, teléfono, años de experiencia, nivel educativo) | % de campos correctos | ≥ 90 % | Script comparador, 3 corridas |
| RQ-FUN-02 | Adec. funcional / corrección | Las listas (habilidades, idiomas) se extraen completas y sin inventar | F1 | ≥ 0,85 | Script comparador |
| RQ-FUN-03 | Adec. funcional / corrección | El puntaje coincide con el cálculo manual | % de casos correctos | 100 % | Unitarias Vitest |
| RQ-FUN-04 | Adec. funcional / completitud | Las funciones de M1–M6 superan sus CP | % de CP funcionales aprobados | 100 % | E2E + manuales |
| RQ-DES-01 | Desempeño / comport. temporal | Procesar un CV (subida → puntaje), en caliente | p95 | ≤ 15 s | Marcas de tiempo en BD |
| RQ-DES-02 | Desempeño / comport. temporal | Respuesta de páginas y API con 10 usuarios concurrentes | p95 / % de errores | ≤ 1,5 s / < 1 % | k6 |
| RQ-SEG-01 | Seguridad / confidencialidad y autenticidad | Ningún acceso indebido (otro reclutador, otro postulante, sin sesión, URL directa de archivo) | Accesos indebidos exitosos | 0 | CP de seguridad manuales y E2E |
| RQ-SEG-02 | Seguridad / integridad y confidencialidad | Sin vulnerabilidades altas en el despliegue | Alertas altas de ZAP | 0 | OWASP ZAP |
| RQ-SEG-03 | Seguridad / responsabilidad | Toda postulación registra el consentimiento (fecha y versión del texto) | % de postulaciones con consentimiento | 100 % | Consulta SQL + E2E |
| RQ-SEG-04 | Seguridad / confidencialidad | "Eliminar mis datos" borra el PDF, el texto y la extracción | % de eliminaciones completas | 100 % | Verificación en BD y Storage |
| RQ-SEG-05 | Seguridad / responsabilidad | Cada vista de un CV queda registrada | % de vistas registradas | 100 % | E2E + consulta SQL |
| RQ-SEG-06 | Seguridad / integridad | Un CV con inyección de instrucciones no altera el resultado | Campos inventados / diferencia de puntaje frente al CV limpio | 0 / ≤ 0 | CP manual (2 CVs) |
| RQ-FIA-01 | Fiabilidad / tolerancia a fallos | Fallos de la IA (timeout, JSON inválido, error 500) terminan en estado controlado | % de fallos controlados / caídas | 100 % / 0 | Unitarias con `ExtractorCvSimulado` |
| RQ-FIA-02 | Fiabilidad / disponibilidad | El sistema está disponible durante el periodo de evaluación | % de tiempo disponible | ≥ 99 % | Monitor de disponibilidad |
| RQ-MAN-01 | Mantenibilidad / capacidad de prueba | El núcleo (dominio y aplicación) está cubierto por pruebas | % de cobertura de líneas | ≥ 80 % | Reporte de cobertura de Vitest |
| RQ-MAN-02 | Mantenibilidad / analizabilidad | Código sin problemas graves | Issues bloqueantes o críticos | 0 | SonarQube |
| RQ-MAN-03 | Mantenibilidad / modularidad | Se respeta la regla de dependencias entre capas | Violaciones | 0 | ESLint en el CI |
| RQ-INT-01 | Interacción / aprendizaje y operabilidad | Los usuarios completan 3 tareas sin ayuda | % de usuarios que completan | ≥ 90 % | Prueba de tareas |
| RQ-INT-02 | Interacción (y satisfacción, 25019) | Los usuarios perciben el sistema como usable | Puntaje SUS promedio | ≥ 68 | Cuestionario SUS |
| RQ-FLE-01 | Flexibilidad / adaptabilidad | Funciona en Chromium, Firefox, WebKit y vista móvil | % de E2E aprobados por navegador | 100 % | Playwright |
| RQ-COM-01 | Compatibilidad / interoperabilidad | Los datos intercambiados cumplen su contrato | % de respuestas válidas según Zod | ≥ 98 % (el resto se rechaza de forma controlada) | Registro de validación |
| RQ-SOP-01 | Seg. operacional / falla segura | Un CV fallido nunca recibe puntaje 0 | % en "pendiente de revisión manual" | 100 % | Unitarias + E2E |
| RQ-SOP-02 | Seg. operacional / advertencia | El ranking advierte que el puntaje es apoyo, no decisión | Aviso presente | Sí | CP manual |
| RQ-VAL-01 | Propuesta de valor (calidad en uso / eficiencia) | El sistema reduce el tiempo de revisión | % de reducción frente a la revisión manual de 10 CVs | ≥ 50 % | Cronómetro + registro del sistema |

> RQ-MAN-03 se agregó por la decisión de arquitectura (Q22). Por eso son 24 RQ y no 23.

---

## 9. Métricas (E11)

Hay una métrica por cada RQ con meta numérica (**M01–M23**, todos excepto RQ-SOP-02, que se verifica solo con su CP). Cada ficha incluye: nombre, característica y subcaracterística, propósito, **fórmula**, unidad, fuente, muestra, meta, resultado e interpretación con limitaciones. Además indica **la medida equivalente de ISO/IEC 25023**; el código exacto de cada medida se verifica contra el texto de la norma antes de citarlo.

Fórmulas principales:

| M | RQ | Fórmula |
|---|---|---|
| M01 | FUN-01 | campos correctos / campos evaluados × 100 (promedio de 3 corridas ± desviación) |
| M02 | FUN-02 | F1 = 2·P·R / (P+R); P = correctas/extraídas; R = correctas/esperadas |
| M03 | FUN-03 | casos con puntaje correcto / casos evaluados × 100 |
| M04 | FUN-04 | CP funcionales aprobados / CP funcionales ejecutados × 100 |
| M05 | DES-01 | percentil 95 de (fin_procesamiento − subida) |
| M06 | DES-02 | p95 de `http_req_duration` y tasa `http_req_failed` (k6) |
| M07 | SEG-01 | accesos indebidos exitosos / intentos × 100 |
| M12 | SEG-06 | campos inventados en los CVs con inyección; puntaje(inyectado) − puntaje(limpio) |
| M14 | FIA-02 | tiempo disponible / tiempo total del periodo × 100 |
| M15 | MAN-01 | líneas ejecutadas / líneas totales del núcleo × 100 |
| M19 | INT-02 | SUS = Σ ajustes por ítem × 2,5 (escala 0–100) |
| M23 | VAL-01 | (t_manual − t_sistema) / t_manual × 100 |

**Indicadores de proceso** (S11), para E06 y E12:

| P | Indicador | Fórmula | Fuente |
|---|---|---|---|
| P01 | Cumplimiento de actividades | actividades realizadas / planificadas × 100 | Trello |
| P02 | Cumplimiento de plazos | tareas a tiempo / tareas programadas × 100 | Trello |
| P03 | % de pruebas aprobadas | aprobadas / ejecutadas × 100 | E09 |
| P04 | Tasa de defectos | defectos / CP ejecutados | E10 |
| P05 | % de retrabajo | commits `fix:` / commits totales × 100 (aproximación declarada) | Git |

**Regla de medición:** la extracción se ejecuta **3 veces** sobre el dataset y se reporta el promedio con su variación (el LLM no es 100 % determinista).

---

## 10. Estrategia de pruebas (E07–E09)

| Tipo | Herramienta | Qué cubre |
|---|---|---|
| Unitarias | Vitest | Puntaje, alias, MCER, validación Zod, estados |
| Unitarias con IA simulada | Vitest + `ExtractorCvSimulado` | Tolerancia a fallos y falla segura (gratis y repetible) |
| Integración | Vitest + Supabase de prueba | Repositorios, RLS, almacén de archivos |
| E2E | Playwright (Chromium, Firefox, WebKit, móvil) | Flujos de M1–M6 y adaptabilidad |
| Exactitud de extracción | Script comparador | Dataset frente a respuesta esperada |
| Seguridad | Manual + OWASP ZAP | IDOR, sin sesión, URL directa, archivo falso, inyección de instrucciones |
| Desempeño | Marcas de tiempo en BD + k6 | Tiempo por CV y respuesta bajo carga |
| Usabilidad | Prueba de tareas + SUS | 3 tareas, con los 4 compañeros y 2–3 personas externas |
| Análisis estático | ESLint + SonarQube | Analizabilidad y modularidad |

**Formato de cada actividad** (S11): entrada, actividad, responsable, recursos, salida y control.

**Criterios de entrada:** despliegue estable, umbrales congelados (`umbrales-v1.0`), dataset listo.
**Criterios de salida:** todos los CP planificados ejecutados, defectos registrados, métricas calculadas.

---

## 11. Dataset de prueba (40 PDFs ficticios)

| Grupo | Cantidad | Propósito |
|---|---|---|
| Normales, generados desde JSON con plantillas variadas (una columna, dos columnas, con tablas, en español y en inglés) | 30 | Exactitud y tiempo |
| Hechos a mano por los integrantes 2–5 (Word o Canva) | 4 | Realismo y participación |
| Escaneados (imagen sin texto) | 2 | Rechazo controlado |
| Con inyección de instrucciones oculta | 2 | RQ-SEG-06 |
| Corrupto, o un ejecutable renombrado a `.pdf` | 1 | Validación del tipo real |
| De más de 5 MB | 1 | Límite de tamaño |

- **Primero se escribe la respuesta esperada (JSON)** y un script genera el PDF. Así siempre coinciden.
- Datos **claramente ficticios**: emails `@example.com`, teléfonos de prueba, nombres inventados. **Ningún dato personal real.**
- **3 ofertas** distintas para probar el ranking.

---

## 12. Trazabilidad y evidencias

```
RQ-xxx  →  CP-xxx  →  DEF-xxx  →  M-xx  →  AM-xx
  (E05)     (E08/E09)   (E10)      (E11)    (E13)
                └──── EV-xxx (evidencia) ────┘
```

- **Códigos:** RQ-ÁREA-NN, CP-NNN, DEF-NNN, Mxx, Pxx, AM-NN y EV-NNN.
- **Carpeta `evidencias/`:** capturas, reportes HTML de Vitest/Playwright/ZAP/k6, exportaciones de SQL y del CI. Todo se indexa en el **Anexo B**.
- **Defectos con el flujo ITIL** (S07): registro, clasificación (impacto × urgencia), asignación, resolución y cierre.

---

## 13. Gestión de la calidad (E06)

- **Planificación:** este plan + E05.
- **Aseguramiento (preventivo):** revisión de requisitos, ESLint, regla de dependencias, revisión de código antes de cada *merge* a `main` (autorrevisión con checklist, declarada como limitación), CI obligatorio.
- **Control (detectivo):** las pruebas del §10.
- **Documentación:** el expediente, `evidencias/` y el historial de Git.
- **Mejora:** **PDCA** por cada AM (planificar → hacer → **volver a medir** → estandarizar).
- **Congelamiento de umbrales:** E05 v1.0 aprobado el 27/11 con la etiqueta Git `umbrales-v1.0`. Todo cambio posterior pasa por **control de cambios** (sección 5.7 de la plantilla) y genera una nueva versión, sin editar en silencio.
- **Herramientas:** GitHub, **GitHub Actions** (se configura y explica paso a paso en la semana 1) y **Trello** (tablero con una tarjeta por entregable y tarea, con fecha límite).
- **Autoevaluación CMMI** del proceso del proyecto (S11), declarada en E06 o E12.

---

## 14. Entregables (numeración de la Matriz) y plantilla de origen

| Matriz | Entregable | Plantilla de Formatos que se usa | Clase base |
|---|---|---|---|
| E01 | Ficha de identificación y diagnóstico | Formatos 01 | S01, S08 |
| E02 | Matriz de características y dimensiones | Formatos 02 (2.1) ampliado con necesidades, matriz de características, matriz de dimensiones y exclusiones (contenido mínimo de la Matriz) | S02, S08 |
| E03 | Selección y aplicación del modelo | Formatos 02 (2.2–2.5): McCall, Boehm, FURPS y 25010:2023 | S03, S09 |
| E04 | Normas y estándares | Formatos 03 | S04, S05, S07 |
| E05 | Matriz de evaluación ISO/IEC 25010 | Formatos 04 (requisitos y criterios) + Formatos 06 (6.2–6.5: método y escala) | S09 + SQuaRE |
| E06 | Plan de gestión y aseguramiento | Formatos 05 + Formatos 06 (6.6: cronograma) | S06, S07, S11 |
| E07 | Plan de pruebas | Formatos 07 | Tema 7 (pendiente) |
| E08 | Casos de prueba | Formatos 08 | Tema 7 |
| E09 | Ejecución y evidencias | Formatos 09 | Tema 7 |
| E10 | Defectos e incidencias | Formatos 10 | Tema 7 + S07 |
| E11 | Métricas e indicadores | Formatos 11 | Tema 8 (pendiente) + S11 |
| E12 | Informe final de evaluación | Formatos 12 | Tema 9 (pendiente) |
| E13 | Acciones correctivas y mejora | Formatos 13 | S06 (PDCA), S11 |
| E14 | Informe ejecutivo y sustentación | Formatos 14 + anexos A, B y C | Todos |

### 14.1 Normas y referencias para E04
| Referencia | Tipo | Aplicación |
|---|---|---|
| ISO/IEC 25010:2023 | Norma (modelo) | Modelo de evaluación |
| ISO/IEC 25000:2014, 25019:2023, 25023:2016, 25030:2019, 25040:2024 | Normas SQuaRE | Calidad en uso, medidas, requisitos y proceso de evaluación |
| ISO/IEC 27001 | Norma (SGSI) | Referencia para controles (acceso, registro). **No se certifica** |
| ISO 9001:2026 (reemplaza a la 2015) | Norma (gestión) | Referencia de proceso y mejora continua |
| **Ley 29733 y su Reglamento** | **Ley (obligatoria)** | Consentimiento, finalidad, derechos ARCO, flujo transfronterizo (Supabase en São Paulo) |
| OWASP Top 10 / ASVS | Estándar de facto (comunidad) | Pruebas de seguridad y ZAP |
| W3C (HTML, WCAG) | Estándar web | Interfaz y accesibilidad básica |
| IETF (HTTP, TLS) | Estándar de Internet | Comunicación segura |
| ITIL / COBIT | Marcos de buenas prácticas | Gestión de defectos e incidentes, controles |
| CMMI / PHVA | Modelo de madurez / ciclo de mejora | Autoevaluación del proceso, AM |

---

## 15. Riesgos principales

| Riesgo | Prob. / impacto | Respuesta |
|---|---|---|
| Trabajo de una sola persona con 4 semanas | Alta / alto | MVP cerrado, CI desde el día 1, prueba de concepto el día 1 |
| Temas 7–9 todavía no dictados | Alta / medio | Revisar el plan después de cada clase |
| Variabilidad del LLM | Media / medio | Temperatura 0, versión fijada, 3 corridas |
| Costo de OpenAI | Baja / bajo | Desarrollo con el extractor simulado, compra solo para medir |
| Cold start de Vercel distorsiona el tiempo | Media / medio | Medir en frío y en caliente por separado y declararlo |
| Flujo transfronterizo de datos (Ley 29733) | Media / medio | Región São Paulo, aviso en el consentimiento, solo datos ficticios |
| Sesgo de la IA en el ranking | Media / alto (ético) | Fórmula transparente, advertencia, decisión humana |
| Integrantes no disponibles para sus CP | Media / medio | Fichas listas con anticipación; sesión conjunta de 1 hora |
| Mediciones hechas en local en vez del entorno evaluado | Media / alto | Toda medición oficial (tiempo por CV, k6, ZAP, disponibilidad) se hace **solo en prod**; local es solo para desarrollo y pruebas automatizadas |
| Suspensión o pérdida de la cuenta de Supabase | Baja / alto | Migraciones y seed en el repo: la BD se recrea en minutos en otro proyecto |
| Límite de emails del SMTP por defecto de Supabase | Alta / medio | Confirmación de email desactivada en dev (declarado en E07) |

---

## 16. Registro de decisiones

| # | Decisión |
|---|---|
| Q1 | La numeración de la Matriz manda; los Formatos son plantillas |
| Q2 | Dos roles (reclutador y postulante); administrador fuera de alcance |
| Q3/Q4 | 5 integrantes; el desarrollo lo hace una persona y los demás ejecutan CP manuales y exponen. Entrega el 11/12, sustentación el 18/12 |
| Q5 | MVP con M1–M6 |
| Q6/Q7/Q14 | Solo TypeScript: Next.js + Supabase en Vercel; sin Render ni FastAPI; ZAP y k6 desde la PC |
| Q8 | OpenAI, que se compra al medir |
| Q9/Q10 | Modelo de postulación a oferta, un CV por postulación |
| Q11 | ISO/IEC 25010:2023 |
| Q12 | Las 9 características, con 3 niveles de profundidad |
| Q15 | Fórmula de puntaje determinista con tabla de alias |
| Q16 | Dataset de 40 PDFs ficticios |
| Q17 | 24 RQ con la terminología del docente (incluye disponibilidad ≥ 99 %) |
| Q18 | Umbrales congelados antes de medir; 3 corridas de extracción |
| Q19 | Métricas de una en una por RQ, alineadas con ISO/IEC 25023 |
| Q20 | GitHub + GitHub Actions (con enseñanza paso a paso) + códigos EV |
| Q21 | Trello para la gestión del proceso |
| Q22 | Hexagonal + Clean Architecture pragmática, capas en español, carpeta `infraestructura/` |
| Q23 | Desarrollo local: Next.js en la PC + Supabase dev en la nube (sin Docker); migraciones y seed en el repo; despliegue a prod a más tardar el 24/11 |
| Q24 | Cuenta de Supabase nueva y dedicada al proyecto, con 2 proyectos (dev y prod) en São Paulo; no se pausan los proyectos existentes |
| Q25/Q26 (repo) | Repositorio público; `docs/curso/` excluido |
| Q26–Q29 (diseño) | Geist + paleta Índigo; puntaje con escala de un solo color más el número; solo modo claro |

---

## 17. Próximos pasos (después de aprobar este plan)

1. `git init`, repositorio en GitHub, primer CI con GitHub Actions (explicado paso a paso).
2. **Lo hace el usuario:** cuenta nueva de Supabase y proyectos `cv-lectura-dev` y `cv-lectura-prod` (São Paulo); pasar la URL y las claves de **dev** para `.env.local` (nunca se suben al repo).
3. Proyecto Next.js local + migraciones iniciales + `npm run seed`.
4. Tablero de Trello con el cronograma del §2.2.
5. **Prueba de concepto del día 1 (local):** un PDF llega a JSON contra Supabase dev (con el extractor simulado y, si ya hay saldo, también con OpenAI).
6. Dominio y puntaje con pruebas, en orden TDD.
7. Vercel + Supabase prod a más tardar el 24/11.

---

## 18. Expediente: dónde vive cada entregable

- Carpeta `docs/expediente/`. Cada entregable tiene un **`.md` (fuente de verdad, se edita aquí)** y su **`.docx` generado** con el formato de la plantilla (Carta, Arial, títulos azules, encabezados de tabla `D9EAF7`).
- Las notas que empiezan con `>` en el `.md` son guías internas y no pasan al `.docx`.
- Borradores v0.1 de E01–E04 redactados el 18/11/2026; pendientes de revisión del equipo sobre el Word.
- Borradores v0.1 de E05–E08 redactados el 18/11/2026. E05 fija las reglas de comparación de la extracción (5.5) y la escala de valoración (5.6); E08 tiene 52 CP (26 automatizados y 26 manuales, ya asignados a cada integrante).
