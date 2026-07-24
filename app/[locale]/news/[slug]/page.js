import { fetchNewsPost } from '../../../../lib/api';
import ScrollReveal from '../../../../components/ScrollReveal';
import { notFound } from 'next/navigation';

export default async function NewsDetailPage({ params: { locale, slug } }) {
  const post = await fetchNewsPost(slug, locale);
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 pt-36 pb-20">
      <ScrollReveal>
        <p className="text-volt uppercase tracking-[0.3em] text-xs font-semibold mb-3">BYD</p>
        <h1 className="font-display font-bold text-4xl mb-4">{post.title}</h1>
        <p className="text-ink-400 text-sm mb-10">
          {new Date(post.publishedAt).toLocaleDateString(locale)}
        </p>
        <div className="prose prose-invert max-w-none text-ink-200 leading-relaxed">
          <p>{post.content || post.excerpt}</p>
        </div>
      </ScrollReveal>
    </div>
  );
}
