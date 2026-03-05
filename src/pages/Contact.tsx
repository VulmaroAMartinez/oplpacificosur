import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useLanguage } from '../context/LanguageContext';

export const Contact = () => {
  const { t } = useLanguage();

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

    try {
      // Use the backend server instead of direct DB access
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-72bfe855/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al enviar el formulario');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: 'Flete Marítimo',
        message: ''
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Hubo un error al enviar el mensaje. Por favor intente nuevamente.');
    }
  };

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">{t('contact.section_subtitle')}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-4">{t('contact.title')}</h1>
          <p className="text-slate-600 text-lg">
            {t('contact.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <div className="bg-slate-50 p-8 rounded-sm mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('contact.info_title')}</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-full text-orange-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Oficina Principal</h4>
                    <p className="text-slate-600">Av. Puerto Madero, Edificio A, Piso 5<br />Ciudad de Tapachula, Chiapas, México</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-full text-orange-500">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Teléfono</h4>
                    <p className="text-slate-600">962 1234-5678</p>
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
                    <p className="text-slate-600">ventas@oplpacificosur.com</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative h-64 rounded-sm overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1618577520246-bad40975f401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBtZWV0aW5nJTIwc2hpcHBpbmclMjBpbmR1c3RyeXxlbnwxfHx8fDE3NzAyMjc3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Customer Service Team"
                className="w-full h-full object-cover"
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
            className="bg-white p-8 rounded-sm shadow-xl border-t-4 border-orange-500"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('contact.form_title')}</h3>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-green-50 rounded-sm">
                <CheckCircle size={64} className="text-green-500 mb-4" />
                <h4 className="text-2xl font-bold text-green-700 mb-2">{t('contact.success_title')}</h4>
                <p className="text-green-600 mb-6">{t('contact.success_msg')}</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2 bg-green-600 text-white font-bold rounded-sm hover:bg-green-700 transition-colors"
                >
                  {t('contact.btn_new')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">{t('contact.labels.name')}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
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
                      placeholder="+507 ..."
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
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-orange-500 outline-none rounded-sm transition-colors resize-none"
                    placeholder={t('contact.placeholders.message')}
                  ></textarea>
                </div>

                {status === 'error' && (
                  <div className="p-4 bg-red-50 text-red-600 text-sm rounded-sm">
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
