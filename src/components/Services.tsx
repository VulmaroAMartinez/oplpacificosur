import React, { useState, useEffect, useCallback } from 'react';

import { Link, useSearchParams } from 'react-router-dom';

import { motion } from 'motion/react';

import {

  Ship,

  Users,

  Package,

  Globe2,

  Container,

  Boxes,

  Sailboat,

  Anchor,

  FileCheck,

  Truck,

  Warehouse,

  Leaf,

} from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

import type { BusinessLine, CatalogServiceId } from '../data/serviceCatalog';

import { servicesForLine } from '../data/serviceCatalog';



function businessLineFromSearch(params: URLSearchParams): BusinessLine {

  const v = params.get('line');

  if (v === 'agency' || v === 'logistics') return v;

  return 'agency';

}



const ICON_BY_SERVICE: Record<CatalogServiceId, React.ReactNode> = {

  agency_ship_agency: <Ship size={40} />,

  agency_provisions: <Package size={40} />,

  agency_fcl_lcl: <Globe2 size={40} />,

  agency_cy: <Container size={40} />,

  agency_cfs: <Boxes size={40} />,

  agency_launch: <Sailboat size={40} />,

  agency_mooring: <Anchor size={40} />,

  log_customs: <FileCheck size={40} />,

  log_load_unload: <Package size={40} />,

  log_road: <Truck size={40} />,

  log_warehouse: <Warehouse size={40} />,

  log_sanitary: <Leaf size={40} />,

};



type ServicesProps = {

  /** En inicio: solo intro y pestañas que enlazan a /servicios. En /servicios: cards completas. */

  variant?: 'preview' | 'full';

};



export const Services = ({ variant = 'full' }: ServicesProps) => {

  const { t, getLink } = useLanguage();

  const isPreview = variant === 'preview';

  const [searchParams, setSearchParams] = useSearchParams();

  const [activeLine, setActiveLine] = useState<BusinessLine>(() => businessLineFromSearch(searchParams));



  useEffect(() => {

    if (!isPreview) {

      setActiveLine(businessLineFromSearch(searchParams));

    }

  }, [searchParams, isPreview]);



  const selectLine = useCallback(

    (line: BusinessLine) => {

      setActiveLine(line);

      setSearchParams(

        (prev) => {

          const next = new URLSearchParams(prev);

          next.set('line', line);

          return next;

        },

        { replace: true }

      );

    },

    [setSearchParams]

  );



  const tabBase =

    'flex-1 px-4 py-4 md:py-5 text-center text-sm md:text-base font-bold transition-colors border-b sm:border-b-0 sm:border-e border-slate-200';

  const tabActive = 'bg-orange-500 text-white';

  const tabInactive = 'bg-white text-slate-700 hover:bg-slate-50';



  const previewLink =

    'group flex flex-1 flex-col items-center justify-center gap-4 rounded-sm border-2 border-slate-200 bg-white px-8 py-8 md:px-10 md:py-10 text-center shadow-md transition-all duration-300 hover:border-orange-500 hover:bg-orange-500 hover:text-white hover:shadow-xl hover:-translate-y-1';



  const visibleIds = servicesForLine(activeLine);

  const count = visibleIds.length;



  return (

    <section id="servicios" className="py-24 bg-slate-50">

      <div className="container mx-auto px-4 md:px-8">

        <div className="text-center max-w-3xl mx-auto mb-12">

          <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">

            {t('services.section_subtitle')}

          </span>

          <h2 className="text-4xl font-bold text-slate-900 mt-2 mb-4">{t('services.section_title')}</h2>

          <p className="text-slate-600">{t('services.section_desc')}</p>

        </div>



        <div className={`max-w-5xl mx-auto ${isPreview ? '' : 'mb-12'}`}>

          {isPreview ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-14 lg:gap-20">

              <Link

                to={{ pathname: getLink('/servicios'), search: '?line=agency' }}

                className={previewLink}

              >

                <Users

                  size={48}

                  strokeWidth={1.5}

                  className="text-orange-500 transition-colors duration-300 group-hover:text-white"

                  aria-hidden

                />

                <span className="text-xl md:text-2xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-white">

                  {t('services.line_agency')}

                </span>

              </Link>

              <Link

                to={{ pathname: getLink('/servicios'), search: '?line=logistics' }}

                className={previewLink}

              >

                <Truck

                  size={48}

                  strokeWidth={1.5}

                  className="text-orange-500 transition-colors duration-300 group-hover:text-white"

                  aria-hidden

                />

                <span className="text-xl md:text-2xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-white">

                  {t('services.line_logistics')}

                </span>

              </Link>

            </div>

          ) : (

            <>

              <div

                className="flex flex-col sm:flex-row rounded-sm border border-slate-200 bg-white overflow-hidden shadow-sm"

                role="tablist"

                aria-label={t('services.section_title')}

              >

                <button

                  type="button"

                  role="tab"

                  aria-selected={activeLine === 'agency'}

                  id="tab-agency"

                  aria-controls="panel-services"

                  onClick={() => selectLine('agency')}

                  className={`${tabBase} ${activeLine === 'agency' ? tabActive : tabInactive}`}

                >

                  {t('services.line_agency')}

                </button>

                <button

                  type="button"

                  role="tab"

                  aria-selected={activeLine === 'logistics'}

                  id="tab-logistics"

                  aria-controls="panel-services"

                  onClick={() => selectLine('logistics')}

                  className={`${tabBase} border-b-0 sm:border-e-0 ${activeLine === 'logistics' ? tabActive : tabInactive}`}

                >

                  {t('services.line_logistics')}

                </button>

              </div>

              <div

                className="mt-2 h-px w-full bg-linear-to-r from-transparent via-slate-300 to-transparent sm:hidden"

                aria-hidden

              />

            </>

          )}

        </div>



        {!isPreview && (

          <motion.div

            id="panel-services"

            role="tabpanel"

            aria-labelledby={activeLine === 'agency' ? 'tab-agency' : 'tab-logistics'}

            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"

          >

            {visibleIds.map((id, index) => {

              const isLast = index === count - 1;

              const loneInTwoCol = isLast && count % 2 === 1;

              const loneInThreeCol = isLast && count % 3 === 1;



              const baseCard =

                'bg-slate-900 p-6 md:p-8 rounded-sm shadow-sm hover:shadow-xl transition-all border-b-4 border-transparent hover:border-orange-500 group';



              const body = (

                <>

                  <div className="text-orange-500 mb-5">{ICON_BY_SERVICE[id]}</div>

                  <h3 className="text-lg md:text-xl font-bold text-white mb-3 leading-snug">

                    {t(`services.titles.${id}`)}

                  </h3>

                  <p className="text-white leading-relaxed text-sm">{t(`services.descs.${id}`)}</p>

                </>

              );



              const motionProps = {

                initial: { opacity: 0, y: 16 } as const,

                animate: { opacity: 1, y: 0 } as const,

                transition: { delay: index * 0.06 },

              };



              if (loneInTwoCol) {

                return (

                  <div

                    key={`${activeLine}-${id}`}

                    className={[

                      'col-span-1 flex w-full justify-center sm:col-span-2',

                      loneInThreeCol ? 'xl:col-span-3' : 'xl:contents',

                    ].join(' ')}

                  >

                    <motion.div

                      {...motionProps}

                      className={[

                        baseCard,

                        'w-full max-w-2xl sm:max-w-[calc((100%-1.5rem)/2)] md:max-w-[calc((100%-2rem)/2)] xl:w-full',

                        loneInThreeCol ? 'xl:max-w-2xl' : 'xl:max-w-none',

                      ].join(' ')}

                    >

                      {body}

                    </motion.div>

                  </div>

                );

              }



              return (

                <motion.div key={`${activeLine}-${id}`} {...motionProps} className={baseCard}>

                  {body}

                </motion.div>

              );

            })}

          </motion.div>

        )}

      </div>

    </section>

  );

};


