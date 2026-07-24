import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales } from '../../i18n';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ChargeProgressBar from '../../components/ChargeProgressBar';
import { getCars } from '../../lib/api';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: 'BYD',
  description: 'Official electric vehicles website',
};

export default async function LocaleLayout({ children, params: { locale } }) {
  const messages = await getMessages();

  // Модели тянем один раз на уровне layout и передаём в шапку/подвал —
  // так меню "Modellari" и футер всегда показывают реальные модели из БД,
  // а не захардкоженный список.
  let cars = [];
  try {
    cars = await getCars(locale);
  } catch (e) {
    console.error('Failed to fetch cars for header/footer:', e);
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ChargeProgressBar />
      <Header cars={cars} locale={locale} />
      <main className="min-h-screen">{children}</main>
      <Footer cars={cars} locale={locale} />
    </NextIntlClientProvider>
  );
}
