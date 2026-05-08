import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const SeoTags = () => {
  const { language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    // Actualizar atributo lang del HTML
    document.documentElement.lang = language;

    // Obtener la ruta sin el prefijo de idioma
    let basePath = location.pathname;
    if (basePath.startsWith('/en/')) {
      basePath = basePath.slice(3);
    } else if (basePath === '/en') {
      basePath = '/';
    }

    const origin = window.location.origin;

    // URLs canónicas por idioma (path-based, no query params)
    const esUrl = `${origin}${basePath}`;
    const enUrl = `${origin}/en${basePath}`;

    // Función para crear o actualizar link tags
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

    // Canonical tag
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = language === 'es' ? esUrl : enUrl;

    // hreflang tags (SEO multilingüe)
    updateLinkTag('es', esUrl);
    updateLinkTag('en', enUrl);
    updateLinkTag('x-default', esUrl); // Español como default

    // Meta description dinámica
    const descriptions: Record<string, Record<string, string>> = {
      '/': {
        es: 'OPL Pacífico Sur — Agente naviero y operador logístico en Tapachula, Chiapas. Transporte marítimo, agencia naviera y logística portuaria.',
        en: 'OPL Pacífico Sur — Shipping agent and logistics operator in Tapachula, Chiapas. Sea freight, shipping agency and port logistics.',
      },
      '/servicios': {
        es: 'Servicios logísticos integrales: transporte marítimo, lanchaje, carga y descarga, amarre, avituallamiento de buques.',
        en: 'Integral logistics services: sea freight, boat services, cargo loading, anchoring, ship supplying.',
      },
      '/nosotros': {
        es: 'Conozca la historia, misión, visión y valores de OPL Pacífico Sur.',
        en: 'Learn about OPL Pacífico Sur history, mission, vision and values.',
      },
      '/contacto': {
        es: 'Contáctenos para cotizaciones y asesoría logística. Tapachula, Chiapas, México.',
        en: 'Contact us for quotes and logistics advice. Tapachula, Chiapas, Mexico.',
      },
    };

    const desc = descriptions[basePath]?.[language] || descriptions['/']?.[language] || '';
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = desc;

  }, [language, location.pathname]);

  return null;
};
