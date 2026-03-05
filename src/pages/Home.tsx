import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { Services } from '../components/Services';
import { About } from '../components/About';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useLanguage } from '../context/LanguageContext';

const MOCK_NEWS_PREVIEW = [
  {
    title: "Expansión de Rutas Comerciales",
    date: "4 Feb, 2026",
    image: "https://images.unsplash.com/photo-1650908282348-3f1178d4e031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHNoaXAlMjBwb3J0JTIwc3Vuc2V0fGVufDF8fHx8MTc3MDIyOTcyMnww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    title: "Drones en Almacenes",
    date: "28 Ene, 2026",
    image: "https://images.unsplash.com/photo-1753781466414-e93cf7f4f6df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpc3RpY3MlMjB0ZWNobm9sb2d5JTIwZHJvbmV8ZW58MXx8fHwxNzcwMjI5NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    title: "Compromiso Verde 2030",
    date: "15 Ene, 2026",
    image: "https://images.unsplash.com/photo-1759354017689-cf8b886b9f41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHNoaXBwaW5nJTIwZWNvJTIwZnJpZW5kbHl8ZW58MXx8fHwxNzcwMjI5NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export const Home = () => {
  const [newsPreview, setNewsPreview] = useState<any[]>(MOCK_NEWS_PREVIEW);
  const { t, language } = useLanguage();
  const getLink = (path: string) => `${path}?lang=${language}`;

  useEffect(() => {
    // Attempt to fetch fresh news
    const fetchNews = async () => {
      try {
        const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-72bfe855/news`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setNewsPreview(data.slice(0, 3));
          }
        }
      } catch (e) {
        console.log("Using fallback news");
      }
    };
    fetchNews();
  }, []);

  return (
    <>
      <Hero />
      
      {/* Services Preview */}
      <Services />
      
      {/* About Preview */}
      <About />
      
      {/* News Preview Section (Only 3 items) */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">{t('news.section_subtitle')}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">{t('news.latest_title')}</h2>
            </div>
            <Link to={getLink('/noticias')} className="hidden md:flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors">
              {t('news.view_all')} <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {newsPreview.map((item, idx) => (
               <div key={idx} className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                 <div className="h-48 overflow-hidden">
                   <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 </div>
                 <div className="p-6">
                   <p className="text-xs text-slate-400 font-bold mb-2 uppercase">{item.date}</p>
                   <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-orange-500 transition-colors">
                     <Link to={getLink('/noticias')}>{item.title}</Link>
                   </h3>
                   <Link to={getLink('/noticias')} className="text-sm font-bold text-slate-600 hover:text-orange-500 transition-colors">{t('news.read_article')}</Link>
                 </div>
               </div>
             ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
             <Link to={getLink('/noticias')} className="inline-flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors">
              {t('news.view_all')} <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-orange-500">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('cta.title')}</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            {t('cta.desc')}
          </p>
          <Link 
            to={getLink('/contacto')}
            className="inline-block bg-white text-orange-600 font-bold py-4 px-10 rounded-sm shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all"
          >
            {t('cta.btn')}
          </Link>
        </div>
      </section>
    </>
  );
};
