import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
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

export const Boletines = () => {
    const { t, getLink } = useLanguage();
    const [items, setItems] = useState<Boletin[]>(FALLBACK_BOLETINES.slice(0, 6));
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    useEffect(() => {
        if (!isSupabaseConfigured) return;
        getPublishedBoletines(6)
            .then((data) => {
                if (data.length > 0) setItems(data);
            })
            .catch(console.error);
    }, []);

    return (
        <section className="py-24 bg-slate-950">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-14"
                >
                    <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">
                        {t('boletines.section_subtitle')}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-5 leading-tight">
                        {t('boletines.section_title')}
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        {t('boletines.section_desc')}
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-12">
                    {items.map((item, index) => {
                        const isHovered = hoveredId === item.id;
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 32 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.07 }}
                                onMouseEnter={() => setHoveredId(item.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className="relative bg-white rounded-xl overflow-hidden flex flex-col cursor-pointer"
                                style={{
                                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: isHovered
                                        ? '0 25px 50px -12px rgba(0,0,0,0.5)'
                                        : '0 4px 6px -1px rgba(0,0,0,0.1)',
                                    zIndex: isHovered ? 10 : 1,
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease, z-index 0s',
                                }}
                            >
                                {/* Image */}
                                <div className="relative h-44 overflow-hidden shrink-0">
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500"
                                        style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
                                        loading="lazy"
                                    />
                                    {/* Category badge */}
                                    <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide">
                                        {item.category}
                                    </span>
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                                </div>

                                {/* Body */}
                                <div className="flex flex-col flex-1 p-4">
                                    <h3
                                        className="font-bold text-slate-900 text-sm leading-snug mb-2"
                                        style={{
                                            overflow: isHovered ? 'visible' : 'hidden',
                                            display: isHovered ? 'block' : '-webkit-box',
                                            WebkitLineClamp: isHovered ? 'none' : 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {item.title}
                                    </h3>

                                    <p
                                        className="text-slate-500 text-xs leading-relaxed mb-4 flex-1"
                                        style={{
                                            overflow: isHovered ? 'visible' : 'hidden',
                                            display: isHovered ? 'block' : '-webkit-box',
                                            WebkitLineClamp: isHovered ? 'none' : 3,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {item.excerpt}
                                    </p>

                                    {/* Read more button */}
                                    {item.read_more_link ? (
                                        <a
                                            href={item.read_more_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-1.5 w-full py-2 border-2 border-orange-500 text-orange-500 text-xs font-bold uppercase tracking-wider rounded hover:bg-orange-500 hover:text-white transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {t('boletines.read_more')} <ExternalLink size={12} />
                                        </a>
                                    ) : (
                                        <div className="flex items-center justify-center gap-1.5 w-full py-2 border-2 border-orange-500 text-orange-500 text-xs font-bold uppercase tracking-wider rounded">
                                            {t('boletines.read_more')} <ArrowRight size={12} />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex justify-center"
                >
                    <Link
                        to={getLink('/boletines')}
                        className="inline-flex items-center gap-3 px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base uppercase tracking-wider rounded-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 group"
                    >
                        {t('boletines.view_all')}
                        <ArrowRight
                            size={20}
                            className="group-hover:translate-x-1 transition-transform duration-200"
                        />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};