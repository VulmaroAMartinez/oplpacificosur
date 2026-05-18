export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | null;
  category: string;
  author: string;
  image_url: string;
  published_at: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsInsert {
  slug: string;
  title: string;
  excerpt: string;
  content?: string | null;
  category?: string;
  author?: string;
  image_url: string;
  published_at?: string;
  is_published?: boolean;
}

export type NewsUpdate = Partial<NewsInsert>;

/** Formato legible para mostrar en UI */
export function formatNewsDate(isoDate: string, locale = 'es-ES'): string {
  return new Date(isoDate).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
