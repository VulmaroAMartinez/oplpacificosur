import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getSiteImages } from '../services/siteImagesService';
import { DEFAULT_SITE_IMAGES, type SiteImageId, type SiteImagesMap } from '../types/siteImages';

interface SiteImagesContextValue {
  images: SiteImagesMap;
  isLoading: boolean;
  refresh: () => Promise<void>;
  getImageUrl: (id: SiteImageId) => string;
  getAltText: (id: SiteImageId) => string;
}

const SiteImagesContext = createContext<SiteImagesContextValue | undefined>(undefined);

type SiteImagesProviderProps = React.PropsWithChildren<Record<string, never>>;

export const SiteImagesProvider = ({ children }: SiteImagesProviderProps) => {
  const [images, setImages] = useState<SiteImagesMap>(DEFAULT_SITE_IMAGES);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await getSiteImages();
      setImages(data);
    } catch (error) {
      console.error('Error loading site images:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getImageUrl = useCallback(
    (id: SiteImageId) => images[id]?.image_url ?? DEFAULT_SITE_IMAGES[id].image_url,
    [images]
  );

  const getAltText = useCallback(
    (id: SiteImageId) => images[id]?.alt_text ?? DEFAULT_SITE_IMAGES[id].alt_text ?? '',
    [images]
  );

  return (
    <SiteImagesContext.Provider value={{ images, isLoading, refresh, getImageUrl, getAltText }}>
      {children}
    </SiteImagesContext.Provider>
  );
};

export function useSiteImages() {
  const ctx = useContext(SiteImagesContext);
  if (!ctx) {
    throw new Error('useSiteImages debe usarse dentro de SiteImagesProvider');
  }
  return ctx;
}
