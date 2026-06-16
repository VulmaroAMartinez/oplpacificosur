import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const DOMAIN = 'https://oplpacifico.com';

interface PageMeta {
  title: string;
  description: string;
  ogImage?: string;
}

type PageMetaMap = {
  [key: string]: {
    es: PageMeta;
    en: PageMeta;
  };
};

const PAGE_META: PageMetaMap = {
  '/': {
    es: {
      title: 'OPL Pacífico Sur — Agente Naviero y Operador Logístico | Tapachula, Chiapas',
      description: 'OPL Pacífico Sur: agencia naviera y operador logístico en Tapachula, Chiapas. Agenciamiento de buques, fletes marítimos FCL/LCL, logística portuaria y transporte terrestre.',
    },
    en: {
      title: 'OPL Pacífico Sur — Shipping Agent and Logistics Operator | Tapachula, Mexico',
      description: 'OPL Pacífico Sur: shipping agent and logistics operator in Tapachula, Chiapas. Ship agency, FCL/LCL ocean freight, port logistics and road transport services.',
    },
  },
  '/servicios': {
    es: {
      title: 'Servicios — Agencia Naviera y Logística Portuaria | OPL Pacífico Sur',
      description: 'Servicios de agencia naviera: agenciamiento de buques, fletes FCL/LCL, lanchaje, amarre. Logística: aduanas, carga/descarga, transporte terrestre, almacén en Tapachula.',
    },
    en: {
      title: 'Services — Shipping Agency and Port Logistics | OPL Pacífico Sur',
      description: 'Shipping agency services: ship agency, FCL/LCL freight, launch boat, mooring. Logistics: customs, load/unload, road transport, warehousing in Tapachula, Mexico.',
    },
  },
  '/nosotros': {
    es: {
      title: 'Nosotros — Historia, Misión y Visión | OPL Pacífico Sur',
      description: 'Conoce a OPL Pacífico Sur, agencia naviera fundada en 2022 en Puerto Madero, Tapachula. Nuestra historia, misión, visión y valores en el sector marítimo-logístico.',
    },
    en: {
      title: 'About Us — History, Mission and Vision | OPL Pacífico Sur',
      description: 'Learn about OPL Pacífico Sur, shipping agency founded in 2022 in Puerto Madero, Tapachula. Our history, mission, vision and values in the maritime-logistics sector.',
    },
  },
  '/noticias': {
    es: {
      title: 'Noticias del Sector Logístico y Marítimo | OPL Pacífico Sur',
      description: 'Mantente informado con las últimas noticias del sector marítimo, logístico y portuario. Novedades de OPL Pacífico Sur y tendencias globales del comercio internacional.',
    },
    en: {
      title: 'Maritime and Logistics Industry News | OPL Pacífico Sur',
      description: 'Stay informed with the latest news from the maritime, logistics and port industry. OPL Pacífico Sur updates and global trade trends.',
    },
  },
  '/boletines': {
    es: {
      title: 'Boletines del Sector Marítimo y Logístico | OPL Pacífico Sur',
      description: 'Explora boletines con análisis del sector marítimo, tendencias globales y estrategias logísticas de OPL Pacífico Sur.',
    },
    en: {
      title: 'Maritime and Logistics Bulletins | OPL Pacífico Sur',
      description: 'Explore bulletins with maritime industry analysis, global trends and logistics strategies from OPL Pacífico Sur.',
    },
  },
  '/contacto': {
    es: {
      title: 'Contacto — Solicita Cotización Logística | OPL Pacífico Sur Tapachula',
      description: 'Contáctanos para solicitar una cotización de fletes marítimos, agenciamiento de buques o servicios logísticos. Tel: +52 962 152 8543. Tapachula, Chiapas, México.',
    },
    en: {
      title: 'Contact — Request a Logistics Quote | OPL Pacífico Sur Tapachula',
      description: 'Contact us to request a quote for sea freight, ship agency or logistics services. Tel: +52 962 152 8543. Tapachula, Chiapas, Mexico.',
    },
  },
};

const DEFAULT_OG_IMAGE = `${DOMAIN}/og-image.jpg`;

function setOrCreate(
  selector: string,
  attribute: string,
  value: string,
  tagName: string = 'meta',
  relAttribute?: string
): void {
  let el = document.querySelector(selector) as HTMLElement;
  if (!el) {
    el = document.createElement(tagName);
    if (relAttribute) {
      el.setAttribute('rel', relAttribute);
    } else if (tagName === 'meta') {
      const attrName = selector.includes('property') ? 'property' : 'name';
      const attrValue = selector.match(/["']([^"']+)["']/)?.[1] || '';
      el.setAttribute(attrName, attrValue);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attribute, value);
}

export const SeoTags = () => {
  const { language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    let basePath = location.pathname;
    if (basePath.startsWith('/en/')) {
      basePath = basePath.slice(3);
    } else if (basePath === '/en') {
      basePath = '/';
    }
    if (basePath.startsWith('/noticias/')) {
      basePath = '/noticias';
    }

    const lang = language as 'es' | 'en';
    const pageMeta = PAGE_META[basePath]?.[lang] || PAGE_META['/'][lang];

    const esPath = basePath;
    const enPath = `/en${basePath === '/' ? '/' : basePath}`;
    const canonicalPath = lang === 'es' ? esPath : enPath;

    const esUrl = `${DOMAIN}${esPath}`;
    const enUrl = `${DOMAIN}${enPath}`;
    const canonicalUrl = `${DOMAIN}${canonicalPath}`;
    const ogImage = pageMeta.ogImage || DEFAULT_OG_IMAGE;

    document.documentElement.lang = language;
    document.title = pageMeta.title;

    setOrCreate('link[rel="canonical"]', 'href', canonicalUrl, 'link', 'canonical');
    setOrCreate('meta[name="description"]', 'content', pageMeta.description);
    setOrCreate('meta[name="robots"]', 'content', 'index, follow');

    const updateHreflang = (hreflang: string, url: string) => {
      let link = document.querySelector(`link[hreflang="${hreflang}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'alternate';
        link.setAttribute('hreflang', hreflang);
        document.head.appendChild(link);
      }
      link.href = url;
    };
    updateHreflang('es', esUrl);
    updateHreflang('en', enUrl);
    updateHreflang('x-default', esUrl);

    setOrCreate('meta[property="og:title"]', 'content', pageMeta.title);
    setOrCreate('meta[property="og:description"]', 'content', pageMeta.description);
    setOrCreate('meta[property="og:url"]', 'content', canonicalUrl);
    setOrCreate('meta[property="og:type"]', 'content', 'website');
    setOrCreate('meta[property="og:site_name"]', 'content', 'OPL Pacífico Sur');
    setOrCreate('meta[property="og:image"]', 'content', ogImage);
    setOrCreate('meta[property="og:image:width"]', 'content', '1200');
    setOrCreate('meta[property="og:image:height"]', 'content', '630');
    setOrCreate('meta[property="og:locale"]', 'content', lang === 'es' ? 'es_MX' : 'en_US');

    setOrCreate('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setOrCreate('meta[name="twitter:title"]', 'content', pageMeta.title);
    setOrCreate('meta[name="twitter:description"]', 'content', pageMeta.description);
    setOrCreate('meta[name="twitter:image"]', 'content', ogImage);

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${DOMAIN}/#organization`,
          name: 'OPL Pacífico Sur',
          url: DOMAIN,
          logo: {
            '@type': 'ImageObject',
            url: `${DOMAIN}/logo.png`,
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+52-962-152-8543',
            contactType: 'customer service',
            areaServed: ['MX', 'GT', 'HN', 'SV'],
            availableLanguage: ['Spanish', 'English'],
            hoursAvailable: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '08:00',
              closes: '18:00',
            },
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Calle Parque Industrial MZ F Lote 34, Puerto Madero Centro',
            addressLocality: 'Tapachula',
            addressRegion: 'Chiapas',
            postalCode: '30830',
            addressCountry: 'MX',
          },
          email: 'logistica@oplpacifico.com',
          sameAs: [
            'https://www.linkedin.com/company/opl-pacifico-sur/',
            'https://www.instagram.com/oplpacificosur',
          ],
        },
        {
          '@type': 'LocalBusiness',
          '@id': `${DOMAIN}/#localbusiness`,
          name: 'OPL Pacífico Sur',
          description:
            lang === 'es'
              ? 'Agencia naviera y operador logístico en Tapachula, Chiapas. Servicios de agenciamiento de buques, fletes marítimos y logística portuaria.'
              : 'Shipping agency and logistics operator in Tapachula, Chiapas. Ship agency, ocean freight and port logistics services.',
          url: DOMAIN,
          telephone: '+52-962-152-8543',
          email: 'logistica@oplpacifico.com',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Calle Parque Industrial MZ F Lote 34, Puerto Madero Centro',
            addressLocality: 'Tapachula',
            addressRegion: 'Chiapas',
            postalCode: '30830',
            addressCountry: 'MX',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 14.9254,
            longitude: -92.2882,
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '08:00',
              closes: '18:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Saturday'],
              opens: '08:00',
              closes: '13:00',
            },
          ],
          priceRange: '$$',
          currenciesAccepted: 'MXN, USD',
          image: ogImage,
        },
        {
          '@type': 'WebSite',
          '@id': `${DOMAIN}/#website`,
          url: DOMAIN,
          name: 'OPL Pacífico Sur',
          inLanguage: lang === 'es' ? 'es-MX' : 'en-US',
        },
        {
          '@type': 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: pageMeta.title,
          description: pageMeta.description,
          inLanguage: lang === 'es' ? 'es-MX' : 'en-US',
          isPartOf: { '@id': `${DOMAIN}/#website` },
        },
      ],
    };

    const existingScript = document.querySelector('script[data-seo="structured-data"]');
    if (existingScript) existingScript.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'structured-data');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, [language, location.pathname]);

  return null;
};
