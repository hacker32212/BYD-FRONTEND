import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { fetchNews } from '../../../lib/api';
import ScrollReveal from '../../../components/ScrollReveal';

export default async function NewsPage({ params: { locale } }) {
  const t = await getTranslations('news');
  const news = await fetchNews(locale);
  

  return (
    <div className="max-w-5xl mx-auto px-6 pt-36 pb-20">
      <ScrollReveal>
        <p className="text-volt uppercase tracking-[0.3em] text-xs font-semibold mb-3">BYD</p>
        <h1 className="font-display font-bold text-4xl mb-14">{t('title')}</h1>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((post, i) => (
          <ScrollReveal key={post.id} delay={i * 80}>
            <Link
              href={`/${locale}/news/${post.slug}`}
              className="block h-full border border-ink-800 hover:border-volt/50 rounded-2xl p-6 transition-colors"
            >
              <h3 className="font-display font-semibold text-lg mb-2">{post.title}</h3>
              <p className="text-ink-400 text-sm">{post.excerpt}</p>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
