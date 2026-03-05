import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Tracking = () => {
  const { t } = useLanguage();

  return (
    <section id="rastreo" className="py-20 bg-slate-900 text-white relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1570106413982-7f2897b8d0c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbG9iYWwlMjBzaGlwcGluZyUyMGxvZ2lzdGljcyUyMG1hcHxlbnwxfHx8fDE3NzAyMjc3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080" 
          alt="Map Background" 
          className="w-full h-full object-cover grayscale"
        />
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('tracking.title')}</h2>
        <p className="text-slate-300 max-w-2xl mx-auto mb-10">
          {t('tracking.desc')}
        </p>

        <div className="bg-white p-2 rounded-sm max-w-3xl mx-auto flex flex-col md:flex-row shadow-2xl">
          <select className="p-4 bg-slate-50 text-slate-700 border-b md:border-b-0 md:border-r border-slate-200 outline-none min-w-[150px]">
            <option>Contenedor</option>
            <option>Bill of Lading</option>
            <option>Booking</option>
          </select>
          <input 
            type="text" 
            placeholder={t('tracking.placeholder')}
            className="flex-1 p-4 text-slate-900 outline-none"
          />
          <button className="bg-orange-500 text-white font-bold py-4 px-8 hover:bg-orange-600 transition-colors rounded-sm md:rounded-l-none">
            {t('tracking.btn_track')}
          </button>
        </div>
      </div>
    </section>
  );
};
