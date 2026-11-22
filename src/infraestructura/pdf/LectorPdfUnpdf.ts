import { extractText, getDocumentProxy } from "unpdf";
import { ErrorPdfIlegible, type LectorPdf } from "@/dominio/puertos";

/**
 * Caracteres de control que algunas fuentes dejan en el texto (p. ej. U+0000). PostgreSQL no los
 * acepta en text ni en jsonb y la postulación no se podía guardar (DEF-001). Se conservan tab, LF y CR.
 */
const CONTROL_NO_IMPRIMIBLE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/**
 * Texto que una persona no puede leer: se descarta antes de enviarlo a la IA (DEF-002, RQ-SEG-06).
 * Un CV real usa 8 pt o más; las instrucciones ocultas suelen ir a 1 pt.
 */
export const TAMANO_MINIMO_LEGIBLE_PT = 4;

type ItemTexto = { str: string; transform: number[] };

/** Lector de PDF basado en unpdf (PDF.js, build serverless compatible con Vercel). */
export class LectorPdfUnpdf implements LectorPdf {
  async extraerTexto(pdf: Uint8Array): Promise<string> {
    try {
      // unpdf transfiere el buffer a PDF.js; se pasa una copia para no invalidar el original.
      const documento = await getDocumentProxy(new Uint8Array(pdf));
      const ilegibles: string[] = [];
      for (let n = 1; n <= documento.numPages; n++) {
        const { items } = await (await documento.getPage(n)).getTextContent();
        for (const item of items as ItemTexto[]) {
          const tamano = Math.hypot(item.transform[2], item.transform[3]);
          if (item.str.trim() && tamano < TAMANO_MINIMO_LEGIBLE_PT) ilegibles.push(item.str);
        }
      }
      const { text } = await extractText(documento, { mergePages: true });
      const visible = ilegibles.reduce((texto, fragmento) => texto.replace(fragmento, ""), text);
      return visible.replace(CONTROL_NO_IMPRIMIBLE, "");
    } catch (error) {
      throw new ErrorPdfIlegible(error);
    }
  }
}
