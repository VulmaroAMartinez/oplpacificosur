import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import {
    createBoletin,
    getBoletinById,
    updateBoletin,
    uploadBoletinImage,
    validateBoletinImageFile,
    } from '../services/bulletinService';
import type { BoletinInsert } from '../types/bulletins';

export const AdminBoletinesForm = () => {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: '',
        excerpt: '',
        category: 'General',
        read_more_link: '',
        is_published: true,
    });

    useEffect(() => {
        if (!isEdit || !id) return;
        getBoletinById(id)
            .then((item) => {
                if (!item) {
                    setError('Boletín no encontrado');
                    return;
                }
                setForm({
                    title: item.title,
                    excerpt: item.excerpt,
                    category: item.category,
                    read_more_link: item.read_more_link ?? '',
                    is_published: item.is_published,
                });
                setExistingImageUrl(item.image_url);
                setImagePreview(item.image_url);
            })
            .catch(() => setError('Error al cargar el boletín'))
            .finally(() => setLoading(false));
    }, [id, isEdit]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validationError = validateBoletinImageFile(file);
        if (validationError) {
            setError(validationError);
            e.target.value = '';
            return;
        }
        setError('');
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        if (!imageFile && !existingImageUrl) {
            setError('Debes subir una imagen de portada.');
            setSaving(false);
            return;
        }

        try {
            const imageUrl = imageFile
                ? await uploadBoletinImage(imageFile)
                : existingImageUrl!;

            const payload: BoletinInsert = {
                title: form.title,
                excerpt: form.excerpt,
                category: form.category,
                image_url: imageUrl,
                read_more_link: form.read_more_link.trim() || null,
                is_published: form.is_published,
            };

            if (isEdit && id) {
                await updateBoletin(id, payload);
            } else {
                await createBoletin(payload);
            }
            navigate('/admin/boletines');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al guardar';
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 pt-24">
                <Loader2 className="animate-spin text-orange-500" size={40} />
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 bg-slate-100 min-h-screen">
            <div className="container mx-auto px-4 md:px-8 max-w-3xl">
                <Link
                    to="/admin/boletines"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-500 mb-6 text-sm font-medium"
                >
                    <ArrowLeft size={18} /> Volver a boletines
                </Link>

                <h1 className="text-2xl font-bold text-slate-900 mb-6">
                    {isEdit ? 'Editar boletín' : 'Nuevo boletín'}
                </h1>

                {error && (
                    <p className="text-red-600 text-sm bg-red-50 p-3 rounded-sm border border-red-100 mb-4">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-sm shadow-md p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Título *
                        </label>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full p-3 border border-slate-200 rounded-sm focus:border-orange-500 outline-none transition-colors"
                            placeholder="Título del boletín"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Categoría *
                        </label>
                        <input
                            type="text"
                            required
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full p-3 border border-slate-200 rounded-sm focus:border-orange-500 outline-none transition-colors"
                            placeholder="Ej. Tendencias, Regulaciones, Tecnología..."
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Extracto *
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={form.excerpt}
                            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                            className="w-full p-3 border border-slate-200 rounded-sm focus:border-orange-500 outline-none transition-colors resize-none"
                            placeholder="Breve descripción del boletín..."
                        />
                    </div>

                    {/* Read more link */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Enlace de lectura (opcional)
                        </label>
                        <input
                            type="url"
                            value={form.read_more_link}
                            onChange={(e) => setForm({ ...form, read_more_link: e.target.value })}
                            className="w-full p-3 border border-slate-200 rounded-sm focus:border-orange-500 outline-none transition-colors"
                            placeholder="https://..."
                        />
                        <p className="text-xs text-slate-400 mt-1">
                            URL externa donde los usuarios podrán leer el boletín completo.
                        </p>
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Imagen de portada *
                        </label>

                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Vista previa"
                                className="w-full max-h-48 object-cover rounded-sm mb-3 border border-slate-200"
                            />
                        )}

                        <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-slate-200 rounded-sm cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition-colors">
                            <Upload size={20} className="text-slate-500" />
                            <span className="text-sm text-slate-600">
                                {imageFile
                                    ? imageFile.name
                                    : isEdit && existingImageUrl
                                        ? 'Cambiar imagen (JPG, PNG, WebP, GIF — máx. 5 MB)'
                                        : 'Elegir imagen (JPG, PNG, WebP, GIF — máx. 5 MB)'}
                            </span>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Published toggle */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.is_published}
                            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                            className="rounded"
                        />
                        <span className="text-sm text-slate-700">
                            Publicado (visible en el sitio)
                        </span>
                    </label>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-orange-500 text-white font-bold rounded-sm hover:bg-orange-600 disabled:opacity-60 flex items-center gap-2 transition-colors"
                        >
                            {saving && <Loader2 className="animate-spin" size={18} />}
                            {isEdit ? 'Guardar cambios' : 'Publicar boletín'}
                        </button>
                        <Link
                            to="/admin/boletines"
                            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-sm hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};