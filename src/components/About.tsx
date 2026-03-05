import React from 'react';
import { CheckCircle2, Target, Eye, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const About = () => {
  const { t, language } = useLanguage();
  const getLink = (path: string) => `${path}?lang=${language}`;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [slidesToShow, setSlidesToShow] = React.useState(3);
  const [isTransitioning, setIsTransitioning] = React.useState(true);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const values = t('about.values');
  
  // Crear array infinito triplicando los valores
  const infiniteValues = [...values, ...values, ...values];
  const startIndex = values.length; // Comenzar en el segundo set

  // Detectar el tamaño de pantalla
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1280) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(2);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Inicializar en el centro
  React.useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);

  // Auto-play
  React.useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    // Si llegamos al final del tercer set, saltar al segundo set sin animación
    if (currentIndex >= values.length * 2) {
      setIsTransitioning(false);
      setCurrentIndex(values.length);
    }
    // Si llegamos al principio del primer set, saltar al segundo set sin animación
    if (currentIndex < values.length) {
      setIsTransitioning(false);
      setCurrentIndex(values.length * 2 - 1);
    }
  };

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(startIndex + index);
  };

  // Calcular el índice actual para los dots
  const getCurrentDotIndex = () => {
    return ((currentIndex - startIndex) % values.length + values.length) % values.length;
  };

  return (
    <section id="nosotros" className="py-24 bg-white overflow-hidden">
      {/* Sección introductoria existente */}
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-sm overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1619070284836-e850273d69ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpc3RpY3MlMjB3YXJlaG91c2UlMjBtb2Rlcm58ZW58MXx8fHwxNzcwMTkwNzI1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Warehouse Operations"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative background element */}
            <div className="absolute -bottom-10 -left-10 w-full h-full bg-slate-100 -z-10 rounded-sm" />
            
            <div className="absolute -bottom-8 -right-8 bg-orange-500 text-white p-6 rounded-sm shadow-lg z-20 max-w-xs hidden md:block">
              <p className="text-4xl font-bold mb-1">15+</p>
              <p className="font-medium text-sm">{t('about.years_exp')}</p>
            </div>
          </div>

          <div className="lg:w-1/2">
            <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">{t('about.section_subtitle')}</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-6">{t('about.title')}</h2>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              {t('about.p1')}
            </p>
            <p className="text-slate-600 mb-8">
              {t('about.p2')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t('about.features').map((item: string, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="text-orange-500 flex-shrink-0" size={20} />
                  <span className="text-slate-800 font-medium">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-10">
              <a href={getLink('/contacto')} className="text-slate-900 font-bold border-b-2 border-orange-500 pb-1 hover:text-orange-500 transition-colors inline-block">
                {t('about.cta_team')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Nuestra Historia */}
      <div className="container mx-auto px-4 md:px-8 mt-32">
        <div className="text-center mb-16">
          <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">{t('about.history_title')}</span>
          <div className="w-20 h-1 bg-orange-500 mx-auto mt-4 mb-8"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-800 text-lg leading-relaxed mb-6 text-center italic">
            {t('about.history_intro')}
          </p>
          
          <div className="bg-slate-50 rounded-sm p-8 md:p-12 shadow-lg">
            <p className="text-slate-700 leading-relaxed mb-6">
              {t('about.history_p1')}
            </p>
            <p className="text-slate-700 leading-relaxed">
              {t('about.history_p2')}
            </p>
          </div>
        </div>
      </div>

      {/* Sección Visión y Misión */}
      <div className="container mx-auto px-4 md:px-8 mt-32">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Visión */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-sm p-10 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/20 p-3 rounded-sm">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold">{t('about.vision_title')}</h3>
            </div>
            <p className="text-white/95 leading-relaxed text-lg">
              {t('about.vision_text')}
            </p>
          </div>

          {/* Misión */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-sm p-10 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-orange-500/20 p-3 rounded-sm">
                <Target className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-3xl font-bold">{t('about.mission_title')}</h3>
            </div>
            <p className="text-white/95 leading-relaxed text-lg">
              {t('about.mission_text')}
            </p>
          </div>
        </div>
      </div>

      {/* Sección Valores */}
      <div className="container mx-auto px-4 md:px-8 mt-32 mb-16">
        <div className="text-center mb-16">
          <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">{t('about.values_title')}</span>
          <div className="w-20 h-1 bg-orange-500 mx-auto mt-4"></div>
        </div>

        <div className="max-w-7xl mx-auto relative px-4 sm:px-8 lg:px-16">
          {/* Botones de navegación */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border-2 border-orange-500 rounded-full p-2 sm:p-3 hover:bg-orange-500 hover:text-white transition-all shadow-lg"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border-2 border-orange-500 rounded-full p-2 sm:p-3 hover:bg-orange-500 hover:text-white transition-all shadow-lg"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>

          {/* Carrusel */}
          <div className="overflow-hidden mx-8 sm:mx-12 lg:mx-16">
            <div 
              ref={sliderRef}
              className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
              style={{ transform: `translateX(-${(currentIndex * 100) / slidesToShow}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {infiniteValues.map((value: { title: string; desc: string }, index: number) => (
                <div 
                  key={`${index}-${value.title}`} 
                  className="flex-shrink-0 px-2 sm:px-3 lg:px-4"
                  style={{ width: `${100 / slidesToShow}%` }}
                >
                  <div className="bg-white border-2 border-slate-200 rounded-sm p-6 sm:p-8 lg:p-10 hover:border-orange-500 hover:shadow-xl transition-all duration-300 group min-h-[320px] sm:min-h-[340px] lg:min-h-[360px] flex flex-col">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-orange-100 p-2 rounded-sm group-hover:bg-orange-500 transition-colors flex-shrink-0">
                        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 group-hover:text-white transition-colors" />
                      </div>
                      <h4 className="text-base sm:text-xl lg:text-2xl font-bold text-slate-900 leading-tight">{value.title}</h4>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots indicadores */}
          <div className="flex justify-center gap-2 mt-8">
            {values.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 sm:h-3 rounded-full transition-all ${
                  getCurrentDotIndex() === index ? 'bg-orange-500 w-6 sm:w-8' : 'bg-slate-300 hover:bg-orange-300 w-2 sm:w-3'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};