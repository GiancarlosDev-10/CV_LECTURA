/**
 * Lectura centralizada de variables de entorno. Falla con un mensaje claro
 * si falta una variable, en lugar de errores difíciles de rastrear.
 */
function requerida(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) {
    throw new Error(`Falta la variable de entorno ${nombre} (ver .env.example)`);
  }
  return valor;
}

export const entorno = {
  supabaseUrl: () => requerida("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseClavePublica: () => requerida("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  supabaseClaveSecreta: () => requerida("SUPABASE_SECRET_KEY"),
  extractorIa: (): "simulado" | "openai" => (process.env.EXTRACTOR_IA === "openai" ? "openai" : "simulado"),
  openAiClave: () => requerida("OPENAI_API_KEY"),
  openAiModelo: () => requerida("OPENAI_MODEL"),
  openAiTemperatura: (): number | undefined => {
    const valor = process.env.OPENAI_TEMPERATURE;
    return valor === undefined || valor === "" ? undefined : Number(valor);
  },
};
