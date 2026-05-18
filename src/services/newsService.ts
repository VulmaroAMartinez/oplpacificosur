import { requireSupabase, isSupabaseConfigured } from '../supabaseClient';
import type { NewsItem, NewsInsert, NewsUpdate } from '../types/news';

const TABLE = 'news';

export { isSupabaseConfigured };

export async function getPublishedNews(limit?: number): Promise<NewsItem[]> {
  const client = requireSupabase();
  let query = client
    .from(TABLE)
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as NewsItem[];
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const client = requireSupabase();
  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error) throw error;
  return data as NewsItem | null;
}

export async function getAllNews(): Promise<NewsItem[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as NewsItem[];
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const client = requireSupabase();
  const { data, error } = await client.from(TABLE).select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as NewsItem | null;
}

export async function createNews(item: NewsInsert): Promise<NewsItem> {
  const client = requireSupabase();
  const { data, error } = await client.from(TABLE).insert(item).select().single();
  if (error) throw error;
  return data as NewsItem;
}

export async function updateNews(id: string, item: NewsUpdate): Promise<NewsItem> {
  const client = requireSupabase();
  const { data, error } = await client.from(TABLE).update(item).eq('id', id).select().single();
  if (error) throw error;
  return data as NewsItem;
}

export async function deleteNews(id: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

/** Noticias de demostración para seed inicial */
export const DEMO_NEWS: NewsInsert[] = [
  {
    slug: 'expansion-rutas-asia-pacifico',
    title: 'Expansión de Rutas Comerciales hacia Asia Pacífico',
    excerpt:
      'OPL Pacífico Sur anuncia nuevas alianzas estratégicas para reducir tiempos de tránsito hacia los principales puertos de China y Japón.',
    content:
      'OPL Pacífico Sur anuncia nuevas alianzas estratégicas para reducir tiempos de tránsito hacia los principales puertos de China y Japón. Esta expansión refuerza nuestra red logística en la región Asia-Pacífico.',
    category: 'Rutas',
    author: 'Redacción',
    image_url:
      'https://images.unsplash.com/photo-1650908282348-3f1178d4e031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    published_at: '2026-02-04T12:00:00Z',
  },
  {
    slug: 'innovacion-drones-almacenes',
    title: 'Innovación en Logística: Drones en Almacenes',
    excerpt:
      'Implementamos tecnología de drones autónomos para optimizar el inventario y agilizar el despacho en nuestros centros de distribución.',
    content:
      'Implementamos tecnología de drones autónomos para optimizar el inventario y agilizar el despacho en nuestros centros de distribución, mejorando la precisión y velocidad operativa.',
    category: 'Innovación',
    author: 'Tecnología',
    image_url:
      'https://images.unsplash.com/photo-1753781466414-e93cf7f4f6df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    published_at: '2026-01-28T12:00:00Z',
  },
  {
    slug: 'compromiso-verde-huella-carbono',
    title: 'Compromiso Verde: Reducción de Huella de Carbono',
    excerpt:
      'Nueva flota de camiones eléctricos y optimización de rutas marítimas para cumplir con nuestros objetivos de sostenibilidad 2030.',
    content:
      'Nueva flota de camiones eléctricos y optimización de rutas marítimas para cumplir con nuestros objetivos de sostenibilidad 2030, alineados con las mejores prácticas del sector logístico.',
    category: 'Medio Ambiente',
    author: 'Sostenibilidad',
    image_url:
      'https://images.unsplash.com/photo-1759354017689-cf8b886b9f41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    published_at: '2026-01-15T12:00:00Z',
  },
];

export async function seedDemoNews(): Promise<void> {
  for (const item of DEMO_NEWS) {
    await createNews(item);
  }
}
