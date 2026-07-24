import Link from 'next/link';
import { getHeroSlides, resolveImage } from '../../lib/api';

export default async function HomePage({ params: { locale } }) {
  let slides = [];
  try {
    slides = await getHeroSlides();
  } catch (e) {
    console.error('Failed to fetch hero slides:', e);
  }

  // Если в админке ещё не добавлено ни одного слайда — показываем один
  // нейтральный экран-заглушку вместо пустой белой страницы.
  if (slides.length === 0) {
    slides = [
      {
        id: 'placeholder',
        title: 'BYD',
        subtitle: '',
        image: '',
        link: '/models',
      },
    ];
  }

  return (
    <main className="bg-black text-white w-full pt-16">
      <div id="models" className="w-full">
        {slides.map((item, idx) => {
          const title = item.title;
          const image = resolveImage(item.image);
          const link = item.link
            ? item.link.startsWith('/models/') || item.link.startsWith('/news')
              ? `/${locale}${item.link}`
              : item.link
            : `/${locale}/models`;

          return (
            <section
              key={item.id || idx}
              className="relative w-full h-[calc(100vh-4rem)] flex flex-col justify-between items-center overflow-hidden bg-[#111111]"
            >
              {/* Фон: фото из админки, либо стильный тёмный градиент BYD, пока фото не загружено */}
              {image ? (
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
                  style={{ backgroundImage: `url(${image})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-[#181a1b] via-[#0f1011] to-[#080808] z-0" />
              )}

              {/* Легкое затемнение для глубокого контраста */}
              <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />

              {/* Пространство сверху */}
              <div className="h-10 z-20" />

              {/* ЗАГОЛОВОК: Точная типографика BYD (Разряженные легкие/полужирные буквы) */}
              <div className="relative z-20 text-center px-4 my-auto">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-[0.12em] uppercase text-white drop-shadow-md font-sans">
                  {title}
                </h1>
                {item.subtitle && (
                  <p className="text-gray-300 text-sm md:text-base mt-4 max-w-xl mx-auto">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {/* КНОПКА СНИЗУ: Минималистичная прозрачная рамка */}
              <div className="relative z-20 mb-10">
                <Link
                  href={link}
                  className="inline-block border border-white/70 bg-black/20 backdrop-blur-md text-white text-xs font-medium tracking-[0.2em] uppercase px-8 py-3 hover:bg-white hover:text-black transition-all duration-300"
                >
                  BATAFSIL MA'LUMOTLAR
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
