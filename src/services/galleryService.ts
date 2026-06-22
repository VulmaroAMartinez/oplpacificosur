import { requireSupabase, isSupabaseConfigured } from '../supabaseClient';
import type { GalleryImage } from '../types/gallery';

const TABLE = 'gallery_images';
const BUCKET = 'gallery-images';
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export { isSupabaseConfigured };

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    if (error.code === '42P01') return [];
    throw error;
  }
  return (data ?? []) as GalleryImage[];
}

export async function getAllGalleryImages(): Promise<GalleryImage[]> {
  return getGalleryImages();
}

export function validateGalleryImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Formato no permitido. Usa JPG, PNG, WebP o GIF.';
  }
  if (file.size > MAX_SIZE) {
    return 'La imagen no puede superar 5 MB.';
  }
  return null;
}

export async function uploadGalleryImage(file: File): Promise<GalleryImage> {
  const validationError = validateGalleryImageFile(file);
  if (validationError) throw new Error(validationError);

  const client = requireSupabase();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const storagePath = `${crypto.randomUUID()}-${Date.now()}.${ext}`;

  const { error: uploadError } = await client.storage.from(BUCKET).upload(storagePath, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (uploadError) {
    if (uploadError.message.includes('Bucket not found')) {
      throw new Error(
        'Bucket gallery-images no existe. Ejecuta supabase/migrations/004_gallery_images.sql en el SQL Editor.'
      );
    }
    throw uploadError;
  }

  const { data: urlData } = client.storage.from(BUCKET).getPublicUrl(storagePath);

  const { data, error } = await client
    .from(TABLE)
    .insert({
      image_url: urlData.publicUrl,
      storage_path: storagePath,
    })
    .select()
    .single();

  if (error) {
    await client.storage.from(BUCKET).remove([storagePath]);
    if (error.code === '42P01') {
      throw new Error(
        'Tabla gallery_images no existe. Ejecuta supabase/migrations/004_gallery_images.sql en el SQL Editor.'
      );
    }
    throw error;
  }

  return data as GalleryImage;
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const client = requireSupabase();

  const { data: row, error: fetchError } = await client
    .from(TABLE)
    .select('storage_path')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!row) return;

  const { error: storageError } = await client.storage.from(BUCKET).remove([row.storage_path]);
  if (storageError && !storageError.message.includes('not found')) {
    throw storageError;
  }

  const { error: deleteError } = await client.from(TABLE).delete().eq('id', id);
  if (deleteError) throw deleteError;
}
