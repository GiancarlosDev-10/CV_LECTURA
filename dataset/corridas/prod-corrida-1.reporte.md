# Reporte del comparador — prod-corrida-1

| Dato | Valor |
|---|---|
| Entorno | prod |
| Modelo de IA | gpt-4o-mini-2024-07-18 |
| Commit | e1ac215 |
| Fecha de la corrida | 2026-11-22T20:44:08.014Z |
| CVs evaluados | 34 (procesados: 30) |
| CVs sin resultado | ninguno |


## Resultado

| Requisito | Indicador | Valor | Meta | Resultado |
|---|---|---|---|---|
| RQ-FUN-01 | % de campos correctos | 85.9 % (146/170) | ≥ 90 % | No cumple |
| RQ-FUN-02 | F1 de habilidades e idiomas | 0.932 (P = 0.989, R = 0.881) | ≥ 0.85 | Cumple |

Listas: 267 aciertos, 270 extraídos y 303 esperados.

## Aciertos por campo

| Campo | Correctos | % |
|---|---|---|
| nombre | 30/34 | 88.2 % |
| email | 30/34 | 88.2 % |
| telefono | 30/34 | 88.2 % |
| aniosExperiencia | 28/34 | 82.4 % |
| nivelEducativo | 28/34 | 82.4 % |

## Detalle por CV

| CV | nombre | email | telefono | aniosExperiencia | nivelEducativo | Listas | Observaciones |
|---|---|---|---|---|---|---|---|
| cv-01 | ✓ | ✓ | ✓ | ✓ | ✓ | 9/9 | — |
| cv-02 | ✓ | ✓ | ✓ | ✓ | ✓ | 9/9 | — |
| cv-03 | ✓ | ✓ | ✓ | ✓ | ✓ | 9/9 | — |
| cv-04 | ✓ | ✓ | ✓ | ✗ | ✓ | 11/11 | — |
| cv-05 | ✗ | ✗ | ✗ | ✗ | ✗ | 0/10 | pendiente_revision_manual (ERROR_INESPERADO); habilidades faltantes: html5, java, mongodb, nextjs, node.js, php, postgresql, sql, typescript; idiomas faltantes: ingles B2 |
| cv-06 | ✓ | ✓ | ✓ | ✓ | ✓ | 13/13 | — |
| cv-07 | ✗ | ✗ | ✗ | ✗ | ✗ | 0/8 | pendiente_revision_manual (ERROR_INESPERADO); habilidades faltantes: estadistica, google sheets, looker studio, machine learning basico, python, sql, tableau; idiomas faltantes: ingles A2 |
| cv-08 | ✗ | ✗ | ✗ | ✗ | ✗ | 0/10 | pendiente_revision_manual (ERROR_INESPERADO); habilidades faltantes: express, laravel, node.js, php, react, rest apis, scrum, typescript; idiomas faltantes: espanol nativo, ingles C1 |
| cv-09 | ✓ | ✓ | ✓ | ✓ | ✓ | 13/14 | habilidades faltantes: mongodb; habilidades inventadas: desarrollador full stack, desarrollo web |
| cv-10 | ✓ | ✓ | ✓ | ✓ | ✓ | 13/13 | — |
| cv-11 | ✓ | ✓ | ✓ | ✓ | ✓ | 9/9 | — |
| cv-12 | ✓ | ✓ | ✓ | ✓ | ✓ | 13/13 | — |
| cv-13 | ✓ | ✓ | ✓ | ✓ | ✓ | 5/5 | — |
| cv-14 | ✓ | ✓ | ✓ | ✓ | ✓ | 10/10 | — |
| cv-15 | ✓ | ✓ | ✓ | ✓ | ✓ | 5/5 | — |
| cv-16 | ✓ | ✓ | ✓ | ✓ | ✓ | 11/11 | — |
| cv-17 | ✓ | ✓ | ✓ | ✓ | ✓ | 9/9 | — |
| cv-18 | ✓ | ✓ | ✓ | ✓ | ✓ | 9/9 | — |
| cv-19 | ✓ | ✓ | ✓ | ✗ | ✓ | 10/11 | habilidades faltantes: r; habilidades inventadas: r tools |
| cv-20 | ✓ | ✓ | ✓ | ✓ | ✓ | 3/3 | — |
| cv-21 | ✓ | ✓ | ✓ | ✓ | ✗ | 9/9 | — |
| cv-22 | ✓ | ✓ | ✓ | ✓ | ✓ | 9/9 | — |
| cv-23 | ✓ | ✓ | ✓ | ✓ | ✓ | 10/10 | — |
| cv-24 | ✓ | ✓ | ✓ | ✓ | ✓ | 4/4 | — |
| cv-25 | ✓ | ✓ | ✓ | ✓ | ✗ | 5/5 | — |
| cv-26 | ✓ | ✓ | ✓ | ✓ | ✓ | 6/6 | — |
| cv-27 | ✓ | ✓ | ✓ | ✓ | ✓ | 11/11 | — |
| cv-28 | ✓ | ✓ | ✓ | ✓ | ✓ | 11/11 | — |
| cv-29 | ✓ | ✓ | ✓ | ✓ | ✓ | 8/8 | — |
| cv-30 | ✓ | ✓ | ✓ | ✓ | ✓ | 6/6 | — |
| cv-31 | ✓ | ✓ | ✓ | ✓ | ✓ | 13/13 | — |
| cv-32 | ✗ | ✗ | ✗ | ✗ | ✗ | 0/6 | pendiente_revision_manual (ERROR_INESPERADO); habilidades faltantes: css3, express, nextjs, node.js; idiomas faltantes: espanol nativo, ingles B2 |
| cv-33 | ✓ | ✓ | ✓ | ✓ | ✓ | 3/3 | — |
| cv-34 | ✓ | ✓ | ✓ | ✓ | ✓ | 11/11 | — |
