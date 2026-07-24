'use client';

import Link from 'next/link';
import { resolveImage } from '../lib/api';

// Достаёт значение характеристики по ключу из массива specs: [{key, value}]
function getSpec(specs, key) {
  return specs?.find((s) => s.key === key)?.value;
}

export default function CarCard({ car, locale }) {
  const specs = car?.specs || [];
  const range = getSpec(specs, 'range');
  const acceleration = getSpec(specs, 'acceleration');
  const price = car?.priceFrom ? Number(car.priceFrom).toLocaleString() : null;
  const image = resolveImage(car?.coverImage || car?.images?.[0]) || '/hero/slide-1.svg';
  const category = car?.category === 'hybrid' ? 'GIBRID' : 'ELEKTR';

  return (
    <div className="group relative bg-[#111111] border border-white/10 hover:border-white/30 transition-all duration-500 flex flex-col justify-between">
      {/* Метка категории */}
      <div className="absolute top-4 left-4 z-10 bg-black/70 px-3 py-1 border border-white/10 text-[10px] uppercase tracking-widest text-gray-300 font-semibold">
        {category}
      </div>

      {/* Фото автомобиля */}
      <div className="relative h-64 w-full overflow-hidden flex items-center justify-center p-4 bg-[#0a0a0a]">
        <img
          src={image}
          alt={car?.title || 'BYD Model'}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Контент карточки */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-white tracking-wide uppercase">
            {car?.title}
          </h3>
          {car?.subtitle && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {car.subtitle}
            </p>
          )}
        </div>

        {/* Характеристики */}
        {(range || acceleration) && (
          <div className="grid grid-cols-2 gap-4 my-6 pt-4 border-t border-white/10 text-center">
            <div>
              <span className="block text-xl font-semibold text-white tracking-tight">
                {range || '—'}
              </span>
              <span className="text-[10px] uppercase text-gray-500 tracking-wider">Запас хода</span>
            </div>
            <div>
              <span className="block text-xl font-semibold text-white tracking-tight">
                {acceleration || '—'}
              </span>
              <span className="text-[10px] uppercase text-gray-500 tracking-wider">0-100 км/ч</span>
            </div>
          </div>
        )}

        {/* Цена и Кнопка */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10">
          <div>
            <span className="block text-[10px] uppercase text-gray-500 tracking-wider">От</span>
            <span className="text-lg font-semibold text-white">
              {price ? `$${price}` : 'По запросу'}
            </span>
          </div>
          <Link
            href={`/${locale}/models/${car?.slug || car?.id}`}
            className="border border-white/70 text-white hover:bg-white hover:text-black px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition-all duration-300"
          >
            Обзор
          </Link>
        </div>
      </div>
    </div>
  );
}
