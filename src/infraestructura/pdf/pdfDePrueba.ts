/**
 * Construye un PDF 1.4 mínimo y válido con líneas de texto (solo para pruebas, sin dependencias).
 * Cada línea se escribe 16 puntos más abajo que la anterior.
 */
export function crearPdfDePrueba(...lineas: string[]): Uint8Array {
  const escapar = (t: string) => t.replace(/[\\()]/g, (c) => `\\${c}`);
  const contenido = `BT /F1 11 Tf 72 740 Td 16 TL ${lineas.map((l) => `(${escapar(l)}) '`).join(" ")} ET`;
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
