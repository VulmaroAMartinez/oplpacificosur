import { requireSupabase, isSupabaseConfigured } from '../supabaseClient';
import type { Boletin, BoletinInsert, BoletinUpdate } from '../types/bulletins';

const TABLE = 'boletines';

export { isSupabaseConfigured };

export async function getPublishedBoletines(limit?: number): Promise<Boletin[]> {
    const client = requireSupabase();
    let query = client
        .from(TABLE)
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as Boletin[];
}

export async function getAllBoletines(): Promise<Boletin[]> {
    const client = requireSupabase();
    const { data, error } = await client
        .from(TABLE)
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as Boletin[];
}

export async function getBoletinById(id: string): Promise<Boletin | null> {
    const client = requireSupabase();
    const { data, error } = await client.from(TABLE).select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data as Boletin | null;
}

export async function createBoletin(item: BoletinInsert): Promise<Boletin> {
    const client = requireSupabase();
    const { data, error } = await client.from(TABLE).insert(item).select().single();
    if (error) throw error;
    return data as Boletin;
}

export async function updateBoletin(id: string, item: BoletinUpdate): Promise<Boletin> {
    const client = requireSupabase();
    const { data, error } = await client.from(TABLE).update(item).eq('id', id).select().single();
    if (error) throw error;
    return data as Boletin;
}

export async function deleteBoletin(id: string): Promise<void> {
    const client = requireSupabase();
    const { error } = await client.from(TABLE).delete().eq('id', id);
    if (error) throw error;
}

/** Upload de imagen al bucket boletines-images */
const BUCKET = 'boletines-images';
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function validateBoletinImageFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
        return 'Formato no permitido. Usa JPG, PNG, WebP o GIF.';
    }
    if (file.size > MAX_SIZE) {
        return 'La imagen no puede superar 5 MB.';
    }
    return null;
}

export async function uploadBoletinImage(file: File): Promise<string> {
    const validationError = validateBoletinImageFile(file);
    if (validationError) throw new Error(validationError);

    const client = requireSupabase();
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `boletin-${Date.now()}.${ext}`;

    const { error } = await client.storage.from(BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
    });

    if (error) {
        if (error.message.includes('Bucket not found')) {
            throw new Error(
                'Bucket boletines-images no existe. Ejecuta supabase/migrations/004_boletines.sql en el SQL Editor.'
            );
        }
        throw error;
    }

    const { data } = client.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

/** Datos de demostración */
export const DEMO_BOLETINES: BoletinInsert[] = [
    {
        title: 'Panorama del Comercio Marítimo 2026',
        excerpt:
            'Análisis de rutas comerciales rentables y tendencias del transporte marítimo internacional para el presente año.',
        category: 'Tendencias',
        image_url:
            'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        read_more_link: null,
        is_published: true,
    },
    {
        title: 'Regulaciones Aduaneras 2026',
        excerpt:
            'Cambios en normativas de importación y exportación que afectan las operaciones logísticas en México y Centroamérica.',
        category: 'Cumplimiento',
        image_url:
            'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        read_more_link: null,
        is_published: true,
    },
    {
        title: 'Optimización Logística',
        excerpt:
            'Reducción de costos y mejora de tiempos de entrega mediante tecnologías de automatización en almacenes.',
        category: 'Estrategia',
        image_url:
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        read_more_link: null,
        is_published: true,
    },
    {
        title: 'Digitalización Portuaria',
        excerpt:
            'Implementación de IoT y blockchain en puertos para mejorar la trazabilidad y eficiencia operativa.',
        category: 'Tecnología',
        image_url:
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        read_more_link: null,
        is_published: true,
    },
    {
        title: 'Logística Verde 2026',
        excerpt:
            'Reducción de huella de carbono en transporte marítimo y terrestre alineado con objetivos de sostenibilidad.',
        category: 'Sostenibilidad',
        image_url:
            'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        read_more_link: null,
        is_published: true,
    },
    {
        title: 'Protección de Carga',
        excerpt:
            'Nuevas tecnologías en seguros y rastreo de mercancías para minimizar pérdidas y daños en tránsito.',
        category: 'Seguridad',
        image_url:
            'https://images.unsplash.com/photo-1563986768609-322da13575f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        read_more_link: null,
        is_published: true,
    },
];

export async function seedDemoBoletines(): Promise<void> {
    for (const item of DEMO_BOLETINES) {
        await createBoletin(item);
    }
}