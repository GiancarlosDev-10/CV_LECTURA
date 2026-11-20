/**
 * Genera el dataset de prueba (PLAN §11) en dataset/:
 *   pdf/cv-NN-<estilo>.pdf   el CV
 *   esperados/cv-NN.json     la respuesta esperada (se escribe ANTES de dibujar el PDF, con los mismos datos)
 *
 * 30 normales (cv-01…30) · 4 con el formato del CV de cada integrante (cv-31…34)
 * 2 escaneados (cv-35, 36) · 2 con inyección de instrucciones (cv-37, 38)
 * 1 ejecutable renombrado a .pdf (cv-39) · 1 de más de 5 MB (cv-40)
 *
 * Uso: npm run dataset   (requiere Chromium de Playwright: npx playwright install chromium)
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium, type Page } from "@playwright/test";
import { PERFILES, respuestaEsperada, type Perfil } from "./dataset/datos";
import { INYECCION, PLANTILLAS } from "./dataset/plantillas";

const RAIZ = "dataset";
const DIR_PDF = join(RAIZ, "pdf");
const DIR_ESPERADOS = join(RAIZ, "esperados");

type Resultado =
  | { tipo: "procesada" }
  | { tipo: "pendiente_revision_manual"; motivo: "PDF_SIN_TEXTO" }
  | { tipo: "rechazo_postulacion"; error: "ARCHIVO_NO_ES_PDF" }
  | { tipo: "rechazo_tamano"; detalle: string };

function guardarEsperado(id: string, archivo: string, datos: Record<string, unknown>, resultado: Resultado, esperado: unknown) {
  writeFileSync(join(DIR_ESPERADOS, `${id}.json`), JSON.stringify({ id, archivo, ...datos, resultadoEsperado: resultado, esperado }, null, 2) + "\n");
}

const meta = (p: Perfil) => ({ estilo: p.estilo, lengua: p.lengua, oferta: p.oferta, ajuste: p.ajuste });

async function pdfDesdeHtml(pagina: Page, html: string, destino: string) {
  await pagina.setContent(html, { waitUntil: "load" });
  await pagina.pdf({ path: destino, format: "A4", printBackground: true, preferCSSPageSize: true });
}

/** "Escanea" un CV: lo convierte en una imagen y arma un PDF que solo contiene esa imagen (sin capa de texto). */
async function pdfEscaneado(pagina: Page, html: string, destino: string) {
  await pagina.setViewportSize({ width: 794, height: 1123 }); // A4 a 96 ppp
  await pagina.setContent(html, { waitUntil: "load" });
  const imagen = await pagina.screenshot({ type: "jpeg", quality: 70, clip: { x: 0, y: 0, width: 794, height: 1123 } });
  const htmlImagen = `<!doctype html><html><head><style>@page{size:A4;margin:0}body{margin:0}img{width:210mm;height:297mm;filter:grayscale(1) contrast(1.1)}</style></head>
    <body><img src="data:image/jpeg;base64,${imagen.toString("base64")}"></body></html>`;
  await pdfDesdeHtml(pagina, htmlImagen, destino);
}

async function main() {
  mkdirSync(DIR_PDF, { recursive: true });
  mkdirSync(DIR_ESPERADOS, { recursive: true });
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage();

  // 1) 34 CVs normales (cv-31…34 con el formato del CV de cada integrante)
  for (const p of PERFILES) {
    const archivo = `${p.id}-${p.estilo}.pdf`;
    guardarEsperado(p.id, archivo, meta(p), { tipo: "procesada" }, respuestaEsperada(p));
    await pdfDesdeHtml(pagina, PLANTILLAS[p.estilo](p), join(DIR_PDF, archivo));
    console.log("✓", archivo);
  }

  const porId = (id: string) => PERFILES.find((p) => p.id === id)!;

  // 2) Escaneados: imagen sin texto → la extracción no se intenta y queda en revisión manual
  for (const [id, base] of [["cv-35", "cv-14"], ["cv-36", "cv-06"]] as const) {
    const p = porId(base);
    const archivo = `${id}-escaneado.pdf`;
    guardarEsperado(id, archivo, { ...meta(p), basadoEn: base }, { tipo: "pendiente_revision_manual", motivo: "PDF_SIN_TEXTO" }, null);
    await pdfEscaneado(pagina, PLANTILLAS[p.estilo](p), join(DIR_PDF, archivo));
    console.log("✓", archivo);
  }
  await pagina.setViewportSize({ width: 1280, height: 720 });

  // 3) Inyección de instrucciones: mismo CV que su par limpio + texto oculto; el resultado esperado es IDÉNTICO al limpio
  for (const [id, limpio] of [["cv-37", "cv-02"], ["cv-38", "cv-29"]] as const) {
    const p = porId(limpio);
    const archivo = `${id}-inyeccion.pdf`;
    guardarEsperado(id, archivo, { ...meta(p), cvLimpio: limpio }, { tipo: "procesada" }, respuestaEsperada(p));
    const html = PLANTILLAS[p.estilo](p).replace("<body>", '<body style="position:relative">').replace("</body>", `${INYECCION}</body>`);
    await pdfDesdeHtml(pagina, html, join(DIR_PDF, archivo));
    console.log("✓", archivo);
  }

  // 4) Ejecutable renombrado a .pdf: cabecera "MZ" de Windows + bytes de relleno (no es un programa real)
  {
    const archivo = "cv-39-ejecutable-renombrado.pdf";
    const bytes = Buffer.alloc(48 * 1024);
    bytes.write("MZ", 0, "ascii");
    for (let i = 2; i < bytes.length; i++) bytes[i] = (i * 31 + 7) % 256;
    writeFileSync(join(DIR_PDF, archivo), bytes);
    guardarEsperado("cv-39", archivo, { estilo: null, lengua: null, oferta: "Desarrollador Full Stack Junior", ajuste: null }, { tipo: "rechazo_postulacion", error: "ARCHIVO_NO_ES_PDF" }, null);
    console.log("✓", archivo);
  }

  // 5) PDF válido de más de 5 MB: un CV normal + ~5,5 MB de líneas de comentario PDF ("%") después del %%EOF.
  //    Los lectores de PDF las ignoran; sirven solo para superar el límite de tamaño.
  {
    const p = porId("cv-10");
    const archivo = "cv-40-mas-de-5mb.pdf";
    const destino = join(DIR_PDF, archivo);
    await pdfDesdeHtml(pagina, PLANTILLAS[p.estilo](p), destino);
    const linea = "%" + "relleno-de-prueba-RQ-tamano-maximo-5MB-".repeat(2) + "\n";
    appendFileSync(destino, "\n" + linea.repeat(Math.ceil((5.5 * 1024 * 1024) / linea.length)));
    guardarEsperado("cv-40", archivo, { ...meta(p), basadoEn: "cv-10" }, { tipo: "rechazo_tamano", detalle: "Supera 5 MB: lo rechaza el formulario y el bucket de Storage" }, null);
    console.log("✓", archivo);
  }

  await navegador.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
