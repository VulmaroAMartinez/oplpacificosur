import React from 'react';
import { motion } from 'motion/react';
import { Ship, Package, Globe2, ShieldCheck, Anchor, Sailboat } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: <Ship size={40} />,
      title: t('services.items.sea_freight.title'),
      description: t('services.items.sea_freight.desc')
    },
    {
      icon: <Sailboat size={40} />,
      title: t('services.items.sailboat_services.title'),
      description: t('services.items.sailboat_services.desc')
    },
    {
      icon: <Package size={40} />,
      title: t('services.items.cargo_services.title'),
      description: t('services.items.cargo_services.desc')
    },
    {
      icon: <ShieldCheck size={40} />,
      title: t('services.items.customs.title'),
      description: t('services.items.customs.desc')
    },
    {
      icon: <Globe2 size={40} />,
      title: t('services.items.ship_services.title'),
      description: t('services.items.ship_services.desc')
    },
    {
      icon: <Anchor size={40} />,
      title: t('services.items.anchor_services.title'),
      description: t('services.items.anchor_services.desc')
    }
  ];

  return (
    <section id="servicios" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">{t('services.section_subtitle')}</span>
          <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">{t('services.section_title')}</h2>
          <p className="text-slate-600">{t('services.section_desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-sm shadow-sm hover:shadow-xl transition-all border-b-4 border-transparent hover:border-orange-500 group"
            >
              <div className="text-slate-400 group-hover:text-orange-500 transition-colors mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
