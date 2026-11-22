# E13. Plan de acciones correctivas y mejora

> **Plantilla:** Formatos 13 · **Estado:** borrador v0.1 (22/11/2026) · **Fuente de verdad:** este archivo.
> Cada acción sigue el ciclo PHVA (ISO 9001:2026): **Planificar** la corrección a partir de la causa, **Hacer** el cambio con su prueba de regresión, **Verificar** volviendo a medir con la misma meta y **Actuar**, dejando la corrección como estándar (prueba automatizada que impide que el defecto vuelva). Los hallazgos que surjan de los casos manuales del equipo se agregan como AM-08 en adelante.

| Campo | Valor |
|---|---|
| Código del entregable | E13 |
| Sistema evaluado | CV Lectura en producción (https://cv-lectura.vercel.app) |
| Responsable de seguimiento | Giancarlos Ormeño |
| Fecha | 22/11/2026 |

## 13.1 Objetivo

Corregir los resultados que no alcanzaron su meta en la primera medición oficial y reducir los riesgos encontrados:

1. Que **RQ-FUN-01** (exactitud de los campos simples) pase de 85,7 % a la meta de 90 % o más, eliminando la causa de DEF-001.
2. Que **RQ-SEG-06** (inyección de instrucciones) pase de 1 campo inventado y +10 puntos a 0 y 0 (DEF-002).
3. Reducir las alertas de seguridad de ZAP de riesgo medio y bajo (DEF-004), aunque RQ-SEG-02 ya cumplía.
4. Dejar planificadas las mejoras para los riesgos que quedan (CSP, otras técnicas de inyección y auditoría de la extracción).

Ninguna meta se cambió para lograrlo (E05 5.7).

## 13.2 Plan de mejora

| ID | Hallazgo / defecto asociado | Causa identificada o hipótesis | Acción correctiva / preventiva | Prioridad | Responsable | Recursos | Plazo | Indicador de éxito | Evidencia de cierre |
|---|---|---|---|---|---|---|---|---|---|
| AM-01 | DEF-001 (RQ-FUN-01) | Algunas fuentes dejan el carácter U+0000 en el texto extraído y PostgreSQL lo rechaza | **Correctiva:** el lector de PDF elimina los caracteres de control no imprimibles antes de devolver el texto; prueba de regresión con cv-05 | Alta | Giancarlos Ormeño | 1 h de desarrollo; dataset | 22/11/2026 | 0 postulaciones con `ERROR_INESPERADO` y M01 ≥ 90 % | Commit `6c4922a`; EV-06 y EV-13: 0 errores y M01 = 96,7 % |
| AM-02 | DEF-002 (RQ-SEG-06) | El texto invisible llega a la IA igual que el visible, y el modelo pequeño no siempre obedece la regla de ignorarlo | **Correctiva:** antes de enviar el texto a la IA se descarta el texto de menos de 4 pt (ilegible para una persona; el texto legítimo más pequeño del dataset mide 8 pt); prueba de regresión que exige que cv-37 dé el mismo texto que cv-02 | Alta | Giancarlos Ormeño | 1 h de desarrollo; dataset | 22/11/2026 | M12: 0 campos inventados y 0 puntos de diferencia en las 3 corridas | Commit `6c4922a`; EV-06 y EV-13 |
| AM-03 | DEF-003 (RQ-FUN-01) | La IA no conoce la fecha actual y se equivoca al sumar meses | **Correctiva:** la IA devuelve solo las fechas de cada trabajo y el código suma la duración, con la fecha actual para los trabajos vigentes; 6 pruebas unitarias | Alta | Giancarlos Ormeño | 1 h de desarrollo | 22/11/2026 (antes del congelamiento) | Años correctos ≥ 90 % | Commit `77d5b6a`; EV-15 (local) y EV-06 (91,2 %–94,1 %) |
| AM-04 | DEF-004 (RQ-SEG-02) | Configuración por defecto de Next.js | **Preventiva:** cabeceras `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff` y `Referrer-Policy`, y `X-Powered-By` desactivada | Media | Giancarlos Ormeño | 30 min | 22/11/2026 | Desaparecen las alertas de clickjacking, `X-Content-Type-Options` y `X-Powered-By` | Commit `3312f07`; EV-10 |
| AM-05 | DEF-004 (pendiente), R-03 | No hay política de seguridad de contenido (CSP) | **Preventiva:** definir una CSP con *nonce* para los scripts de Next.js, probarla con la suite E2E en los 4 perfiles y repetir ZAP | Media | Giancarlos Ormeño | 2–3 h; guía de CSP de Next.js | Recomendada después de la entrega (no se aplica antes de medir para no arriesgar el funcionamiento) | Alerta "CSP Header Not Set" ausente y E2E 100 % | Pendiente |
| AM-06 | DEF-002 (riesgo residual), R-04 | El filtro de AM-02 solo mira el tamaño de letra | **Preventiva:** descartar también el texto del mismo color que el fondo y registrar en la postulación cuando se detecte texto oculto, para que el reclutador lo vea | Media | Giancarlos Ormeño | 3–4 h | Después de la entrega | Nuevos CVs de prueba con texto blanco de 10 pt sin efecto en la extracción | Pendiente |
| AM-07 | DEF-005, DEF-006 | La IA infiere el nivel educativo cuando el CV no lo dice y lee mal algunas fechas | **Preventiva:** guardar las fechas y la institución que devuelve la IA, para que el reclutador y el equipo puedan auditarlas, y clasificar el tipo de institución en el código | Baja | Giancarlos Ormeño | 3 h | Después de la entrega | M01 ≥ 98 % sin errores en años ni nivel educativo | Pendiente |

## 13.3 Priorización

| Acción | Impacto esperado | Esfuerzo estimado | Riesgo de no actuar | Prioridad justificada |
|---|---|---|---|---|
| AM-01 | Alto: 4 de 34 postulantes recuperan su evaluación y RQ-FUN-01 pasa a cumplir | Bajo (1 h) | Alto: postulantes válidos sin evaluar; un requisito A en "No cumple" deja Adecuación funcional como "No satisfactoria" | **Alta:** mucho impacto con poco esfuerzo |
| AM-02 | Alto: se cierra una vía real de manipulación del ranking | Bajo (1 h) | Alto: un postulante podría ganar ventaja injusta; RQ-SEG-06 (A) no cumpliría y Seguridad quedaría "No satisfactoria" | **Alta** |
| AM-03 | Alto: los años de experiencia pesan en el puntaje | Bajo (1 h) | Alto: puntajes incorrectos de forma sistemática | **Alta** (se hizo antes de congelar los umbrales) |
| AM-04 | Medio: menos superficie de ataque y menos información expuesta | Muy bajo (30 min) | Bajo: no había alertas altas | **Media:** se hizo por su bajo costo |
| AM-05 | Medio: defensa en profundidad contra scripts inyectados | Medio (2–3 h y pruebas) | Medio: hoy no se conoce ninguna vía de inyección de scripts; una CSP mal hecha puede romper la aplicación | **Media:** se recomienda con tiempo para probarla |
| AM-06 | Medio: cierra otras técnicas de inyección | Medio (3–4 h) | Medio: requiere un atacante que conozca el sistema | **Media** |
| AM-07 | Bajo: mejora 3 a 6 campos de 170 | Medio (3 h) | Bajo: RQ-FUN-01 ya cumple con margen y el reclutador ve el PDF | **Baja** |

## 13.4 Verificación de eficacia

La verificación es la **segunda medición oficial** (corridas 4–6, commit `3312f07`), hecha con las mismas condiciones y metas que la primera (corridas 1–3, commit `e1ac215`).

| Acción implementada | Cómo se comprobó | Resultado antes | Resultado después | ¿Fue eficaz? | Evidencia |
|---|---|---|---|---|---|
| AM-01 | 3 corridas en producción + consulta de motivos en la BD | M01 = 85,7 % ± 0,3; 12 `ERROR_INESPERADO` (4 CVs × 3) | M01 = 96,7 % ± 0,3; 0 `ERROR_INESPERADO` | **Sí** | EV-05, EV-06, EV-13 |
| AM-02 | Comparación de cv-37 con cv-02 y de cv-38 con cv-29 en las 3 corridas, y de sus puntajes | cv-37: 1 campo inventado ("Inglés C2") y +10 puntos (100 frente a 90) | 0 campos y 0 puntos en ambos pares | **Sí** (con riesgo residual, AM-06) | EV-05, EV-06, EV-13 |
| AM-03 | Corrida local antes y después; luego la medición oficial | Años correctos: 70,6 % (y 50,0 % con el prompt ajustado) | 97,1 % en local; 91,2 %–94,1 % en la 2.ª medición oficial | **Sí** | EV-15, EV-06 |
| AM-04 | Segundo escaneo base de ZAP y revisión de cabeceras con `curl` | 0 altas; 4 tipos medios, 2 bajos (9 tipos en total) | 0 altas; 3 tipos medios, 0 bajos (6 tipos en total) | **Sí** (la CSP queda en AM-05) | EV-09, EV-10 |

**Sin efectos secundarios.** Las mejoras no empeoraron otras métricas: el tiempo por CV pasó de un p95 de 4,7 s a 4,9 s (meta ≤ 15 s), la carga de 299 ms a 297 ms, y las pruebas E2E siguieron en 20 de 20 en los 4 perfiles (EV-12). Las 92 pruebas unitarias y 27 de integración siguen aprobadas.

**Estandarización (Actuar).** Cada corrección tiene una prueba automatizada en el CI que impide que el defecto vuelva: cv-05 sin caracteres de control (AM-01), cv-37 con el mismo texto que cv-02 (AM-02) y 6 pruebas de la suma de años (AM-03).

## 13.5 Riesgos residuales y seguimiento

| Riesgo | Estado | Seguimiento |
|---|---|---|
| Inyección con técnicas no cubiertas (texto blanco de tamaño normal, detrás de imágenes) | Abierto | AM-06. El CP manual CP-047 vuelve a probar cv-37 y cv-38 en producción |
| Sin CSP | Abierto | AM-05; se mantiene el escaneo base de ZAP después de cada despliegue importante |
| Errores residuales de la IA en nivel educativo y años (DEF-005, DEF-006) | Aceptado | El reclutador ve el PDF junto a los datos con la advertencia "Verifica estos datos contra el PDF". AM-07 a futuro |
| Cambio de modelo de IA o de su versión | Controlado | El modelo está fijado (`gpt-4o-mini-2024-07-18`) y se registra en cada postulación; cambiarlo exige repetir las 3 corridas con el script de medición |
| Pausa o límites de los planes gratuitos | En seguimiento | Monitor de UptimeRobot con alerta por correo hasta el 08/12/2026 (M14) |
| Defectos que encuentre el equipo en los casos manuales | Por conocer | Se registran en E10 (DEF-007 en adelante) y, si corresponde, aquí (AM-08 en adelante) |
