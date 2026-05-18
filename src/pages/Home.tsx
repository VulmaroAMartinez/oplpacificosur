import React, { useEffect, useState } from 'react';
import { Hero } from '../components/Hero';
import { Services } from '../components/Services';
import { About } from '../components/About';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getPublishedNews, isSupabaseConfigured } from '../services/newsService';
import { formatNewsDate, type NewsItem } from '../types/news';

const MOCK_NEWS_PREVIEW: Pick<NewsItem, 'title' | 'slug' | 'image_url' | 'published_at'>[] = [
  {
    slug: 'expansion-rutas-asia-pacifico',
    title: 'Expansión de Rutas Comerciales',
    published_at: '2026-02-04T12:00:00Z',
    image_url:
      'https://images.unsplash.com/photo-1650908282348-3f1178d4e031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    slug: 'innovacion-drones-almacenes',
    title: 'Drones en Almacenes',
    published_at: '2026-01-28T12:00:00Z',
    image_url:
      'https://images.unsplash.com/photo-1753781466414-e93cf7f4f6df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    slug: 'compromiso-verde-huella-carbono',
    title: 'Compromiso Verde 2030',
    published_at: '2026-01-15T12:00:00Z',
    image_url:
      'https://images.unsplash.com/photo-1759354017689-cf8b886b9f41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

export const Home = () => {
  const [newsPreview, setNewsPreview] = useState(MOCK_NEWS_PREVIEW);
  const { t, getLink, language } = useLanguage();
  const locale = language === 'en' ? 'en-US' : 'es-ES';

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    getPublishedNews(3)
      .then((data) => {
        if (data.length > 0) {
          setNewsPreview(
            data.map((item) => ({
              slug: item.slug,
              title: item.title,
              published_at: item.published_at,
              image_url: item.image_url,
            }))
          );
        }
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <Hero />

      <Services variant="preview" />

      <About />

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">
                {t('news.section_subtitle')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">{t('news.latest_title')}</h2>
            </div>
            <Link
              to={getLink('/noticias')}
              className="hidden md:flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors"
            >
              {t('news.view_all')} <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsPreview.map((item) => (
              <Link
                key={item.slug}
                to={getLink(`/noticias/${item.slug}`)}
                className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all group block"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs text-slate-400 uppercase tracking-wide">
                    {formatNewsDate(item.published_at, locale)}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2 group-hover:text-orange-500 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="md:hidden text-center mt-8">
            <Link
              to={getLink('/noticias')}
              className="inline-flex items-center gap-2 text-orange-500 font-bold"
            >
              {t('news.view_all')} <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-center">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('cta.title')}</h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">{t('cta.desc')}</p>
          <Link
            to={getLink('/contacto')}
            className="inline-flex items-center gap-2 px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-sm transition-all group"
          >
            {t('cta.btn')}
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={22} />
          </Link>
        </div>
      </section>
    </>
  );
};
