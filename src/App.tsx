import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';
import { SeoTags } from './components/SeoTags';

// Pages
import { Home } from './pages/Home';
import { News } from './pages/News';
import { Contact } from './pages/Contact';

// Reusing existing components wrapped for pages
import { Services } from './components/Services';
import { About } from './components/About';
import { Tracking } from './components/Tracking';

// Simple wrappers for full page view of sections
const ServicesPage = () => <div className="pt-20"><Services /></div>;
const AboutPage = () => <div className="pt-20"><About /></div>;
const TrackingPage = () => <div className="pt-20 min-h-screen bg-slate-900"><Tracking /></div>;

/**
 * Componente con las rutas de la app.
 * Se duplican bajo / (español) y /en/ (inglés).
 */
const AppRoutes = () => (
  <Routes>
    {/* ── Rutas en Español (default, sin prefijo) ──────────── */}
    <Route path="/" element={<Home />} />
    <Route path="/servicios" element={<ServicesPage />} />
    <Route path="/nosotros" element={<AboutPage />} />
    <Route path="/noticias" element={<News />} />
    <Route path="/noticias/:id" element={<News />} />
    <Route path="/rastreo" element={<TrackingPage />} />
    <Route path="/contacto" element={<Contact />} />

    {/* ── Rutas en Inglés (prefijo /en/) ────────────────────── */}
    <Route path="/en" element={<Home />} />
    <Route path="/en/" element={<Home />} />
    <Route path="/en/servicios" element={<ServicesPage />} />
    <Route path="/en/nosotros" element={<AboutPage />} />
    <Route path="/en/noticias" element={<News />} />
    <Route path="/en/noticias/:id" element={<News />} />
    <Route path="/en/rastreo" element={<TrackingPage />} />
    <Route path="/en/contacto" element={<Contact />} />

    {/* ── Redirigir rutas legacy con ?lang= ─────────────────── */}
    {/* Si alguien accede con el formato viejo, redirigir */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => {
  return (
    <Router>
      <LanguageProvider>
        <SeoTags />
        <div className="font-sans text-slate-900 bg-white flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </Router>
  );
};

export default App;
