# 🔍 AUDITORÍA SEO TÉCNICA COMPLETA — OPL Pacífico Sur

---

## PARTE 1: DIAGNÓSTICO DIRECTO DE ERRORES EN GOOGLE SEARCH CONSOLE

### ❗ "Página con redirección" — Causas identificadas

**Causa principal #1 — Hero.tsx tiene su propia función `getLink` local que genera URLs con parámetros:**

```tsx
// src/components/Hero.tsx — LÍNEA 27 (BUG CRÍTICO)
const getLink = (path: string) => `${path}?lang=${language}`;
```

Esto genera URLs como `/contacto?lang=es` y `/servicios?lang=en` en los botones CTA. Googlebot rastrea esos links, llega a una URL con parámetro que el router de React no reconoce, y el catch-all redirige a `/`. GSC lo reporta como "Página con redirección".

**Causa principal #2 — App.tsx redirige TODOS los 404 a la homepage:**

```tsx
// src/App.tsx — PROBLEMA CRÍTICO
<Route path="*" element={<Navigate to="/" replace />} />
```

Cada URL inválida produce un redirect a `/`. Google rastrea la URL, ve una redirección, y la reporta en GSC como "Página con redirección".

**Causa principal #3 — Redirección por idioma vía JavaScript:**

```tsx
// src/context/LanguageContext.tsx
navigate('/en/', { replace: true }); // JS redirect que Googlebot puede no procesar correctamente
```

Googlebot puede llegar a `/` y ver que hay un JS redirect a `/en/`. Según cómo procese el JavaScript, lo puede reportar como "Página con redirección".

---

### ❗ "Duplicada: Google ha elegido una versión canónica diferente"

**Causa #1 — URLs con `?lang=es` duplican el contenido sin parámetro:**

- `/contacto` y `/contacto?lang=es` sirven exactamente el mismo contenido
- `/servicios` y `/servicios?lang=en` también son duplicados
- Google elige `/contacto` como canónica (sin parámetro), pero el sitio dice que `/contacto?lang=es` es la URL "correcta" → conflicto

**Causa #2 — Canonical tags se establecen vía JavaScript (CSR):**

```tsx
// SeoTags.tsx — se ejecuta DESPUÉS de que Googlebot renderiza
useEffect(() => {
  canonical.href = language === 'es' ? esUrl : enUrl;
}, [language, location.pathname]);
```

Si Googlebot evalúa la página antes de que el JS complete su ejecución, puede que no vea la canonical correcta. Google entonces elige su propia versión canónica, que puede no coincidir con la que el sitio pretende.

---

## PARTE 2: PROBLEMAS DETECTADOS — ANÁLISIS COMPLETO

---

### 🔴 PROBLEMA 1 — Hero.tsx: función `getLink` local con parámetros URL

**Explicación técnica:**
`Hero.tsx` importa solo `t` y `language` del contexto, e implementa su propia versión de `getLink` que genera parámetros de query. El resto de componentes (Navbar, Footer, About) usan correctamente el `getLink` del contexto que genera rutas `/en/servicios`.

**Impacto SEO:** Genera contenido duplicado, URLs con parámetros indexadas, y es la causa directa de los errores en GSC.

**Prioridad:** 🔴 CRÍTICA

**Solución:**

```tsx
// src/components/Hero.tsx — ANTES (INCORRECTO):
export const Hero = () => {
  const { t, language } = useLanguage();  // ← solo importa t y language
  const { getImageUrl, getAltText } = useSiteImages();
  // ...
  const getLink = (path: string) => `${path}?lang=${language}`;  // ← ELIMINAR ESTO
```

```tsx
// src/components/Hero.tsx — DESPUÉS (CORRECTO):
export const Hero = () => {
  const { t, language, getLink } = useLanguage();  // ← añadir getLink del contexto
  const { getImageUrl, getAltText } = useSiteImages();
  // ← Eliminar completamente la función local getLink
  // No se añade nada más, el resto del componente permanece igual
```

---

### 🔴 PROBLEMA 2 — App.tsx: 404 redirige a homepage (Soft 404 + Redirect)

**Explicación técnica:**
Cualquier URL inexistente (ej. `/pagina-inventada`) recibe un redirect 302 a `/`. Google:
1. Rastrea `/pagina-inventada`
2. Recibe redirect a `/`
3. Lo reporta como "Página con redirección"
4. La URL `/pagina-inventada` queda marcada como "redirigida" en vez de "no encontrada"

**Impacto SEO:** Dilución del rastreo (crawl budget), errores en GSC, imposible distinguir páginas válidas de inválidas.

**Prioridad:** 🔴 CRÍTICA

**Solución:**

```tsx
// src/pages/NotFound.tsx — NUEVO ARCHIVO
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const NotFound = () => {
  const { getLink } = useLanguage();
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 pt-24">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-orange-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Página no encontrada
        </h2>
        <p className="text-slate-600 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          to={getLink('/')}
          className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-sm transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};
```

```tsx
// src/App.tsx — CAMBIAR:
// ANTES:
<Route path="*" element={<Navigate to="/" replace />} />

// DESPUÉS:
import { NotFound } from './pages/NotFound';
// ...
<Route path="*" element={<NotFound />} />
```

Para que Vercel devuelva HTTP 404 real (no 200 con contenido de SPA), actualizar `vercel.json`:

```json
// vercel.json — VERSIÓN MEJORADA
{
  "rewrites": [
    {
      "source": "/((?!robots\\.txt|sitemap\\.xml|sitemap-news\\.xml|favicon\\.ico).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/admin/(.*)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex, nofollow"
        }
      ]
    }
  ]
}
```

---

### 🔴 PROBLEMA 3 — Footer.tsx: enlaces internos apuntan a URL incorrecta

**Explicación técnica:**
Los enlaces de Servicios y Nosotros en el footer apuntan al inicio `/` en vez de a sus páginas reales.

```tsx
// src/components/Footer.tsx — LÍNEAS INCORRECTAS:
<li><Link to={getLink('/')} ...>{t('nav.services')}</Link></li>  // ← apunta a /
<li><Link to={getLink('/')} ...>{t('nav.about')}</Link></li>    // ← apunta a /
<li><Link to={getLink('/')} ...>{t('nav.news')}</Link></li>     // ← apunta a /
```

**Impacto SEO:** Google no puede descubrir las páginas internas a través del footer. El PageRank interno no fluye hacia `/servicios` ni `/nosotros`. Reduce la rastreabilidad.

**Prioridad:** 🔴 ALTA

**Solución:**

```tsx
// src/components/Footer.tsx — CORRECCIÓN:
{/* Quick Links */}
<ul className="space-y-3">
  <li><Link to={getLink('/')} className="hover:text-orange-500 transition-colors">{t('nav.home')}</Link></li>
  <li><Link to={getLink('/servicios')} className="hover:text-orange-500 transition-colors">{t('nav.services')}</Link></li>
  <li><Link to={getLink('/nosotros')} className="hover:text-orange-500 transition-colors">{t('nav.about')}</Link></li>
  <li><Link to={getLink('/noticias')} className="hover:text-orange-500 transition-colors">{t('nav.news')}</Link></li>
  <li><Link to={getLink('/contacto')} className="hover:text-orange-500 transition-colors">{t('nav.contact_short')}</Link></li>
</ul>
```

---

### 🔴 PROBLEMA 4 — No existe robots.txt

**Explicación técnica:**
No hay ningún archivo `public/robots.txt` en el proyecto. Esto significa:
- Google puede rastrear `/admin`, `/admin/login`, `/admin/noticias/*` (panel de administración)
- No hay declaración del sitemap
- No hay reglas de exclusión

**Impacto SEO:** Google indexa páginas de administración, desperdicia crawl budget en páginas sin valor SEO.

**Prioridad:** 🔴 ALTA

**Solución — Crear `public/robots.txt`:**

```txt
# robots.txt — OPL Pacífico Sur
# Ubicar en: public/robots.txt

User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /admin/login
Disallow: /admin/noticias/
Disallow: /admin/imagenes

# Evitar indexación de URLs con parámetros de idioma residuales
Disallow: /*?lang=

# Sitemap
Sitemap: https://www.oplpacifico.com/sitemap.xml
```

---

### 🔴 PROBLEMA 5 — No existe sitemap.xml

**Explicación técnica:**
No hay ningún archivo de sitemap. Google no tiene una lista oficial de URLs a rastrear. Las páginas de noticias dinámicas son especialmente difíciles de descubrir sin sitemap.

**Prioridad:** 🔴 ALTA

**Solución — Crear `public/sitemap.xml` (estático para rutas fijas):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- Inicio -->
  <url>
    <loc>https://www.oplpacifico.com/</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.oplpacifico.com/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.oplpacifico.com/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.oplpacifico.com/"/>
    <lastmod>2026-06-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Inicio EN -->
  <url>
    <loc>https://www.oplpacifico.com/en/</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.oplpacifico.com/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.oplpacifico.com/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.oplpacifico.com/"/>
    <lastmod>2026-06-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Servicios -->
  <url>
    <loc>https://www.oplpacifico.com/servicios</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.oplpacifico.com/servicios"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.oplpacifico.com/en/servicios"/>
    <lastmod>2026-06-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://www.oplpacifico.com/en/servicios</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.oplpacifico.com/servicios"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.oplpacifico.com/en/servicios"/>
    <lastmod>2026-06-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Nosotros -->
  <url>
    <loc>https://www.oplpacifico.com/nosotros</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.oplpacifico.com/nosotros"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.oplpacifico.com/en/nosotros"/>
    <lastmod>2026-06-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://www.oplpacifico.com/en/nosotros</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.oplpacifico.com/nosotros"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.oplpacifico.com/en/nosotros"/>
    <lastmod>2026-06-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Noticias -->
  <url>
    <loc>https://www.oplpacifico.com/noticias</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.oplpacifico.com/noticias"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.oplpacifico.com/en/noticias"/>
    <lastmod>2026-06-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://www.oplpacifico.com/en/noticias</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.oplpacifico.com/noticias"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.oplpacifico.com/en/noticias"/>
    <lastmod>2026-06-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Contacto -->
  <url>
    <loc>https://www.oplpacifico.com/contacto</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.oplpacifico.com/contacto"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.oplpacifico.com/en/contacto"/>
    <lastmod>2026-06-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://www.oplpacifico.com/en/contacto</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.oplpacifico.com/contacto"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.oplpacifico.com/en/contacto"/>
    <lastmod>2026-06-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

</urlset>
```

> **Para noticias dinámicas:** Debes generar el sitemap dinámicamente o actualizarlo manualmente cuando publiques artículos. Ver Sección de implementación avanzada.

---

### 🔴 PROBLEMA 6 — index.html: sin meta tags estáticas, título genérico

**Explicación técnica:**
El archivo `index.html` actual solo tiene:
```html
<title>Página web corporativa</title>
```
Sin meta description, sin canonical, sin Open Graph, sin Twitter Cards. Googlebot puede renderizar la página ANTES de que el JavaScript de `SeoTags.tsx` ejecute. En ese momento, ve un título genérico y ninguna meta tag.

**Impacto SEO:** Google muestra "Página web corporativa" en los resultados de búsqueda en vez del título real. Peor CTR, posicionamiento débil.

**Prioridad:** 🔴 ALTA

**Solución — Reemplazar `index.html` completo:**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Primary SEO -->
    <title>OPL Pacífico Sur — Agente Naviero y Operador Logístico | Tapachula, Chiapas</title>
    <meta name="description" content="OPL Pacífico Sur: agencia naviera y operador logístico en Tapachula, Chiapas. Servicios de agenciamiento de buques, fletes marítimos FCL/LCL, logística portuaria y transporte. Contáctenos." />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="OPL Pacífico Sur" />

    <!-- Canonical -->
    <link rel="canonical" href="https://www.oplpacifico.com/" />

    <!-- Hreflang -->
    <link rel="alternate" hreflang="es" href="https://www.oplpacifico.com/" />
    <link rel="alternate" hreflang="en" href="https://www.oplpacifico.com/en/" />
    <link rel="alternate" hreflang="x-default" href="https://www.oplpacifico.com/" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="OPL Pacífico Sur" />
    <meta property="og:title" content="OPL Pacífico Sur — Agente Naviero y Operador Logístico" />
    <meta property="og:description" content="Agencia naviera y operador logístico en Tapachula, Chiapas. Servicios de fletes marítimos, agenciamiento de buques, logística portuaria y transporte terrestre." />
    <meta property="og:url" content="https://www.oplpacifico.com/" />
    <meta property="og:image" content="https://www.oplpacifico.com/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="OPL Pacífico Sur — Agencia Naviera" />
    <meta property="og:locale" content="es_MX" />
    <meta property="og:locale:alternate" content="en_US" />

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="OPL Pacífico Sur — Agente Naviero y Operador Logístico" />
    <meta name="twitter:description" content="Agencia naviera y operador logístico en Tapachula, Chiapas. Fletes marítimos, agenciamiento de buques y logística portuaria." />
    <meta name="twitter:image" content="https://www.oplpacifico.com/og-image.jpg" />
    <meta name="twitter:image:alt" content="OPL Pacífico Sur" />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <!-- Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://images.unsplash.com" />
    
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

### 🔴 PROBLEMA 7 — SeoTags.tsx: gestión incompleta de meta tags

**Explicación técnica:**
`SeoTags.tsx` no gestiona:
- `document.title` por página
- Open Graph tags
- Twitter Card tags
- Meta robots
- Structured Data (Schema.org)

**Impacto SEO:** Cada página tiene el mismo título genérico, sin OG tags para redes sociales, sin rich snippets posibles.

**Prioridad:** 🔴 ALTA

**Solución — Reemplazar `src/components/SeoTags.tsx` completo:**

```tsx
// src/components/SeoTags.tsx — VERSIÓN COMPLETA
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const DOMAIN = 'https://www.oplpacifico.com';

interface PageMeta {
  title: string;
  description: string;
  ogImage?: string;
}

type PageMetaMap = {
  [key: string]: {
    es: PageMeta;
    en: PageMeta;
  };
};

const PAGE_META: PageMetaMap = {
  '/': {
    es: {
      title: 'OPL Pacífico Sur — Agente Naviero y Operador Logístico | Tapachula, Chiapas',
      description: 'OPL Pacífico Sur: agencia naviera y operador logístico en Tapachula, Chiapas. Agenciamiento de buques, fletes marítimos FCL/LCL, logística portuaria y transporte terrestre.',
    },
    en: {
      title: 'OPL Pacífico Sur — Shipping Agent and Logistics Operator | Tapachula, Mexico',
      description: 'OPL Pacífico Sur: shipping agent and logistics operator in Tapachula, Chiapas. Ship agency, FCL/LCL ocean freight, port logistics and road transport services.',
    },
  },
  '/servicios': {
    es: {
      title: 'Servicios — Agencia Naviera y Logística Portuaria | OPL Pacífico Sur',
      description: 'Servicios de agencia naviera: agenciamiento de buques, fletes FCL/LCL, lanchaje, amarre. Logística: aduanas, carga/descarga, transporte terrestre, almacén en Tapachula.',
    },
    en: {
      title: 'Services — Shipping Agency and Port Logistics | OPL Pacífico Sur',
      description: 'Shipping agency services: ship agency, FCL/LCL freight, launch boat, mooring. Logistics: customs, load/unload, road transport, warehousing in Tapachula, Mexico.',
    },
  },
  '/nosotros': {
    es: {
      title: 'Nosotros — Historia, Misión y Visión | OPL Pacífico Sur',
      description: 'Conoce a OPL Pacífico Sur, agencia naviera fundada en 2022 en Puerto Madero, Tapachula. Nuestra historia, misión, visión y valores en el sector marítimo-logístico.',
    },
    en: {
      title: 'About Us — History, Mission and Vision | OPL Pacífico Sur',
      description: 'Learn about OPL Pacífico Sur, shipping agency founded in 2022 in Puerto Madero, Tapachula. Our history, mission, vision and values in the maritime-logistics sector.',
    },
  },
  '/noticias': {
    es: {
      title: 'Noticias del Sector Logístico y Marítimo | OPL Pacífico Sur',
      description: 'Mantente informado con las últimas noticias del sector marítimo, logístico y portuario. Novedades de OPL Pacífico Sur y tendencias globales del comercio internacional.',
    },
    en: {
      title: 'Maritime and Logistics Industry News | OPL Pacífico Sur',
      description: 'Stay informed with the latest news from the maritime, logistics and port industry. OPL Pacífico Sur updates and global trade trends.',
    },
  },
  '/contacto': {
    es: {
      title: 'Contacto — Solicita Cotización Logística | OPL Pacífico Sur Tapachula',
      description: 'Contáctanos para solicitar una cotización de fletes marítimos, agenciamiento de buques o servicios logísticos. Tel: +52 962 152 8543. Tapachula, Chiapas, México.',
    },
    en: {
      title: 'Contact — Request a Logistics Quote | OPL Pacífico Sur Tapachula',
      description: 'Contact us to request a quote for sea freight, ship agency or logistics services. Tel: +52 962 152 8543. Tapachula, Chiapas, Mexico.',
    },
  },
};

const DEFAULT_OG_IMAGE = `${DOMAIN}/og-image.jpg`;

function setOrCreate(
  selector: string,
  attribute: string,
  value: string,
  tagName: string = 'meta',
  relAttribute?: string
): void {
  let el = document.querySelector(selector) as HTMLElement;
  if (!el) {
    el = document.createElement(tagName);
    if (relAttribute) {
      el.setAttribute('rel', relAttribute);
    } else if (tagName === 'meta') {
      const attrName = selector.includes('property') ? 'property' : 'name';
      const attrValue = selector.match(/["']([^"']+)["']/)?.[1] || '';
      el.setAttribute(attrName, attrValue);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attribute, value);
}

export const SeoTags = () => {
  const { language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    // Normalizar ruta base (quitar prefijo /en)
    let basePath = location.pathname;
    if (basePath.startsWith('/en/')) {
      basePath = basePath.slice(3);
    } else if (basePath === '/en') {
      basePath = '/';
    }
    // Para páginas de noticias individuales, usar el meta de /noticias
    if (basePath.startsWith('/noticias/')) {
      basePath = '/noticias';
    }

    const lang = language as 'es' | 'en';
    const pageMeta = PAGE_META[basePath]?.[lang] || PAGE_META['/'][lang];

    const esPath = basePath;
    const enPath = `/en${basePath === '/' ? '/' : basePath}`;
    const canonicalPath = lang === 'es' ? esPath : enPath;

    const esUrl = `${DOMAIN}${esPath}`;
    const enUrl = `${DOMAIN}${enPath}`;
    const canonicalUrl = `${DOMAIN}${canonicalPath}`;
    const ogImage = pageMeta.ogImage || DEFAULT_OG_IMAGE;

    // ── HTML lang ──────────────────────────────────────────────
    document.documentElement.lang = language;

    // ── Title ──────────────────────────────────────────────────
    document.title = pageMeta.title;

    // ── Canonical ──────────────────────────────────────────────
    setOrCreate('link[rel="canonical"]', 'href', canonicalUrl, 'link', 'canonical');

    // ── Meta Description ───────────────────────────────────────
    setOrCreate('meta[name="description"]', 'content', pageMeta.description);

    // ── Meta Robots ────────────────────────────────────────────
    setOrCreate('meta[name="robots"]', 'content', 'index, follow');

    // ── Hreflang ───────────────────────────────────────────────
    const updateHreflang = (hreflang: string, url: string) => {
      let link = document.querySelector(`link[hreflang="${hreflang}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'alternate';
        link.setAttribute('hreflang', hreflang);
        document.head.appendChild(link);
      }
      link.href = url;
    };
    updateHreflang('es', esUrl);
    updateHreflang('en', enUrl);
    updateHreflang('x-default', esUrl);

    // ── Open Graph ─────────────────────────────────────────────
    setOrCreate('meta[property="og:title"]', 'content', pageMeta.title);
    setOrCreate('meta[property="og:description"]', 'content', pageMeta.description);
    setOrCreate('meta[property="og:url"]', 'content', canonicalUrl);
    setOrCreate('meta[property="og:type"]', 'content', 'website');
    setOrCreate('meta[property="og:site_name"]', 'content', 'OPL Pacífico Sur');
    setOrCreate('meta[property="og:image"]', 'content', ogImage);
    setOrCreate('meta[property="og:image:width"]', 'content', '1200');
    setOrCreate('meta[property="og:image:height"]', 'content', '630');
    setOrCreate('meta[property="og:locale"]', 'content', lang === 'es' ? 'es_MX' : 'en_US');

    // ── Twitter Cards ──────────────────────────────────────────
    setOrCreate('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setOrCreate('meta[name="twitter:title"]', 'content', pageMeta.title);
    setOrCreate('meta[name="twitter:description"]', 'content', pageMeta.description);
    setOrCreate('meta[name="twitter:image"]', 'content', ogImage);

    // ── Structured Data (JSON-LD) ───────────────────────────────
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${DOMAIN}/#organization`,
          name: 'OPL Pacífico Sur',
          url: DOMAIN,
          logo: {
            '@type': 'ImageObject',
            url: `${DOMAIN}/logo.png`,
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+52-962-152-8543',
            contactType: 'customer service',
            areaServed: ['MX', 'GT', 'HN', 'SV'],
            availableLanguage: ['Spanish', 'English'],
            hoursAvailable: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '08:00',
              closes: '18:00',
            },
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Calle Parque Industrial MZ F Lote 34, Puerto Madero Centro',
            addressLocality: 'Tapachula',
            addressRegion: 'Chiapas',
            postalCode: '30830',
            addressCountry: 'MX',
          },
          email: 'logistica@oplpacifico.com',
          sameAs: [],
        },
        {
          '@type': 'LocalBusiness',
          '@id': `${DOMAIN}/#localbusiness`,
          name: 'OPL Pacífico Sur',
          description:
            lang === 'es'
              ? 'Agencia naviera y operador logístico en Tapachula, Chiapas. Servicios de agenciamiento de buques, fletes marítimos y logística portuaria.'
              : 'Shipping agency and logistics operator in Tapachula, Chiapas. Ship agency, ocean freight and port logistics services.',
          url: DOMAIN,
          telephone: '+52-962-152-8543',
          email: 'logistica@oplpacifico.com',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Calle Parque Industrial MZ F Lote 34, Puerto Madero Centro',
            addressLocality: 'Tapachula',
            addressRegion: 'Chiapas',
            postalCode: '30830',
            addressCountry: 'MX',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 14.9254,
            longitude: -92.2882,
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '08:00',
              closes: '18:00',
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Saturday'],
              opens: '08:00',
              closes: '13:00',
            },
          ],
          priceRange: '$$',
          currenciesAccepted: 'MXN, USD',
          image: ogImage,
        },
        {
          '@type': 'WebSite',
          '@id': `${DOMAIN}/#website`,
          url: DOMAIN,
          name: 'OPL Pacífico Sur',
          inLanguage: lang === 'es' ? 'es-MX' : 'en-US',
        },
        {
          '@type': 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: pageMeta.title,
          description: pageMeta.description,
          inLanguage: lang === 'es' ? 'es-MX' : 'en-US',
          isPartOf: { '@id': `${DOMAIN}/#website` },
        },
      ],
    };

    // Remover script anterior y añadir nuevo
    const existingScript = document.querySelector('script[data-seo="structured-data"]');
    if (existingScript) existingScript.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'structured-data');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

  }, [language, location.pathname]);

  return null;
};
```

---

### 🟡 PROBLEMA 8 — Redirección JavaScript por idioma del navegador

**Explicación técnica:**
```tsx
// LanguageContext.tsx
if (prefersEnglish) {
  navigate('/en/', { replace: true }); // JS redirect
}
```

Googlebot renderiza `/` con JavaScript desactivado o lentamente. No ve el redirect. O si ejecuta JS, puede registrar que `/` hace redirect a `/en/` y reportarlo como "Página con redirección".

**Impacto SEO:** Puede interferir con la indexación de `/`, confundir el hreflang, y generar errores en GSC.

**Prioridad:** 🟡 MEDIA

**Solución — Mover la detección al servidor con Vercel middleware:**

```ts
// middleware.ts — NUEVO ARCHIVO EN LA RAÍZ DEL PROYECTO
// (Requiere que el proyecto use Vercel con Edge Runtime)
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/',
};

export default function middleware(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language') || '';
  const hasVisited = request.cookies.get('lang-detected');

  // Solo en primera visita, solo en la raíz
  if (!hasVisited && acceptLanguage.toLowerCase().includes('en')) {
    const response = NextResponse.redirect(new URL('/en/', request.url));
    response.cookies.set('lang-detected', '1', { maxAge: 60 * 60 * 24 });
    return response;
  }
}
```

> **Nota:** Dado que el proyecto usa Vite puro (no Next.js), la alternativa más simple es **eliminar la redirección automática** y dejar que el usuario elija el idioma manualmente via el selector en el Navbar. Esto evita el problema completamente sin afectar la UX notablemente.

**Alternativa mínima — deshabilitar el auto-redirect en LanguageContext.tsx:**

```tsx
// src/context/LanguageContext.tsx — ELIMINAR este useEffect completo:
// BORRAR desde línea 35 hasta línea 55:
useEffect(() => {
  const alreadyDetected = sessionStorage.getItem('lang-detected');
  if (alreadyDetected) return;
  // ... todo este bloque
}, []);
// FIN DEL BLOQUE A ELIMINAR
```

---

### 🟡 PROBLEMA 9 — Páginas de admin expuestas a crawlers

**Explicación técnica:**
Las rutas `/admin`, `/admin/login`, `/admin/noticias/nueva` no tienen ninguna protección contra rastreo. Si Google las indexa, aparecerán en resultados de búsqueda.

**Impacto SEO:** Contenido sin valor en índice de Google, posibles problemas de seguridad.

**Prioridad:** 🟡 MEDIA

**Solución — Añadir meta robots noindex en AdminGuard y páginas admin:**

```tsx
// src/components/AdminGuard.tsx — AÑADIR al principio del componente:
import { useEffect } from 'react';

export const AdminGuard = () => {
  useEffect(() => {
    // Bloquear indexación de todas las páginas admin
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    metaRobots.content = 'noindex, nofollow';

    return () => {
      // Restaurar al salir de admin
      if (metaRobots) metaRobots.content = 'index, follow';
    };
  }, []);

  // ... resto del componente igual
```

También en `AdminLogin.tsx`:
```tsx
// src/pages/AdminLogin.tsx — AÑADIR useEffect:
useEffect(() => {
  let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'robots';
    document.head.appendChild(meta);
  }
  meta.content = 'noindex, nofollow';
  document.title = 'Login — Panel de Administración';
}, []);
```

---

### 🟡 PROBLEMA 10 — No hay breadcrumbs con Schema.org

**Explicación técnica:**
El sitio no implementa breadcrumbs estructurados. Google usa el markup `BreadcrumbList` de Schema.org para mostrar la ruta de navegación en los resultados de búsqueda.

**Prioridad:** 🟡 MEDIA

**Solución — Crear componente Breadcrumb:**

```tsx
// src/components/Breadcrumb.tsx — NUEVO ARCHIVO
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DOMAIN = 'https://www.oplpacifico.com';

interface BreadcrumbItem {
  label: string;
  path: string;
}

export const Breadcrumb = () => {
  const location = useLocation();
  const { language, t, getLink } = useLanguage();

  let basePath = location.pathname;
  const isEnglish = basePath.startsWith('/en');
  if (basePath.startsWith('/en/')) basePath = basePath.slice(3);
  else if (basePath === '/en') basePath = '/';

  if (basePath === '/') return null; // No breadcrumb en homepage

  const labelMap: Record<string, string> = {
    '/servicios': t('nav.services'),
    '/nosotros': t('nav.about'),
    '/noticias': t('nav.news'),
    '/contacto': t('nav.contact_short'),
  };

  const items: BreadcrumbItem[] = [
    { label: t('nav.home'), path: '/' },
  ];

  const segments = basePath.split('/').filter(Boolean);
  let accPath = '';
  segments.forEach((seg) => {
    accPath += `/${seg}`;
    items.push({
      label: labelMap[accPath] || seg,
      path: accPath,
    });
  });

  // Structured Data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${DOMAIN}${isEnglish ? '/en' : ''}${item.path}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav aria-label="Breadcrumb" className="container mx-auto px-4 md:px-8 pt-6">
        <ol className="flex items-center gap-1 text-sm text-slate-500 flex-wrap">
          {items.map((item, index) => (
            <li key={item.path} className="flex items-center gap-1">
              {index > 0 && <ChevronRight size={14} className="text-slate-400" />}
              {index === items.length - 1 ? (
                <span className="text-slate-700 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={getLink(item.path)}
                  className="hover:text-orange-500 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};
```

Añadir en las páginas internas (Services, About, News, Contact):
```tsx
// Ejemplo en ServicesPage (src/App.tsx):
const ServicesPage = () => (
  <div className="pt-20">
    <Breadcrumb />
    <Services />
  </div>
);
```

---

### 🟡 PROBLEMA 11 — Sitio SPA (CSR puro) sin SSR

**Explicación técnica:**
Todo el sitio es Client-Side Rendering (React + Vite). Aunque Google puede ejecutar JavaScript, hay dos problemas:
1. **Indexación más lenta** — Google rastrea, almacena en cola para renderizado JS (puede tardar días)
2. **Meta tags tardías** — El `<title>` y `<meta description>` cambian después del renderizado inicial

**Impacto SEO:** Google puede ver el contenido pero con retraso. Para sitios con alta competitividad SEO, el SSR es casi obligatorio.

**Prioridad:** 🟡 MEDIA (requiere refactorización mayor)

**Solución ideal:** Migrar a Next.js o Astro con SSR/SSG. Alternativa más rápida: usar `react-snap` para pre-renderizado estático.

**Solución inmediata con react-snap:**
```bash
npm install react-snap --save-dev
```

```json
// package.json — añadir script:
{
  "scripts": {
    "postbuild": "react-snap"
  },
  "reactSnap": {
    "inlineCss": true,
    "puppeteerArgs": ["--no-sandbox"],
    "puppeteerExecutablePath": "node_modules/.bin/chromium"
  }
}
```

---

### 🟢 PROBLEMA 12 — No hay Open Graph image (og:image)

**Explicación técnica:**
No existe ninguna imagen `/og-image.jpg` en la carpeta public. Los links compartidos en WhatsApp, LinkedIn, etc., mostrarán un preview vacío.

**Prioridad:** 🟢 BAJA-MEDIA

**Solución:**
1. Crear una imagen de 1200×630px con el logo de OPL Pacífico Sur
2. Guardarla como `public/og-image.jpg`
3. El `index.html` actualizado ya referencia `https://www.oplpacifico.com/og-image.jpg`

---

## PARTE 3: TABLA RESUMEN EJECUTIVO

| # | Problema | Severidad | URL/Archivo afectado | Causa GSC | Solución | Prioridad |
|---|----------|-----------|---------------------|-----------|----------|-----------|
| 1 | `getLink` local en Hero.tsx genera `?lang=` params | 🔴 CRÍTICA | `Hero.tsx` L27 | ✅ Duplicadas + Redirección | Usar `getLink` del contexto | Inmediata |
| 2 | 404 → redirect a homepage | 🔴 CRÍTICA | `App.tsx` | ✅ Redirección | Crear componente `NotFound` | Inmediata |
| 3 | No existe `robots.txt` | 🔴 ALTA | `public/` | — | Crear `public/robots.txt` | Esta semana |
| 4 | No existe `sitemap.xml` | 🔴 ALTA | `public/` | — | Crear `public/sitemap.xml` | Esta semana |
| 5 | Footer: services/about → `/` en vez de sus rutas | 🔴 ALTA | `Footer.tsx` | — | Corregir URLs destino | Inmediata |
| 6 | `index.html` sin meta tags estáticas | 🔴 ALTA | `index.html` | ✅ Duplicadas | Añadir meta tags base | Esta semana |
| 7 | `SeoTags.tsx` sin OG, Twitter, JSON-LD | 🔴 ALTA | `SeoTags.tsx` | — | Reemplazar con versión completa | Esta semana |
| 8 | No hay Structured Data (Schema.org) | 🟡 MEDIA | Todos | — | JSON-LD en `SeoTags.tsx` | 2 semanas |
| 9 | Admin pages sin `noindex` | 🟡 MEDIA | `/admin/*` | — | Meta robots noindex | Esta semana |
| 10 | JS auto-redirect de idioma | 🟡 MEDIA | `LanguageContext.tsx` | ✅ Redirección | Eliminar o mover a servidor | 2 semanas |
| 11 | No hay breadcrumbs Schema.org | 🟡 MEDIA | Páginas internas | — | Crear componente Breadcrumb | 2 semanas |
| 12 | Sitio es SPA puro (sin SSR) | 🟡 MEDIA | Todo el sitio | — | Considerar Next.js/Astro | Largo plazo |
| 13 | No hay `og:image` en `/public` | 🟢 BAJA | `public/` | — | Crear imagen 1200×630px | 2 semanas |
| 14 | Noticias dinámicas no en sitemap | 🟡 MEDIA | `/noticias/*` | — | Sitemap dinámico o manual | 2 semanas |
| 15 | Sin `title` único por página (antes de JS) | 🔴 ALTA | `index.html` | — | Incluido en fix de index.html | Esta semana |

---

## PARTE 4: PLAN DE ACCIÓN ORDENADO

### ✅ DÍA 1 — Cambios de 5 minutos con alto impacto

```tsx
// 1. Hero.tsx — UNA SOLA LÍNEA:
// Cambiar: const { t, language } = useLanguage();
// Por:
const { t, language, getLink } = useLanguage();
// Y BORRAR la línea: const getLink = (path: string) => `${path}?lang=${language}`;

// 2. App.tsx — Cambiar catch-all:
// import { NotFound } from './pages/NotFound';
// <Route path="*" element={<NotFound />} />

// 3. Footer.tsx — Corregir 3 links:
// '/servicios', '/nosotros', '/noticias'
```

### ✅ DÍA 2 — Crear archivos faltantes

```bash
# Crear public/robots.txt  (contenido arriba)
# Crear public/sitemap.xml (contenido arriba)
# Actualizar index.html    (contenido arriba)
# Reemplazar SeoTags.tsx   (contenido arriba)
# Crear pages/NotFound.tsx (contenido arriba)
```

### ✅ SEMANA 1 — Optimizaciones adicionales

```bash
# Crear og-image.jpg (1200x630px) en public/
# Añadir noindex en AdminGuard y AdminLogin
# Implementar Breadcrumb component
# Actualizar vercel.json
```

### ✅ TRAS LOS CAMBIOS — Acciones en Google Search Console

1. **Validar corrección** de errores "Página con redirección" y "Duplicada"
2. **Enviar sitemap:** GSC → Sitemaps → `https://www.oplpacifico.com/sitemap.xml`
3. **Solicitar reindexación** de URLs principales via "Inspección de URL"
4. **Monitorear** el informe de Cobertura en los próximos 7-14 días

---

> **⚠️ Reemplaza `https://www.oplpacifico.com` con tu dominio real en producción en todos los archivos.** Si el dominio tiene `www`, úsalo consistentemente; si no, omítelo también consistentemente.