import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DOMAIN = 'https://oplpacifico.com';

interface BreadcrumbItem {
  label: string;
  path: string;
}

export const Breadcrumb = () => {
  const location = useLocation();
  const { t, getLink } = useLanguage();

  let basePath = location.pathname;
  const isEnglish = basePath.startsWith('/en');
  if (basePath.startsWith('/en/')) basePath = basePath.slice(3);
  else if (basePath === '/en') basePath = '/';

  if (basePath === '/') return null;

  const labelMap: Record<string, string> = {
    '/servicios': t('nav.services'),
    '/nosotros': t('nav.about'),
    '/noticias': t('nav.news'),
    '/boletines': t('boletines.section_title'),
    '/contacto': t('nav.contact_short'),
  };

  const items: BreadcrumbItem[] = [{ label: t('nav.home'), path: '/' }];

  const segments = basePath.split('/').filter(Boolean);
  let accPath = '';
  segments.forEach((seg) => {
    accPath += `/${seg}`;
    items.push({
      label: labelMap[accPath] || seg,
      path: accPath,
    });
  });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${DOMAIN}${isEnglish ? '/en' : ''}${item.path}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav aria-label="Breadcrumb" className="container mx-auto px-4 md:px-8 pt-6">
        <ol className="flex items-center gap-1 text-sm text-slate-500 flex-wrap">
          {items.map((item, index) => (
            <li key={item.path} className="flex items-center gap-1">
              {index > 0 && <ChevronRight size={14} className="text-slate-400" />}
              {index === items.length - 1 ? (
                <span className="text-slate-700 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={getLink(item.path)}
                  className="hover:text-orange-500 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};
