import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContactForm from '../../../../components/ContactForm';
import { getCarBySlug, resolveImage } from '../../../../lib/api';

// Достаёт значение характеристики по ключу из массива specs: [{key, value}]
function getSpec(specs, key) {
  return specs?.find((s) => s.key === key)?.value;
}

export default async function ModelDetailPage({ params: { slug, locale } }) {
  let car = null;
  try {
    car = await getCarBySlug(slug, locale);
  } catch (e) {
    console.error('Failed to load car details:', e);
  }

  // Если модели с таким slug нет в базе — показываем 404, а не выдуманные
  // данные (раньше здесь всегда подставлялась заглушка "BYD HAN" / 610 км и т.д.,
  // даже если модель не существует).
  if (!car) notFound();

  const specs = car.specs || [];
  const range = getSpec(specs, 'range');
  const accel = getSpec(specs, 'acceleration');
  const power = getSpec(specs, 'power');
  const battery = getSpec(specs, 'battery');
  const price = car.priceFrom ? Number(car.priceFrom).toLocaleString() : null;
  const image = resolveImage(car.coverImage || car.images?.[0]) || '/hero/slide-1.svg';
  const category = car.category === 'hybrid' ? 'GIBRID AVTOMOBIL' : 'ELEKTR AVTOMOBIL';

  const specItems = [
    range && { label: 'Запас хода', value: range },
    accel && { label: '0-100 км/ч', value: accel },
    power && { label: 'Мощность', value: power },
    battery && { label: 'Батарея', value: battery },
  ].filter(Boolean);

  return (
    <main className="bg-black text-white min-h-screen pt-16">
      {/* 1. Полноэкранный промо-баннер авто — в стиле главной страницы */}
      <section className="relative h-[calc(100vh-4rem)] w-full flex flex-col justify-between items-center overflow-hidden bg-[#111111]">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

        <div className="h-10 z-20" />

        <div className="relative z-20 text-center px-4 my-auto">
          <span className="text-gray-300 text-xs md:text-sm tracking-[0.3em] uppercase block mb-4">
            {category}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-[0.12em] uppercase text-white drop-shadow-md">
            {car.title}
          </h1>
          {car.subtitle && (
            <p className="text-gray-300 text-sm md:text-base mt-4 max-w-xl mx-auto">
              {car.subtitle}
            </p>
          )}
        </div>

        <div className="relative z-20 mb-10">
          <Link
            href="#test-drive"
            className="inline-block border border-white/70 bg-black/20 backdrop-blur-md text-white text-xs font-medium tracking-[0.2em] uppercase px-8 py-3 hover:bg-white hover:text-black transition-all duration-300"
          >
            Тест-драйв
          </Link>
        </div>
      </section>

      {/* 2. Панель ключевых характеристик */}
      {specItems.length > 0 && (
        <section className="border-y border-white/10 bg-black py-8">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {specItems.map((item) => (
              <div key={item.label}>
                <span className="block text-2xl md:text-4xl font-semibold text-white">
                  {item.value}
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
            <div>
              <span className="block text-2xl md:text-4xl font-semibold text-white">
                {price ? `от $${price}` : 'По запросу'}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Стартовая цена</span>
            </div>
          </div>
        </section>
      )}

      {/* 3. Описание */}
      {car.description && (
        <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-semibold uppercase tracking-tight mb-6">
                О модели
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {car.description}
              </p>
            </div>
            <div className="border border-white/10">
              <img src={image} alt={car.title} className="w-full h-auto object-cover" />
            </div>
          </div>
        </section>
      )}

      {/* 4. Запись на тест-драйв */}
      <section id="test-drive" className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-semibold uppercase tracking-wider">
            Забронировать {car.title}
          </h2>
        </div>
        <div className="border border-white/10 bg-[#111111] p-8 md:p-12">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
