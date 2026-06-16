import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

export const AdminGuard = () => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    metaRobots.content = 'noindex, nofollow';

    return () => {
      if (metaRobots) metaRobots.content = 'index, follow';
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setChecking(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-white p-8 rounded-sm shadow-md">
          <h1 className="text-xl font-bold text-slate-900 mb-2">Supabase no configurado</h1>
          <p className="text-slate-600 text-sm">
            Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env.
            Consulta docs/SUPABASE_SETUP.md.
          </p>
        </div>
      </div>
    );
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};
