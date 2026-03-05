import React from 'react';
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t, language } = useLanguage();
  const getLink = (path: string) => `${path}?lang=${language}`;

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div>
            <div className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                OPL Pacífico Sur
            </div>
            <p className="mb-6 leading-relaxed">
              {t('footer.about_text')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t('footer.quick_links')}</h4>
            <ul className="space-y-3">
              <li><Link to={getLink('/')} className="hover:text-orange-500 transition-colors">{t('nav.home')}</Link></li>
              <li><Link to={getLink('/')} className="hover:text-orange-500 transition-colors">{t('nav.services')}</Link></li>
              <li><Link to={getLink('/')} className="hover:text-orange-500 transition-colors">{t('nav.about')}</Link></li>
              {/* <li><Link to={getLink('/rastreo')} className="hover:text-orange-500 transition-colors">{t('nav.tracking')}</Link></li> */}
              <li><Link to={getLink('/')} className="hover:text-orange-500 transition-colors">{t('nav.news')}</Link></li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t('footer.services_links')}</h4>
            <ul className="space-y-3">
              <li><Link to={getLink('/')} className="hover:text-orange-500 transition-colors">{t('services.items.sea_freight.title')}</Link></li>
              <li><Link to={getLink('/')} className="hover:text-orange-500 transition-colors">{t('services.items.sailboat_services.title')}</Link></li>
              <li><Link to={getLink('/')} className="hover:text-orange-500 transition-colors">{t('services.items.cargo_services.title')}</Link></li>
              <li><Link to={getLink('/')} className="hover:text-orange-500 transition-colors">{t('services.items.anchor_services.title')}</Link></li>
              <li><Link to={getLink('/')} className="hover:text-orange-500 transition-colors">{t('services.items.ship_services.title')}</Link></li>
              <li><Link to={getLink('/')} className="hover:text-orange-500 transition-colors">{t('services.items.customs.title')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t('footer.contact_info')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-orange-500 mt-1 shrink-0" size={18} />
                <span>Aquí va la dirección<br/>Tapachula, Chiapas, México</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-orange-500 shrink-0" size={18} />
                <span>+52 962 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-orange-500 shrink-0" size={18} />
                <span>info@oplpacificosur.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="border-t border-slate-800 py-8 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} OPL Pacífico Sur {t('footer.rights')}</p>
      </div>
    </footer>
  );
};
