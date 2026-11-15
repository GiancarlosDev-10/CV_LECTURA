import { Tarjeta, TituloPagina } from "@/app/_componentes/ui";
import { requerirRol } from "@/app/_lib/sesion";
import { PESOS_POR_DEFECTO } from "@/dominio/entidades/oferta";
import { FormularioOferta } from "./FormularioOferta";

export const metadata = { title: "Nueva oferta · CV Lectura" };

export default async function PaginaNuevaOferta() {
  await requerirRol("reclutador");
  return (
    <>
      <TituloPagina titulo="Nueva oferta" subtitulo="Los requisitos y los pesos determinan el puntaje de cada postulante." />
      <Tarjeta>
        <FormularioOferta pesosPorDefecto={PESOS_POR_DEFECTO} />
      </Tarjeta>
    </>
  );
}
