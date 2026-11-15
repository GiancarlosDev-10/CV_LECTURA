import { describe, expect, it } from "vitest";
import { ErrorPdfIlegible } from "@/dominio/puertos";
import { LectorPdfUnpdf } from "./LectorPdfUnpdf";
import { crearPdfDePrueba } from "./pdfDePrueba";

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
