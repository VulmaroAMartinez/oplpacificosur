-- Bucket público para imágenes de noticias
-- Ejecutar en Supabase SQL Editor (después de 001_news.sql)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'news-images',
  'news-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lectura pública
drop policy if exists "news_images_public_read" on storage.objects;
create policy "news_images_public_read"
  on storage.objects for select
  using (bucket_id = 'news-images');

-- Subida / actualización / borrado solo autenticados
drop policy if exists "news_images_auth_insert" on storage.objects;
create policy "news_images_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'news-images');

drop policy if exists "news_images_auth_update" on storage.objects;
create policy "news_images_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'news-images');

drop policy if exists "news_images_auth_delete" on storage.objects;
create policy "news_images_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'news-images');
