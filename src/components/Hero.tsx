import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSiteImages } from '../context/SiteImagesContext';
//add more images to carusel 
const TYPING_SPEED = 55;
const PAUSE_BETWEEN = 280;

const HERO_SLOT_IDS = ['hero_1', 'hero_2', 'hero_3', 'hero_4', 'hero_5', 'hero_6', 'hero_7'] as const;

export const Hero = () => {
  const { t, language, getLink } = useLanguage();
  const { getImageUrl, getAltText } = useSiteImages();

  const slides = useMemo(
    () =>
      HERO_SLOT_IDS.map((id, index) => ({
        id: index + 1,
        image: getImageUrl(id),
        alt: getAltText(id) ?? `Slide ${index + 1}`,
      })),
    [getImageUrl, getAltText]
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const titleStart = t('hero.title_start') as string;
  const titleHighlight = t('hero.title_highlight') as string;

  const [displayedStart, setDisplayedStart] = useState('');
  const [displayedHighlight, setDisplayedHighlight] = useState('');
  const [phase, setPhase] = useState<'start' | 'pause' | 'highlight' | 'done'>('start');
  const [cursorVisible, setCursorVisible] = useState(true);

  // Precargar imágenes del carrusel
  useEffect(() => {
    slides.forEach(({ image }) => {
      const img = new Image();
      img.src = image;
    });
  }, [slides]);

  // Slideshow interval
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

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

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 1,
    }),
  };

  return (
    <section id="inicio" className="relative h-screen min-h-[600px] flex items-center overflow-hidden bg-slate-900">
      {/* Background Image Carousel */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
          }}
          className="absolute inset-0 z-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].alt}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all hidden md:block"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all hidden md:block"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-white md:ml-16 lg:ml-20"
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
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">
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

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-12 bg-orange-500'
                : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
