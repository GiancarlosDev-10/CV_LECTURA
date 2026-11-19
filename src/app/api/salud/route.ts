import { NextResponse } from "next/server";
import { clienteServicio } from "@/infraestructura/supabase/clienteServicio";

/**
 * Verificación de disponibilidad (RQ-FIA-02) para el monitor externo.
 * Responde 200 solo si la aplicación Y la base de datos responden; si Supabase falla, 503.
 * No devuelve datos: la consulta solo cuenta filas (head) para tocar PostgreSQL.
 */
export async function GET() {
  const inicio = Date.now();
  const { error } = await clienteServicio().from("ofertas").select("id", { count: "exact", head: true });
  const cuerpo = { estado: error ? "caido" : "ok", bd: error ? "error" : "ok", ms: Date.now() - inicio };
  return NextResponse.json(cuerpo, { status: error ? 503 : 200, headers: { "Cache-Control": "no-store" } });
}
