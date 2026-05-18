import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getPublishedNews, isSupabaseConfigured } from '../services/newsService';
import { formatNewsDate, type NewsItem } from '../types/news';
import { NewsDetail } from './NewsDetail';

function buildFallbackNews(): NewsItem[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'fallback-1',
      slug: 'expansion-rutas-asia-pacifico',
      title: 'Expansión de Rutas Comerciales hacia Asia Pacífico',
      excerpt:
        'OPL Pacífico Sur anuncia nuevas alianzas estratégicas para reducir tiempos de tránsito hacia los principales puertos de China y Japón.',
      content: null,
      category: 'Rutas',
      author: 'Redacción',
      image_url:
        'https://images.unsplash.com/photo-1650908282348-3f1178d4e031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      published_at: '2026-02-04T12:00:00Z',
      is_published: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'fallback-2',
      slug: 'innovacion-drones-almacenes',
      title: 'Innovación en Logística: Drones en Almacenes',
      excerpt:
        'Implementamos tecnología de drones autónomos para optimizar el inventario y agilizar el despacho en nuestros centros de distribución.',
      content: null,
      category: 'Innovación',
      author: 'Tecnología',
      image_url:
        'https://images.unsplash.com/photo-1753781466414-e93cf7f4f6df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      published_at: '2026-01-28T12:00:00Z',
      is_published: true,
      created_at: now,
      updated_at: now,
    },
    {
      id: 'fallback-3',
      slug: 'compromiso-verde-huella-carbono',
      title: 'Compromiso Verde: Reducción de Huella de Carbono',
      excerpt:
        'Nueva flota de camiones eléctricos y optimización de rutas marítimas para cumplir con nuestros objetivos de sostenibilidad 2030.',
      content: null,
      category: 'Medio Ambiente',
      author: 'Sostenibilidad',
      image_url:
        'https://images.unsplash.com/photo-1759354017689-cf8b886b9f41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      published_at: '2026-01-15T12:00:00Z',
      is_published: true,
      created_at: now,
      updated_at: now,
    },
  ];
}

export const News = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(!slug);
  const { t, getLink, language } = useLanguage();
  const locale = language === 'en' ? 'en-US' : 'es-ES';

  useEffect(() => {
    if (slug) return;

    const fetchNews = async () => {
      try {
        if (isSupabaseConfigured) {
          const data = await getPublishedNews();
          setNewsItems(data.length > 0 ? data : buildFallbackNews());
        } else {
          setNewsItems(buildFallbackNews());
        }
      } catch (err) {
        console.error(err);
        setNewsItems(buildFallbackNews());
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [slug]);

  if (slug) {
    return <NewsDetail />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">
            {t('news.section_subtitle')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-4">{t('news.title')}</h1>
          <p className="text-slate-600 text-lg">{t('news.desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 uppercase rounded-sm">
                  {item.category}
                </span>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-slate-400 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{formatNewsDate(item.published_at, locale)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{item.author}</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors">
                  <Link to={getLink(`/noticias/${item.slug}`)}>{item.title}</Link>
                </h2>

                <p className="text-slate-600 mb-6 flex-1">{item.excerpt}</p>

                <Link
                  to={getLink(`/noticias/${item.slug}`)}
                  className="inline-flex items-center gap-2 text-orange-500 font-bold hover:gap-3 transition-all"
                >
                  {t('news.read_more')} <ArrowRight size={18} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};
