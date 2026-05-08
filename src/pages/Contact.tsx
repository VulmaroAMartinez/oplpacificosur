import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

// ─── Configuración ─────────────────────────────────────────────
// Registrate gratis en https://web3forms.com para obtener tu access_key
// Recibirás los emails directamente en tu correo registrado.
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string;

// ─── Anti-spam: Rate limiting por sesión ───────────────────────
const MAX_SUBMISSIONS_PER_SESSION = 3;
let sessionSubmissions = 0;

// ─── Validación ────────────────────────────────────────────────
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(data: { name: string; email: string; message: string }): string | null {
  if (!data.name || data.name.trim().length < 2) return 'El nombre es obligatorio (mínimo 2 caracteres).';
  if (!data.email || !validateEmail(data.email)) return 'Ingrese un correo electrónico válido.';
  if (!data.message || data.message.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
  if (data.name.length > 100) return 'El nombre no puede exceder 100 caracteres.';
  if (data.message.length > 5000) return 'El mensaje no puede exceder 5000 caracteres.';
  return null;
}

export const Contact = () => {
  const { t } = useLanguage();
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formStartTime = useRef<number>(Date.now());

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: 'Flete Marítimo',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // ── Anti-spam check 1: Honeypot ──────────────────────────
    if (honeypotRef.current && honeypotRef.current.value) {
      // Bot detected → finge éxito
      setStatus('success');
      return;
    }

    // ── Anti-spam check 2: Tiempo mínimo ─────────────────────
    const elapsed = Date.now() - formStartTime.current;
    if (elapsed < 3000) {
      // Llenó el form en menos de 3 segundos → bot
      setStatus('success');
      return;
    }

    // ── Anti-spam check 3: Rate limiting ─────────────────────
    if (sessionSubmissions >= MAX_SUBMISSIONS_PER_SESSION) {
      setStatus('error');
      setErrorMessage('Ha excedido el número máximo de envíos. Inténtelo más tarde.');
      return;
    }

    // ── Validación del frontend ──────────────────────────────
    const validationError = validateForm(formData);
    if (validationError) {
      setStatus('error');
      setErrorMessage(validationError);
      return;
    }

    try {
      // ── Envío directo vía Web3Forms ────────────────────────
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `[OPL Pacífico Sur] Nuevo mensaje de ${formData.name}`,
          from_name: 'OPL Pacífico Sur Web',
          // Datos del formulario
          name: formData.name,
          email: formData.email,
          phone: formData.phone || 'No proporcionado',
          company: formData.company || 'No proporcionado',
          service: formData.service,
          message: formData.message,
          // Anti-spam de Web3Forms
          botcheck: '', // Web3Forms honeypot
          // Metadata
          _template: 'table', // Formato del email: tabla legible
          _captcha: false,    // Desactivar captcha visual (usamos nuestro propio anti-spam)
        }),
      });

      const result = await response.json();

      if (result.success) {
        sessionSubmissions++;
        setStatus('success');
        setFormData({
          name: '', email: '', company: '', phone: '',
          service: 'Flete Marítimo', message: ''
        });
      } else {
        throw new Error(result.message || 'Error al enviar');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setErrorMessage(
        error.message || 'Hubo un error al enviar el mensaje. Por favor intente nuevamente.'
      );
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setErrorMessage('');
    formStartTime.current = Date.now();
  };

  return (
    <div className="pt-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">{t('contact.section_subtitle')}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-4">{t('contact.title')}</h1>
          <p className="text-slate-600 text-lg">{t('contact.desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('contact.info_title')}</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-full text-orange-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Dirección</h4>
                    <p className="text-slate-600">Tapachula, Chiapas, México</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-full text-orange-500">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Teléfono</h4>
                    <p className="text-slate-600">+52 962 123 4567</p>
                    <p className="text-slate-500 text-sm">Lunes a Viernes, 8:00 AM - 6:00 PM</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-full text-orange-500">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Email</h4>
                    <p className="text-slate-600">info@oplpacificosur.com</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative h-64 rounded-sm overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1618577520246-bad40975f401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBtZWV0aW5nJTIwc2hpcHBpbmclMjBpbmR1c3RyeXxlbnwxfHx8fDE3NzAyMjc3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Customer Service Team"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                <p className="text-white font-bold text-xl">{t('contact.support_badge')}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-white p-8 rounded-sm shadow-xl border-t-4 border-orange-500"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('contact.form_title')}</h3>

            {status === 'success' ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('contact.success_title')}</h3>
                <p className="text-slate-600 mb-6">{t('contact.success_msg')}</p>
                <button
                  onClick={resetForm}
                  className="text-orange-500 font-bold hover:text-orange-600 transition-colors"
                >
                  {t('contact.btn_new')}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* ── Honeypot (invisible para usuarios, visible para bots) ── */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="website_url">Website</label>
                  <input
                    type="text"
                    name="website_url"
                    id="website_url"
                    ref={honeypotRef}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">{t('contact.labels.name')}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      minLength={2}
                      maxLength={100}
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 outline-none rounded-sm transition-colors"
                      placeholder={t('contact.placeholders.name')}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">{t('contact.labels.phone')}</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 outline-none rounded-sm transition-colors"
                      placeholder="+52 ..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">{t('contact.labels.email')}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      maxLength={254}
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 outline-none rounded-sm transition-colors"
                      placeholder={t('contact.placeholders.email')}
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-bold text-slate-700 mb-2">{t('contact.labels.company')}</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      maxLength={100}
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 outline-none rounded-sm transition-colors"
                      placeholder={t('contact.placeholders.company')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-bold text-slate-700 mb-2">{t('contact.labels.service')}</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 outline-none rounded-sm transition-colors"
                  >
                    <option>Flete Marítimo</option>
                    <option>Transporte Terrestre</option>
                    <option>Almacenaje y Distribución</option>
                    <option>Aduanas</option>
                    <option>Carga de Proyecto</option>
                    <option>Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">{t('contact.labels.message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    maxLength={5000}
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 outline-none rounded-sm transition-colors resize-none"
                    placeholder={t('contact.placeholders.message')}
                  ></textarea>
                </div>

                {status === 'error' && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm rounded-sm" role="alert">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-orange-500 text-white font-bold py-4 rounded-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> {t('contact.sending')}
                    </>
                  ) : (
                    <>
                      {t('contact.btn_send')} <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
