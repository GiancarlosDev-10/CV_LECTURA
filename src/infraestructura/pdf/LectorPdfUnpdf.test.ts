import { describe, expect, it } from "vitest";
import { ErrorPdfIlegible } from "@/dominio/puertos";
import { LectorPdfUnpdf } from "./LectorPdfUnpdf";

/** Construye un PDF 1.4 mínimo y válido con una línea de texto (sin dependencias). */
function crearPdfDePrueba(texto: string): Uint8Array {
  const contenido = `BT /F1 12 Tf 72 720 Td (${texto}) Tj ET`;
  const objetos = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${contenido.length} >>\nstream\n${contenido}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const desplazamientos: number[] = [];
  objetos.forEach((cuerpo, i) => {
    desplazamientos.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${cuerpo}\nendobj\n`;
  });
  const inicioXref = pdf.length;
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`;
  pdf += desplazamientos.map((d) => `${String(d).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

describe("LectorPdfUnpdf", () => {
  const lector = new LectorPdfUnpdf();

  it("extrae el texto de un PDF con capa de texto", async () => {
    const texto = await lector.extraerTexto(crearPdfDePrueba("Ana Torres - ana.torres@example.com"));
    expect(texto).toContain("Ana Torres");
    expect(texto).toContain("ana.torres@example.com");
  });

  it("lanza ErrorPdfIlegible si el archivo no es un PDF válido", async () => {
    const falso = new TextEncoder().encode("MZ esto es un ejecutable renombrado a .pdf");
    await expect(lector.extraerTexto(falso)).rejects.toBeInstanceOf(ErrorPdfIlegible);
  });
});
