-- Galería dinámica de la sección Nosotros
-- Ejecutar en Supabase SQL Editor (después de 001_news.sql)

create table if not exists public.gallery_images (
  id            uuid primary key default gen_random_uuid(),
  image_url     text not null,
  storage_path  text not null,
  created_at    timestamptz not null default now()
);

create index if not exists gallery_images_created_at_idx on public.gallery_images (created_at asc);

alter table public.gallery_images enable row level security;

-- Lectura pública
drop policy if exists "gallery_images_select_public" on public.gallery_images;
create policy "gallery_images_select_public"
  on public.gallery_images for select
  using (true);

-- Escritura solo autenticados
drop policy if exists "gallery_images_insert_authenticated" on public.gallery_images;
create policy "gallery_images_insert_authenticated"
  on public.gallery_images for insert
  to authenticated
  with check (true);

drop policy if exists "gallery_images_delete_authenticated" on public.gallery_images;
create policy "gallery_images_delete_authenticated"
  on public.gallery_images for delete
  to authenticated
  using (true);

-- Bucket público para imágenes de galería
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery-images',
  'gallery-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "gallery_images_storage_public_read" on storage.objects;
create policy "gallery_images_storage_public_read"
  on storage.objects for select
  using (bucket_id = 'gallery-images');

drop policy if exists "gallery_images_storage_auth_insert" on storage.objects;
create policy "gallery_images_storage_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery-images');

drop policy if exists "gallery_images_storage_auth_update" on storage.objects;
create policy "gallery_images_storage_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'gallery-images');

drop policy if exists "gallery_images_storage_auth_delete" on storage.objects;
create policy "gallery_images_storage_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery-images');
