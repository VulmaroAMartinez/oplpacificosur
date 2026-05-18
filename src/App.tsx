import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';
import { SeoTags } from './components/SeoTags';
import { AdminGuard } from './components/AdminGuard';

// Pages
import { Home } from './pages/Home';
import { News } from './pages/News';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { AdminLogin } from './pages/AdminLogin';
import { AdminNewsForm } from './pages/AdminNewsForm';

// Reusing existing components wrapped for pages
import { Services } from './components/Services';
import { About } from './components/About';

const ServicesPage = () => <div className="pt-20"><Services /></div>;
const AboutPage = () => <div className="pt-20"><About /></div>;

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/servicios" element={<ServicesPage />} />
    <Route path="/nosotros" element={<AboutPage />} />
    <Route path="/noticias" element={<News />} />
    <Route path="/noticias/:slug" element={<News />} />
    <Route path="/contacto" element={<Contact />} />

    <Route path="/en" element={<Home />} />
    <Route path="/en/" element={<Home />} />
    <Route path="/en/servicios" element={<ServicesPage />} />
    <Route path="/en/nosotros" element={<AboutPage />} />
    <Route path="/en/noticias" element={<News />} />
    <Route path="/en/noticias/:slug" element={<News />} />
    <Route path="/en/contacto" element={<Contact />} />

    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin" element={<AdminGuard />}>
      <Route index element={<Admin />} />
      <Route path="noticias/nueva" element={<AdminNewsForm />} />
      <Route path="noticias/:id/editar" element={<AdminNewsForm />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
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
      <main className="flex-grow">
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
        <SeoTags />
        <AppShell />
      </LanguageProvider>
    </Router>
  );
};

export default App;
