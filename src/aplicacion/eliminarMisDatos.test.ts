import { describe, expect, it, vi } from "vitest";
import type { DatosDelPostulante } from "@/dominio/puertos";
import { eliminarMiCuenta, eliminarPostulacion } from "./eliminarMisDatos";

function datosFalsos(parcial: Partial<DatosDelPostulante> = {}): DatosDelPostulante {
  return {
    leerInicioDelCv: vi.fn(),
    crearPostulacion: vi.fn(),
    rutaDelCv: vi.fn(async () => "u1/p1.pdf"),
    rutasDeTodosMisCv: vi.fn(async () => ["u1/p1.pdf", "u1/p2.pdf"]),
    eliminarArchivos: vi.fn(async () => {}),
    eliminarPostulacion: vi.fn(async () => {}),
    eliminarCuenta: vi.fn(async () => {}),
    ...parcial,
  };
}

describe("eliminarPostulacion (derecho de cancelación)", () => {
  it("borra primero el PDF y luego la postulación", async () => {
    const orden: string[] = [];
    const datos = datosFalsos({
      eliminarArchivos: vi.fn(async () => void orden.push("archivo")),
      eliminarPostulacion: vi.fn(async () => void orden.push("postulacion")),
    });

    expect(await eliminarPostulacion("p1", datos)).toEqual({ ok: true });
    expect(datos.eliminarArchivos).toHaveBeenCalledWith(["u1/p1.pdf"]);
    expect(orden).toEqual(["archivo", "postulacion"]);
  });

  it("si la postulación no existe o no es suya → NO_ENCONTRADA", async () => {
    const datos = datosFalsos({ rutaDelCv: vi.fn(async () => null) });
    expect(await eliminarPostulacion("ajena", datos)).toEqual({ ok: false, error: "NO_ENCONTRADA" });
    expect(datos.eliminarPostulacion).not.toHaveBeenCalled();
  });

  it("si falla el borrado del PDF, no borra la fila (evita archivos huérfanos sin rastro)", async () => {
    const datos = datosFalsos({
      eliminarArchivos: vi.fn(async () => {
        throw new Error("storage caído");
      }),
    });
    await expect(eliminarPostulacion("p1", datos)).rejects.toThrow("storage caído");
    expect(datos.eliminarPostulacion).not.toHaveBeenCalled();
  });
});

describe("eliminarMiCuenta", () => {
  it("borra todos los PDF y luego la cuenta (las postulaciones caen en cascada)", async () => {
    const datos = datosFalsos();
    await eliminarMiCuenta(datos);

    expect(datos.eliminarArchivos).toHaveBeenCalledWith(["u1/p1.pdf", "u1/p2.pdf"]);
    expect(datos.eliminarCuenta).toHaveBeenCalledOnce();
  });
});
