# Dataset de prueba — 40 CVs ficticios (PLAN §11)

Sirve para medir la extracción con IA (RQ-FUN-01, RQ-FUN-02, RQ-DES-01) y los casos negativos (RQ-SEG-06, validación de tipo y tamaño).

**Todos los datos son ficticios**: nombres combinados al azar, correos `@example.com`, teléfonos `900 000 1xx`, empresas e instituciones inventadas y una silueta genérica en lugar de foto. Los **diseños** imitan CVs reales en formatos de Word, Google Docs y Canva que se usaron solo como referencia visual; esos CVs reales **no** están en el repositorio (`docs/cvs/` está en `.gitignore`).

## Cómo se genera

```bash
npm run dataset        # escribe dataset/pdf/ y dataset/esperados/
```

- Semilla fija: cada ejecución produce exactamente los mismos datos.
- La respuesta esperada se calcula de los **mismos datos** con que se dibuja el PDF, así siempre coinciden.
- Requiere el Chromium de Playwright y las fuentes de Windows (Times New Roman, Cambria, Arial, Calibri, Segoe UI, Georgia).
- `cv-40` (más de 5 MB) no se sube al repositorio: se regenera con el mismo comando.

## Composición

| CV | Cantidad | Qué prueba | Resultado esperado |
|---|---|---|---|
| cv-01 … cv-30 | 30 | Exactitud y tiempo de la extracción en 8 estilos (ver abajo), 25 en español y 5 en inglés | `procesada` con los datos de `esperado` |
| cv-31 … cv-34 | 4 | Uno por integrante (Raquel, Hermy, Nancy y Paul) con el formato de su propio CV y datos ficticios (realismo y participación) | `procesada` con los datos de `esperado` |
| cv-35, cv-36 | 2 | PDF escaneado: solo imagen, sin texto (basados en cv-14 y cv-06) | `pendiente_revision_manual` con motivo `PDF_SIN_TEXTO` |
| cv-37, cv-38 | 2 | Inyección de instrucciones en texto blanco de 1 pt (copias de cv-02 y cv-29) | `procesada` con datos **idénticos** a su CV limpio (RQ-SEG-06) |
| cv-39 | 1 | Archivo con cabecera de ejecutable de Windows (`MZ`) renombrado a `.pdf` (no es un programa real) | Rechazo `ARCHIVO_NO_ES_PDF` |
| cv-40 | 1 | PDF válido de 5,6 MB | Rechazo por tamaño (formulario y bucket de Storage) |

**Estilos** (diseño inspirado en las referencias): `times-centrado` (Word), `cambria-barras` (Word), `moderno-sans` (Word), `clasico-numerado` (Word con foto y números romanos), `docs-azul-tabla` (Google Docs con tabla de competencias), `canva-elegante` (Canva con foto), `canva-minimal` (Canva con poco texto) y `dos-columnas` (barra lateral).

**Ofertas** (las 3 del seed): Desarrollador Full Stack Junior, Analista de Datos y Asistente de Recursos Humanos, con candidatos de ajuste alto, medio y bajo para que el ranking tenga variedad.

## Formato de `esperados/cv-NN.json`

```json
{
  "id": "cv-14",
  "archivo": "cv-14-clasico-numerado.pdf",
  "estilo": "clasico-numerado", "lengua": "es",
  "oferta": "Asistente de Recursos Humanos", "ajuste": "medio",
  "resultadoEsperado": { "tipo": "procesada" },
  "esperado": { "nombre": "…", "email": "…", "telefono": "…", "aniosExperiencia": 3.5,
                "nivelEducativo": "tecnico", "habilidades": ["…"], "idiomas": [{ "idioma": "Inglés", "nivel": "B1" }] }
}
```

`esperado` sigue el contrato `CvExtraido` del sistema (`src/dominio/entidades/cvExtraido.ts`).

## Reglas con que se escribió la respuesta esperada

Son las mismas instrucciones que recibe la IA (`INSTRUCCIONES_EXTRACCION`):

- **Habilidades e idiomas:** tal como están escritos en el CV (por ejemplo "JS", "ReactJS" o "MS Excel" para probar la tabla de alias).
- **Nivel de idioma:** "Intermedio" = B1, "Avanzado" = C1, "Básico" = A2, "Nativo" = `nativo`.
- **Años de experiencia:** suma de la duración de los trabajos listados (los trabajos actuales cuentan hasta noviembre de 2026), en bloques de 6 meses. Si el CV no tiene experiencia, el valor es `null`.
- **Nivel educativo:** el más alto **terminado**; un estudio "en curso" no cuenta (por ejemplo, una maestría en curso con bachiller terminado = `universitario`).

## Comparador de la extracción (RQ-FUN-01 y RQ-FUN-02)

Aplica las reglas de comparación de **E05, sección 5.5** (nombre sin mayúsculas ni tildes, teléfono solo dígitos sin +51, años ± 0,5, habilidades e idiomas normalizados con la tabla de alias del sistema). Un CV en revisión manual o sin resultado cuenta con todos sus campos incorrectos. El alcance es cv-01 a cv-34 (E05 5.3).

```bash
npm run corrida:local -- prueba1     # corrida de PREPARACIÓN con procesarCv, sin BD (extractor según EXTRACTOR_IA)
npm run comparar -- dataset/corridas/local-prueba1.json
npm run comparar -- dataset/corridas/corrida-1.json dataset/corridas/corrida-2.json dataset/corridas/corrida-3.json
```

- Cada corrida es un archivo `dataset/corridas/<nombre>.json` con `corrida`, `entorno` (`local`, `dev` o `prod`), `modelo`, `commit`, `fecha` y `resultados` (`{ id, estado: "procesada", cvExtraido }` o `{ id, estado: "pendiente_revision_manual", motivo }`).
- El comparador escribe `<nombre>.reporte.md` (resultado, aciertos por campo y diferencias por CV) y, con varias corridas, el promedio y la desviación estándar muestral.
- Las corridas `local-*` son de preparación y no se suben al repositorio. **La medición oficial se hace en producción** (E05 5.7).

## CVs con el formato del equipo (cv-31 … cv-34)

Se generan igual que cv-01…30 (misma semilla, agregados al final para no alterar los anteriores). Cada uno usa la plantilla que imita el CV de un integrante; los datos son ficticios.

| CV | Integrante | Estilo |
|---|---|---|
| cv-31 | Raquel | `docs-azul-tabla` |
| cv-32 | Hermy | `cambria-barras` |
| cv-33 | Nancy | `canva-minimal` |
| cv-34 | Paul | `times-centrado` (no tiene CV propio: se usa un formato genérico de Word) |
