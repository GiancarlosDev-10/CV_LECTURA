import { beforeEach, describe, expect, it } from "vitest";
import { CONSENTIMIENTO_VIGENTE } from "@/dominio/entidades/consentimiento";
import type { DatosDelPostulante, NuevaPostulacion } from "@/dominio/puertos";
import { postularAOferta, type SolicitudPostulacion } from "./postularAOferta";

const POSTULANTE = "11111111-1111-4111-8111-111111111111";
const OFERTA = "22222222-2222-4222-8222-222222222222";
const POSTULACION = "33333333-3333-4333-8333-333333333333";
const RUTA = `${POSTULANTE}/${POSTULACION}.pdf`;

class DatosEnMemoria implements DatosDelPostulante {
  archivos = new Map<string, Uint8Array>();
  creadas: NuevaPostulacion[] = [];
  respuestaCrear: "creada" | "duplicada" | "oferta_no_disponible" = "creada";

  async leerInicioDelCv(ruta: string, bytes: number) {
    return this.archivos.get(ruta)?.slice(0, bytes) ?? null;
  }
  async crearPostulacion(p: NuevaPostulacion) {
    if (this.respuestaCrear === "creada") this.creadas.push(p);
    return this.respuestaCrear;
  }
  async rutaDelCv() {
    return null;
  }
  async rutasDeTodosMisCv() {
    return [];
  }
  async eliminarArchivos(rutas: string[]) {
    rutas.forEach((r) => this.archivos.delete(r));
  }
  async eliminarPostulacion() {}
  async eliminarCuenta() {}
}

const pdf = new TextEncoder().encode("%PDF-1.7\ncontenido");
const ejecutable = new TextEncoder().encode("MZ\x90\x00 ejecutable renombrado");
const ahora = new Date("2026-11-20T10:00:00Z");

let datos: DatosEnMemoria;
const solicitud = (parcial: Partial<SolicitudPostulacion> = {}): SolicitudPostulacion => ({
  postulanteId: POSTULANTE,
  ofertaId: OFERTA,
  postulacionId: POSTULACION,
  aceptaConsentimiento: true,
  versionConsentimiento: CONSENTIMIENTO_VIGENTE.version,
  ...parcial,
});
const ejecutar = (s: SolicitudPostulacion) => postularAOferta(s, { datos, reloj: () => ahora });

beforeEach(() => {
  datos = new DatosEnMemoria();
  datos.archivos.set(RUTA, pdf);
});

describe("postularAOferta", () => {
  it("crea la postulación con el consentimiento vigente y su fecha", async () => {
    const resultado = await ejecutar(solicitud());

    expect(resultado).toEqual({ ok: true, postulacionId: POSTULACION });
    expect(datos.creadas).toEqual([
      {
        id: POSTULACION,
        ofertaId: OFERTA,
        postulanteId: POSTULANTE,
        rutaCv: RUTA,
        consentimientoVersion: CONSENTIMIENTO_VIGENTE.version,
        consentimientoEn: ahora,
      },
    ]);
  });

  it("sin consentimiento → rechaza y borra el archivo subido", async () => {
    const resultado = await ejecutar(solicitud({ aceptaConsentimiento: false }));

    expect(resultado).toEqual({ ok: false, error: "CONSENTIMIENTO_REQUERIDO" });
    expect(datos.creadas).toHaveLength(0);
    expect(datos.archivos.has(RUTA)).toBe(false);
  });

  it("con una versión de consentimiento desactualizada → rechaza", async () => {
    const resultado = await ejecutar(solicitud({ versionConsentimiento: "v0-antigua" }));
    expect(resultado).toEqual({ ok: false, error: "CONSENTIMIENTO_DESACTUALIZADO" });
  });

  it("archivo que no es PDF aunque tenga extensión .pdf → rechaza y lo borra", async () => {
    datos.archivos.set(RUTA, ejecutable);
    const resultado = await ejecutar(solicitud());

    expect(resultado).toEqual({ ok: false, error: "ARCHIVO_NO_ES_PDF" });
    expect(datos.archivos.has(RUTA)).toBe(false);
  });

  it("archivo inexistente → ARCHIVO_NO_ENCONTRADO", async () => {
    datos.archivos.clear();
    expect(await ejecutar(solicitud())).toEqual({ ok: false, error: "ARCHIVO_NO_ENCONTRADO" });
  });

  it("identificador de postulación inválido (posible manipulación de ruta) → rechaza sin tocar archivos", async () => {
    const resultado = await ejecutar(solicitud({ postulacionId: "../otro-usuario/cv" }));

    expect(resultado).toEqual({ ok: false, error: "SOLICITUD_INVALIDA" });
    expect(datos.archivos.has(RUTA)).toBe(true);
  });

  it.each([
    ["duplicada", "YA_POSTULO"],
    ["oferta_no_disponible", "OFERTA_NO_DISPONIBLE"],
  ] as const)("si la base responde '%s' → %s y borra el archivo", async (respuesta, error) => {
    datos.respuestaCrear = respuesta;
    const resultado = await ejecutar(solicitud());

    expect(resultado).toEqual({ ok: false, error });
    expect(datos.archivos.has(RUTA)).toBe(false);
  });
});
