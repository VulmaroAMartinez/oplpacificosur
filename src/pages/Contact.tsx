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

/** Identificadores alineados con `services.items.*` (mismo orden que en la web). */
const CONTACT_SERVICE_IDS = [
  'customs',
  'sea_freight',
  'cargo_services',
  'anchor_services',
  'sailboat_services',
  'ship_services',
  'other'
] as const;

type ContactServiceId = (typeof CONTACT_SERVICE_IDS)[number];

function validateContactForm(
  data: { name: string; email: string; message: string },
  err: {
    name_min: string;
    email_invalid: string;
    message_min: string;
    name_max: string;
    message_max: string;
  }
): string | null {
  if (!data.name || data.name.trim().length < 2) return err.name_min;
  if (!data.email || !validateEmail(data.email)) return err.email_invalid;
  if (!data.message || data.message.trim().length < 10) return err.message_min;
  if (data.name.length > 100) return err.name_max;
  if (data.message.length > 5000) return err.message_max;
  return null;
}

function serviceInterestLabel(id: string, t: (key: string) => string): string {
  if (id === 'other') return t('contact.service_other');
  return t(`services.items.${id}.title`);
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
    service: 'customs' as ContactServiceId,
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'service' ? (value as ContactServiceId) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    if (!WEB3FORMS_ACCESS_KEY) {
      setStatus('error');
      setErrorMessage(t('contact.errors.missing_key'));
      return;
    }

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
      setErrorMessage(t('contact.errors.rate_limit'));
      return;
    }

    const validationError = validateContactForm(formData, {
      name_min: t('contact.errors.name_min'),
      email_invalid: t('contact.errors.email_invalid'),
      message_min: t('contact.errors.message_min'),
      name_max: t('contact.errors.name_max'),
      message_max: t('contact.errors.message_max')
    });
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
          name: formData.name,
          email: formData.email,
          phone: formData.phone || t('contact.not_provided'),
          company: formData.company || t('contact.not_provided'),
          service: serviceInterestLabel(formData.service, t),
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
          service: 'customs', message: ''
        });
      } else {
        throw new Error(result.message || t('contact.errors.submit_failed'));
      }
    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      setStatus('error');
      const msg = error instanceof Error ? error.message : '';
      setErrorMessage(msg || t('contact.errors.submit_failed'));
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setErrorMessage('');
    formStartTime.current = Date.now();
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-orange-500">{t('contact.section_subtitle')}</span>
          <h1 className="mt-2 mb-4 text-4xl font-bold text-slate-900 md:text-5xl">{t('contact.title')}</h1>
          <p className="text-lg text-slate-600">{t('contact.desc')}</p>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-8 rounded-sm bg-slate-50 p-8">
              <h3 className="mb-6 text-2xl font-bold text-slate-900">{t('contact.info_title')}</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-orange-100 p-3 text-orange-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{t('contact.info.address_heading')}</h4>
                    <p className="text-slate-600">{t('contact.info.address_value')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-orange-100 p-3 text-orange-500">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{t('contact.info.phone_heading')}</h4>
                    <p className="text-slate-600">{t('contact.info.phone_value')}</p>
                    <p className="text-sm text-slate-500">{t('contact.info.phone_hours')}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-orange-100 p-3 text-orange-500">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{t('contact.info.email_heading')}</h4>
                    <p className="text-slate-600">{t('contact.info.email_value')}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative h-64 overflow-hidden rounded-sm shadow-md">
              <img
                src="https://images.unsplash.com/photo-1618577520246-bad40975f401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBtZWV0aW5nJTIwc2hpcHBpbmclMjBpbmR1c3RyeXxlbnwxfHx8fDE3NzAyMjc3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt={t('contact.image_alt')}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40">
                <p className="text-xl font-bold text-white">{t('contact.support_badge')}</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-sm border-t-4 border-orange-500 bg-white p-8 shadow-xl"
          >
            <h3 className="mb-6 text-2xl font-bold text-slate-900">{t('contact.form_title')}</h3>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center rounded-sm bg-green-50 py-12 text-center">
                <CheckCircle size={64} className="mb-4 text-green-500" />
                <h4 className="mb-2 text-2xl font-bold text-green-700">{t('contact.success_title')}</h4>
                <p className="mb-6 text-green-600">{t('contact.success_msg')}</p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-sm bg-green-600 px-6 py-2 font-bold text-white transition-colors hover:bg-green-700"
                >
                  {t('contact.btn_new')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative space-y-6" noValidate>
                {/* Honeypot: sin texto "Website" (evita confusión y lectores de pantalla); oculto de forma fiable */}
                <input
                  type="text"
                  name="company_website_trap"
                  ref={honeypotRef}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="pointer-events-none fixed top-0 left-0 h-px w-px opacity-0 overflow-hidden"
                />

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
                      placeholder={t('contact.placeholders.phone')}
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
                    {CONTACT_SERVICE_IDS.map((id) => (
                      <option key={id} value={id}>
                        {serviceInterestLabel(id, t)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-bold text-slate-700">{t('contact.labels.message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    maxLength={5000}
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full resize-none rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-colors focus:border-orange-500"
                    placeholder={t('contact.placeholders.message')}
                  ></textarea>
                </div>

                {status === 'error' && (
                  <div className="rounded-sm bg-red-50 p-4 text-sm text-red-600" role="alert">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex w-full items-center justify-center gap-2 rounded-sm bg-orange-500 py-4 font-bold text-white transition-all hover:bg-orange-600 disabled:opacity-70"
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
