import { requireSupabase } from '../supabaseClient';

export const NEWS_IMAGES_BUCKET = 'news-images';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function validateNewsImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Formato no permitido. Usa JPG, PNG, WebP o GIF.';
  }
  if (file.size > MAX_SIZE_BYTES) {
    return 'La imagen no puede superar 5 MB.';
  }
  return null;
}

/** Sube una imagen al bucket news-images y devuelve la URL pública */
export async function uploadNewsImage(file: File, slugHint?: string): Promise<string> {
  const validationError = validateNewsImageFile(file);
  if (validationError) throw new Error(validationError);

  const client = requireSupabase();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeSlug = (slugHint || 'noticia').replace(/[^a-z0-9-]/gi, '').slice(0, 40);
  const path = `${safeSlug}-${Date.now()}.${ext}`;

  const { error } = await client.storage.from(NEWS_IMAGES_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    if (error.message.includes('Bucket not found')) {
      throw new Error(
        'Bucket news-images no existe. Ejecuta supabase/migrations/002_storage_news_images.sql en el SQL Editor.'
      );
    }
    throw error;
  }

  const { data } = client.storage.from(NEWS_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
