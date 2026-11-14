import { extractText } from "unpdf";
import { ErrorPdfIlegible, type LectorPdf } from "@/dominio/puertos";

/** Lector de PDF basado en unpdf (PDF.js, build serverless compatible con Vercel). */
export class LectorPdfUnpdf implements LectorPdf {
  async extraerTexto(pdf: Uint8Array): Promise<string> {
    try {
      // unpdf transfiere el buffer a PDF.js; se pasa una copia para no invalidar el original.
      const { text } = await extractText(new Uint8Array(pdf), { mergePages: true });
      return text;
    } catch (error) {
      throw new ErrorPdfIlegible(error);
    }
  }
}
