import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';
import { SiteImagesProvider } from './context/SiteImagesContext';
import { SeoTags } from './components/SeoTags';
import { AdminGuard } from './components/AdminGuard';

// Pages
import { Home } from './pages/Home';
import { News } from './pages/News';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { AdminLogin } from './pages/AdminLogin';
import { AdminNewsForm } from './pages/AdminNewsForm';
import { AdminImages } from './pages/AdminImages';
import { BoletinesPage } from './pages/BulletinsPage';
import { AdminBoletines } from './pages/AdminBulletin';
import { AdminBoletinesForm } from './pages/AdminBulletinForm';

// Reusing existing components wrapped for pages
import { Services } from './components/Services';
import { About } from './components/About';
import { NotFound } from './pages/NotFound';
import { Breadcrumb } from './components/Breadcrumb';

const ServicesPage = () => (
  <div className="pt-20">
    <Breadcrumb />
    <Services />
  </div>
);
const AboutPage = () => (
  <div className="pt-20">
    <Breadcrumb />
    <About />
  </div>
);
const NewsPage = () => (
  <div className="pt-20">
    <Breadcrumb />
    <News />
  </div>
);
const BoletinesPageWrapper = () => (
  <div className="pt-20">
    <Breadcrumb />
    <BoletinesPage />
  </div>
);
const ContactPage = () => (
  <div className="pt-20">
    <Breadcrumb />
    <Contact />
  </div>
);

const AppRoutes = () => (
  <Routes>
    {/* Spanish routes (default) */}
    <Route path="/" element={<Home />} />
    <Route path="/servicios" element={<ServicesPage />} />
    <Route path="/nosotros" element={<AboutPage />} />
    <Route path="/noticias" element={<NewsPage />} />
    <Route path="/noticias/:slug" element={<NewsPage />} />
    <Route path="/boletines" element={<BoletinesPageWrapper />} />
    <Route path="/contacto" element={<ContactPage />} />

    {/* English routes */}
    <Route path="/en" element={<Home />} />
    <Route path="/en/" element={<Home />} />
    <Route path="/en/servicios" element={<ServicesPage />} />
    <Route path="/en/nosotros" element={<AboutPage />} />
    <Route path="/en/noticias" element={<NewsPage />} />
    <Route path="/en/noticias/:slug" element={<NewsPage />} />
    <Route path="/en/boletines" element={<BoletinesPageWrapper />} />
    <Route path="/en/contacto" element={<ContactPage />} />

    {/* Admin routes */}
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin" element={<AdminGuard />}>
      <Route index element={<Admin />} />
      <Route path="noticias/nueva" element={<AdminNewsForm />} />
      <Route path="noticias/:id/editar" element={<AdminNewsForm />} />
      <Route path="imagenes" element={<AdminImages />} />
      <Route path="boletines" element={<AdminBoletines />} />
      <Route path="boletines/nuevo" element={<AdminBoletinesForm />} />
      <Route path="boletines/:id/editar" element={<AdminBoletinesForm />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const AppShell = () => {
  const location = useLocation();
  const isAdminLogin = location.pathname === '/admin/login';

  if (isAdminLogin) {
    return <AppRoutes />;
  }

  return (
    <div className="font-sans text-slate-900 bg-white flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <LanguageProvider>
        <SiteImagesProvider>
          <SeoTags />
          <AppShell />
        </SiteImagesProvider>
      </LanguageProvider>
    </Router>
  );
};

export default App;