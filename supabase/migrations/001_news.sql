-- Tabla de noticias para el sitio corporativo OPL Pacífico Sur
-- Ejecutar en Supabase SQL Editor

create table if not exists public.news (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text not null,
  content       text,
  category      text not null default 'General',
  author        text not null default 'Admin',
  image_url     text not null,
  published_at  timestamptz not null default now(),
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists news_published_at_idx on public.news (published_at desc);
create index if not exists news_slug_idx on public.news (slug);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists news_updated_at on public.news;
create trigger news_updated_at
  before update on public.news
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.news enable row level security;

-- Lectura pública: solo noticias publicadas
drop policy if exists "news_select_published" on public.news;
create policy "news_select_published"
  on public.news for select
  using (is_published = true);

-- Admin autenticado: ver todas (incluye borradores)
drop policy if exists "news_select_authenticated" on public.news;
create policy "news_select_authenticated"
  on public.news for select
  to authenticated
  using (true);

-- Escritura solo autenticados
drop policy if exists "news_insert_authenticated" on public.news;
create policy "news_insert_authenticated"
  on public.news for insert
  to authenticated
  with check (true);

drop policy if exists "news_update_authenticated" on public.news;
create policy "news_update_authenticated"
  on public.news for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "news_delete_authenticated" on public.news;
create policy "news_delete_authenticated"
  on public.news for delete
  to authenticated
  using (true);
