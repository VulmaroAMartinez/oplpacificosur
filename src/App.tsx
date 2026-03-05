import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';
import { SeoTags } from './components/SeoTags';

// Pages
import { Home } from './pages/Home';
import { News } from './pages/News';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';

// Reusing existing components wrapped for pages
import { Services } from './components/Services';
import { About } from './components/About';
import { Tracking } from './components/Tracking';

// Simple wrappers for full page view of sections
const ServicesPage = () => <div className="pt-20"><Services /></div>;
const AboutPage = () => <div className="pt-20"><About /></div>;
const TrackingPage = () => <div className="pt-20 min-h-screen bg-slate-900"><Tracking /></div>;

const App = () => {
  return (
    <Router>
      <LanguageProvider>
        <SeoTags />
        <div className="font-sans text-slate-900 bg-white flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/servicios" element={<ServicesPage />} />
              <Route path="/nosotros" element={<AboutPage />} />
              <Route path="/noticias" element={<News />} />
              <Route path="/noticias/:id" element={<News />} />
              <Route path="/rastreo" element={<TrackingPage />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </Router>
  );
};

export default App;
