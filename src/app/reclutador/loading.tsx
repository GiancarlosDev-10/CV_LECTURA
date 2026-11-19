import { Esqueleto } from "@/app/_componentes/visual";

export default function Cargando() {
  return (
    <div role="status" aria-label="Cargando" className="grid gap-4">
      <Esqueleto className="h-8 w-72" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Esqueleto className="h-20" />
        <Esqueleto className="h-20" />
        <Esqueleto className="h-20" />
        <Esqueleto className="h-20" />
      </div>
      <Esqueleto className="h-80 w-full" />
    </div>
  );
}
