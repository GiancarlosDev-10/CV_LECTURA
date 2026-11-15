import { redirect } from "next/navigation";
import { BotonEnlace } from "@/app/_componentes/ui";
import { obtenerSesion, rutaInicio } from "@/app/_lib/sesion";

export default async function Inicio() {
  const sesion = await obtenerSesion();
  if (sesion) redirect(rutaInicio(sesion.rol));

  return (
    <main className="mx-auto grid w-full max-w-3xl flex-1 content-center gap-8 px-6 py-16">
      <p className="text-xl font-extrabold tracking-tight text-primario">
        CV<span className="font-semibold text-texto"> Lectura</span>
      </p>
      <div className="grid gap-4">
        <h1 className="text-4xl font-bold leading-tight tracking-tight">Postula con tu CV en PDF. Nosotros hacemos el resto.</h1>
        <p className="max-w-prose text-texto-2">
          El sistema lee tu CV, extrae tu experiencia, educación, habilidades e idiomas, y calcula qué tanto se ajusta a la
          oferta. El reclutador revisa cada perfil: el puntaje es un apoyo, no una decisión automática.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <BotonEnlace href="/registro">Crear cuenta de postulante</BotonEnlace>
        <BotonEnlace href="/ingresar" variante="secundario">
          Ingresar
        </BotonEnlace>
      </div>
    </main>
  );
}
