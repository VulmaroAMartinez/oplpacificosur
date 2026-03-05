import React, { useState, useEffect } from 'react';
import { Menu, X, Anchor, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
const logo = new URL('../assets/oplblanco.png', import.meta.url).href;

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  // En páginas internas (no home), el navbar siempre debe tener fondo
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determinar clases del navbar basado en scroll y ubicación
  const navbarClasses = isHome 
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900 shadow-lg py-4' : 'bg-transparent py-6'
      }`
    : 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-slate-900 shadow-lg py-4';

  const linkClasses = (path: string) => {
    const isActive = location.pathname === path;
    return `hover:text-orange-400 transition-colors ${isActive ? 'text-orange-500' : 'text-white'}`;
  };

  const getLink = (path: string) => `${path}?lang=${language}`;

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <Link to={getLink('/')} className="flex items-center gap-2 text-white group">
        <img src={logo} alt="OPL Pacífico Sur" className="h-10 md:h-12 w-auto group-hover:opacity-90 transition-opacity" />

        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide">
          <Link to={getLink('/')} className={linkClasses('/')}>{t('nav.home')}</Link>
          <Link to={getLink('/servicios')} className={linkClasses('/servicios')}>{t('nav.services')}</Link>
          <Link to={getLink('/nosotros')} className={linkClasses('/nosotros')}>{t('nav.about')}</Link>
          <Link to={getLink('/noticias')} className={linkClasses('/noticias')}>{t('nav.news')}</Link>
          
          <button 
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1 text-white hover:text-orange-400 transition-colors uppercase font-bold"
          >
            <Globe size={18} /> {language}
          </button>

          <Link
            to={getLink('/contacto')}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-sm transition-colors uppercase font-bold text-xs"
          >
            {t('nav.contact_short')}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="text-white flex items-center gap-1 uppercase font-bold text-sm"
          >
            <Globe size={18} /> {language}
          </button>
          <button
            className="text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-t border-slate-800 absolute w-full"
          >
            <div className="flex flex-col p-4 gap-4 text-white text-center">
              <Link to={getLink('/')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.home')}</Link>
              <Link to={getLink('/servicios')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.services')}</Link>
              <Link to={getLink('/nosotros')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.about')}</Link>
              <Link to={getLink('/noticias')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.news')}</Link>
              <Link to={getLink('/contacto')} onClick={() => setIsMobileMenuOpen(false)} className="text-orange-400 font-bold">{t('nav.contact')}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
