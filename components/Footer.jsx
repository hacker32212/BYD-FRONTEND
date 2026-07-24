'use client';

import Link from 'next/link';

export default function Footer({ cars = [], locale = 'uz' }) {
  return (
    <footer className="bg-[#1c1d1f] text-gray-300 py-16 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-white font-bold text-base mb-6 uppercase tracking-wider">
          Modellari
        </h3>

        {/* Список моделей — тянется из БД, ссылки ведут на реальные карточки моделей */}
        {cars.length > 0 ? (
          <ul className="space-y-3 text-sm font-semibold text-gray-300 mb-16">
            {cars.map((car) => (
              <li key={car.id || car.slug}>
                <Link href={`/${locale}/models/${car.slug}`} className="hover:text-white transition-colors">
                  {car.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 mb-16">Modellar hali qo'shilmagan</p>
        )}

        {/* Юридические ссылки */}
        <div className="flex flex-wrap gap-6 text-xs text-gray-400 mb-8 border-t border-white/10 pt-8">
          <a href="#" className="hover:underline">Maxfiylik & huquqiylik</a>
          <a href="#" className="hover:underline">Foydalanish Shartlari</a>
          <a href="#" className="hover:underline">Eslab qolish</a>
        </div>

        {/* Копирайт */}
        <div className="text-center text-xs text-gray-500">
          © BYD Auto UZ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
