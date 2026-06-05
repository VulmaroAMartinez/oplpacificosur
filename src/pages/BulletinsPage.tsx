import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ExternalLink, Loader2, Newspaper } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
    getPublishedBoletines,
    isSupabaseConfigured,
    DEMO_BOLETINES,
} from '../services/bulletinService';
import type { Boletin } from '../types/bulletins';

const FALLBACK_BOLETINES: Boletin[] = DEMO_BOLETINES.map((b, i) => ({
    id: `fallback-${i}`,
    ...b,
    category: b.category ?? 'General',
    read_more_link: b.read_more_link ?? null,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
}));

export const BoletinesPage = () => {
    const { t } = useLanguage();
    const [items, setItems] = useState<Boletin[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBoletines = async () => {
            try {
                if (isSupabaseConfigured) {
                    const data = await getPublishedBoletines();
                    setItems(data.length > 0 ? data : FALLBACK_BOLETINES);
                } else {
                    setItems(FALLBACK_BOLETINES);
                }
            } catch (err) {
                console.error(err);
                setItems(FALLBACK_BOLETINES);
            } finally {
                setLoading(false);
            }
        };
        fetchBoletines();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
                <Loader2 className="animate-spin text-orange-500" size={48} />
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 md:px-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">
                        {t('boletines.section_subtitle')}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-4">
                        {t('boletines.page_title')}
                    </h1>
                    <p className="text-slate-600 text-lg">{t('boletines.page_desc')}</p>
                </motion.div>

                {/* Boletines List */}
                <div className="max-w-5xl mx-auto space-y-6">
                    {items.map((item, index) => (
                        <motion.article
                            key={item.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: index * 0.06 }}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                        >
                            {/* Mobile: stacked layout */}
                            <div className="flex flex-col md:flex-row">
                                {/* Image — 25% on desktop */}
                                <div className="md:w-1/4 h-52 md:h-auto shrink-0 relative overflow-hidden">
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent to-black/10" />
                                </div>

                                {/* Content — 50% on desktop */}
                                <div className="md:w-2/4 p-6 md:p-8 flex flex-col justify-center">
                                    <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wide mb-3 self-start">
                                        {item.category}
                                    </span>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-orange-600 transition-colors">
                                        {item.title}
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed">{item.excerpt}</p>
                                </div>

                                {/* CTA — 25% on desktop */}
                                <div className="md:w-1/4 flex items-center justify-center p-6 md:p-8 border-t md:border-t-0 md:border-l border-slate-100">
                                    {item.read_more_link ? (
                                        <a
                                            href={item.read_more_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase text-sm tracking-wider rounded-lg shadow-md hover:shadow-orange-500/30 transition-all duration-300 group/btn"
                                        >
                                            {t('boletines.read_more')}
                                            <ExternalLink
                                                size={16}
                                                className="group-hover/btn:scale-110 transition-transform"
                                            />
                                        </a>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-400 font-bold uppercase text-sm tracking-wider rounded-lg cursor-default">
                                            {t('boletines.read_more')}
                                            <ArrowRight size={16} />
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Footer message */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-5xl mx-auto mt-16"
                >
                    <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-xl p-8 md:p-10 text-center">
                        <Newspaper className="text-orange-500 mx-auto mb-4" size={40} />
                        <p className="text-white text-lg leading-relaxed max-w-2xl mx-auto">
                            {t('boletines.footer_msg')}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};