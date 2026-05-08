import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TYPING_SPEED = 55;
const PAUSE_BETWEEN = 280;

export const Hero = () => {
  const { t, getLink, language } = useLanguage();

  const titleStart = t('hero.title_start') as string;
  const titleHighlight = t('hero.title_highlight') as string;

  const [displayedStart, setDisplayedStart] = useState('');
  const [displayedHighlight, setDisplayedHighlight] = useState('');
  const [phase, setPhase] = useState<'start' | 'pause' | 'highlight' | 'done'>('start');
  const [cursorVisible, setCursorVisible] = useState(true);

  // Reiniciar typewriter al cambiar idioma
  useEffect(() => {
    setDisplayedStart('');
    setDisplayedHighlight('');
    setPhase('start');
  }, [language]);

  // Lógica del typewriter
  useEffect(() => {
    if (phase === 'start') {
      if (displayedStart.length < titleStart.length) {
        const t = setTimeout(() => {
          setDisplayedStart(titleStart.slice(0, displayedStart.length + 1));
        }, TYPING_SPEED);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase('pause'), PAUSE_BETWEEN);
        return () => clearTimeout(t);
      }
    }

    if (phase === 'pause') {
      const t = setTimeout(() => setPhase('highlight'), 100);
      return () => clearTimeout(t);
    }

    if (phase === 'highlight') {
      if (displayedHighlight.length < titleHighlight.length) {
        const t = setTimeout(() => {
          setDisplayedHighlight(titleHighlight.slice(0, displayedHighlight.length + 1));
        }, TYPING_SPEED);
        return () => clearTimeout(t);
      } else {
        setPhase('done');
      }
    }
  }, [displayedStart, displayedHighlight, phase, titleStart, titleHighlight]);

  // Cursor parpadeante
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  const Cursor = ({ active }: { active: boolean }) => (
    <span
      className="inline-block w-[3px] h-[0.85em] bg-orange-400 ml-1 align-middle"
      style={{ opacity: active && cursorVisible ? 1 : 0, transition: 'opacity 0.1s' }}
    />
  );

  return (
    <section id="inicio" className="relative h-screen min-h-[600px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1621862681400-a2a7321dc1c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250YWluZXIlMjBzaGlwJTIwY2FyZ28lMjBvY2VhbnxlbnwxfHx8fDE3NzAyMjc3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Container Ship"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-white"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-12 bg-orange-500" />
            <span className="uppercase tracking-widest text-sm font-semibold text-orange-400">
              {t('hero.subtitle')}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span>
              {displayedStart}
              <Cursor active={phase === 'start' || phase === 'pause'} />
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              {displayedHighlight}
              <Cursor active={phase === 'highlight' || phase === 'done'} />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg leading-relaxed">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={getLink('/contacto')}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-sm transition-all flex items-center justify-center gap-2 group"
            >
              {t('hero.cta_quote')}
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </a>
            <a
              href={getLink('/servicios')}
              className="px-8 py-4 bg-transparent border border-white text-white font-bold rounded-sm hover:bg-white hover:text-slate-900 transition-all text-center"
            >
              {t('hero.cta_services')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
