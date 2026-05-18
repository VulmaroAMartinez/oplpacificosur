import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const logoBlanco = new URL('../assets/oplblanco.png', import.meta.url).href;

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin', { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase no está configurado. Revisa tu archivo .env.');
      return;
    }

    setIsLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);

    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? 'Correo o contraseña incorrectos.'
          : authError.message
      );
      return;
    }

    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[360px]"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-full mb-4 p-3 shadow-lg shadow-orange-500/30">
            <img
              src={logoBlanco}
              alt="OPL Pacífico Sur"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">OPL Pacífico Sur</h1>
          <p className="text-slate-400">Panel de Administración</p>
        </div>

        <div className="bg-white rounded-sm shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
            <div className="bg-orange-100 p-3 rounded-full shrink-0">
              <Lock className="text-orange-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Acceso Restringido</h2>
              <p className="text-sm text-slate-500">Ingresa tus credenciales</p>
            </div>
          </div>

          {!isSupabaseConfigured ? (
            <p className="text-red-600 text-sm text-center bg-red-50 p-4 rounded-sm border border-red-100">
              Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY. Ver docs/SUPABASE_SETUP.md
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 outline-none rounded-sm transition-colors"
                    placeholder="tu@email.com"
                    required
                    autoFocus
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 outline-none rounded-sm transition-colors"
                    placeholder="Ingresa tu contraseña"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-sm"
                >
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-sm hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Verificando...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Ingresar al Panel
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-400 text-center">
              Solo personal autorizado. Todas las acciones son registradas.
            </p>
            <p className="text-center mt-4">
              <Link to="/" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
                ← Volver al sitio
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          © {new Date().getFullYear()} OPL Pacífico Sur. Todos los derechos reservados.
        </p>
      </motion.div>
    </div>
  );
};
