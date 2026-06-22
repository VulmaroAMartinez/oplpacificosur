import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Images, Loader2, Trash2, Upload } from 'lucide-react';
import {
  deleteGalleryImage,
  getAllGalleryImages,
  uploadGalleryImage,
  validateGalleryImageFile,
} from '../services/galleryService';
import type { GalleryImage } from '../types/gallery';

export const AdminGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadImages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllGalleryImages();
      setImages(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las imágenes. ¿Ejecutaste la migración 004_gallery_images.sql?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = '';
    if (files.length === 0) return;

    setUploading(true);
    setError('');
    setSuccess('');

    let uploaded = 0;
    const errors: string[] = [];

    for (const file of files) {
      const validationError = validateGalleryImageFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
        continue;
      }

      try {
        const created = await uploadGalleryImage(file);
        setImages((prev) => [...prev, created]);
        uploaded += 1;
      } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'Error al subir la imagen';
        errors.push(`${file.name}: ${message}`);
      }
    }

    setUploading(false);

    if (uploaded > 0) {
      setSuccess(
        uploaded === 1
          ? '1 imagen subida correctamente.'
          : `${uploaded} imágenes subidas correctamente.`
      );
    }
    if (errors.length > 0) {
      setError(errors.join(' '));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta imagen de la galería?')) return;

    setError('');
    setSuccess('');

    try {
      await deleteGalleryImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      setSuccess('Imagen eliminada.');
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Error al eliminar la imagen';
      setError(message);
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
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Images className="text-orange-500" size={32} />
            Galería
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Sube o elimina fotos de la galería en la sección Nosotros. Las imágenes se muestran en
            formato horizontal en un carrusel del sitio público.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-sm text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-sm text-sm">{success}</div>
        )}

        <div className="mb-8">
          <label
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm font-bold text-sm transition-colors cursor-pointer ${
              uploading
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Subiendo…
              </>
            ) : (
              <>
                <Upload size={18} />
                Subir imágenes
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="sr-only"
              disabled={uploading}
              onChange={handleFileChange}
            />
          </label>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-orange-500" size={40} />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white rounded-sm shadow-md border border-slate-100">
            <Images size={48} className="mx-auto mb-4 opacity-20" />
            <p>No hay imágenes en la galería.</p>
            <p className="text-sm mt-2">Sube fotos para que aparezcan en la sección Nosotros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-sm shadow-md overflow-hidden border border-slate-100 group relative"
              >
                <div className="aspect-4/3 bg-slate-200 relative overflow-hidden">
                  <img
                    src={image.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDelete(image.id)}
                    className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 hover:bg-red-500 hover:text-white rounded-sm shadow-md opacity-0 group-hover:opacity-100 transition-all"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
