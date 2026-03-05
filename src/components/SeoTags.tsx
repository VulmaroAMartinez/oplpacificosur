import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export const SeoTags = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language;

    // Manage Hreflang Tags
    // We need to construct the URLs for the alternate versions
    // Since we are using query parameters (?lang=es, ?lang=en)
    
    const baseUrl = window.location.origin + window.location.pathname;
    
    // Function to add or update link tag
    const updateLinkTag = (hreflang: string, url: string) => {
      let link = document.querySelector(`link[hreflang="${hreflang}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = hreflang;
        document.head.appendChild(link);
      }
      link.href = url;
    };

    updateLinkTag('es', `${baseUrl}?lang=es`);
    updateLinkTag('en', `${baseUrl}?lang=en`);
    
    // Also add x-default usually pointing to the main version
    updateLinkTag('x-default', `${baseUrl}`);

  }, [language]); // Re-run when language changes, though purely URL based

  return null;
};
