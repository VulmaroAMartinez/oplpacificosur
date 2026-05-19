import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ImageIcon, Loader2, Upload } from 'lucide-react';
import { getSiteImages, updateSiteImage, validateSiteImageFile } from '../services/siteImagesService';
import { SITE_IMAGE_SLOTS, type SiteImageId, type SiteImagesMap } from '../types/siteImages';

export const AdminImages = () => {
  const [images, setImages] = useState<SiteImagesMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<SiteImageId | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getSiteImages();
        setImages(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las imágenes. ¿Ejecutaste la migración 003_site_images.sql?');
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, []);

  const handleFileChange = async (id: SiteImageId, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const validationError = validateSiteImageFile(file);
    if (validationError) {
      setError(validationError);
      setSuccess('');
      return;
    }

    setUploadingId(id);
    setError('');
    setSuccess('');

    try {
      const updated = await updateSiteImage(id, file);
      setImages(updated);
      setSuccess(`Imagen actualizada: ${SITE_IMAGE_SLOTS.find((s) => s.id === id)?.label ?? id}`);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Error al subir la imagen';
      setError(message);
    } finally {
      setUploadingId(null);
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
            <ImageIcon className="text-orange-500" size={32} />
            Gestión de imágenes del sitio
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Sube imágenes para el carrusel de inicio, la sección Nosotros y Contacto. Solo estos espacios son
            editables desde el panel.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-sm text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-sm text-sm">{success}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-orange-500" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {SITE_IMAGE_SLOTS.map((slot) => {
              const current = images?.[slot.id];
              const isUploading = uploadingId === slot.id;

              return (
                <div
                  key={slot.id}
                  className="bg-white rounded-sm shadow-md overflow-hidden border border-slate-100"
                >
                  <div className="aspect-video bg-slate-200 relative">
                    {current?.image_url ? (
                      <img
                        src={current.image_url}
                        alt={current.alt_text ?? slot.label}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon size={48} />
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                        <Loader2 className="animate-spin text-white" size={32} />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900">{slot.label}</h3>
                    <p className="text-sm text-slate-500 mt-1 mb-4">{slot.description}</p>
                    <label
                      className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-sm font-bold text-sm transition-colors cursor-pointer ${
                        isUploading
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      <Upload size={18} />
                      {isUploading ? 'Subiendo…' : 'Reemplazar imagen'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="sr-only"
                        disabled={isUploading}
                        onChange={(e) => handleFileChange(slot.id, e)}
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
