-- Imágenes editables del sitio (Hero, About, Contact)
-- Ejecutar en Supabase SQL Editor (después de 001_news.sql)

create table if not exists public.site_images (
  id          text primary key,
  image_url   text not null,
  alt_text    text,
  updated_at  timestamptz not null default now()
);

drop trigger if exists site_images_updated_at on public.site_images;
create trigger site_images_updated_at
  before update on public.site_images
  for each row execute function public.set_updated_at();

-- Valores por defecto (URLs actuales de Unsplash)
insert into public.site_images (id, image_url, alt_text) values
  (
    'hero_1',
    'https://images.unsplash.com/photo-1621862681400-a2a7321dc1c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250YWluZXIlMjBzaGlwJTIwY2FyZ28lMjBvY2VhbnxlbnwxfHx8fDE3NzAyMjc3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'Barco de contenedores en el océano'
  ),
  (
    'hero_2',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHBvcnQlMjBhaXJpYWx8ZW58MXx8fHwxNzcwMjI3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'Vista aérea del puerto de carga'
  ),
  (
    'hero_3',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBsb2dpc3RpY3N8ZW58MXx8fHwxNzcwMjI3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'Almacén logístico moderno'
  ),
  (
    'about',
    'https://images.unsplash.com/photo-1619070284836-e850273d69ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpc3RpY3MlMjB3YXJlaG91c2UlMjBtb2Rlcm58ZW58MXx8fHwxNzcwMTkwNzI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'Warehouse Operations'
  ),
  (
    'contact',
    'https://images.unsplash.com/photo-1618577520246-bad40975f401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBtZWV0aW5nJTIwc2hpcHBpbmclMjBpbmR1c3RyeXxlbnwxfHx8fDE3NzAyMjc3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'Corporate meeting'
  )
on conflict (id) do nothing;

alter table public.site_images enable row level security;

-- Lectura pública
drop policy if exists "site_images_select_public" on public.site_images;
create policy "site_images_select_public"
  on public.site_images for select
  using (true);

-- Escritura solo autenticados
drop policy if exists "site_images_update_authenticated" on public.site_images;
create policy "site_images_update_authenticated"
  on public.site_images for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "site_images_insert_authenticated" on public.site_images;
create policy "site_images_insert_authenticated"
  on public.site_images for insert
  to authenticated
  with check (true);

-- Bucket público para imágenes del sitio
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "site_images_storage_public_read" on storage.objects;
create policy "site_images_storage_public_read"
  on storage.objects for select
  using (bucket_id = 'site-images');

drop policy if exists "site_images_storage_auth_insert" on storage.objects;
create policy "site_images_storage_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images');

drop policy if exists "site_images_storage_auth_update" on storage.objects;
create policy "site_images_storage_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images');

drop policy if exists "site_images_storage_auth_delete" on storage.objects;
create policy "site_images_storage_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images');
