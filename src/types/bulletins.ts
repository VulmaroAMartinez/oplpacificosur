export interface Boletin {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    image_url: string;
    read_more_link: string | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface BoletinInsert {
    title: string;
    excerpt: string;
    category?: string;
    image_url: string;
    read_more_link?: string | null;
    is_published?: boolean;
}

export type BoletinUpdate = Partial<BoletinInsert>;