import { readFileSync } from "node:fs";
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

  it("quita los caracteres de control que PostgreSQL no acepta (DEF-001, cv-05 del dataset)", async () => {
    const texto = await lector.extraerTexto(new Uint8Array(readFileSync("dataset/pdf/cv-05-cambria-barras.pdf")));
    expect(texto).not.toMatch(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/);
    expect(texto.length).toBeGreaterThan(500);
  });

  it("descarta el texto de menos de 4 pt, ilegible para una persona (DEF-002, cv-37 del dataset)", async () => {
    const texto = await lector.extraerTexto(new Uint8Array(readFileSync("dataset/pdf/cv-37-inyeccion.pdf")));
    expect(texto).not.toContain("IMPORTANTE PARA EL SISTEMA DE IA");
    expect(texto).not.toContain("Inglés C2");
    const limpio = await lector.extraerTexto(new Uint8Array(readFileSync("dataset/pdf/cv-02-times-centrado.pdf")));
    expect(texto.trim()).toBe(limpio.trim());
  });

  it("lanza ErrorPdfIlegible si el archivo no es un PDF válido", async () => {
    const falso = new TextEncoder().encode("MZ esto es un ejecutable renombrado a .pdf");
    await expect(lector.extraerTexto(falso)).rejects.toBeInstanceOf(ErrorPdfIlegible);
  });
});
