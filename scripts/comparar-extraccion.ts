/**
 * Compara una o más corridas de extracción con el dataset esperado (E05 5.5).
 *   npm run comparar -- dataset/corridas/corrida-1.json [corrida-2.json corrida-3.json]
 * Escribe un reporte Markdown junto a cada corrida (<nombre>.reporte.md) y, con
 * varias corridas, el promedio y la desviación estándar de RQ-FUN-01 y RQ-FUN-02.
 */
import { writeFileSync } from "node:fs";
import {
  CAMPOS_SIMPLES,
  compararCorrida,
  resumirCorridas,
  type ConteoLista,
  type ResultadoCorrida,
} from "./comparador/compararExtraccion";
import { casosDelAlcance, leerCorrida, leerEsperados, type Corrida } from "./comparador/corrida";

const META_CAMPOS = 90;
const META_F1 = 0.85;

const pct = (v: number) => `${v.toFixed(1)} %`;
const dec = (v: number) => v.toFixed(3);
const cumple = (ok: boolean) => (ok ? "Cumple" : "No cumple");

function listaDiferencias(nombre: string, l: ConteoLista): string[] {
  const partes: string[] = [];
  if (l.faltantes.length) partes.push(`${nombre} faltantes: ${l.faltantes.join(", ")}`);
  if (l.inventados.length) partes.push(`${nombre} inventadas: ${l.inventados.join(", ")}`);
  return partes;
}

function reporte(corrida: Corrida, r: ResultadoCorrida): string {
  const procesados = r.detalle.filter((d) => d.estado === "procesada").length;
  const filas = r.detalle.map((d) => {
    const marcas = CAMPOS_SIMPLES.map((c) => (d.campos[c] ? "✓" : "✗")).join(" | ");
    const observaciones = [
      d.estado !== "procesada" ? `${d.estado}${d.motivo ? ` (${d.motivo})` : ""}` : "",
      ...listaDiferencias("habilidades", d.habilidades),
      ...listaDiferencias("idiomas", d.idiomas),
    ].filter(Boolean);
    const aciertos = d.habilidades.aciertos + d.idiomas.aciertos;
    const esperados = d.habilidades.esperados + d.idiomas.esperados;
    return `| ${d.id} | ${marcas} | ${aciertos}/${esperados} | ${observaciones.join("; ") || "—"} |`;
  });

  return `# Reporte del comparador — ${corrida.corrida}

| Dato | Valor |
|---|---|
| Entorno | ${corrida.entorno} |
| Modelo de IA | ${corrida.modelo} |
| Commit | ${corrida.commit} |
| Fecha de la corrida | ${corrida.fecha} |
| CVs evaluados | ${r.detalle.length} (procesados: ${procesados}) |
| CVs sin resultado | ${r.sinResultado.length ? r.sinResultado.join(", ") : "ninguno"} |

${corrida.entorno === "prod" ? "" : "> Medición de preparación (no es de producción): no sirve para decidir el requisito (E05 5.7).\n"}
## Resultado

| Requisito | Indicador | Valor | Meta | Resultado |
|---|---|---|---|---|
| RQ-FUN-01 | % de campos correctos | ${pct(r.porcentajeCampos)} (${r.camposCorrectos}/${r.camposEvaluados}) | ≥ ${META_CAMPOS} % | ${cumple(r.porcentajeCampos >= META_CAMPOS)} |
| RQ-FUN-02 | F1 de habilidades e idiomas | ${dec(r.f1)} (P = ${dec(r.precision)}, R = ${dec(r.exhaustividad)}) | ≥ ${META_F1} | ${cumple(r.f1 >= META_F1)} |

Listas: ${r.listas.aciertos} aciertos, ${r.listas.extraidos} extraídos y ${r.listas.esperados} esperados.

## Aciertos por campo

| Campo | Correctos | % |
|---|---|---|
${CAMPOS_SIMPLES.map((c) => `| ${c} | ${r.porCampo[c]}/${r.detalle.length} | ${pct((r.porCampo[c] / r.detalle.length) * 100)} |`).join("\n")}

## Detalle por CV

| CV | ${CAMPOS_SIMPLES.join(" | ")} | Listas | Observaciones |
|---|${CAMPOS_SIMPLES.map(() => "---").join("|")}|---|---|
${filas.join("\n")}
`;
}

const rutas = process.argv.slice(2);
if (rutas.length === 0) {
  console.error("Uso: npm run comparar -- <corrida.json> [<corrida.json> ...]");
  process.exit(1);
}

const casos = casosDelAlcance(leerEsperados("dataset/esperados"));
const resultados = rutas.map((ruta) => {
  const corrida = leerCorrida(ruta);
  const r = compararCorrida(casos, corrida.resultados);
  const salida = ruta.replace(/\.json$/, ".reporte.md");
  writeFileSync(salida, reporte(corrida, r));
  console.log(
    `${corrida.corrida} (${corrida.entorno}): campos ${pct(r.porcentajeCampos)} · F1 ${dec(r.f1)}` +
      `${r.sinResultado.length ? ` · sin resultado: ${r.sinResultado.join(", ")}` : ""} → ${salida}`,
  );
  return { corrida, r };
});

if (resultados.length > 1) {
  const entornos = new Set(resultados.map(({ corrida }) => corrida.entorno));
  const modelos = new Set(resultados.map(({ corrida }) => corrida.modelo));
  if (entornos.size > 1 || modelos.size > 1) {
    console.warn("Atención: las corridas no comparten entorno o modelo; el promedio no es comparable.");
  }
  const s = resumirCorridas(resultados.map(({ r }) => r));
  console.log(
    `\nPromedio de ${resultados.length} corridas (desviación estándar muestral):\n` +
      `  RQ-FUN-01: ${pct(s.porcentajeCampos.promedio)} ± ${s.porcentajeCampos.desviacion.toFixed(1)} → ${cumple(s.porcentajeCampos.promedio >= META_CAMPOS)}\n` +
      `  RQ-FUN-02: ${dec(s.f1.promedio)} ± ${dec(s.f1.desviacion)} → ${cumple(s.f1.promedio >= META_F1)}`,
  );
}
