import { requireSupabase } from '../supabaseClient';
import {
  DEFAULT_SITE_IMAGES,
  SITE_IMAGE_IDS,
  type SiteImageId,
  type SiteImagesMap,
} from '../types/siteImages';

export const SITE_IMAGES_BUCKET = 'site-images';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function validateSiteImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Formato no permitido. Usa JPG, PNG, WebP o GIF.';
  }
  if (file.size > MAX_SIZE_BYTES) {
    return 'La imagen no puede superar 5 MB.';
  }
  return null;
}

function rowsToMap(rows: { id: string; image_url: string; alt_text: string | null }[]): SiteImagesMap {
  const map: SiteImagesMap = { ...DEFAULT_SITE_IMAGES };
  for (const row of rows) {
    if (SITE_IMAGE_IDS.includes(row.id as SiteImageId)) {
      map[row.id as SiteImageId] = {
        image_url: row.image_url,
        alt_text: row.alt_text,
      };
    }
  }
  return map;
}

export async function getSiteImages(): Promise<SiteImagesMap> {
  const client = requireSupabase();
  const { data, error } = await client.from('site_images').select('id, image_url, alt_text');

  if (error) {
    if (error.code === '42P01') {
      console.warn('Tabla site_images no existe. Ejecuta supabase/migrations/003_site_images.sql');
      return { ...DEFAULT_SITE_IMAGES };
    }
    throw error;
  }

  return rowsToMap(data ?? []);
}

async function uploadSiteImageFile(file: File, slotId: SiteImageId): Promise<string> {
  const validationError = validateSiteImageFile(file);
  if (validationError) throw new Error(validationError);

  const client = requireSupabase();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${slotId}-${Date.now()}.${ext}`;

  const { error } = await client.storage.from(SITE_IMAGES_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    if (error.message.includes('Bucket not found')) {
      throw new Error(
        'Bucket site-images no existe. Ejecuta supabase/migrations/003_site_images.sql en el SQL Editor.'
      );
    }
    throw error;
  }

  const { data } = client.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function updateSiteImage(
  id: SiteImageId,
  file: File,
  altText?: string | null
): Promise<SiteImagesMap> {
  const imageUrl = await uploadSiteImageFile(file, id);
  const client = requireSupabase();

  const payload: { image_url: string; alt_text?: string | null } = { image_url: imageUrl };
  if (altText !== undefined) {
    payload.alt_text = altText;
  }

  const { error } = await client.from('site_images').update(payload).eq('id', id);

  if (error) throw error;

  return getSiteImages();
}
