import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getNewsBySlug, isSupabaseConfigured } from '../services/newsService';
import { formatNewsDate, type NewsItem } from '../types/news';

export const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, getLink, language } = useLanguage();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const locale = language === 'en' ? 'en-US' : 'es-ES';

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    getNewsBySlug(slug)
      .then((item) => {
        if (!item) setNotFound(true);
        else setArticle(item);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Noticia no encontrada</h1>
        <Link
          to={getLink('/noticias')}
          className="text-orange-500 font-bold inline-flex items-center gap-2"
        >
          <ArrowLeft size={18} /> {t('news.view_all')}
        </Link>
      </div>
    );
  }

  const body = article.content?.trim() || article.excerpt;

  return (
    <article className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <Link
          to={getLink('/noticias')}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-500 mb-8 text-sm font-medium"
        >
          <ArrowLeft size={18} /> {t('news.view_all')}
        </Link>

        <div className="relative h-72 md:h-96 rounded-sm overflow-hidden mb-8 shadow-md">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 uppercase rounded-sm">
            {article.category}
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 text-sm mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            {formatNewsDate(article.published_at, locale)}
          </span>
          <span className="flex items-center gap-1">
            <User size={16} />
            {article.author}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{article.title}</h1>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
          {body}
        </div>
      </div>
    </article>
  );
};
