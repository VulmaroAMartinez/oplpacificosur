import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { translations } from '../utils/translations';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
  getLink: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Construye un link con el prefijo de idioma.
 * Español (default) usa / sin prefijo.
 * Inglés usa /en/ como prefijo.
 */
function buildLocalizedPath(path: string, lang: Language): string {
  // Asegura que el path empiece con /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (lang === 'es') {
    return cleanPath; // Español es el idioma por defecto, sin prefijo
  }

  return `/en${cleanPath}`;
}

/**
 * Detecta el idioma desde la URL actual.
 */
function detectLanguageFromPath(pathname: string): Language {
  if (pathname.startsWith('/en/') || pathname === '/en') {
    return 'en';
  }
  return 'es';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [language, setLanguageState] = useState<Language>(() => {
    return detectLanguageFromPath(window.location.pathname);
  });

  // Redirigir según idioma del navegador solo en la primera visita de la sesión
  useEffect(() => {
    const alreadyDetected = sessionStorage.getItem('lang-detected');
    if (alreadyDetected) return;

    sessionStorage.setItem('lang-detected', '1');

    // Solo redirigir si el usuario está en la raíz (no en una ruta directa)
    const isRootPath = location.pathname === '/' || location.pathname === '';
    if (!isRootPath) return;

    const browserLang = navigator.language || (navigator as any).userLanguage || '';
    const prefersEnglish = browserLang.toLowerCase().startsWith('en');

    if (prefersEnglish) {
      setLanguageState('en');
      navigate('/en/', { replace: true });
    }
  }, []);

  // Sincronizar idioma cuando cambia la URL
  useEffect(() => {
    const detected = detectLanguageFromPath(location.pathname);
    if (detected !== language) {
      setLanguageState(detected);
    }
  }, [location.pathname]);

  const setLanguage = (lang: Language) => {
    if (lang === language) return;

    // Obtener la ruta actual sin el prefijo de idioma
    let currentPath = location.pathname;

    // Remover prefijo /en si existe
    if (currentPath.startsWith('/en/')) {
      currentPath = currentPath.slice(3); // quita '/en'
    } else if (currentPath === '/en') {
      currentPath = '/';
    }

    // Construir nueva ruta con el nuevo idioma
    const newPath = buildLocalizedPath(currentPath, lang);

    setLanguageState(lang);
    navigate(newPath, { replace: true });
  };

  const t = (path: string): any => {
    const keys = path.split('.');
    let current: any = translations[language];
    for (const key of keys) {
      if (current === undefined || current[key] === undefined) {
        console.warn(`Translation key missing: ${path} for language ${language}`);
        return path;
      }
      current = current[key];
    }
    return current;
  };

  const getLink = (path: string): string => {
    return buildLocalizedPath(path, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLink }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
