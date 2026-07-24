import { getTranslations } from 'next-intl/server';
import ContactForm from '../../../components/ContactForm';
import ScrollReveal from '../../../components/ScrollReveal';

export default async function ContactPage() {
  const t = await getTranslations('contact');
  return (
    <div className="max-w-3xl mx-auto px-6 pt-36 pb-20">
      <ScrollReveal>
        <p className="text-volt uppercase tracking-[0.3em] text-xs font-semibold mb-3">BYD</p>
        <h1 className="font-display font-bold text-4xl mb-8">{t('title')}</h1>
        <ContactForm />
      </ScrollReveal>
    </div>
  );
}
