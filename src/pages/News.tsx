import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useLanguage } from '../context/LanguageContext';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-72bfe855/news`;

// Fallback data in case API is empty initially (only used if fetch returns empty and user hasn't seeded)
// or we can just show empty state. Let's show empty state or a message.
const MOCK_NEWS = [
  {
    id: 1,
    title: "Expansión de Rutas Comerciales hacia Asia Pacífico",
    excerpt: "MarLogística anuncia nuevas alianzas estratégicas para reducir tiempos de tránsito hacia los principales puertos de China y Japón.",
    date: "4 Feb, 2026",
    author: "Redacción",
    category: "Rutas",
    image: "https://images.unsplash.com/photo-1650908282348-3f1178d4e031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHNoaXAlMjBwb3J0JTIwc3Vuc2V0fGVufDF8fHx8MTc3MDIyOTcyMnww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    title: "Innovación en Logística: Drones en Almacenes",
    excerpt: "Implementamos tecnología de drones autónomos para optimizar el inventario y agilizar el despacho en nuestros centros de distribución.",
    date: "28 Ene, 2026",
    author: "Tecnología",
    category: "Innovación",
    image: "https://images.unsplash.com/photo-1753781466414-e93cf7f4f6df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpc3RpY3MlMjB0ZWNobm9sb2d5JTIwZHJvbmV8ZW58MXx8fHwxNzcwMjI5NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 3,
    title: "Compromiso Verde: Reducción de Huella de Carbono",
    excerpt: "Nueva flota de camiones eléctricos y optimización de rutas marítimas para cumplir con nuestros objetivos de sostenibilidad 2030.",
    date: "15 Ene, 2026",
    author: "Sostenibilidad",
    category: "Medio Ambiente",
    image: "https://images.unsplash.com/photo-1759354017689-cf8b886b9f41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHNoaXBwaW5nJTIwZWNvJTIwZnJpZW5kbHl8ZW58MXx8fHwxNzcwMjI5NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 4,
    title: "Nuevos Acuerdos Comerciales Internacionales",
    excerpt: "Analizamos el impacto de los recientes tratados de libre comercio y cómo benefician a nuestros clientes exportadores.",
    date: "10 Ene, 2026",
    author: "Análisis",
    category: "Comercio",
    image: "https://images.unsplash.com/photo-1591453214154-c95db71dbd83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkZSUyMGFncmVlbWVudCUyMGhhbmRzaGFrZSUyMGJ1c2luZXNzfGVufDF8fHx8MTc3MDIyOTcyMnww&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export const News = () => {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  
  const getLink = (path: string) => `${path}?lang=${language}`;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });
        if (res.ok) {
          const data = await res.json();
          // If no data in backend, use mock data for better UX initially
          if (Array.isArray(data) && data.length > 0) {
            setNewsItems(data);
          } else {
            setNewsItems(MOCK_NEWS);
          }
        } else {
           setNewsItems(MOCK_NEWS);
        }
      } catch (err) {
        console.error(err);
        setNewsItems(MOCK_NEWS);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

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
          <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">{t('news.section_subtitle')}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-4">{t('news.title')}</h1>
          <p className="text-slate-600 text-lg">
            {t('news.desc')}
          </p>
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
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 uppercase rounded-sm">
                  {item.category}
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-slate-400 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{item.author}</span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors">
                  <Link to={getLink(`/noticias/${item.id}`)}>{item.title}</Link>
                </h2>
                
                <p className="text-slate-600 mb-6 flex-1">
                  {item.excerpt}
                </p>
                
                <Link 
                  to={getLink(`/noticias/${item.id}`)} 
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
