export const SITE_IMAGE_IDS = [
  'hero_1', 'hero_2', 'hero_3', 'hero_4', 'hero_5', 'hero_6', 'hero_7',
  'about', 'about_1', 'about_2', 'about_3',
  'contact',
] as const;

export type SiteImageId = (typeof SITE_IMAGE_IDS)[number];

export interface SiteImageRow {
  id: SiteImageId;
  image_url: string;
  alt_text: string | null;
  updated_at: string;
}

export type SiteImagesMap = Record<SiteImageId, { image_url: string; alt_text: string | null }>;

export const DEFAULT_SITE_IMAGES: SiteImagesMap = {
  hero_1: {
    image_url:
      'https://images.unsplash.com/photo-1621862681400-a2a7321dc1c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250YWluZXIlMjBzaGlwJTIwY2FyZ28lMjBvY2VhbnxlbnwxfHx8fDE3NzAyMjc3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt_text: 'Barco de contenedores en el océano',
  },
  hero_2: {
    image_url:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHBvcnQlMjBhaXJpYWx8ZW58MXx8fHwxNzcwMjI3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt_text: 'Vista aérea del puerto de carga',
  },
  hero_3: {
    image_url:
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBsb2dpc3RpY3N8ZW58MXx8fHwxNzcwMjI3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt_text: 'Almacén logístico moderno',
  },
  hero_4: {
    image_url:
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBsb2dpc3RpY3N8ZW58MXx8fHwxNzcwMjI3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt_text: 'Almacén logístico moderno',
  },
  hero_5: {
    image_url:
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBsb2dpc3RpY3N8ZW58MXx8fHwxNzcwMjI3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt_text: 'Almacén logístico moderno',
  },
  hero_6: {
    image_url:
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBsb2dpc3RpY3N8ZW58MXx8fHwxNzcwMjI3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt_text: 'Almacén logístico moderno',
  },
  hero_7: {
    image_url:
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBsb2dpc3RpY3N8ZW58MXx8fHwxNzcwMjI3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt_text: 'Almacén logístico moderno',
  },
  about: {
    image_url:
      'https://images.unsplash.com/photo-1619070284836-e850273d69ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpc3RpY3MlMjB3YXJlaG91c2UlMjBtb2Rlcm58ZW58MXx8fHwxNzcwMTkwNzI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt_text: 'Warehouse Operations',
  },
  about_1: {
    image_url:
      'https://images.unsplash.com/photo-1619070284836-e850273d69ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpc3RpY3MlMjB3YXJlaG91c2UlMjBtb2Rlcm58ZW58MXx8fHwxNzcwMTkwNzI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt_text: 'Primera imagen del carrusel Nosotros',
  },
  about_2: {
    image_url:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHBvcnQlMjBhaXJpYWx8ZW58MXx8fHwxNzcwMjI3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt_text: 'Segunda imagen del carrusel Nosotros',
  },
  about_3: {
    image_url:
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBsb2dpc3RpY3N8ZW58MXx8fHwxNzcwMjI3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt_text: 'Tercera imagen del carrusel Nosotros',
  },
  contact: {
    image_url:
      'https://images.unsplash.com/photo-1618577520246-bad40975f401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBtZWV0aW5nJTIwc2hpcHBpbmclMjBpbmR1c3RyeXxlbnwxfHx8fDE3NzAyMjc3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt_text: 'Corporate meeting',
  },
};

export const SITE_IMAGE_SLOTS: { id: SiteImageId; label: string; description: string }[] = [
  { id: 'hero_1', label: 'Carrusel inicio — Diapositiva 1', description: 'Imagen de fondo del hero (página de inicio)' },
  { id: 'hero_2', label: 'Carrusel inicio — Diapositiva 2', description: 'Segunda imagen del carrusel principal' },
  { id: 'hero_3', label: 'Carrusel inicio — Diapositiva 3', description: 'Tercera imagen del carrusel principal' },
  { id: 'hero_4', label: 'Carrusel inicio — Diapositiva 4', description: 'Cuarta imagen del carrusel principal' },
  { id: 'hero_5', label: 'Carrusel inicio — Diapositiva 5', description: 'Quinta imagen del carrusel principal' },
  { id: 'hero_6', label: 'Carrusel inicio — Diapositiva 6', description: 'Sexta imagen del carrusel principal' },
  { id: 'hero_7', label: 'Carrusel inicio — Diapositiva 7', description: 'Séptima imagen del carrusel principal' },
  { id: 'about_1', label: 'Carrusel Nosotros — Diapositiva 1', description: 'Primera imagen del carrusel en la sección Nosotros' },
  { id: 'about_2', label: 'Carrusel Nosotros — Diapositiva 2', description: 'Segunda imagen del carrusel en la sección Nosotros' },
  { id: 'about_3', label: 'Carrusel Nosotros — Diapositiva 3', description: 'Tercera imagen del carrusel en la sección Nosotros' },
  { id: 'contact', label: 'Sección Contacto', description: 'Imagen lateral en la página de contacto' },
];
