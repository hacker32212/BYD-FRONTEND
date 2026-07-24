import CarCard from '@/components/CarCard';
import { getCars } from '@/lib/api';

export default async function ModelsPage({ params: { locale } }) {
  let cars = [];
  try {
    cars = await getCars(locale);
  } catch (e) {
    console.error('Error fetching models:', e);
  }

  return (
    <div className="bg-black text-white min-h-screen pt-36 pb-28">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">

        {/* Заголовок страницы */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-7xl font-semibold tracking-[0.08em] uppercase mb-6">
            Modellar
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
            Yuqori avtonomlik, xavfsizlik va intellektual boshqaruvni birlashtirgan BYD
            elektromobili yoki gibridini tanlang.
          </p>
        </div>

        {/* Сетка автомобилей */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.length > 0 ? (
            cars.map((car) => (
              <CarCard key={car.id || car.slug} car={car} locale={locale} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500 text-sm uppercase tracking-widest">
              Modellar hali qo'shilmagan
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
