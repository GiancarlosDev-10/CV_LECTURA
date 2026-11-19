# E01. Documento de identificación y diagnóstico del sistema

> **Plantilla:** Formatos 01 · **Estado:** borrador v0.1 (18/11/2026) · **Fuente de verdad:** este archivo; el .docx se genera desde aquí.

| Campo | Valor |
|---|---|
| Código del entregable | E01 |
| Nombre del sistema | CV Lectura — Sistema web de RRHH con lectura automática de CVs |
| Versión evaluada | Versión desplegada en producción al momento de cada medición (se registra el commit de Git en cada evidencia). Borrador redactado sobre el commit `c6312bc` (18/11/2026) |
| Equipo responsable | Giancarlos Ormeño (desarrollo, calidad y pruebas); Raquel Montes, Hermy Salcedo, Nancy Vilcas y Paul Carretero (pruebas manuales y usuarios de prueba) |
| Fecha | 18/11/2026 |
| Organización / contexto | Proyecto final de la unidad didáctica Calidad de Software y Sistemas, VI ciclo, IESTP Gilda Liliana Ballivián Rosado. Caso de uso: área de Recursos Humanos de una organización que recibe postulaciones a sus ofertas de empleo |

## 1.1 Resumen del sistema

CV Lectura es un sistema web que apoya la selección de personal. Un reclutador publica una oferta de empleo con sus requisitos (habilidades obligatorias y deseables, años de experiencia, nivel educativo e idiomas) y los pesos de cada criterio. El postulante se registra, acepta el consentimiento de tratamiento de datos y sube su CV en PDF a esa oferta.

El sistema lee el PDF, extrae los datos con un modelo de inteligencia artificial (OpenAI), valida la respuesta y calcula un puntaje con una fórmula fija y transparente. Con esos puntajes arma el ranking de la oferta, que el reclutador revisa con el desglose por criterio antes de tomar su decisión.

Está dirigido a dos tipos de usuario: **reclutadores**, que necesitan revisar muchos CVs en poco tiempo, y **postulantes**, que necesitan postular de forma sencilla y con sus datos protegidos.

## 1.2 Problema o necesidad que atiende

La revisión manual de CVs consume muchas horas: cada CV tiene un formato distinto y el reclutador debe leerlo completo para encontrar habilidades, experiencia, estudios e idiomas, y luego compararlo con los requisitos de la oferta. Cuando llegan decenas de postulaciones, la comparación se vuelve lenta y poco uniforme.

Además, los CVs contienen datos personales (nombre, correo, teléfono, historial laboral) que están protegidos por la **Ley N.° 29733, Ley de Protección de Datos Personales**, y su Reglamento. Cualquier sistema que los procese debe pedir consentimiento, limitar el acceso y permitir que el titular elimine sus datos.

El sistema busca **reducir las horas de revisión manual** (propuesta de valor del enunciado) sin quitarle al reclutador la decisión final y protegiendo los datos del postulante.

## 1.3 Objetivos y alcance

**Objetivo general del sistema:**
Reducir el tiempo que un reclutador dedica a revisar CVs, mediante la extracción automática de sus datos y un ranking por oferta con puntaje explicable, protegiendo los datos personales de los postulantes conforme a la Ley N.° 29733.

**Alcance funcional (módulos y procesos incluidos):**

- **M1. Autenticación y roles:** ingreso de reclutadores; registro e ingreso de postulantes; control de acceso por rol.
- **M2. Ofertas:** crear, editar y cerrar ofertas con requisitos y pesos que suman 100.
- **M3. Postulación:** subida de un CV en PDF (máximo 5 MB, validación del tipo real del archivo) con consentimiento obligatorio y versionado.
- **M4. Extracción con IA:** PDF → texto → OpenAI con salida estructurada → validación del formato → estado de la postulación.
- **M5. Puntaje y ranking:** fórmula determinista, ranking con desglose por criterio, advertencia de que el puntaje es apoyo y no decisión, y registro de la decisión del reclutador.
- **M6. Privacidad:** "Eliminar mis datos" (PDF, texto y extracción) y registro de cada vista de un CV.

**Fuera de alcance (no se evalúan):**

- Panel de administrador. Su única función sería dar de alta a los reclutadores, y eso se resuelve con un script de carga (*seed*); los derechos de supresión los ejerce el propio postulante desde M6.
- Lectura de PDFs escaneados (OCR): se rechazan con un mensaje claro, como caso negativo.
- CVs en Word, envío de correos, agenda de entrevistas y banco de talento.
- Modo oscuro.

## 1.4 Usuarios y roles

| Tipo de usuario / rol | Necesidades principales | Funciones y permisos | Importancia para la evaluación |
|---|---|---|---|
| Reclutador | Revisar muchas postulaciones en poco tiempo y comparar candidatos con criterios uniformes | Crear, editar y cerrar **sus** ofertas; ver ranking, desglose, CV y decisión **solo de sus ofertas**. Alta mediante *seed* | Alta: es quien usa el ranking y quien se beneficia del ahorro de tiempo (RQ-VAL-01) |
| Postulante | Postular de forma simple, saber en qué estado está su postulación y que sus datos estén protegidos | Ver ofertas abiertas; postular con consentimiento; ver sus postulaciones; eliminar sus datos. Registro propio | Alta: es el titular de los datos personales; la seguridad y la privacidad se evalúan desde su lado |
| Servicio de IA (OpenAI) | — (actor externo) | Recibe el texto del CV y devuelve los datos extraídos; no calcula el puntaje | Media: su respuesta determina la exactitud de la extracción (RQ-FUN-01/02) y su falla debe ser controlada (RQ-FIA-01) |
| Administrador | — | **Fuera de alcance** (ver 1.3) | No se evalúa |

## 1.5 Arquitectura y entorno tecnológico conocido

| Componente | Tecnología / versión | Función | Observaciones |
|---|---|---|---|
| Aplicación web y API | Next.js 16.4.6 (App Router), React 19.3.0, TypeScript 5 | Interfaz, acciones del servidor y rutas de API | Un solo lenguaje para todo el sistema |
| Base de datos, autenticación y archivos | Supabase (PostgreSQL, Auth, Storage) con políticas RLS; región São Paulo | Datos de ofertas y postulaciones, sesiones, almacenamiento privado de los PDF | Dos proyectos: `cv-lectura-dev` (desarrollo) y `cv-lectura-prod` (entorno evaluado) |
| Lectura de PDF | unpdf 2.1 | Convierte el PDF a texto | Determinista; se prueba sin IA |
| Extracción con IA | OpenAI (SDK 7.57), modelo *mini* con salida estructurada y temperatura 0; Zod 4.6 para validar | Extrae datos del CV a JSON | La versión exacta del modelo se fija antes de medir y se registra en E07. Mientras tanto se usa un extractor simulado |
| Despliegue | Vercel, región `gru1` (São Paulo); despliegue automático desde la rama `main` | Publica el sistema en https://cv-lectura.vercel.app | Entorno donde se hacen todas las mediciones oficiales |
| Arquitectura del código | Hexagonal (puertos y adaptadores) con capas de dominio, aplicación e infraestructura | Separa la lógica del puntaje de Next.js, Supabase y OpenAI | La regla de dependencias entre capas se controla con ESLint |
| Gestión y CI | GitHub, GitHub Actions, Trello | Control de versiones, integración continua (lint, tipos, pruebas) y cronograma | Repositorio público: https://github.com/GiancarlosDev-10/CV_LECTURA |

**Diferencia con la propuesta del enunciado.** El enunciado sugiere Next.js, FastAPI (Python), OpenAI, PostgreSQL, Vercel y Render. Se mantienen Next.js, OpenAI, PostgreSQL y Vercel. FastAPI y Render se reemplazan por las rutas de servidor de Next.js para tener un solo lenguaje, una sola cadena de pruebas y un solo despliegue, lo que reduce los puntos de falla que habría que evaluar. La librería MarkItDown queda como posible acción de mejora si la exactitud de la extracción no alcanza su meta.

## 1.6 Inventario de módulos y funcionalidades

| ID | Módulo | Funcionalidad | Descripción | Prioridad / criticidad |
|---|---|---|---|---|
| F01 | M1 Autenticación | Registro e ingreso | El postulante se registra; ambos roles ingresan con correo y contraseña | Alta |
| F02 | M1 Autenticación | Control por rol | Cada rol solo ve sus pantallas; las políticas RLS impiden leer datos ajenos aunque se manipule la URL | Crítica |
| F03 | M2 Ofertas | Gestión de ofertas | Crear, editar y cerrar ofertas con requisitos y pesos que suman 100 | Alta |
| F04 | M3 Postulación | Subir CV con consentimiento | PDF de hasta 5 MB, verificación de la firma real del archivo y consentimiento versionado obligatorio | Crítica |
| F05 | M4 Extracción | Extraer datos del CV | PDF → texto → IA → validación; si falla, la postulación queda en "pendiente de revisión manual" | Crítica |
| F06 | M5 Puntaje | Calcular puntaje | Fórmula determinista con tabla de alias; la IA no puntúa | Crítica |
| F07 | M5 Ranking | Ranking con desglose | Lista ordenada por oferta, desglose por criterio y advertencia de apoyo a la decisión | Alta |
| F08 | M5 Ranking | Decisión del reclutador | El reclutador registra su decisión con nota; no puede modificar el puntaje ni el estado | Media |
| F09 | M6 Privacidad | Eliminar mis datos | Borra el PDF, el texto y la extracción del postulante | Crítica |
| F10 | M6 Privacidad | Registro de vistas | Cada vez que un reclutador abre un CV queda registrado | Alta |

## 1.7 Diagnóstico inicial

**Fortalezas:**

- El puntaje no depende de la IA: se calcula con una fórmula fija, conocida y probada con pruebas unitarias, y el reclutador ve el desglose.
- La seguridad tiene dos barreras: el control por rol en la aplicación y las políticas RLS en la base de datos, verificadas con pruebas de integración contra la base real.
- Si la IA falla, el sistema no asigna puntaje 0: deja la postulación en revisión manual (falla segura).
- Hay integración continua desde el primer día (lint, tipos y pruebas en cada cambio).

**Dificultades y riesgos conocidos:**

- **Variabilidad de la IA:** el mismo CV puede extraerse distinto en dos corridas. Por eso la extracción se mide 3 veces.
- **Formatos de CV muy variados** (dos columnas, tablas, inglés): pueden bajar la exactitud.
- **PDFs escaneados:** no tienen texto y se rechazan; es una limitación declarada.
- **Inyección de instrucciones:** un CV podría incluir texto oculto que intente manipular a la IA.
- **Sesgo y efecto sobre las personas (riesgo ético):** un ranking automático influye en el acceso de una persona a un empleo. Se mitiga con la fórmula transparente, la advertencia en pantalla y la decisión humana final.
- **Flujo transfronterizo de datos:** la base de datos está en São Paulo (Brasil); se informa en el consentimiento y solo se usan datos ficticios.
- **Equipo:** una sola persona desarrolla; los demás integrantes participan en pruebas manuales y de usabilidad.
- **Plataformas gestionadas** (Vercel, Supabase): no se tiene acceso a métricas de infraestructura; el arranque en frío de Vercel puede afectar los tiempos.

**Aspectos que requieren evaluación:** exactitud de la extracción, tiempo de procesamiento por CV, protección de datos personales (acceso, consentimiento, eliminación, registro), tolerancia a fallos de la IA, disponibilidad y facilidad de uso.

## 1.8 Conclusión del diagnóstico

Es necesario evaluar la calidad del sistema porque sus resultados afectan a personas: un dato mal extraído o un acceso indebido perjudica directamente a un postulante, y un sistema lento o difícil no reduciría las horas de revisión que justifican su existencia.

Se priorizan los tres aspectos que pide el enunciado: **porcentaje de datos extraídos correctamente, protección de datos personales y tiempo por CV**. Por eso Adecuación funcional, Eficiencia del desempeño y Seguridad se evalúan a fondo; Fiabilidad, Mantenibilidad y Capacidad de interacción con profundidad media; y Flexibilidad, Compatibilidad y Seguridad operacional con profundidad mínima (detalle en E02 y E03).
