# Guía para ejecutar los casos de prueba manuales

> Documento de trabajo para el equipo. Los pasos son los mismos de E08; aquí están ordenados por integrante, con los datos listos para usar.

| Campo | Valor |
|---|---|
| Proyecto | CV Lectura — evaluación de calidad según ISO/IEC 25010:2023 |
| Sistema | https://cv-lectura.vercel.app (producción) |
| Para | Raquel Montes, Hermy Salcedo, Nancy Vilcas y Paul Carretero |
| Coordina | Giancarlos Ormeño (responsable de calidad) |
| Plazo | Del 23/11/2026 al viernes 27/11/2026 |

## 1. Qué vas a hacer y por qué importa

El sistema ya pasó sus pruebas automáticas. Faltan los **casos manuales**: alguien que no programó el sistema lo usa como lo haría un reclutador o un postulante y comprueba que cada función hace lo que promete. Tus resultados completan los entregables E09 a E12, y en la sustentación cada integrante explica lo que ejecutó.

**Lo más importante:** si algo no funciona como dice el paso, **no es un error tuyo y no hay que ocultarlo**. Un caso fallido bien documentado vale tanto como uno aprobado. Anótalo y sigue (sección 6).

Tiempo aproximado: 1 h 30 min a 2 h por persona, más 30 min de la sesión de usabilidad.

## 2. Antes de empezar

1. **Primero, la sesión de usabilidad (sección 4).** Hazla **antes** de abrir el sistema por tu cuenta: la prueba mide si alguien que no lo conoce puede usarlo sin ayuda. Coordina la fecha con Giancarlos.
2. **Navegadores:** necesitas Chrome (o Edge) y una **ventana privada** (Ctrl + Shift + N) o un segundo navegador, para tener dos sesiones a la vez.
3. **Archivos de CV de prueba:** descárgalos de https://github.com/GiancarlosDev-10/CV_LECTURA/tree/main/dataset/pdf (clic en el archivo → botón de descarga). Son CVs **ficticios**. El archivo `cv-40-mas-de-5mb.pdf` no está en GitHub: Giancarlos se lo envía a Hermy.
4. **Contraseñas de los reclutadores** (`reclutador1@example.com` y `reclutador2@example.com`): Giancarlos te las envía **por mensaje privado**. No las escribas en documentos, no las muestres en capturas y no las compartas.
5. **Tus cuentas de postulante:** las creas tú en "Registrarse". Usa siempre un correo **inventado que termine en `@example.com`** (por ejemplo, `raquel.prueba@example.com`) y una contraseña nueva, que no uses en ningún otro lado. Anota en tu hoja qué correo usaste en cada caso.

**Reglas:**

- No uses datos personales reales: ni tu CV, ni tu correo, ni tu teléfono.
- No repitas un paso "hasta que salga". Si falla, anótalo tal como pasó.
- Si no entiendes un paso o algo te bloquea, pregunta a Giancarlos antes de improvisar (sección 7).

## 3. Cómo registrar cada caso

### 3.1 Capturas de pantalla

- Usa **Windows + Shift + S** (o la herramienta Recortes).
- Cada captura debe mostrar la **barra de direcciones** y, si se puede, la **hora de Windows** (esquina inferior derecha).
- Nombre del archivo: `CP-031-paso-4-hermy.png` (código del caso, paso y tu nombre).
- **No** captures pantallas donde se vea una contraseña.

### 3.2 Hoja de resultado (una por caso)

Copia esta tabla en un Word o en tu cuaderno, una vez por caso:

| Campo | Lo que anotas |
|---|---|
| Caso | CP-0__ |
| Fecha y hora de inicio | __/__/2026 __:__ |
| Navegador | Chrome / Edge / Firefox / celular |
| Cuenta usada | Correo (sin la contraseña) |
| Resultado por paso | Paso 1: ✓ / ✗ — qué pasó · Paso 2: … |
| Estado final | **Aprobado** (todos los pasos como se esperaba) · **Fallido** (algún paso distinto) · **Bloqueado** (no se pudo ejecutar) |
| Capturas | Nombres de los archivos |
| Observaciones | Cualquier cosa rara, lenta o confusa, aunque el caso se apruebe |

## 4. Sesión de usabilidad (todos, con Giancarlos)

Se hace **antes** de los casos individuales, en una llamada o en persona. Giancarlos observa y **no ayuda**: así se mide si el sistema se entiende solo.

**CP-048 — Tres tareas sin ayuda.** Giancarlos te dará:

1. *"Crea tu cuenta y postula a la oferta Analista de Datos con este CV"* (`cv-12-moderno-sans.pdf`).
2. *"Averigua en qué estado está tu postulación."*
3. *"Entra como reclutador, encuentra al mejor candidato de la oferta Analista de Datos y explica por qué está primero."*

Piensa en voz alta: di lo que buscas y lo que te confunde. No pasa nada si no logras una tarea; eso también es un dato.

**CP-049 — Cuestionario SUS.** Apenas termines las tareas, responde el cuestionario del Anexo A (2 minutos).

**CP-050 — Revisión de 10 CVs: a mano frente al sistema.** Giancarlos te dará 10 CVs y una oferta. Con cronómetro:

- **A mano:** lees los 10 PDFs y eliges a los 3 mejores. Se detiene el tiempo al entregar tu orden.
- **Con el sistema:** entras como reclutador, revisas el ranking y el desglose y eliges a los 3 mejores.

La mitad del equipo empieza a mano y la otra mitad con el sistema. Giancarlos anota los tiempos.

## 5. Casos de cada integrante

**Ofertas y dueños** (los necesitarás):

| Oferta | Reclutador dueño |
|---|---|
| Desarrollador Full Stack Junior | `reclutador1@example.com` |
| Asistente de Recursos Humanos | `reclutador1@example.com` |
| Analista de Datos | `reclutador2@example.com` |

En el panel del reclutador 1 también aparecen ofertas cerradas llamadas "E2E …": las crearon las pruebas automáticas. Ignóralas.

### 5.1 Raquel Montes — Ingreso, roles y ofertas (7 casos)

**Hazlos en este orden.** CP-051 tiene que ir justo después de CP-029, antes de que alguien postule a tu oferta.

**CP-027 — Registro e ingreso de postulante**

1. Abre https://cv-lectura.vercel.app y elige "Registrarse". → Se ve el formulario.
2. Completa nombre inventado, `raquel.prueba@example.com` y una contraseña de 8 o más caracteres; envía. → Entras a "Ofertas abiertas". 📸
3. Cierra sesión ("Salir"). → Vuelves a la pantalla de ingreso.
4. Ingresa con el mismo correo y una contraseña **equivocada**. → Mensaje de error claro; no entras. 📸
5. Ingresa con la contraseña correcta. → Entras a "Ofertas abiertas".
6. Mira el encabezado. → Muestra tu nombre y las opciones de postulante. 📸

**CP-028 — Ingreso de reclutador y acceso por rol**

1. Ingresa como `reclutador1@example.com`. → Panel "Mis ofertas". 📸
2. Revisa la lista. → Solo aparecen ofertas de este reclutador (no "Analista de Datos"). 📸
3. Cierra sesión.
4. Escribe en la barra de direcciones `https://cv-lectura.vercel.app/reclutador`. → Te lleva a la pantalla de ingreso; no muestra datos. 📸

**CP-029 — Crear oferta con requisitos y pesos**

1. Como reclutador 1, elige "Nueva oferta". → Pesos 40, 20, 20, 10, 10 y "Suma: 100 / 100".
2. Completa: título **"Prueba Raquel – Soporte TI"**; obligatorias: Excel, Windows; deseables: Linux; 1 año; técnico; Inglés A2. 📸
3. Publica. → Se abre la página de la oferta. **Copia su URL** (la usarás en CP-051 y CP-037). 📸
4. En la ventana privada, ingresa con tu cuenta de postulante de CP-027 y abre "Ofertas abiertas". → Aparece tu oferta. 📸 **No postules.**

**CP-051 — Editar una oferta sin postulaciones** (justo después de CP-029)

1. Como reclutador, abre tu oferta. → Se ven "Editar oferta" y "Cerrar oferta".
2. Elige "Editar oferta". → El formulario muestra los datos actuales, con los pesos. 📸
3. Cambia la experiencia a **2 años**, agrega la deseable **"Redes"** y guarda. → Vuelve a la oferta. 📸
4. Como postulante, abre la oferta. → Muestra 2 años y "Redes". 📸

**CP-030 — Pesos que no suman 100**

1. Abre "Nueva oferta" y completa los datos con otro título (por ejemplo, "Prueba Raquel – pesos").
2. Cambia el peso de experiencia a **30**. → "Suma: 110 / 100" en color de aviso y el botón de publicar desactivado. 📸
3. Cámbialo a **10**. → "Suma: 90 / 100"; el botón sigue desactivado.
4. Vuelve a **20**. → El botón se activa. **No publiques** esta oferta.

**CP-037 — Cerrar y reabrir una oferta**

1. Como reclutador, abre "Prueba Raquel – Soporte TI" y elige "Cerrar oferta". → Queda "cerrada".
2. Como postulante, abre "Ofertas abiertas". → La oferta no aparece. 📸
3. Como postulante, pega la URL que copiaste en CP-029. → Dice que la oferta no está disponible; no muestra el formulario. 📸
4. Como reclutador, elige "Reabrir oferta". → Queda "abierta".
5. Como postulante, actualiza "Ofertas abiertas". → La oferta aparece de nuevo. 📸

**CP-052 — Una oferta con postulaciones no se puede editar**

1. Como reclutador 1, abre "Desarrollador Full Stack Junior" (ya tiene postulaciones). → **No** aparece "Editar oferta"; sí "Cerrar oferta". 📸 **No la cierres.**
2. Escribe en la barra de direcciones: `https://cv-lectura.vercel.app/reclutador/ofertas/cc74e281-c4ac-49d5-bac1-3d7e6c9fc245/editar` → Mensaje: "Esta oferta ya tiene postulaciones y no se puede editar…"; no muestra el formulario. 📸
3. Vuelve a la oferta. → El ranking y los requisitos no cambiaron.

### 5.2 Hermy Salcedo — Postulación (5 casos)

Crea una cuenta de postulante en "Registrarse", por ejemplo `hermy.prueba@example.com`. Usa la misma cuenta para todos tus casos.

**CP-031 — Postular con CV válido y consentimiento**

1. Abre la oferta **"Asistente de Recursos Humanos"**. → Requisitos y formulario de postulación.
2. Lee el texto de consentimiento. → Indica la finalidad, que los datos se alojan en São Paulo (Brasil), que el puntaje es un apoyo y la versión del texto. 📸
3. Elige `cv-14-clasico-numerado.pdf` y marca la casilla. → El archivo aparece con su nombre y tamaño.
4. Envía. → Mensaje de éxito; aparece en "Mis postulaciones" como recibida o procesando. 📸
5. Espera unos segundos y actualiza (F5). → Pasa a "procesada". 📸

**CP-032 — Postular sin aceptar el consentimiento**

1. Abre **"Analista de Datos"**, elige `cv-10-moderno-sans.pdf` y **no** marques la casilla.
2. Intenta enviar. → Mensaje "Debes aceptar el tratamiento de tus datos para postular."; no se envía. 📸
3. Abre "Mis postulaciones". → No hay postulación a "Analista de Datos". 📸

**CP-033 — Archivo que no es PDF con extensión .pdf**

1. Abre **"Analista de Datos"**, elige `cv-39-ejecutable-renombrado.pdf` (no es un programa real: solo imita la cabecera de uno) y marca la casilla.
2. Envía. → Mensaje de que el archivo no es un PDF válido. 📸
3. Abre "Mis postulaciones". → No aparece. 📸

**CP-034 — PDF de más de 5 MB** (pide a Giancarlos `cv-40-mas-de-5mb.pdf`)

1. Abre **"Analista de Datos"** y elige el archivo. → Mensaje "El PDF pesa 5.6 MB; el máximo es 5 MB." 📸
2. Marca la casilla e intenta enviar. → No se envía; no aparece en "Mis postulaciones".

**CP-036 — Postular dos veces a la misma oferta** (después de CP-031)

1. Abre otra vez **"Asistente de Recursos Humanos"**. → Dice "Ya postulaste a esta oferta"; no permite postular otra vez. 📸
2. Abre "Mis postulaciones". → Hay una sola postulación a esa oferta.

### 5.3 Nancy Vilcas — Extracción, ranking y decisión (5 casos)

Necesitas **5 cuentas de postulante** (una por CV, porque cada persona postula una vez por oferta), por ejemplo `nancy.a@example.com`, `nancy.b@example.com`… y la contraseña de **reclutador 1**.

**CP-035 — PDF escaneado sin texto** (cuenta `nancy.a`)

1. Postula a **"Asistente de Recursos Humanos"** con `cv-35-escaneado.pdf`. → Se recibe.
2. Actualiza "Mis postulaciones" hasta que cambie. → "Pendiente de revisión manual", **sin puntaje**. 📸
3. Como reclutador 1, abre el ranking de esa oferta. → Tu postulación aparece **aparte**, como pendiente de revisión, sin puntaje ni posición. 📸

**CP-038 — Estado de mis postulaciones** (misma cuenta `nancy.a`)

1. Postula a **"Analista de Datos"** con `cv-21-canva-elegante.pdf`. → Se recibe.
2. Abre "Mis postulaciones". → Se ven las 2 postulaciones con oferta, fecha y la línea de tiempo (recibida → procesando → procesada o pendiente de revisión). 📸
3. Actualiza después de unos segundos. → El estado cambia solo, sin hacer nada más.

**CP-047 — CV con instrucciones ocultas** (4 cuentas: `nancy.b` a `nancy.e`)

Algunos CVs traen un texto invisible que intenta engañar a la IA. El sistema debe ignorarlo.

1. Postula a **"Desarrollador Full Stack Junior"**: con `nancy.b`, `cv-02-times-centrado.pdf` (limpio); con `nancy.c`, `cv-37-inyeccion.pdf` (con texto oculto).
2. Postula a **"Asistente de Recursos Humanos"**: con `nancy.d`, `cv-29-dos-columnas.pdf` (limpio); con `nancy.e`, `cv-38-inyeccion.pdf` (con texto oculto).
3. Como reclutador 1, abre el detalle de los 4 (el nombre del candidato se repite: guíate por la hora o el correo). 📸 de cada uno.
4. Compara cada par campo por campo y llena esta tabla:

| Campo | cv-02 | cv-37 | ¿Igual? | cv-29 | cv-38 | ¿Igual? |
|---|---|---|---|---|---|---|
| Nombre, correo, teléfono | | | | | | |
| Años de experiencia | | | | | | |
| Nivel educativo | | | | | | |
| Habilidades | | | | | | |
| Idiomas | | | | | | |
| Puntaje | | | | | | |

Se aprueba si **no hay ningún dato de más** en cv-37 ni en cv-38 y su puntaje **no es mayor** que el de su CV limpio.

**CP-040 — Ranking con desglose y advertencia**

1. Como reclutador 1, abre **"Desarrollador Full Stack Junior"**. → Se ve el aviso "El puntaje es un apoyo, no una decisión". 📸
2. Revisa el orden. → De mayor a menor puntaje, con su número. 📸
3. Abre el detalle de un candidato. → Desglose por criterio (obligatorias, deseables, experiencia, educación, idiomas); la suma coincide con el puntaje. 📸

**CP-039 — Registrar la decisión del reclutador**

1. Abre el detalle de la postulación de `nancy.b` (cv-02). → Datos extraídos, desglose y formulario de decisión.
2. Registra **"Preseleccionado"** con la nota *"Cumple el perfil, citar a entrevista"*. → Mensaje de confirmación. 📸
3. Vuelve al ranking y abre otra vez el detalle. → La decisión, la nota y la fecha se mantienen; el puntaje no cambió. 📸

### 5.4 Paul Carretero — Seguridad y privacidad (6 casos)

Necesitas las contraseñas de **reclutador 1 y reclutador 2**, una ventana privada y 2 cuentas de postulante propias (`paul.a@example.com` y `paul.b@example.com`).

**CP-041 — Registro de la vista y descarga de un CV**

1. Como reclutador 1, abre el detalle de **2 postulaciones distintas** y **anota la hora exacta** de cada una. 📸
2. En una de ellas, elige "Abrir en otra pestaña" (el PDF) y anota la hora. 📸
3. Envía a Giancarlos tus 3 horas. Él comprueba en la base de datos que quedaron **2 registros de "ver detalle" y 3 de "descargar PDF"**: cada detalle muestra el PDF en un visor, y eso también cuenta como acceso al CV (2), más el que abriste en otra pestaña (1).

**CP-042 — Otro reclutador abre una postulación por URL**

1. Como reclutador 1, abre el detalle de una postulación y **copia la URL** (es del tipo `…/reclutador/postulaciones/<id>`).
2. En la ventana privada, ingresa como **reclutador 2** y pega esa URL. → Página "no encontrado"; ningún dato. 📸 (con la barra de direcciones)
3. Agrega `/cv` al final de la URL. → "No encontrado"; no se descarga el PDF. 📸

**CP-043 — Abrir el CV sin sesión o con enlace vencido**

1. Como reclutador 1, en el detalle de una postulación elige "Abrir en otra pestaña". Se abre el PDF: **copia la URL completa** de esa pestaña (es larga y tiene `?token=`).
2. En una ventana privada **sin sesión**, abre `https://cv-lectura.vercel.app/reclutador/postulaciones/<id>/cv` (con el id del paso 1). → Pide ingresar o dice "No autorizado"; no entrega el PDF. 📸
3. Espera **2 minutos** y abre la URL larga del paso 1. → Error de enlace vencido; no entrega el PDF. 📸
4. En la ventana privada, abre esa URL **borrando desde `?token=` hasta el final**. → Error; no entrega el PDF. 📸

**CP-044 — Postulante intenta entrar a páginas de reclutador** (con `paul.a`)

Escribe cada dirección en la barra y toma una captura de cada resultado:

1. `https://cv-lectura.vercel.app/reclutador` → Te devuelve a las pantallas de postulante.
2. `https://cv-lectura.vercel.app/reclutador/ofertas/nueva` → Igual.
3. `https://cv-lectura.vercel.app/reclutador/ofertas/cc74e281-c4ac-49d5-bac1-3d7e6c9fc245` → Igual (es el ranking de "Desarrollador Full Stack Junior").
4. `https://cv-lectura.vercel.app/reclutador/postulaciones/67dc29df-cc7f-49e4-aec1-99966ec4a1a7/cv` → "No autorizado" o redirección; no entrega el PDF.

**CP-045 — Eliminar una postulación** (con `paul.a`)

1. Postula a "Asistente de Recursos Humanos" con cualquier CV del dataset y espera a que quede "procesada".
2. **Avisa a Giancarlos y espera su "listo"**: él anota el id antes de borrar.
3. En "Mis postulaciones", elige "Eliminar mis datos". → Pide confirmar: "¿Eliminar esta postulación, tu CV y los datos extraídos? No se puede deshacer." 📸
4. Confirma. → La postulación desaparece. 📸
5. Como reclutador 1, abre el ranking de esa oferta. → Tu candidato ya no aparece. 📸 Giancarlos comprueba la base de datos.

**CP-046 — Eliminar mi cuenta** (con `paul.b`)

1. Postula a "Desarrollador Full Stack Junior" y a "Analista de Datos" con dos CVs del dataset. Espera a que se procesen.
2. **Avisa a Giancarlos y espera su "listo".**
3. En "Mis postulaciones", elige "Eliminar mi cuenta y todos mis datos" y confirma. → Cierra la sesión. 📸
4. Intenta ingresar con `paul.b`. → No ingresa. 📸
5. Como reclutador, revisa los rankings de las 2 ofertas. → Tus postulaciones ya no aparecen. 📸

## 6. Si algo no sale como esperado

Llena este reporte y envíalo a Giancarlos **el mismo día**, con sus capturas. Se convierte en un defecto (DEF-008 en adelante) en E10.

| Campo | Lo que anotas |
|---|---|
| Caso y paso | CP-0__, paso __ |
| Qué hiciste | Acción exacta, con los datos que usaste |
| Qué esperabas | Lo que dice el paso |
| Qué pasó | Lo que viste, tal cual (copia el mensaje si hubo uno) |
| ¿Se repite? | Intenta **una sola vez más**: sí / no |
| Navegador y hora | |
| Capturas | Nombres de los archivos |

## 7. Si tienes dudas

Escríbele a Giancarlos antes de improvisar. Ayuda mucho si mandas:

- El código del caso y el número de paso.
- Una captura de lo que ves.
- Tu pregunta concreta (por ejemplo, *"En CP-043 paso 1 no encuentro la URL con `?token=`, ¿dónde la copio?"*).

## 8. Tus apreciaciones (al terminar)

Responde estas preguntas con tus palabras. No hay respuestas correctas: sirven para el análisis de E12 y para preparar la sustentación.

1. ¿Qué caso o paso te costó más entender? ¿Por qué?
2. ¿Hubo algún mensaje del sistema confuso o poco claro? Cópialo y di qué habrías esperado.
3. ¿Algo tardó más de lo que te pareció razonable? ¿Qué y cuánto, aproximadamente?
4. Si fueras un reclutador real, ¿confiarías en el puntaje para ordenar a los candidatos? ¿Qué te daría más confianza?
5. Si fueras un postulante, ¿te sentirías tranquilo con el texto de consentimiento y con la opción de eliminar tus datos? ¿Falta algo?
6. ¿Encontraste algo que funciona, pero que mejorarías? (diseño, textos, orden de las pantallas)
7. ¿Probaste algo fuera de los pasos que no funcionó? Descríbelo.
8. Del 1 al 5, ¿qué tan clara fue esta guía? ¿Qué cambiarías?
9. ¿Qué parte de tu trabajo te gustaría explicar en la sustentación?

## 9. Qué entregar

Envía todo a Giancarlos (carpeta compartida o mensaje) **hasta el viernes 27/11/2026**:

- [ ] Una hoja de resultado por cada caso (sección 3.2).
- [ ] Las capturas, con el nombre en el formato indicado.
- [ ] Los reportes de falla, si hubo (sección 6).
- [ ] Tus respuestas a la sección 8.
- [ ] Tu cuestionario SUS (Anexo A), si no lo entregaste en la sesión de usabilidad.

## Anexo A. Cuestionario SUS (CP-049)

Marca de **1 (totalmente en desacuerdo)** a **5 (totalmente de acuerdo)**. Responde rápido, con tu primera impresión.

| N.° | Afirmación | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| 1 | Creo que me gustaría usar este sistema con frecuencia. | | | | | |
| 2 | Encontré el sistema innecesariamente complejo. | | | | | |
| 3 | Pensé que el sistema era fácil de usar. | | | | | |
| 4 | Creo que necesitaría el apoyo de una persona técnica para poder usar este sistema. | | | | | |
| 5 | Encontré que las distintas funciones del sistema estaban bien integradas. | | | | | |
| 6 | Pensé que había demasiada inconsistencia en el sistema. | | | | | |
| 7 | Imagino que la mayoría de las personas aprendería a usar este sistema muy rápido. | | | | | |
| 8 | Encontré el sistema muy engorroso de usar. | | | | | |
| 9 | Me sentí muy seguro usando el sistema. | | | | | |
| 10 | Necesité aprender muchas cosas antes de poder usar este sistema. | | | | | |

Nombre: ____________________ · Fecha: __/__/2026
