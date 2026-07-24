import { getTranslations } from 'next-intl/server';
import { fetchDealers } from '../../../lib/api';
import ScrollReveal from '../../../components/ScrollReveal';

export default async function DealersPage({ params: { locale } }) {
  const t = await getTranslations('dealers');
  const dealers = await fetchDealers(locale);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-36 pb-20">
      <ScrollReveal>
        <p className="text-volt uppercase tracking-[0.3em] text-xs font-semibold mb-3">BYD</p>
        <h1 className="font-display font-bold text-4xl mb-14">{t('title')}</h1>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dealers.map((d, i) => (
          <ScrollReveal key={d.id} delay={i * 80}>
            <div className="border border-ink-800 rounded-2xl p-6">
              <h3 className="font-display font-semibold text-lg mb-2">{d.city}</h3>
              <p className="text-ink-400 mb-1">{d.address}</p>
              {d.workHours && <p className="text-ink-400 mb-1">{t('workHours')}: {d.workHours}</p>}
              {d.phone && <p className="text-ink-400">{t('phone')}: {d.phone}</p>}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
