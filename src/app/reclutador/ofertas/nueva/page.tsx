import { Tarjeta, TituloPagina } from "@/app/_componentes/ui";
import { requerirRol } from "@/app/_lib/sesion";
import { FormularioOferta } from "../_formulario/FormularioOferta";
import { crearOferta } from "./acciones";

export const metadata = { title: "Nueva oferta · CV Lectura" };

export default async function PaginaNuevaOferta() {
  await requerirRol("reclutador");
  return (
    <>
      <TituloPagina titulo="Nueva oferta" subtitulo="Los requisitos y los pesos determinan el puntaje de cada postulante." />
      <Tarjeta>
        <FormularioOferta accion={crearOferta} textoBoton="Publicar oferta" textoPendiente="Publicando…" />
      </Tarjeta>
    </>
  );
}
