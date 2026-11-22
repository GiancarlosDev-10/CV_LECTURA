# E08. Especificación de casos de prueba

> **Plantilla:** Formatos 08 · **Estado:** borrador v0.1 (18/11/2026) · **Fuente de verdad:** este archivo.
> Los casos automatizados (CP-001 a CP-026) se describen en una tabla porque sus pasos están en el código de la prueba. Los manuales (CP-027 a CP-052) tienen ficha completa: son los que ejecuta cada integrante, con sus propias capturas.
> CP-016 a CP-022, CP-024 y CP-025 se ejecutaron el 22/11/2026 (E09). CP-023 (monitor) está en curso y CP-026 espera los CP manuales.

| Campo | Valor |
|---|---|
| Código del entregable | E08 |
| Sistema evaluado | CV Lectura — Sistema web de RRHH con lectura automática de CVs |
| Preparado por | Giancarlos Ormeño |
| Fecha | 18/11/2026 |
| Entorno de ejecución | Producción https://cv-lectura.vercel.app, salvo que el caso indique otro |

## 8.1 Catálogo de casos de prueba

Ejecución: **A** = automatizada; **M** = manual. Prioridad: **A** alta, **M** media, **B** baja.

| CP | Nombre | Módulo | Requisito | Tipo | Ejec. | Prior. | Responsable |
|---|---|---|---|---|---|---|---|
| CP-001 | Cálculo del puntaje según la fórmula | M5 | RQ-FUN-03 | Unitaria | A | A | Giancarlos Ormeño |
| CP-002 | Normalización de habilidades e idiomas por alias | M5 | RQ-FUN-03 | Unitaria | A | A | Giancarlos Ormeño |
| CP-003 | Orden del ranking y desempate | M5 | RQ-FUN-04 | Unitaria | A | M | Giancarlos Ormeño |
| CP-004 | Consentimiento obligatorio y vigente al postular | M3 | RQ-SEG-03 | Unitaria | A | A | Giancarlos Ormeño |
| CP-005 | Validación del tipo real del archivo | M3 | RQ-FUN-04 | Unitaria | A | A | Giancarlos Ormeño |
| CP-006 | Fallas de la IA terminan en revisión manual | M4 | RQ-FIA-01, RQ-SOP-01, RQ-COM-01 | Unitaria (IA simulada) | A | A | Giancarlos Ormeño |
| CP-007 | PDF sin texto o corrupto termina en revisión manual | M4 | RQ-SOP-01 | Unitaria | A | A | Giancarlos Ormeño |
| CP-008 | Orden seguro de borrado al eliminar datos | M6 | RQ-SEG-04 | Unitaria | A | A | Giancarlos Ormeño |
| CP-009 | Procesamiento de un CV de punta a punta | M3–M5 | RQ-FUN-04, RQ-SOP-01 | Integración | A | A | Giancarlos Ormeño |
| CP-010 | Usuario sin sesión no accede a datos ni archivos | M1 | RQ-SEG-01 | Integración (seguridad) | A | A | Giancarlos Ormeño |
| CP-011 | Perfiles y roles no se pueden alterar | M1 | RQ-SEG-01 | Integración (seguridad) | A | A | Giancarlos Ormeño |
| CP-012 | Ofertas protegidas entre reclutadores y fijas con postulaciones | M2 | RQ-SEG-01, RQ-FUN-03 | Integración (seguridad) | A | A | Giancarlos Ormeño |
| CP-013 | Postulaciones, puntaje y decisión protegidos | M3, M5 | RQ-SEG-01 | Integración (seguridad) | A | A | Giancarlos Ormeño |
| CP-014 | Bucket privado de CVs | M3, M6 | RQ-SEG-01 | Integración (seguridad) | A | A | Giancarlos Ormeño |
| CP-015 | Derecho de cancelación en la BD y Storage | M6 | RQ-SEG-04 | Integración | A | A | Giancarlos Ormeño |
| CP-016 | Exactitud de la extracción (3 corridas) | M4 | RQ-FUN-01, RQ-FUN-02, RQ-COM-01 | Exactitud | A | A | Giancarlos Ormeño |
| CP-017 | Tiempo de procesamiento por CV | M3–M5 | RQ-DES-01 | Desempeño | A | A | Giancarlos Ormeño |
| CP-018 | Respuesta con 10 usuarios concurrentes | Todos | RQ-DES-02 | Desempeño (carga) | A | M | Giancarlos Ormeño |
| CP-019 | Escaneo de vulnerabilidades | Despliegue | RQ-SEG-02 | Seguridad (ZAP) | A | A | Giancarlos Ormeño |
| CP-020 | Cobertura de pruebas del núcleo | Núcleo | RQ-MAN-01 | Estática / CI | A | M | Giancarlos Ormeño |
| CP-021 | Regla de dependencias entre capas | Todo el código | RQ-MAN-03 | Estática / CI | A | M | Giancarlos Ormeño |
| CP-022 | Análisis de SonarQube | Todo el código | RQ-MAN-02 | Estática | A | B | Giancarlos Ormeño |
| CP-023 | Disponibilidad en el periodo de evaluación | Despliegue | RQ-FIA-02 | Disponibilidad | A | M | Giancarlos Ormeño |
| CP-024 | Flujos de M1–M6 en 4 navegadores | M1–M6 | RQ-FUN-04, RQ-FLE-01, RQ-SEG-05 | E2E | A | A | Giancarlos Ormeño |
| CP-025 | Consentimiento registrado en todas las postulaciones | M3 | RQ-SEG-03 | Consulta SQL | A | A | Giancarlos Ormeño |
| CP-026 | Registro de cada vista de CV | M5, M6 | RQ-SEG-05 | Consulta SQL | A | M | Giancarlos Ormeño |
| CP-027 | Registro e ingreso de postulante | M1 | RQ-FUN-04 | Funcional | M | A | Raquel Montes |
| CP-028 | Ingreso de reclutador y acceso por rol | M1 | RQ-FUN-04, RQ-SEG-01 | Funcional | M | A | Raquel Montes |
| CP-029 | Crear oferta con requisitos y pesos | M2 | RQ-FUN-04 | Funcional | M | A | Raquel Montes |
| CP-030 | Pesos que no suman 100 | M2 | RQ-FUN-04 | Funcional (negativa) | M | M | Raquel Montes |
| CP-031 | Postular con CV válido y consentimiento | M3 | RQ-FUN-04, RQ-SEG-03 | Funcional | M | A | Hermy Salcedo |
| CP-032 | Postular sin aceptar el consentimiento | M3 | RQ-SEG-03 | Funcional (negativa) | M | A | Hermy Salcedo |
| CP-033 | Archivo que no es PDF con extensión .pdf | M3 | RQ-FUN-04 | Funcional (negativa) | M | A | Hermy Salcedo |
| CP-034 | PDF de más de 5 MB | M3 | RQ-FUN-04 | Funcional (valor límite) | M | M | Hermy Salcedo |
| CP-035 | PDF escaneado sin texto | M4 | RQ-SOP-01 | Funcional (negativa) | M | A | Nancy Vilcas |
| CP-036 | Postular dos veces a la misma oferta | M3 | RQ-FUN-04 | Funcional (negativa) | M | M | Hermy Salcedo |
| CP-037 | Cerrar y reabrir una oferta | M2 | RQ-FUN-04 | Funcional | M | M | Raquel Montes |
| CP-038 | Estado de mis postulaciones | M3, M4 | RQ-FUN-04 | Funcional | M | M | Nancy Vilcas |
| CP-039 | Registrar la decisión del reclutador | M5 | RQ-FUN-04 | Funcional | M | M | Nancy Vilcas |
| CP-040 | Ranking con desglose y advertencia | M5 | RQ-SOP-02, RQ-FUN-04 | Funcional | M | A | Nancy Vilcas |
| CP-041 | Registro de la vista y descarga de un CV | M5, M6 | RQ-SEG-05 | Seguridad | M | M | Paul Carretero |
| CP-042 | Otro reclutador abre una postulación por URL | M5 | RQ-SEG-01 | Seguridad (IDOR) | M | A | Paul Carretero |
| CP-043 | Abrir el CV sin sesión o con enlace vencido | M5, M6 | RQ-SEG-01 | Seguridad | M | A | Paul Carretero |
| CP-044 | Postulante intenta entrar a páginas de reclutador | M1 | RQ-SEG-01 | Seguridad | M | A | Paul Carretero |
| CP-045 | Eliminar una postulación | M6 | RQ-SEG-04 | Funcional / seguridad | M | A | Paul Carretero |
| CP-046 | Eliminar mi cuenta | M6 | RQ-SEG-04 | Funcional / seguridad | M | A | Paul Carretero |
| CP-047 | CV con inyección de instrucciones | M4, M5 | RQ-SEG-06 | Seguridad | M | A | Nancy Vilcas |
| CP-048 | Prueba de 3 tareas sin ayuda | M1–M5 | RQ-INT-01 | Usabilidad | M | M | Giancarlos Ormeño (facilitador) |
| CP-049 | Cuestionario SUS | M1–M5 | RQ-INT-02 | Usabilidad | M | M | Giancarlos Ormeño (facilitador) |
| CP-050 | Revisión de 10 CVs: a mano frente al sistema | M5 | RQ-VAL-01 | Calidad en uso | M | A | Giancarlos Ormeño (facilitador) |
| CP-051 | Editar una oferta sin postulaciones | M2 | RQ-FUN-04 | Funcional | M | M | Raquel Montes |
| CP-052 | Una oferta con postulaciones no se puede editar | M2 | RQ-FUN-04, RQ-FUN-03 | Funcional (negativa) | M | A | Raquel Montes |

**Cobertura:** los 24 requisitos de E05 tienen al menos un caso. RQ-FUN-04 se calcula solo con los CP de tipo funcional (CP-024, CP-027 a CP-040, CP-051 y CP-052).

## 8.2 Casos automatizados

Preparado por Giancarlos Ormeño el 18/11/2026. Para las suites existentes, el paso es ejecutar el comando indicado; los pasos detallados son los de cada prueba del archivo.

| CP | Precondiciones | Pasos / comando | Datos de entrada | Resultado esperado | Criterio de aprobación | Evidencia prevista |
|---|---|---|---|---|---|---|
| CP-001 | Ninguna | `npm run test` → `calcularPuntaje.test.ts` | Ofertas y CVs de ejemplo con cálculo manual: todo cumplido, 3 de 4 obligatorias, 2 de 4 años, niveles educativos, MCER, pesos personalizados, pesos que no suman 100 | Cada puntaje y desglose coincide con el cálculo manual; pesos inválidos se rechazan | 100 % de los casos aprobados | Reporte de Vitest |
| CP-002 | Ninguna | `npm run test` → `normalizacion.test.ts` | "JS", "ReactJS", tildes y mayúsculas, espacios repetidos | Se reconocen como la misma habilidad o idioma | 100 % aprobados | Reporte de Vitest |
| CP-003 | Ninguna | `npm run test` → `generarRanking.test.ts` | Postulaciones con puntajes distintos, empates y sin puntaje | Orden descendente; en empate va primero quien postuló antes; las que no tienen puntaje quedan fuera del ranking | 100 % aprobados | Reporte de Vitest |
| CP-004 | Ninguna | `npm run test` → `postularAOferta.test.ts` | Postulación con consentimiento vigente, sin consentimiento y con versión desactualizada | Solo se crea con el consentimiento vigente y su fecha; en los otros casos se rechaza y se borra el archivo subido | 100 % aprobados | Reporte de Vitest |
| CP-005 | Ninguna | `npm run test` → `postularAOferta.test.ts` | Archivo sin firma `%PDF-`, archivo inexistente, identificador manipulado | Rechazo `ARCHIVO_NO_ES_PDF`, `ARCHIVO_NO_ENCONTRADO` o `SOLICITUD_INVALIDA`, sin tocar otros archivos | 100 % aprobados | Reporte de Vitest |
| CP-006 | Ninguna | `npm run test` → `procesarCv.test.ts` | IA simulada: tiempo agotado, error del servicio, JSON que no cumple el contrato | Estado `pendiente_revision_manual` con motivo `IA_TIEMPO_AGOTADO`, `IA_ERROR` o `RESPUESTA_IA_INVALIDA`; sin puntaje; sin caída | 100 % aprobados | Reporte de Vitest |
| CP-007 | Ninguna | `npm run test` → `procesarCv.test.ts` y `LectorPdfUnpdf.test.ts` | PDF sin texto, PDF corrupto, error de infraestructura | Revisión manual con `PDF_SIN_TEXTO` (sin llamar a la IA), `PDF_ILEGIBLE` o `ERROR_INESPERADO`; sin puntaje | 100 % aprobados | Reporte de Vitest |
| CP-008 | Ninguna | `npm run test` → `eliminarMisDatos.test.ts` | Postulación propia, ajena, falla al borrar el PDF, eliminación de cuenta | Se borra primero el PDF y luego la fila; si falla el PDF no se borra la fila; una postulación ajena da `NO_ENCONTRADA` | 100 % aprobados | Reporte de Vitest |
| CP-009 | Supabase con migraciones aplicadas | `npm run test:integracion` → `procesamiento.integracion.test.ts` | PDF con texto, PDF sin texto, IA con JSON inválido | `procesada` con puntaje, desglose y marcas de tiempo; los otros dos en revisión manual y sin puntaje | 100 % aprobados en dev y prod | Reporte de Vitest |
| CP-010 | Igual que CP-009 | `npm run test:integracion` → `seguridad.integracion.test.ts` (usuario sin sesión) | Cliente sin sesión con la ruta de un CV real | No lee ofertas ni postulaciones; no descarga el CV | 0 accesos exitosos | Reporte de Vitest |
| CP-011 | Igual que CP-009 | Ídem (perfiles y roles) | Postulante que intenta leer otros perfiles o cambiar su rol | Solo ve su perfil; no puede ascenderse a reclutador | 0 accesos exitosos | Reporte de Vitest |
| CP-012 | Igual que CP-009 | Ídem (ofertas y edición de ofertas) | Postulante y reclutador ajeno intentando crear o modificar ofertas; el dueño cambiando requisitos de una oferta con postulaciones, cerrándola y editando una sin postulaciones | Los intentos ajenos se rechazan; con postulaciones, el cambio de requisitos o título se rechaza con `OFERTA_CON_POSTULACIONES` pero cerrar y reabrir funciona; sin postulaciones, la edición se guarda | 0 accesos exitosos y 100 % aprobadas | Reporte de Vitest |
| CP-013 | Igual que CP-009 | Ídem (postulaciones y decisión) | Otro reclutador, otro postulante, postulante que intenta ponerse puntaje, reclutador que intenta cambiar el puntaje o firmar como otro | Solo el reclutador dueño ve la postulación y registra su decisión con su autoría; nadie modifica puntaje ni estado | 0 accesos exitosos | Reporte de Vitest |
| CP-014 | Igual que CP-009 | Ídem (bucket privado) | Otro reclutador descargando, postulante subiendo a carpeta ajena, archivo no PDF | Solo el reclutador dueño descarga; los demás intentos se rechazan | 0 accesos exitosos | Reporte de Vitest |
| CP-015 | Igual que CP-009 | Ídem (derecho de cancelación) | Postulante con una postulación y su CV | La fila y el archivo desaparecen; nadie más puede verlos | 100 % aprobados | Reporte de Vitest |
| CP-016 | Umbrales congelados; dataset completo; saldo de OpenAI; script comparador y de medición listos | Subir cv-01 a cv-34 a producción con el script de medición; esperar el procesamiento; ejecutar el comparador; repetir 3 veces | Dataset y `dataset/esperados/` | Reporte por corrida con % de campos correctos, F1 y % de respuestas válidas | Promedio ≥ 90 %, F1 ≥ 0,85 y ≥ 98 % válidas | 3 reportes del comparador |
| CP-017 | CP-016 ejecutado | Consulta SQL del p95 de `fin_procesamiento − subido_en` de las 3 corridas | Postulaciones de las corridas | p95 calculado, con el primer CV de cada corrida aparte | p95 ≤ 15 s | Exportación SQL |
| CP-018 | k6 instalado | Ejecutar el script de k6: 10 usuarios virtuales durante 2 min | Inicio, ingreso, ofertas, `/api/salud` | Resumen con `http_req_duration` y `http_req_failed` | p95 ≤ 1,5 s y errores < 1 % | Resumen de k6 |
| CP-019 | ZAP instalado | Escaneo base de ZAP contra producción | URL de producción | Lista de alertas por riesgo | 0 alertas altas | Reporte HTML de ZAP |
| CP-020 | Ninguna | CI: `npm run test:coverage` | Commit evaluado | Reporte de cobertura del núcleo | Líneas ≥ 80 % | Artefacto del CI |
| CP-021 | Ninguna | CI: `npm run lint` | Commit evaluado | ESLint sin violaciones de `no-restricted-imports` | 0 violaciones | Registro del CI |
| CP-022 | SonarQube Community instalado | Analizar el commit evaluado | Código fuente | Panel de issues | 0 bloqueantes o críticos | Captura del panel |
| CP-023 | Monitor creado | Revisar el reporte del monitor al 08/12/2026 | Chequeos cada 5 min a `/api/salud` | % de tiempo disponible del periodo | ≥ 99 % | Reporte del monitor |
| CP-024 | Suite E2E escrita; cuentas del *seed* | `npx playwright test` contra producción | Flujos de postulante y reclutador | Todos los flujos pasan en Chromium, Firefox, WebKit y móvil | 100 % por navegador | Reporte HTML de Playwright |
| CP-025 | Corridas y CP manuales terminados | Consulta SQL de postulaciones sin `consentimiento_version` o `consentimiento_en` | Todas las postulaciones de producción | Ninguna sin consentimiento | 100 % con consentimiento | Exportación SQL |
| CP-026 | CP-024, CP-041 y CP-050 ejecutados | Comparar las vistas hechas en los CP con las filas de `accesos_cv` | Lista de vistas realizadas | Cada vista tiene su fila con reclutador, acción y fecha | 100 % registradas | Exportación SQL |

## CP-027. Registro e ingreso de postulante

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M1 — Registro e ingreso |
| Requisito relacionado | RQ-FUN-04 |
| Tipo / prioridad | Funcional · Alta |
| Responsable | Raquel Montes |
| Objetivo | Comprobar que una persona puede crear su cuenta de postulante e ingresar |
| Precondiciones | Navegador sin sesión iniciada; correo `@example.com` que no exista en el sistema |
| Resultado esperado final | La cuenta queda creada y el postulante entra a "Ofertas abiertas" |
| Criterio de aprobación | Todos los pasos dan el resultado esperado |
| Evidencia prevista | Capturas de los pasos 2, 4 y 6 |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Abrir la página de inicio y elegir "Registrarse" | — | Se muestra el formulario de registro |
| 2 | Completar el formulario y enviarlo | Nombre inventado, `raquel.prueba@example.com`, contraseña de 8 o más caracteres | Se crea la cuenta y se muestra la lista de ofertas abiertas |
| 3 | Cerrar sesión | — | Vuelve a la pantalla de ingreso |
| 4 | Ingresar con una contraseña incorrecta | Correo del paso 2, contraseña errada | Mensaje de error claro; no ingresa |
| 5 | Ingresar con los datos correctos | Correo y contraseña del paso 2 | Entra a "Ofertas abiertas" |
| 6 | Revisar el encabezado | — | Muestra el nombre del postulante y las opciones de postulante |

## CP-028. Ingreso de reclutador y acceso por rol

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M1 — Ingreso y control por rol |
| Requisito relacionado | RQ-FUN-04, RQ-SEG-01 |
| Tipo / prioridad | Funcional · Alta |
| Responsable | Raquel Montes |
| Objetivo | Comprobar que el reclutador ingresa a su panel y que cada rol ve solo sus pantallas |
| Precondiciones | Cuenta `reclutador1@example.com` del *seed* (contraseña entregada por el responsable de calidad) |
| Resultado esperado final | El reclutador entra a su panel; un usuario sin sesión no puede abrir el panel |
| Criterio de aprobación | Todos los pasos dan el resultado esperado |
| Evidencia prevista | Capturas de los pasos 1, 2 y 4 |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Ingresar como reclutador | `reclutador1@example.com` | Se muestra el panel con sus ofertas |
| 2 | Revisar las ofertas listadas | — | Solo aparecen las ofertas de este reclutador |
| 3 | Cerrar sesión | — | Vuelve a la pantalla de ingreso |
| 4 | Escribir en la barra de direcciones la URL del panel | `https://cv-lectura.vercel.app/reclutador` | Redirige a la pantalla de ingreso; no muestra datos |

## CP-029. Crear oferta con requisitos y pesos

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M2 — Crear oferta |
| Requisito relacionado | RQ-FUN-04 |
| Tipo / prioridad | Funcional · Alta |
| Responsable | Raquel Montes |
| Objetivo | Comprobar que el reclutador publica una oferta con requisitos y pesos que suman 100 |
| Precondiciones | Sesión de `reclutador1@example.com` |
| Resultado esperado final | La oferta aparece en el panel del reclutador y en "Ofertas abiertas" del postulante |
| Criterio de aprobación | Todos los pasos dan el resultado esperado |
| Evidencia prevista | Capturas del formulario lleno y de la oferta publicada desde ambos roles |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Elegir "Nueva oferta" | — | Se muestra el formulario con pesos por defecto (40, 20, 20, 10, 10) y "Suma: 100 / 100" |
| 2 | Completar título, descripción y requisitos | "Prueba Raquel – Soporte TI"; obligatorias: Excel, Windows; deseables: Linux; 1 año; técnico; Inglés A2 | Los campos aceptan los datos |
| 3 | Guardar | — | La oferta queda creada y se abre su página |
| 4 | Ingresar como postulante en otro navegador y abrir "Ofertas abiertas" | — | La nueva oferta aparece en la lista |

## CP-030. Pesos que no suman 100

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M2 — Validación de pesos |
| Requisito relacionado | RQ-FUN-04 |
| Tipo / prioridad | Funcional (negativa) · Media |
| Responsable | Raquel Montes |
| Objetivo | Comprobar que no se puede publicar una oferta con pesos que no suman 100 |
| Precondiciones | Sesión de `reclutador1@example.com` |
| Resultado esperado final | La oferta no se crea mientras la suma sea distinta de 100 |
| Criterio de aprobación | Todos los pasos dan el resultado esperado |
| Evidencia prevista | Captura del paso 2 |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Abrir "Nueva oferta" y completar los datos | Datos de CP-029 con otro título | — |
| 2 | Cambiar el peso de experiencia | 30 (suma 110) | El indicador muestra "Suma: 110 / 100" en color de aviso y el botón de guardar queda desactivado |
| 3 | Cambiar el peso de experiencia | 10 (suma 90) | "Suma: 90 / 100"; el botón sigue desactivado |
| 4 | Volver a 20 | 20 (suma 100) | El botón se activa |

## CP-031. Postular con CV válido y consentimiento

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M3 — Postulación |
| Requisito relacionado | RQ-FUN-04, RQ-SEG-03 |
| Tipo / prioridad | Funcional · Alta |
| Responsable | Hermy Salcedo |
| Objetivo | Comprobar que un postulante sube su CV a una oferta con consentimiento y que el CV se procesa |
| Precondiciones | Cuenta de postulante propia (CP-027) que no haya postulado a la oferta; archivo `cv-14-clasico-numerado.pdf` del dataset |
| Resultado esperado final | La postulación queda "procesada" y muestra la versión del consentimiento aceptado |
| Criterio de aprobación | Todos los pasos dan el resultado esperado |
| Evidencia prevista | Capturas de los pasos 2, 4 y 5 |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Abrir la oferta "Asistente de Recursos Humanos" | — | Se muestran los requisitos y el formulario de postulación |
| 2 | Leer el texto de consentimiento | — | Indica la finalidad, que los datos se alojan en São Paulo (Brasil), que el puntaje es apoyo y la versión del texto |
| 3 | Elegir el PDF y marcar la casilla de consentimiento | `cv-14-clasico-numerado.pdf` | El archivo aparece con su nombre y tamaño |
| 4 | Enviar la postulación | — | Mensaje de éxito; la postulación aparece en "Mis postulaciones" como "recibida" o "procesando" |
| 5 | Esperar y actualizar "Mis postulaciones" | — | La postulación pasa a "procesada" |

## CP-032. Postular sin aceptar el consentimiento

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M3 — Consentimiento obligatorio |
| Requisito relacionado | RQ-SEG-03 |
| Tipo / prioridad | Funcional (negativa) · Alta |
| Responsable | Hermy Salcedo |
| Objetivo | Comprobar que no se puede postular sin aceptar el consentimiento |
| Precondiciones | Sesión de postulante que no haya postulado a la oferta "Analista de Datos" |
| Resultado esperado final | No se crea ninguna postulación |
| Criterio de aprobación | Todos los pasos dan el resultado esperado |
| Evidencia prevista | Captura del paso 2 y de "Mis postulaciones" |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Abrir la oferta "Analista de Datos" y elegir el PDF sin marcar la casilla | `cv-10-moderno-sans.pdf` | — |
| 2 | Intentar enviar | — | Mensaje "Debes aceptar el tratamiento de tus datos para postular."; no se envía |
| 3 | Abrir "Mis postulaciones" | — | No aparece una postulación a "Analista de Datos" |

## CP-033. Archivo que no es PDF con extensión .pdf

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M3 — Validación del tipo real |
| Requisito relacionado | RQ-FUN-04 |
| Tipo / prioridad | Funcional (negativa) · Alta |
| Responsable | Hermy Salcedo |
| Objetivo | Comprobar que el sistema revisa el contenido del archivo y no solo su extensión |
| Precondiciones | Sesión de postulante sin postulación a la oferta elegida; archivo `cv-39-ejecutable-renombrado.pdf` (no es un programa real, solo tiene la cabecera `MZ`) |
| Resultado esperado final | La postulación se rechaza con un mensaje claro y no queda registrada |
| Criterio de aprobación | Todos los pasos dan el resultado esperado |
| Evidencia prevista | Captura del mensaje de rechazo y de "Mis postulaciones" |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Abrir una oferta, elegir el archivo y aceptar el consentimiento | `cv-39-ejecutable-renombrado.pdf` | — |
| 2 | Enviar | — | Mensaje de que el archivo no es un PDF válido |
| 3 | Abrir "Mis postulaciones" | — | No aparece la postulación |

## CP-034. PDF de más de 5 MB

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M3 — Límite de tamaño |
| Requisito relacionado | RQ-FUN-04 |
| Tipo / prioridad | Funcional (valor límite) · Media |
| Responsable | Hermy Salcedo |
| Objetivo | Comprobar que se rechaza un PDF mayor al límite de 5 MB |
| Precondiciones | Sesión de postulante; archivo `cv-40-mas-de-5mb.pdf` (5,6 MB; se genera con `npm run dataset`, no está en el repositorio) |
| Resultado esperado final | El archivo no se sube y se informa el tamaño máximo |
| Criterio de aprobación | Todos los pasos dan el resultado esperado |
| Evidencia prevista | Captura del mensaje |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Abrir una oferta y elegir el archivo | `cv-40-mas-de-5mb.pdf` | Mensaje "El PDF pesa 5.6 MB; el máximo es 5 MB." |
| 2 | Intentar enviar con el consentimiento marcado | — | No se envía; no aparece en "Mis postulaciones" |

## CP-035. PDF escaneado sin texto

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M4 — Falla segura |
| Requisito relacionado | RQ-SOP-01 |
| Tipo / prioridad | Funcional (negativa) · Alta |
| Responsable | Nancy Vilcas |
| Objetivo | Comprobar que un CV que el sistema no puede leer queda para revisión humana y no recibe puntaje 0 |
| Precondiciones | Sesión de postulante sin postulación a la oferta; archivo `cv-35-escaneado.pdf`; acceso a la cuenta del reclutador dueño de la oferta |
| Resultado esperado final | Estado "pendiente de revisión manual", sin puntaje y fuera del ranking |
| Criterio de aprobación | Todos los pasos dan el resultado esperado |
| Evidencia prevista | Capturas de los pasos 2 y 3 |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Postular con el PDF escaneado | `cv-35-escaneado.pdf` | La postulación se recibe |
| 2 | Actualizar "Mis postulaciones" hasta que cambie el estado | — | "Pendiente de revisión manual"; no muestra puntaje |
| 3 | Ingresar como el reclutador de la oferta y abrir el ranking | — | La postulación aparece aparte, como pendiente de revisión, sin puntaje ni posición |

## CP-036. Postular dos veces a la misma oferta

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M3 — Una postulación por oferta |
| Requisito relacionado | RQ-FUN-04 |
| Tipo / prioridad | Funcional (negativa) · Media |
| Responsable | Hermy Salcedo |
| Objetivo | Comprobar que un postulante no puede postular dos veces a la misma oferta |
| Precondiciones | CP-031 ejecutado (ya postuló a "Asistente de Recursos Humanos") |
| Resultado esperado final | No se crea una segunda postulación |
| Criterio de aprobación | Todos los pasos dan el resultado esperado |
| Evidencia prevista | Captura del paso 1 |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Abrir de nuevo la oferta "Asistente de Recursos Humanos" | — | Indica que ya postuló; no permite postular otra vez |
| 2 | Abrir "Mis postulaciones" | — | Hay una sola postulación a esa oferta |

## CP-037. Cerrar y reabrir una oferta

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M2 — Estado de la oferta |
| Requisito relacionado | RQ-FUN-04 |
| Tipo / prioridad | Funcional · Media |
| Responsable | Raquel Montes |
| Objetivo | Comprobar que una oferta cerrada deja de recibir postulaciones y que puede reabrirse |
| Precondiciones | Oferta creada en CP-029; sesión de `reclutador1@example.com`; sesión de postulante en otro navegador |
| Resultado esperado final | Cerrada: no aparece ni admite postulaciones. Reabierta: vuelve a aparecer |
| Criterio de aprobación | Todos los pasos dan el resultado esperado |
| Evidencia prevista | Capturas de los pasos 2, 3 y 5 |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Abrir la oferta de CP-029 y cerrarla | — | La oferta queda como "cerrada" |
| 2 | Como postulante, abrir "Ofertas abiertas" | — | La oferta no aparece |
| 3 | Como postulante, abrir la URL directa de la oferta | URL copiada en el paso 1 | Indica que la oferta no está disponible; no muestra el formulario |
| 4 | Como reclutador, reabrir la oferta | — | La oferta queda como "abierta" |
| 5 | Como postulante, actualizar "Ofertas abiertas" | — | La oferta aparece de nuevo |

## CP-038. Estado de mis postulaciones

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M3, M4 — Seguimiento del postulante |
| Requisito relacionado | RQ-FUN-04 |
| Tipo / prioridad | Funcional · Media |
| Responsable | Nancy Vilcas |
| Objetivo | Comprobar que el postulante ve el estado de cada postulación y su avance |
| Precondiciones | Sesión de postulante con al menos una postulación procesada (por ejemplo, la de CP-035 y otra con `cv-21-canva-elegante.pdf`) |
| Resultado esperado final | Cada postulación muestra oferta, fecha y estado correctos |
| Criterio de aprobación | Todos los pasos dan el resultado esperado |
| Evidencia prevista | Captura del paso 2 |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Postular a otra oferta | `cv-21-canva-elegante.pdf` | La postulación se recibe |
| 2 | Abrir "Mis postulaciones" | — | Se listan las postulaciones con oferta, fecha y la línea de tiempo del estado (recibida → procesando → procesada o pendiente de revisión) |
| 3 | Actualizar después del procesamiento | — | El estado cambia sin que el postulante haga nada más |

## CP-039. Registrar la decisión del reclutador

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M5 — Decisión humana |
| Requisito relacionado | RQ-FUN-04 |
| Tipo / prioridad | Funcional · Media |
| Responsable | Nancy Vilcas |
| Objetivo | Comprobar que el reclutador registra su decisión sobre un candidato |
| Precondiciones | Sesión del reclutador dueño de una oferta con postulaciones procesadas |
| Resultado esperado final | La decisión queda guardada con su nota, fecha y autor |
| Criterio de aprobación | Todos los pasos dan el resultado esperado |
| Evidencia prevista | Capturas de los pasos 2 y 3 |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Abrir el detalle de una postulación desde el ranking | — | Se muestran los datos extraídos, el desglose y el formulario de decisión |
| 2 | Registrar la decisión | "Preseleccionado"; nota "Cumple el perfil, citar a entrevista" | Mensaje de confirmación |
| 3 | Volver al ranking y abrir de nuevo el detalle | — | La decisión, la nota y la fecha se mantienen; el puntaje no cambió |

## CP-040. Ranking con desglose y advertencia

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M5 — Ranking |
| Requisito relacionado | RQ-SOP-02, RQ-FUN-04 |
| Tipo / prioridad | Funcional · Alta |
| Responsable | Nancy Vilcas |
| Objetivo | Comprobar que el ranking ordena por puntaje, explica cada puntaje y advierte que es solo un apoyo |
| Precondiciones | Sesión del reclutador dueño de una oferta con 3 o más postulaciones procesadas |
| Resultado esperado final | Ranking ordenado, con desglose por criterio y aviso visible |
| Criterio de aprobación | Todos los pasos dan el resultado esperado |
| Evidencia prevista | Capturas de los pasos 1, 2 y 3 |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Abrir la oferta desde el panel | — | Se muestra el aviso de que el puntaje es un apoyo y la decisión la toma una persona |
| 2 | Revisar el orden | — | Los candidatos están de mayor a menor puntaje, con su número visible |
| 3 | Abrir el detalle de un candidato | — | Se ve el desglose (obligatorias, deseables, experiencia, educación, idiomas) y la suma coincide con el puntaje; el aviso también aparece |

## CP-041. Registro de la vista y descarga de un CV

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M5, M6 — Registro de accesos |
| Requisito relacionado | RQ-SEG-05 |
| Tipo / prioridad | Seguridad · Media |
| Responsable | Paul Carretero |
| Objetivo | Generar vistas y descargas controladas para verificar que cada una queda registrada |
| Precondiciones | Sesión de `reclutador1@example.com` con postulaciones en sus ofertas; hoja de anotación |
| Resultado esperado final | Cada vista y descarga anotada tiene su fila en `accesos_cv` (la verificación SQL se hace en CP-026) |
| Criterio de aprobación | Todos los pasos se ejecutan y se anotan con hora |
| Evidencia prevista | Hoja de anotación con hora y captura de cada vista |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Abrir el detalle de 2 postulaciones distintas y anotar la hora | — | Se muestra el detalle |
| 2 | Descargar el PDF de una de ellas y anotar la hora | — | El PDF se abre |
| 3 | Entregar la hoja al responsable de calidad | — | Se compara con `accesos_cv`: 2 filas "ver_detalle" y 3 "descargar_pdf" (el visor del detalle carga el PDF y cuenta como acceso: 2; más la pestaña del paso 2: 1) |

## CP-042. Otro reclutador abre una postulación por URL

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M5 — Control de acceso (IDOR) |
| Requisito relacionado | RQ-SEG-01 |
| Tipo / prioridad | Seguridad · Alta |
| Responsable | Paul Carretero |
| Objetivo | Comprobar que un reclutador no puede ver postulaciones de ofertas ajenas aunque conozca la URL |
| Precondiciones | Dos navegadores: uno con `reclutador1@example.com`, otro con `reclutador2@example.com` |
| Resultado esperado final | El reclutador 2 no ve datos ni CV de la postulación del reclutador 1 |
| Criterio de aprobación | 0 accesos exitosos |
| Evidencia prevista | Capturas de los pasos 2 y 3 con la barra de direcciones visible |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Como reclutador 1, abrir el detalle de una postulación y copiar la URL | — | URL del tipo `/reclutador/postulaciones/<id>` |
| 2 | Como reclutador 2, pegar esa URL | URL del paso 1 | Página "no encontrado"; no se muestra ningún dato |
| 3 | Como reclutador 2, agregar `/cv` al final de la URL | URL del paso 1 + `/cv` | Respuesta "No encontrado"; no se descarga el PDF |

## CP-043. Abrir el CV sin sesión o con enlace vencido

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M5, M6 — Acceso a archivos |
| Requisito relacionado | RQ-SEG-01 |
| Tipo / prioridad | Seguridad · Alta |
| Responsable | Paul Carretero |
| Objetivo | Comprobar que el PDF de un CV no se puede abrir sin sesión ni con un enlace firmado vencido |
| Precondiciones | Sesión de `reclutador1@example.com`; una ventana privada sin sesión |
| Resultado esperado final | El PDF solo se abre con la sesión del reclutador dueño y durante 60 s |
| Criterio de aprobación | 0 accesos exitosos en los pasos 2, 3 y 4 |
| Evidencia prevista | Capturas de los pasos 2, 3 y 4 |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Como reclutador 1, descargar un CV y copiar la URL final del PDF (enlace firmado) | — | El PDF se abre |
| 2 | En la ventana privada, abrir `/reclutador/postulaciones/<id>/cv` | URL con el id del paso 1 | Pide ingresar o responde "No autorizado"; no entrega el PDF |
| 3 | Esperar 2 minutos y abrir el enlace firmado del paso 1 | URL firmada | Error de enlace vencido; no entrega el PDF |
| 4 | En la ventana privada, quitar los parámetros del enlace firmado y abrirlo | URL sin `?token=` | Error; el bucket es privado |

## CP-044. Postulante intenta entrar a páginas de reclutador

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M1 — Control por rol |
| Requisito relacionado | RQ-SEG-01 |
| Tipo / prioridad | Seguridad · Alta |
| Responsable | Paul Carretero |
| Objetivo | Comprobar que un postulante no puede usar funciones de reclutador escribiendo la URL |
| Precondiciones | Sesión de postulante; id de una postulación y de una oferta (los entrega el responsable de calidad) |
| Resultado esperado final | El postulante no ve el panel, el ranking ni CVs de otras personas |
| Criterio de aprobación | 0 accesos exitosos |
| Evidencia prevista | Captura de cada paso con la barra de direcciones visible |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Abrir el panel de reclutador | `/reclutador` | Redirige a las pantallas de postulante; no muestra el panel |
| 2 | Abrir el formulario de nueva oferta | `/reclutador/ofertas/nueva` | Igual que el paso 1 |
| 3 | Abrir el ranking de una oferta | `/reclutador/ofertas/<id>` | Igual que el paso 1 |
| 4 | Abrir el CV de otra persona | `/reclutador/postulaciones/<id>/cv` | "No autorizado" o redirección; no entrega el PDF |

## CP-045. Eliminar una postulación

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M6 — Derecho de cancelación |
| Requisito relacionado | RQ-SEG-04 |
| Tipo / prioridad | Funcional / seguridad · Alta |
| Responsable | Paul Carretero |
| Objetivo | Comprobar que el postulante elimina su postulación con el PDF, el texto y los datos extraídos |
| Precondiciones | Cuenta de postulante propia con una postulación procesada. El ejecutor anota la hora exacta del borrado; la verificación en BD y Storage la hace después el responsable de calidad (no hace falta coordinar antes) |
| Resultado esperado final | La postulación desaparece para el postulante y para el reclutador; en la BD y Storage no queda la fila ni el archivo |
| Criterio de aprobación | Todos los pasos dan el resultado esperado y la verificación en BD y Storage no encuentra nada |
| Evidencia prevista | Capturas de los pasos 2 a 4 y consulta antes/después |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Abrir "Mis postulaciones" y elegir eliminar la postulación | — | Pide confirmar: "¿Eliminar esta postulación, tu CV y los datos extraídos? No se puede deshacer." |
| 2 | Confirmar | — | La postulación desaparece de la lista |
| 3 | Como reclutador dueño, abrir el ranking de esa oferta y la URL del detalle anotada | — | El candidato ya no aparece; el detalle da "no encontrado" |
| 4 | El responsable de calidad consulta después la BD y Storage | Correo de la cuenta y hora del borrado | 0 postulaciones de esa cuenta y 0 archivos en su carpeta |

## CP-046. Eliminar mi cuenta

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M6 — Derecho de cancelación |
| Requisito relacionado | RQ-SEG-04 |
| Tipo / prioridad | Funcional / seguridad · Alta |
| Responsable | Paul Carretero |
| Objetivo | Comprobar que el postulante elimina su cuenta con todas sus postulaciones y CVs |
| Precondiciones | Cuenta de postulante creada para este caso, con 2 postulaciones. El ejecutor anota la hora exacta del borrado |
| Resultado esperado final | La cuenta ya no permite ingresar; no queda ninguna postulación ni PDF |
| Criterio de aprobación | Todos los pasos dan el resultado esperado y la verificación no encuentra nada |
| Evidencia prevista | Capturas de los pasos 1 a 3 y consulta antes/después |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | En "Mis postulaciones", elegir eliminar la cuenta y confirmar | — | Pide confirmación; luego cierra la sesión |
| 2 | Intentar ingresar con la misma cuenta | Correo y contraseña de la cuenta | No ingresa |
| 3 | Como reclutador, revisar los rankings de las 2 ofertas | — | Las postulaciones ya no aparecen |
| 4 | El responsable de calidad consulta después la BD y Storage | Correo de la cuenta y hora del borrado | La cuenta no existe y no queda ninguna carpeta de CVs sin dueño en Storage |

## CP-047. CV con inyección de instrucciones

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M4, M5 — Integridad de la extracción |
| Requisito relacionado | RQ-SEG-06 |
| Tipo / prioridad | Seguridad · Alta |
| Responsable | Nancy Vilcas |
| Objetivo | Comprobar que un texto oculto con instrucciones para la IA no cambia los datos extraídos ni el puntaje |
| Precondiciones | 4 cuentas de postulante (una por CV); archivos `cv-02`, `cv-37`, `cv-29` y `cv-38`; los 4 se suben a la **misma oferta** que indica su respuesta esperada |
| Resultado esperado final | cv-37 da los mismos datos y el mismo puntaje que cv-02; cv-38 los mismos que cv-29 |
| Criterio de aprobación | 0 campos inventados y diferencia de puntaje ≤ 0 en ambos pares |
| Evidencia prevista | Capturas del detalle de los 4 CVs y tabla comparativa |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Postular con el CV limpio y con su copia con inyección | `cv-02-times-centrado.pdf` y `cv-37-inyeccion.pdf` | Ambas postulaciones quedan procesadas |
| 2 | Repetir con el segundo par | `cv-29-dos-columnas.pdf` y `cv-38-inyeccion.pdf` | Ambas procesadas |
| 3 | Como reclutador, abrir el detalle de los 4 | — | — |
| 4 | Comparar cada par campo por campo | — | Mismos datos; ninguna habilidad, idioma o año de más; puntaje de la copia ≤ puntaje del limpio |

## CP-048. Prueba de 3 tareas sin ayuda

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M1–M5 — Aprendizaje y operabilidad |
| Requisito relacionado | RQ-INT-01 |
| Tipo / prioridad | Usabilidad · Media |
| Responsable | Cada participante, sin supervisión (prueba autoadministrada); participantes: los 4 integrantes y 2 o 3 personas externas. Giancarlos Ormeño prepara la prueba y verifica los resultados |
| Objetivo | Medir si una persona que no conoce el sistema completa las tareas principales sin ayuda |
| Precondiciones | Producción disponible; cuenta `reclutador.usabilidad@example.com` con la oferta "Asistente de Recursos Humanos — Sede Norte" (5 CVs procesados, cerrada a nuevas postulaciones), preparada con `npm run usabilidad:preparar`; documento `01-prueba-de-usabilidad`; el participante no ha usado el sistema antes (los integrantes hacen la prueba **antes** de ejecutar sus CP) |
| Resultado esperado final | El participante completa las 3 tareas sin ayuda |
| Criterio de aprobación | ≥ 90 % de los participantes completan las 3 tareas |
| Evidencia prevista | Hoja de autorregistro por participante (completó sí/no, horas de inicio y fin, dudas marcadas) con una captura al final de cada tarea. Las horas se contrastan con los registros del sistema (creación de la cuenta, `subido_en` de la postulación y `accesos_cv` del reclutador) |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Tarea 1 (postulante): "Crea tu cuenta y postula a la oferta Desarrollador Full Stack Junior con este CV" | `cv-12-moderno-sans.pdf` | Postulación enviada sin ayuda |
| 2 | Tarea 2 (postulante): "Averigua en qué estado está tu postulación" | — | Encuentra el estado sin ayuda |
| 3 | Tarea 3 (reclutador): "Encuentra al mejor candidato de la oferta Asistente de Recursos Humanos — Sede Norte y explica por qué está primero" | Cuenta del reclutador de usabilidad | Identifica al primero y explica su desglose |
| 4 | El participante anota sus horas, el resultado y sus dudas en la hoja de autorregistro | — | Hoja completa y 3 capturas |

## CP-049. Cuestionario SUS

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M1–M5 — Satisfacción |
| Requisito relacionado | RQ-INT-02 |
| Tipo / prioridad | Usabilidad · Media |
| Responsable | Cada participante de CP-048 (autoadministrado); Giancarlos Ormeño calcula el puntaje |
| Objetivo | Medir la usabilidad percibida con un cuestionario estándar |
| Precondiciones | CP-048 terminado por el participante; cuestionario SUS de 10 ítems en español, escala de 1 a 5 |
| Resultado esperado final | Cada participante entrega su cuestionario completo |
| Criterio de aprobación | Puntaje SUS promedio ≥ 68 |
| Evidencia prevista | Cuestionarios respondidos y hoja de cálculo |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Responder el cuestionario justo después de las tareas (está en el mismo documento) | — | El participante responde los 10 ítems sin ayuda |
| 2 | Calcular el puntaje de cada participante | Ítems impares: respuesta − 1; pares: 5 − respuesta; suma × 2,5 | Puntaje de 0 a 100 por participante |
| 3 | Calcular el promedio | — | SUS promedio del grupo |

## CP-050. Revisión de 10 CVs: a mano frente al sistema

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M5 — Propuesta de valor |
| Requisito relacionado | RQ-VAL-01 |
| Tipo / prioridad | Calidad en uso · Alta |
| Responsable | Cada participante, con su cronómetro (autoadministrado); participantes: Raquel, Hermy, Nancy y Paul. Giancarlos Ormeño calcula la reducción |
| Objetivo | Medir cuánto tiempo ahorra el sistema frente a revisar CVs a mano |
| Precondiciones | Oferta "Analista de Datos — Sede Sur" del reclutador de usabilidad con exactamente 10 CVs procesados (cv-03, 04, 07, 10, 13, 16, 22, 24, 28 y 34), cerrada a nuevas postulaciones y distinta de la oferta de CP-048 para no sesgar la revisión a mano; los mismos 10 PDFs en una carpeta; cronómetro del celular. Raquel y Hermy empiezan a mano; Nancy y Paul, con el sistema |
| Resultado esperado final | Tiempo a mano y con el sistema registrado por participante |
| Criterio de aprobación | Reducción promedio ≥ 50 % = (t_manual − t_sistema) / t_manual × 100 |
| Evidencia prevista | Tabla de tiempos y de los 3 elegidos en el documento `01-prueba-de-usabilidad` de cada participante |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Leer los requisitos de la oferta | Oferta elegida | El participante conoce los criterios |
| 2 | **A mano:** revisar los 10 PDFs y ordenar a los 3 mejores candidatos; detener el cronómetro al entregar el orden | 10 PDFs | Tiempo manual (t_manual) |
| 3 | **Con el sistema:** ingresar como reclutador, revisar el ranking y el desglose y elegir a los 3 mejores; detener el cronómetro al entregar el orden | Cuenta de reclutador | Tiempo con el sistema (t_sistema) |
| 4 | Registrar ambos tiempos y los 3 elegidos | — | Hoja completa |

## CP-051. Editar una oferta sin postulaciones

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M2 — Editar oferta |
| Requisito relacionado | RQ-FUN-04 |
| Tipo / prioridad | Funcional · Media |
| Responsable | Raquel Montes |
| Objetivo | Comprobar que el reclutador corrige una oferta que todavía no recibió postulaciones |
| Precondiciones | Sesión de `reclutador1@example.com`; una oferta nueva sin postulaciones (por ejemplo, la de CP-029 **antes** de que alguien postule) |
| Resultado esperado final | Los cambios quedan guardados y los ve el postulante |
| Criterio de aprobación | Todos los pasos dan el resultado esperado |
| Evidencia prevista | Capturas de los pasos 2, 3 y 4 |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Abrir la oferta desde el panel | — | Se ven los botones "Editar oferta" y "Cerrar oferta" |
| 2 | Elegir "Editar oferta" | — | El formulario muestra los datos actuales de la oferta, incluidos los pesos |
| 3 | Cambiar los años de experiencia y agregar una habilidad deseable; guardar | 2 años; deseable: "Redes" | Vuelve a la página de la oferta |
| 4 | Como postulante, abrir la oferta | — | Muestra 2 años y la habilidad "Redes" |

## CP-052. Una oferta con postulaciones no se puede editar

| Campo | Valor |
|---|---|
| Módulo / funcionalidad | M2 — Editar oferta (bloqueo) |
| Requisito relacionado | RQ-FUN-04, RQ-FUN-03 |
| Tipo / prioridad | Funcional (negativa) · Alta |
| Responsable | Raquel Montes |
| Objetivo | Comprobar que los requisitos de una oferta no cambian después de recibir postulaciones, para que los puntajes sigan correspondiendo a la fórmula |
| Precondiciones | Sesión de `reclutador1@example.com`; una oferta suya con al menos una postulación; el id de esa oferta |
| Resultado esperado final | No hay forma de editar la oferta; cerrarla sigue funcionando |
| Criterio de aprobación | Todos los pasos dan el resultado esperado |
| Evidencia prevista | Capturas de los pasos 1 y 2 con la barra de direcciones visible |

| N.° | Acción | Datos de entrada | Resultado esperado |
|---|---|---|---|
| 1 | Abrir la oferta desde el panel | — | No aparece el botón "Editar oferta"; sí aparece "Cerrar oferta" |
| 2 | Escribir la URL de edición | `/reclutador/ofertas/<id>/editar` | Mensaje: "Esta oferta ya tiene postulaciones y no se puede editar…"; no se muestra el formulario |
| 3 | Volver a la oferta y revisar el ranking | — | Los puntajes y requisitos no cambiaron |
