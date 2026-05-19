import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import { createNews, getNewsById, updateNews } from '../services/newsService';
import { uploadNewsImage, validateNewsImageFile } from '../services/storageService';
import { slugify } from '../utils/slug';
import type { NewsInsert } from '../types/news';

export const AdminNewsForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'General',
    author: 'Admin',
    is_published: true,
  });

  useEffect(() => {
    if (!isEdit || !id) return;

    getNewsById(id)
      .then((item) => {
        if (!item) {
          setError('Noticia no encontrada');
          return;
        }
        setForm({
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          content: item.content ?? '',
          category: item.category,
          author: item.author,
          is_published: item.is_published,
        });
        setSlugManual(true);
        setExistingImageUrl(item.image_url);
        setImagePreview(item.image_url);
      })
      .catch(() => setError('Error al cargar la noticia'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateNewsImageFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = '';
      return;
    }

    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugManual ? prev.slug : slugify(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const finalSlug = form.slug || slugify(form.title);

    if (!imageFile && !existingImageUrl) {
      setError('Debes subir una imagen de portada.');
      setSaving(false);
      return;
    }

    try {
      const imageUrl = imageFile
        ? await uploadNewsImage(imageFile, finalSlug)
        : existingImageUrl!;

      const payload: NewsInsert = {
        slug: finalSlug,
        title: form.title,
        excerpt: form.excerpt,
        content: form.content || null,
        category: form.category,
        author: form.author,
        image_url: imageUrl,
        is_published: form.is_published,
      };

      if (isEdit && id) {
        await updateNews(id, payload);
      } else {
        await createNews(payload);
      }
      navigate('/admin');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar';
      setError(message.includes('duplicate') ? 'El slug ya existe. Usa otro.' : message);
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
          to="/admin"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-500 mb-6 text-sm font-medium"
        >
          <ArrowLeft size={18} /> Volver al panel
        </Link>

        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          {isEdit ? 'Editar noticia' : 'Nueva noticia'}
        </h1>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 p-3 rounded-sm border border-red-100 mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-sm shadow-md p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL) *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => {
                setSlugManual(true);
                setForm({ ...form, slug: slugify(e.target.value) });
              }}
              className="w-full p-3 border border-slate-200 rounded-sm font-mono text-sm"
            />
            <p className="text-xs text-slate-400 mt-1">/noticias/{form.slug || '...'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoría *</label>
              <input
                type="text"
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Autor *</label>
              <input
                type="text"
                required
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Imagen de portada *</label>
            <p className="text-xs text-slate-500 mb-2">
              {isEdit
                ? 'Sube una imagen nueva para reemplazar la actual, o deja la existente.'
                : 'Sube una imagen de portada para la noticia.'}
            </p>

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
                onChange={handleImageFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Extracto *</label>
            <textarea
              required
              rows={3}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contenido completo</label>
            <textarea
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-sm"
              placeholder="Texto del artículo para la página de detalle..."
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-slate-700">Publicada (visible en el sitio)</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-orange-500 text-white font-bold rounded-sm hover:bg-orange-600 disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <Loader2 className="animate-spin" size={18} />}
              {isEdit ? 'Guardar cambios' : 'Publicar'}
            </button>
            <Link
              to="/admin"
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-sm hover:bg-slate-50"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
