-- =====================================================================
-- Una oferta con postulaciones ya no cambia su título, descripción ni
-- requisitos (RQ-FUN-03): el puntaje de cada CV se calcula una sola vez con
-- los requisitos vigentes, y el postulante consintió para ESA oferta
-- (principio de finalidad, Ley N.° 29733). Cerrar y reabrir sigue permitido.
-- La pantalla de edición ya lo impide; este disparador es la segunda barrera.
-- =====================================================================
create function public.impedir_cambios_con_postulaciones()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (new.titulo, new.descripcion, new.requisitos) is distinct from (old.titulo, old.descripcion, old.requisitos)
     and exists (select 1 from public.postulaciones p where p.oferta_id = old.id) then
    raise exception 'OFERTA_CON_POSTULACIONES'
      using hint = 'La oferta ya tiene postulaciones: ciérrala y publica una nueva.';
  end if;
  return new;
end;
$$;

-- Solo la usa el disparador: nadie la invoca directamente
revoke execute on function public.impedir_cambios_con_postulaciones() from public, anon, authenticated;

create trigger ofertas_fijas_con_postulaciones
  before update on public.ofertas
  for each row execute function public.impedir_cambios_con_postulaciones();
