// Convierte docs/expediente/*.md en .docx con el estilo de la plantilla Formatos
// (Carta, Arial, títulos 1F4E79 / 2F5597, encabezados de tabla D9EAF7).
// Uso: npm run expediente (todos los .md de docs/expediente/) o con archivos sueltos como argumentos.
// Cada .docx se escribe al lado de su .md.
import fs from "node:fs";
import path from "node:path";
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  HeadingLevel, AlignmentType, BorderStyle, LevelFormat, Footer, PageNumber, TableLayoutType,
} from "docx";

const ANCHO = 12240 - 1020 * 2; // ancho útil en DXA (Carta, márgenes de la plantilla)
const BORDE = { style: BorderStyle.SINGLE, size: 4, color: "8EAADB" };
const BORDES = { top: BORDE, bottom: BORDE, left: BORDE, right: BORDE, insideHorizontal: BORDE, insideVertical: BORDE };

function runs(texto, base = {}) {
  // **negrita** y `código`
  const partes = texto.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return partes.map((p) => {
    if (p.startsWith("**")) return new TextRun({ ...base, text: p.slice(2, -2), bold: true });
    if (p.startsWith("`")) return new TextRun({ ...base, text: p.slice(1, -1), font: "Consolas" });
    return new TextRun({ ...base, text: p });
  });
}

function celdas(linea) {
  return linea.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

function anchos(filas, n) {
  // reparte el ancho según el largo del texto de cada columna (con mínimo)
  const largo = Array(n).fill(0);
  for (const f of filas) f.forEach((c, i) => (largo[i] += Math.min(c.length, 220) + 12));
  const total = largo.reduce((a, b) => a + b, 0);
  const w = largo.map((l) => Math.max(1300, Math.round((l / total) * ANCHO)));
  const exceso = w.reduce((a, b) => a + b, 0) - ANCHO;
  const iMax = w.indexOf(Math.max(...w));
  w[iMax] -= exceso;
  return w;
}

function tabla(filas, { encabezado = true, clave = false } = {}) {
  const n = filas[0].length;
  const w = clave ? [Math.round(ANCHO * 0.3), ANCHO - Math.round(ANCHO * 0.3)] : anchos(filas, n);
  return new Table({
    width: { size: ANCHO, type: WidthType.DXA },
    columnWidths: w,
    layout: TableLayoutType.FIXED,
    borders: BORDES,
    rows: filas.map((f, r) => {
      const esEnc = encabezado && r === 0;
      return new TableRow({
        tableHeader: esEnc,
        cantSplit: true,
        children: f.map((c, i) => {
          const sombra = esEnc || (clave && i === 0);
          return new TableCell({
            width: { size: w[i], type: WidthType.DXA },
            shading: sombra ? { type: ShadingType.CLEAR, fill: "D9EAF7", color: "auto" } : undefined,
            margins: { top: 50, bottom: 50, left: 90, right: 90 },
            children: [new Paragraph({ spacing: { after: 0 }, children: runs(c, { size: 18, bold: esEnc || (clave && i === 0) }) })],
          });
        }),
      });
    }),
  });
}

function convertir(archivo) {
  const lineas = fs.readFileSync(archivo, "utf8").replace(/\r/g, "").split("\n");
  const hijos = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new TextRun({ text: "PROYECTO FINAL – CALIDAD DE SOFTWARE Y SISTEMAS", bold: true, size: 20, color: "404040" })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [new TextRun({ text: "IESTP Gilda Liliana Ballivián Rosado · Desarrollo de Sistemas Informáticos · VI ciclo", size: 18, color: "5A5A5A" })] }),
  ];
  let i = 0;
  let primeraTabla = true;
  while (i < lineas.length) {
    const l = lineas[i];
    if (!l.trim() || l.startsWith(">")) { i++; continue; } // las notas de guía no van al .docx
    if (l.startsWith("# ")) {
      hijos.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(l.slice(2).toUpperCase())] }));
      i++; continue;
    }
    if (l.startsWith("## ")) {
      hijos.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(l.slice(3))] }));
      i++; continue;
    }
    if (l.startsWith("|")) {
      const filas = [];
      while (i < lineas.length && lineas[i].startsWith("|")) {
        if (!/^\|[\s|:-]+\|$/.test(lineas[i].trim())) filas.push(celdas(lineas[i]));
        i++;
      }
      // la primera tabla es la ficha del entregable (campo | valor): sin fila de encabezado
      if (primeraTabla && filas[0][0] === "Campo") {
        hijos.push(tabla(filas.slice(1), { encabezado: false, clave: true }));
      } else if (filas[0].length === 2 && filas[0][0] === "Campo") {
        hijos.push(tabla(filas.slice(1), { encabezado: false, clave: true }));
      } else {
        hijos.push(tabla(filas));
      }
      hijos.push(new Paragraph({ spacing: { after: 60 }, children: [] }));
      primeraTabla = false;
      continue;
    }
    if (/^- /.test(l)) {
      hijos.push(new Paragraph({ numbering: { reference: "vinetas", level: 0 }, spacing: { after: 60 }, children: runs(l.slice(2)) }));
      i++; continue;
    }
    if (/^\d+\. /.test(l)) {
      hijos.push(new Paragraph({ numbering: { reference: "numeros", level: 0 }, spacing: { after: 60 }, children: runs(l.replace(/^\d+\. /, "")) }));
      i++; continue;
    }
    hijos.push(new Paragraph({ spacing: { after: 120 }, alignment: AlignmentType.JUSTIFIED, children: runs(l) }));
    i++;
  }

  const doc = new Document({
    creator: "Giancarlos Ormeño",
    title: path.basename(archivo, ".md"),
    styles: {
      default: { document: { run: { font: "Arial", size: 20 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: "Arial", size: 28, bold: true, color: "1F4E79" },
          paragraph: { spacing: { before: 240, after: 160 }, keepNext: true, keepLines: true, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: "Arial", size: 22, bold: true, color: "2F5597" },
          paragraph: { spacing: { before: 240, after: 100 }, keepNext: true, keepLines: true, outlineLevel: 1 } },
      ],
    },
    numbering: {
      config: [
        { reference: "vinetas", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 260 } } } }] },
        { reference: "numeros", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 300 } } } }] },
      ],
    },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 907, right: 1020, bottom: 907, left: 1020 } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
        new TextRun({ text: "CV Lectura · " + path.basename(archivo, ".md").split("-")[0] + " · Página ", size: 16, color: "808080" }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "808080" }),
      ] })] }) },
      children: hijos,
    }],
  });
  const salida = archivo.replace(/\.md$/, ".docx");
  return Packer.toBuffer(doc).then((b) => { fs.writeFileSync(salida, b); console.log("✓", salida); });
}

// sin argumentos convierte todos los .md de docs/expediente/
const CARPETA = "docs/expediente";
const archivos = process.argv.length > 2
  ? process.argv.slice(2)
  : fs.readdirSync(CARPETA).filter((f) => f.endsWith(".md")).map((f) => path.join(CARPETA, f));

Promise.all(archivos.map(convertir)).catch((e) => { console.error(e); process.exit(1); });
