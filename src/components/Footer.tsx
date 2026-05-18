import React from 'react';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t, getLink } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div>
            <div className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                OPL Pacífico Sur
            </div>
            <p className="mb-6 leading-relaxed text-justify">
              {t('footer.about_text')}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://wa.me/529621528543"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={18} />
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
              <li>
                <Link
                  to={{ pathname: getLink('/servicios'), search: '?line=agency' }}
                  className="hover:text-orange-500 transition-colors"
                >
                  {t('services.line_agency')}
                </Link>
              </li>
              <li>
                <Link
                  to={{ pathname: getLink('/servicios'), search: '?line=logistics' }}
                  className="hover:text-orange-500 transition-colors"
                >
                  {t('services.line_logistics')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t('footer.contact_info')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-orange-500 mt-0.5 shrink-0" size={24} strokeWidth={2} aria-hidden />
                <span>{t('contact.info.address_value')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-orange-500 shrink-0" size={24} strokeWidth={2} aria-hidden />
                <a href="tel:+529621528543" className="hover:text-orange-500 transition-colors">
                  {t('contact.info.phone_value')}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-orange-500 shrink-0" size={24} strokeWidth={2} aria-hidden />
                <a href="mailto:logistica@oplpacifico.com" className="hover:text-orange-500 transition-colors">
                  {t('contact.info.email_value')}
                </a>
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
