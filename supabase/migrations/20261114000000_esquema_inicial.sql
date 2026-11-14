-- =====================================================================
-- Esquema inicial — Sistema de RRHH con lectura de CVs
-- Seguridad: RLS en todas las tablas (segunda barrera además del código).
-- Ver docs/PLAN.md §3 (roles y módulos) y §8 (RQ-SEG-*).
-- =====================================================================

-- ---------------------------------------------------------------------
-- Perfiles: un perfil por usuario de auth. Todo registro propio es
-- "postulante"; los reclutadores se crean solo con el seed (service role).
-- ---------------------------------------------------------------------
create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  rol text not null default 'postulante' check (rol in ('reclutador', 'postulante')),
  nombre text not null default '',
  creado_en timestamptz not null default now()
);

create function public.crear_perfil_nuevo_usuario()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfiles (id, nombre)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nombre', ''));
  return new;
end;
$$;

create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil_nuevo_usuario();

create function public.es_reclutador()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.perfiles where id = auth.uid() and rol = 'reclutador'
  );
$$;

-- ---------------------------------------------------------------------
-- Ofertas
-- ---------------------------------------------------------------------
create table public.ofertas (
  id uuid primary key default gen_random_uuid(),
  reclutador_id uuid not null references public.perfiles (id),
  titulo text not null check (length(titulo) between 3 and 150),
  descripcion text not null default '',
  -- RequisitosOferta (validado con Zod en la aplicación)
  requisitos jsonb not null,
  estado text not null default 'abierta' check (estado in ('abierta', 'cerrada')),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index ofertas_reclutador_idx on public.ofertas (reclutador_id);

-- ---------------------------------------------------------------------
-- Postulaciones (un CV por postulación; consentimiento obligatorio)
-- Las marcas de tiempo son la fuente de RQ-DES-01 (tiempo por CV).
-- ---------------------------------------------------------------------
create table public.postulaciones (
  id uuid primary key default gen_random_uuid(),
  oferta_id uuid not null references public.ofertas (id) on delete cascade,
  postulante_id uuid not null references public.perfiles (id) on delete cascade,
  ruta_cv text not null,
  estado text not null default 'recibida'
    check (estado in ('recibida', 'procesando', 'procesada', 'pendiente_revision_manual')),
  motivo_revision text,
  detalle_revision text,
  texto_cv text,
  cv_extraido jsonb,
  puntaje numeric(5, 2) check (puntaje between 0 and 100),
  desglose jsonb,
  modelo_ia text,
  consentimiento_version text not null,
  consentimiento_en timestamptz not null,
  subido_en timestamptz not null default now(),
  inicio_procesamiento timestamptz,
  fin_procesamiento timestamptz,
  unique (oferta_id, postulante_id),
  -- Falla segura (RQ-SOP-01): un CV en revisión manual nunca tiene puntaje.
  constraint revision_manual_sin_puntaje
    check (estado <> 'pendiente_revision_manual' or puntaje is null)
);

create index postulaciones_oferta_idx on public.postulaciones (oferta_id, puntaje desc);
create index postulaciones_postulante_idx on public.postulaciones (postulante_id);

-- ---------------------------------------------------------------------
-- Registro de accesos a CVs (RQ-SEG-05, responsabilidad).
-- Sin FK a postulaciones: el registro sobrevive a la eliminación ARCO
-- y no contiene datos personales del postulante.
-- ---------------------------------------------------------------------
create table public.accesos_cv (
  id bigint generated always as identity primary key,
  postulacion_id uuid not null,
  reclutador_id uuid not null references public.perfiles (id),
  accion text not null check (accion in ('ver_detalle', 'descargar_pdf')),
  ocurrido_en timestamptz not null default now()
);

create index accesos_cv_postulacion_idx on public.accesos_cv (postulacion_id);

-- =====================================================================
-- Permisos explícitos (mínimo privilegio). El proyecto NO expone tablas
-- automáticamente: cada rol recibe solo lo que necesita y la RLS filtra filas.
-- anon (sin sesión) no recibe nada. service_role (servidor) recibe todo.
-- =====================================================================
grant usage on schema public to authenticated, service_role;

grant select on public.perfiles to authenticated;
grant select, insert, update on public.ofertas to authenticated;
grant select, insert, delete on public.postulaciones to authenticated;
grant select, insert on public.accesos_cv to authenticated;

grant all on public.perfiles, public.ofertas, public.postulaciones, public.accesos_cv to service_role;
grant usage, select on all sequences in schema public to service_role;

revoke execute on function public.es_reclutador() from public, anon;
grant execute on function public.es_reclutador() to authenticated, service_role;
revoke execute on function public.crear_perfil_nuevo_usuario() from public, anon, authenticated;

-- =====================================================================
-- RLS
-- =====================================================================
alter table public.perfiles enable row level security;
alter table public.ofertas enable row level security;
alter table public.postulaciones enable row level security;
alter table public.accesos_cv enable row level security;

-- Perfiles: cada uno ve solo su perfil; nadie cambia su rol desde el cliente.
create policy "ver mi perfil" on public.perfiles
  for select to authenticated using (id = (select auth.uid()));

-- Ofertas: las abiertas son públicas para usuarios autenticados;
-- el reclutador ve y gestiona solo las suyas.
create policy "ver ofertas abiertas o propias" on public.ofertas
  for select to authenticated
  using (estado = 'abierta' or reclutador_id = (select auth.uid()));

create policy "reclutador crea sus ofertas" on public.ofertas
  for insert to authenticated
  with check (reclutador_id = (select auth.uid()) and public.es_reclutador());

create policy "reclutador edita sus ofertas" on public.ofertas
  for update to authenticated
  using (reclutador_id = (select auth.uid()))
  with check (reclutador_id = (select auth.uid()));

-- Postulaciones
create policy "postulante ve sus postulaciones" on public.postulaciones
  for select to authenticated using (postulante_id = (select auth.uid()));

create policy "reclutador ve postulaciones de sus ofertas" on public.postulaciones
  for select to authenticated
  using (exists (
    select 1 from public.ofertas o
    where o.id = oferta_id and o.reclutador_id = (select auth.uid())
  ));

create policy "postulante postula a ofertas abiertas" on public.postulaciones
  for insert to authenticated
  with check (
    postulante_id = (select auth.uid())
    and not public.es_reclutador()
    and estado = 'recibida'
    and puntaje is null
    and exists (select 1 from public.ofertas o where o.id = oferta_id and o.estado = 'abierta')
  );

-- Derecho de cancelación (ARCO, RQ-SEG-04)
create policy "postulante elimina sus postulaciones" on public.postulaciones
  for delete to authenticated using (postulante_id = (select auth.uid()));

-- El procesamiento (estado, puntaje) solo lo escribe el servidor con service role:
-- no hay política de UPDATE para usuarios.

-- Registro de accesos: el reclutador registra y ve solo sus propios accesos,
-- y solo sobre postulaciones de sus ofertas.
create policy "reclutador registra sus accesos" on public.accesos_cv
  for insert to authenticated
  with check (
    reclutador_id = (select auth.uid())
    and exists (
      select 1 from public.postulaciones p
      join public.ofertas o on o.id = p.oferta_id
      where p.id = postulacion_id and o.reclutador_id = (select auth.uid())
    )
  );

create policy "reclutador ve sus accesos" on public.accesos_cv
  for select to authenticated using (reclutador_id = (select auth.uid()));

-- =====================================================================
-- Storage: bucket privado de CVs. Ruta: {postulante_id}/{postulacion_id}.pdf
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cvs', 'cvs', false, 5242880, array['application/pdf']);

create policy "postulante sube su CV" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'cvs' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "postulante ve su CV" on storage.objects
  for select to authenticated
  using (bucket_id = 'cvs' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "reclutador ve CVs de sus ofertas" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'cvs'
    and exists (
      select 1 from public.postulaciones p
      join public.ofertas o on o.id = p.oferta_id
      where p.ruta_cv = name and o.reclutador_id = (select auth.uid())
    )
  );

create policy "postulante elimina su CV" on storage.objects
  for delete to authenticated
  using (bucket_id = 'cvs' and (storage.foldername(name))[1] = (select auth.uid())::text);
