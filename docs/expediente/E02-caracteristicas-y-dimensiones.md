# E02. Matriz de análisis de características y dimensiones de calidad

> **Plantilla:** Formatos 02 (2.1) ampliada con el contenido mínimo de la Matriz para E02 · **Estado:** borrador v0.1 (18/11/2026) · **Fuente de verdad:** este archivo.

| Campo | Valor |
|---|---|
| Código del entregable | E02 |
| Sistema evaluado | CV Lectura — Sistema web de RRHH con lectura automática de CVs |
| Equipo | Giancarlos Ormeño, Raquel Montes, Hermy Salcedo, Nancy Vilcas y Paul Carretero |
| Fecha | 18/11/2026 |

## 2.1 Fundamentos de calidad aplicados

**Qué significa calidad en este sistema.**
Calidad es el grado en que el sistema cumple sus requisitos y satisface las necesidades reales de quienes lo usan. En CV Lectura no basta con que "funcione": un sistema que sube el CV pero extrae mal la experiencia, que tarda varios minutos por CV o que deja ver los datos de un postulante a otro reclutador funciona, pero no tiene calidad. Para este sistema, calidad significa:

- **Hacer correctamente lo que se necesita:** extraer bien los datos del CV y calcular el puntaje sin errores.
- **Hacerlo en un tiempo útil:** que procesar un CV sea mucho más rápido que leerlo a mano.
- **Proteger la información:** que cada persona vea solo lo que le corresponde y que el postulante pueda eliminar sus datos.
- **Ser confiable y fácil de usar:** que una falla de la IA no produzca un resultado injusto y que ambos roles completen sus tareas sin ayuda.

**Dimensiones o perspectivas de calidad consideradas y su relación con los usuarios.**
Se usan las tres perspectivas vistas en clase (S02) y los cinco componentes de calidad de los sistemas informáticos (S08):

| Perspectiva | Pregunta | En CV Lectura | Usuario relacionado |
|---|---|---|---|
| Calidad interna | ¿Cómo está construido? | Arquitectura en capas, regla de dependencias, cobertura de pruebas del núcleo, código sin problemas graves | Equipo de desarrollo y mantenimiento |
| Calidad externa | ¿Cómo funciona? | Exactitud de la extracción, tiempo por CV, accesos indebidos, disponibilidad | Reclutador y postulante (de forma indirecta) |
| Calidad en uso | ¿Cómo le sirve al usuario? | Completar las tareas sin ayuda, satisfacción, reducción del tiempo de revisión | Reclutador y postulante |

## 2.2 Necesidades de los usuarios

| ID | Usuario | Necesidad | Característica relacionada |
|---|---|---|---|
| N01 | Reclutador | Conocer los datos clave del CV sin leerlo completo | Adecuación funcional (corrección) |
| N02 | Reclutador | Comparar candidatos con un criterio uniforme y entender por qué uno está arriba de otro | Adecuación funcional (corrección), Seguridad operacional (advertencia) |
| N03 | Reclutador | Revisar las postulaciones en menos tiempo que a mano | Eficiencia del desempeño, calidad en uso (eficiencia) |
| N04 | Reclutador | Ver solo las postulaciones de sus propias ofertas | Seguridad (confidencialidad) |
| N05 | Postulante | Postular de forma simple y saber en qué estado está | Capacidad de interacción (operabilidad, aprendizaje) |
| N06 | Postulante | Que sus datos personales estén protegidos y poder eliminarlos | Seguridad (confidencialidad, responsabilidad) |
| N07 | Postulante | Que una falla del sistema no lo descarte injustamente | Fiabilidad (tolerancia a fallos), Seguridad operacional (falla segura) |
| N08 | Ambos | Que el sistema esté disponible cuando lo necesitan y funcione en su navegador o celular | Fiabilidad (disponibilidad), Flexibilidad (adaptabilidad) |
| N09 | Equipo | Corregir y mejorar el sistema sin romper lo que ya funciona | Mantenibilidad |

## 2.3 Matriz de características de calidad (ISO/IEC 25010:2023)

Las nueve características del modelo son pertinentes en algún grado. Se asigna una **profundidad de evaluación** según el riesgo y lo que pide el enunciado (porcentaje de datos extraídos, protección de datos personales y tiempo por CV).

| Característica | Pertinencia para CV Lectura | Profundidad | Subcaracterísticas incluidas |
|---|---|---|---|
| Adecuación funcional | Es el núcleo del enunciado: el porcentaje de datos extraídos correctamente y el puntaje correcto | A fondo | Corrección funcional, completitud funcional |
| Eficiencia del desempeño | El enunciado pide medir el tiempo por CV; la propuesta de valor es ahorrar tiempo | A fondo | Comportamiento temporal |
| Seguridad | Se procesan datos personales protegidos por la Ley N.° 29733 | A fondo | Confidencialidad, integridad, responsabilidad, autenticidad, resistencia |
| Fiabilidad | La IA es un servicio externo que puede fallar; el sistema debe estar disponible en el periodo de evaluación | Media | Tolerancia a fallos, disponibilidad |
| Mantenibilidad | Las acciones de mejora (E13) exigen cambiar el sistema sin romperlo | Media | Capacidad de prueba, analizabilidad, modularidad |
| Capacidad de interacción | Dos tipos de usuario que deben completar sus tareas sin capacitación | Media | Capacidad de aprendizaje, operabilidad, protección contra errores del usuario |
| Flexibilidad | Los usuarios entran desde distintos navegadores y desde el celular | Mínima | Adaptabilidad |
| Compatibilidad | El sistema intercambia datos con OpenAI y Supabase | Mínima | Interoperabilidad |
| Seguridad operacional | Un ranking automático puede afectar el acceso de una persona a un empleo (interpretación argumentada) | Mínima | Funcionamiento seguro ante fallos, advertencia de peligros |

## 2.4 Matriz de dimensiones consideradas

| Dimensión (S02 / S08) | Qué se analiza en CV Lectura | Características ISO relacionadas | Cómo se obtendrá evidencia |
|---|---|---|---|
| Calidad interna / técnica | Arquitectura en capas, modularidad, cobertura y análisis estático | Mantenibilidad | Reporte de cobertura, ESLint en el CI, SonarQube |
| Calidad externa / operativa | Tiempo por CV, respuesta con carga, disponibilidad, tolerancia a fallos | Eficiencia del desempeño, Fiabilidad | Marcas de tiempo en la BD, k6, monitor de disponibilidad, pruebas con IA simulada |
| Calidad funcional | Extracción y puntaje correctos, funciones completas | Adecuación funcional | Script comparador sobre el dataset, pruebas unitarias, casos de prueba |
| Calidad de uso | Tareas completadas sin ayuda, satisfacción | Capacidad de interacción; calidad en uso (ISO/IEC 25019) | Prueba de tareas y cuestionario SUS |
| Calidad de la información | Exactitud de los datos extraídos y validez de su formato | Adecuación funcional, Compatibilidad | Comparación con la respuesta esperada y validación con Zod |
| Eficacia | ¿El reclutador obtiene un ranking útil? | Adecuación funcional | Casos de prueba funcionales y prueba de tareas |
| Eficiencia | ¿Lo obtiene en menos tiempo que a mano? | Eficiencia del desempeño; calidad en uso | Revisión manual cronometrada de 10 CVs frente al sistema |
| Seguridad | Confidencialidad, integridad y disponibilidad de los datos personales | Seguridad, Fiabilidad | Casos de seguridad, OWASP ZAP, pruebas de RLS |
| Mantenibilidad | Facilidad para aplicar las acciones de mejora | Mantenibilidad | Diff de cada acción de mejora y pruebas de regresión |
| Satisfacción | Percepción de los usuarios | Calidad en uso (ISO/IEC 25019) | Cuestionario SUS |

## 2.5 Justificación de criterios incluidos y excluidos

**Incluidos.** Cada subcaracterística incluida tiene al menos un requisito de calidad con indicador y método (24 requisitos en total; se especifican en E05). Se priorizan las que responden a las necesidades N01–N09.

**Excluidos (con motivo):**

| Característica | Subcaracterística excluida | Motivo |
|---|---|---|
| Adecuación funcional | Pertinencia funcional | No se mide con un indicador propio; se observa de forma cualitativa en la prueba de tareas |
| Eficiencia del desempeño | Utilización de recursos, capacidad | Plataformas gestionadas (Vercel y Supabase) sin acceso a métricas de CPU o memoria; la capacidad no es objetivo de un proyecto académico |
| Seguridad | No repudio | No hay firma digital ni transacciones con valor legal |
| Fiabilidad | Ausencia de fallos, capacidad de recuperación | No hay operación prolongada que permita medir fallos; el respaldo lo da Supabase y no se prueba |
| Mantenibilidad | Reutilización, modificabilidad | La reutilización no es objetivo; la modificabilidad se evidencia de forma cualitativa con el diff de las acciones de mejora |
| Capacidad de interacción | Reconocibilidad de la adecuación, compromiso del usuario, inclusividad, asistencia al usuario, autodescriptividad | La muestra de usuarios (4 integrantes y 2–3 externos) no es suficiente para medirlas con validez |
| Flexibilidad | Escalabilidad, instalabilidad, reemplazabilidad | Es un sistema web sin instalación y sin objetivo de crecimiento |
| Compatibilidad | Coexistencia | El sistema no convive con otros sistemas del cliente |
| Seguridad operacional | Restricción operacional, identificación de peligros, integración segura | No controla procesos físicos; su único riesgo es el efecto del ranking sobre las personas |

**Sobre Seguridad operacional.** Se incluye con una interpretación argumentada: el sistema no controla máquinas, pero un ranking automático influye en el acceso de una persona a un empleo. Si el docente no acepta esta interpretación, la característica pasa a "No aplica" sin afectar el resto de la evaluación.
