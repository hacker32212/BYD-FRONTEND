'use client';

import { useState } from 'react';
import { createLead } from '../lib/api';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', phone: '', model: '', note: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await createLead({
        name: formData.name,
        phone: formData.phone,
        model: formData.model,
        note: formData.note,
      });
      setStatus({ type: 'success', text: 'Заявка успешно отправлена! Наш менеджер свяжется с вами.' });
      setFormData({ name: '', phone: '', model: '', note: '' });
    } catch (err) {
      setStatus({ type: 'error', text: 'Ошибка отправки. Пожалуйста, попробуйте еще раз.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status && (
        <div
          className={`p-4 text-xs uppercase tracking-widest border ${
            status.type === 'success'
              ? 'border-emerald-400/40 text-emerald-300'
              : 'border-rose-400/40 text-rose-300'
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
            Ваше имя
          </label>
          <input
            type="text"
            required
            placeholder="Александр"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-transparent border border-white/20 px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-white transition text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
            Номер телефона
          </label>
          <input
            type="tel"
            required
            placeholder="+998 (90) 000-00-00"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-transparent border border-white/20 px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-white transition text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
          Интересующая модель
        </label>
        <input
          type="text"
          placeholder="Например: BYD HAN, BYD SEAL"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          className="w-full bg-transparent border border-white/20 px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-white transition text-sm"
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
          Комментарий / Пожелания
        </label>
        <textarea
          rows={4}
          placeholder="Укажите удобное время для тест-драйва или вопрос..."
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          className="w-full bg-transparent border border-white/20 px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-white transition text-sm resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-black hover:bg-gray-200 font-medium py-4 text-xs uppercase tracking-[0.25em] transition-all duration-300 disabled:opacity-50"
      >
        {loading ? 'Отправка...' : 'Отправить заявку'}
      </button>
    </form>
  );
}
