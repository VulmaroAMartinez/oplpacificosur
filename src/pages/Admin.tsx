import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Newspaper, RefreshCw, LogOut, Pencil, ImageIcon, BookOpen, Images } from 'lucide-react';
import { supabase } from '../supabaseClient';
import {
  deleteNews,
  getAllNews,
  seedDemoNews,
} from '../services/newsService';
import { formatNewsDate, type NewsItem } from '../types/news';

export const Admin = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllNews();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeedNews = async () => {
    if (!confirm('¿Cargar noticias de ejemplo?')) return;
    setIsLoading(true);
    try {
      await seedDemoNews();
      await fetchData();
    } catch (error) {
      console.error('Error seeding news:', error);
      alert('Error al cargar demo. ¿Ya existen noticias con el mismo slug?');
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('¿Eliminar esta noticia?')) return;
    try {
      await deleteNews(id);
      setNews(news.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="pt-24 pb-20 bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-slate-900">Panel de Administración</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-2 bg-white rounded-full shadow-sm hover:shadow-md text-slate-600 hover:text-orange-500 transition-all"
              title="Recargar datos"
            >
              <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm border border-slate-300 text-slate-600 hover:bg-white rounded-sm flex items-center gap-2"
            >
              <LogOut size={16} /> Salir
            </button>
          </div>
        </div>

        {/* Quick-access cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Images card */}
          <Link
            to="/admin/imagenes"
            className="bg-white rounded-sm shadow-md overflow-hidden border border-slate-100 hover:border-orange-300 hover:shadow-lg transition-all group"
          >
            <div className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-sm bg-orange-100 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <ImageIcon size={28} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">Imágenes del sitio</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Carrusel de inicio, Nosotros y Contacto
                  </p>
                </div>
              </div>
              <span className="text-orange-500 font-bold text-sm shrink-0">Gestionar →</span>
            </div>
          </Link>

          {/* Gallery card */}
          <Link
            to="/admin/galeria"
            className="bg-white rounded-sm shadow-md overflow-hidden border border-slate-100 hover:border-orange-300 hover:shadow-lg transition-all group"
          >
            <div className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-sm bg-orange-100 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Images size={28} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">Galería</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Subir y eliminar fotos de la sección Nosotros
                  </p>
                </div>
              </div>
              <span className="text-orange-500 font-bold text-sm shrink-0">Gestionar →</span>
            </div>
          </Link>

          {/* Boletines card */}
          <Link
            to="/admin/boletines"
            className="bg-white rounded-sm shadow-md overflow-hidden border border-slate-100 hover:border-orange-300 hover:shadow-lg transition-all group"
          >
            <div className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-sm bg-orange-100 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <BookOpen size={28} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">Boletines Informativos</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Crear, editar y eliminar boletines
                  </p>
                </div>
              </div>
              <span className="text-orange-500 font-bold text-sm shrink-0">Gestionar →</span>
            </div>
          </Link>
        </div>

        {/* News management table */}
        <div className="bg-white rounded-sm shadow-md overflow-hidden min-h-[500px]">
          <div className="flex border-b border-slate-200 px-6 py-4 items-center justify-between">
            <h2 className="font-bold flex items-center gap-2 text-slate-900">
              <Newspaper size={20} className="text-orange-500" />
              Gestión de Noticias ({news.length})
            </h2>
            <div className="flex gap-2">
              {news.length === 0 && (
                <button
                  onClick={handleSeedNews}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-sm"
                >
                  Cargar Demo
                </button>
              )}
              <Link
                to="/admin/noticias/nueva"
                className="px-4 py-2 bg-orange-500 text-white rounded-sm hover:bg-orange-600 transition-colors flex items-center gap-2 font-bold text-sm"
              >
                <Plus size={16} /> Nueva Noticia
              </Link>
            </div>
          </div>

          <div className="p-6">
            {news.length === 0 && !isLoading ? (
              <div className="text-center py-20 text-slate-500">
                <Newspaper size={48} className="mx-auto mb-4 opacity-20" />
                <p>No hay noticias publicadas.</p>
                <p className="text-sm mt-2">Crea una nueva o carga el contenido de demostración.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 border border-slate-100 rounded-sm hover:shadow-sm bg-white items-center"
                  >
                    <img
                      src={item.image_url}
                      alt=""
                      className="w-16 h-16 object-cover rounded-sm bg-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
                      <p className="text-sm text-slate-500">
                        {formatNewsDate(item.published_at)} • {item.category}
                        {!item.is_published && (
                          <span className="ml-2 text-amber-600 font-medium">Borrador</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        to={`/admin/noticias/${item.id}/editar`}
                        className="text-slate-400 hover:text-orange-500 p-2"
                        title="Editar"
                      >
                        <Pencil size={20} />
                      </Link>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="text-red-400 hover:text-red-600 p-2"
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};