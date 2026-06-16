import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const NotFound = () => {
  const { getLink, language } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 pt-24">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-orange-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          {language === 'es' ? 'Página no encontrada' : 'Page not found'}
        </h2>
        <p className="text-slate-600 mb-8">
          {language === 'es'
            ? 'La página que buscas no existe o ha sido movida.'
            : 'The page you are looking for does not exist or has been moved.'}
        </p>
        <Link
          to={getLink('/')}
          className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-sm transition-colors"
        >
          {language === 'es' ? 'Volver al inicio' : 'Back to home'}
        </Link>
      </div>
    </div>
  );
};
