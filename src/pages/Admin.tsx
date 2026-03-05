import React, { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Trash2, Plus, MessageSquare, Newspaper, RefreshCw } from 'lucide-react';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-72bfe855`;

// Initial seed data for news
const INITIAL_NEWS = [
  {
    title: "Expansión de Rutas Comerciales hacia Asia Pacífico",
    excerpt: "MarLogística anuncia nuevas alianzas estratégicas para reducir tiempos de tránsito hacia los principales puertos de China y Japón.",
    date: "4 Feb, 2026",
    author: "Redacción",
    category: "Rutas",
    image: "https://images.unsplash.com/photo-1650908282348-3f1178d4e031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJnbyUyMHNoaXAlMjBwb3J0JTIwc3Vuc2V0fGVufDF8fHx8MTc3MDIyOTcyMnww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    title: "Innovación en Logística: Drones en Almacenes",
    excerpt: "Implementamos tecnología de drones autónomos para optimizar el inventario y agilizar el despacho en nuestros centros de distribución.",
    date: "28 Ene, 2026",
    author: "Tecnología",
    category: "Innovación",
    image: "https://images.unsplash.com/photo-1753781466414-e93cf7f4f6df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpc3RpY3MlMjB0ZWNobm9sb2d5JTIwZHJvbmV8ZW58MXx8fHwxNzcwMjI5NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    title: "Compromiso Verde: Reducción de Huella de Carbono",
    excerpt: "Nueva flota de camiones eléctricos y optimización de rutas marítimas para cumplir con nuestros objetivos de sostenibilidad 2030.",
    date: "15 Ene, 2026",
    author: "Sostenibilidad",
    category: "Medio Ambiente",
    image: "https://images.unsplash.com/photo-1759354017689-cf8b886b9f41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHNoaXBwaW5nJTIwZWNvJTIwZnJpZW5kbHl8ZW58MXx8fHwxNzcwMjI5NzIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export const Admin = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'news'>('messages');
  const [messages, setMessages] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // News Form State
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newNews, setNewNews] = useState({
    title: '',
    excerpt: '',
    date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    author: 'Admin',
    category: 'General',
    image: 'https://images.unsplash.com/photo-1619070284836-e850273d69ac?auto=format&fit=crop&q=80&w=1000'
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Messages
      const msgRes = await fetch(`${API_URL}/contact`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (msgRes.ok) setMessages(await msgRes.json());

      // Fetch News
      const newsRes = await fetch(`${API_URL}/news`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (newsRes.ok) setNews(await newsRes.json());
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeedNews = async () => {
    if (!confirm("¿Cargar noticias de ejemplo?")) return;
    setIsLoading(true);
    try {
      for (const item of INITIAL_NEWS) {
        await fetch(`${API_URL}/news`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(item)
        });
      }
      fetchData();
    } catch (error) {
      console.error("Error seeding news:", error);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("¿Eliminar esta noticia?")) return;
    try {
      await fetch(`${API_URL}/news/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      setNews(news.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(newNews)
      });
      setShowNewsForm(false);
      fetchData();
    } catch (error) {
      console.error("Error creating news:", error);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Panel de Administración</h1>
          <button 
            onClick={fetchData} 
            className="p-2 bg-white rounded-full shadow-sm hover:shadow-md text-slate-600 hover:text-orange-500 transition-all"
            title="Recargar datos"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="bg-white rounded-sm shadow-md overflow-hidden min-h-[600px]">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-4 text-center font-bold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'messages' 
                  ? 'bg-white text-orange-500 border-b-2 border-orange-500' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <MessageSquare size={20} /> Mensajes Recibidos ({messages.length})
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 py-4 text-center font-bold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'news' 
                  ? 'bg-white text-orange-500 border-b-2 border-orange-500' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Newspaper size={20} /> Gestión de Noticias ({news.length})
            </button>
          </div>

          <div className="p-6">
            {/* MESSAGES TAB */}
            {activeTab === 'messages' && (
              <div>
                {messages.length === 0 ? (
                  <div className="text-center py-20 text-slate-500">
                    <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No hay mensajes nuevos.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                          <th className="p-4 border-b">Fecha</th>
                          <th className="p-4 border-b">Nombre</th>
                          <th className="p-4 border-b">Empresa</th>
                          <th className="p-4 border-b">Servicio</th>
                          <th className="p-4 border-b">Mensaje</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {messages.map((msg) => (
                          <tr key={msg.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 border-b text-slate-500 whitespace-nowrap">
                              {new Date(msg.submittedAt).toLocaleDateString()} <br/>
                              <span className="text-xs">{new Date(msg.submittedAt).toLocaleTimeString()}</span>
                            </td>
                            <td className="p-4 border-b font-bold text-slate-900">
                              {msg.name} <br/>
                              <span className="font-normal text-slate-500 text-xs">{msg.email}</span>
                            </td>
                            <td className="p-4 border-b text-slate-700">{msg.company || '-'}</td>
                            <td className="p-4 border-b">
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                                {msg.service}
                              </span>
                            </td>
                            <td className="p-4 border-b text-slate-600 max-w-xs truncate" title={msg.message}>
                              {msg.message}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* NEWS TAB */}
            {activeTab === 'news' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Artículos Publicados</h2>
                  <div className="flex gap-2">
                    {news.length === 0 && (
                      <button 
                        onClick={handleSeedNews}
                        className="px-4 py-2 text-sm border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-sm"
                      >
                        Cargar Demo
                      </button>
                    )}
                    <button 
                      onClick={() => setShowNewsForm(!showNewsForm)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-sm hover:bg-orange-600 transition-colors flex items-center gap-2 font-bold text-sm"
                    >
                      <Plus size={16} /> {showNewsForm ? 'Cancelar' : 'Nueva Noticia'}
                    </button>
                  </div>
                </div>

                {showNewsForm && (
                  <motion.form 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleCreateNews}
                    className="bg-slate-50 p-6 rounded-sm mb-8 border border-slate-200"
                  >
                    <h3 className="font-bold mb-4">Redactar Nueva Noticia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input 
                        type="text" placeholder="Título" required
                        value={newNews.title} onChange={e => setNewNews({...newNews, title: e.target.value})}
                        className="p-3 border rounded-sm w-full"
                      />
                      <input 
                        type="text" placeholder="Categoría (ej. Innovación)" required
                        value={newNews.category} onChange={e => setNewNews({...newNews, category: e.target.value})}
                        className="p-3 border rounded-sm w-full"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input 
                        type="text" placeholder="Autor" required
                        value={newNews.author} onChange={e => setNewNews({...newNews, author: e.target.value})}
                        className="p-3 border rounded-sm w-full"
                      />
                      <input 
                        type="text" placeholder="URL de Imagen" required
                        value={newNews.image} onChange={e => setNewNews({...newNews, image: e.target.value})}
                        className="p-3 border rounded-sm w-full"
                      />
                    </div>
                    <textarea 
                      placeholder="Extracto / Contenido breve" required rows={3}
                      value={newNews.excerpt} onChange={e => setNewNews({...newNews, excerpt: e.target.value})}
                      className="p-3 border rounded-sm w-full mb-4"
                    ></textarea>
                    <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-sm font-bold">
                      Publicar
                    </button>
                  </motion.form>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {news.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border border-slate-100 rounded-sm hover:shadow-sm bg-white items-center">
                      <img src={item.image} alt="" className="w-16 h-16 object-cover rounded-sm bg-slate-200" />
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{item.title}</h4>
                        <p className="text-sm text-slate-500">{item.date} • {item.category}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteNews(item.id)}
                        className="text-red-400 hover:text-red-600 p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
