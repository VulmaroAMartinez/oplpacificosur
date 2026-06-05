import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    Newspaper,
    Loader2,
    Plus,
    Pencil,
    Trash2,
    RefreshCw,
} from 'lucide-react';
import {
    getAllBoletines,
    deleteBoletin,
    seedDemoBoletines,
} from '../services/bulletinService';
import type { Boletin } from '../types/bulletins';

export const AdminBoletines = () => {
    const [items, setItems] = useState<Boletin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getAllBoletines();
            setItems(data);
        } catch (err) {
            console.error(err);
            setError('No se pudieron cargar los boletines. ¿Ejecutaste la migración 004_boletines.sql?');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este boletín?')) return;
        try {
            await deleteBoletin(id);
            setItems((prev) => prev.filter((b) => b.id !== id));
        } catch (err) {
            console.error(err);
            setError('Error al eliminar el boletín.');
        }
    };

    const handleSeedDemo = async () => {
        if (!confirm('¿Cargar boletines de ejemplo?')) return;
        setLoading(true);
        try {
            await seedDemoBoletines();
            await fetchData();
        } catch (err) {
            console.error(err);
            setError('Error al cargar demo. ¿Ya existen boletines con datos similares?');
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-20 bg-slate-100 min-h-screen">
            <div className="container mx-auto px-4 md:px-8">
                <div className="mb-8">
                    <Link
                        to="/admin"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-500 mb-4 text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> Volver al panel
                    </Link>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <Newspaper className="text-orange-500" size={32} />
                            Gestión de Boletines ({items.length})
                        </h1>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchData}
                                className="p-2 bg-white rounded-full shadow-sm hover:shadow-md text-slate-600 hover:text-orange-500 transition-all"
                                title="Recargar"
                            >
                                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                            </button>
                            {items.length === 0 && !loading && (
                                <button
                                    onClick={handleSeedDemo}
                                    className="px-4 py-2 text-sm border border-slate-300 text-slate-600 hover:bg-white rounded-sm"
                                >
                                    Cargar Demo
                                </button>
                            )}
                            <Link
                                to="/admin/boletines/nuevo"
                                className="px-4 py-2 bg-orange-500 text-white rounded-sm hover:bg-orange-600 transition-colors flex items-center gap-2 font-bold text-sm"
                            >
                                <Plus size={16} /> Nuevo Boletín
                            </Link>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-sm text-sm">{error}</div>
                )}

                <div className="bg-white rounded-sm shadow-md overflow-hidden min-h-[400px]">
                    {loading ? (
                        <div className="flex justify-center py-24">
                            <Loader2 className="animate-spin text-orange-500" size={40} />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">
                            <Newspaper size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-medium">No hay boletines publicados.</p>
                            <p className="text-sm mt-2">
                                Crea uno nuevo o carga el contenido de demostración.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 p-4 hover:bg-slate-50 items-center transition-colors"
                                >
                                    <img
                                        src={item.image_url}
                                        alt=""
                                        className="w-16 h-16 object-cover rounded-sm bg-slate-200 shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
                                        <p className="text-sm text-slate-500 truncate mt-0.5">
                                            <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded mr-2">
                                                {item.category}
                                            </span>
                                            {item.excerpt}
                                        </p>
                                        {!item.is_published && (
                                            <span className="text-xs text-amber-600 font-medium">Borrador</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Link
                                            to={`/admin/boletines/${item.id}/editar`}
                                            className="text-slate-400 hover:text-orange-500 p-2 transition-colors"
                                            title="Editar"
                                        >
                                            <Pencil size={20} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-400 hover:text-red-600 p-2 transition-colors"
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
    );
};