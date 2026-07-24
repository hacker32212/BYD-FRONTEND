'use client';

import { useState } from 'react';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import { resolveImage } from '../lib/api';

export default function Header({ cars = [], locale = 'uz' }) {
  // Состояние: открыта ли выпадающая панель моделей
  const [isModelsOpen, setIsModelsOpen] = useState(false);
  // Состояние: активная вкладка ('electric' или 'hybrid')
  const [activeTab, setActiveTab] = useState('electric');

  // Модели тянутся из БД (переданы из layout.js) — больше никаких
  // захардкоженных названий и картинок с чужого сайта byd.com.
  const electricCars = cars.filter((c) => (c.category || 'electric') === 'electric');
  const hybridCars = cars.filter((c) => c.category === 'hybrid');
  const currentCars = activeTab === 'electric' ? electricCars : hybridCars;
  const hasHybrid = hybridCars.length > 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#141414] border-b border-white/10">
      {/* ВЕРХНЯЯ СТРОКА ШАПКИ */}
      <div className="h-20 flex items-center justify-between w-full max-w-[1700px] mx-auto px-8">

        {/* Левая часть: Логотип и Навигация */}
        <div className="flex items-center space-x-16 h-full">
          {/* Логотип BYD */}
          <Link href={`/${locale}`} className="flex items-center">
            <img
              src="https://www.byd.com/static_material/byd/overseas/public-icon/logo.svg"
              alt="BYD"
              className="h-6 w-auto object-contain brightness-0 invert"
            />
          </Link>

          {/* Пункты меню */}
          <nav className="hidden md:flex items-center space-x-10 text-sm font-semibold text-white tracking-widest uppercase h-full">

            {/* Кнопка "Modellari" с обработчиками наведения */}
            <div
              className="relative h-full flex items-center cursor-pointer"
              onMouseEnter={() => setIsModelsOpen(true)}
            >
              <span className={`py-2 transition-colors ${isModelsOpen ? 'text-gray-300 border-b-2 border-white' : 'hover:text-gray-300'}`}>
                Modellari
              </span>
            </div>

            <Link href={`/${locale}/about`} className="hover:text-gray-300 transition-colors py-2">
              BYD Haqida
            </Link>
          </nav>
        </div>

        {/* Правая часть: Global и языки */}
        <div className="flex items-center space-x-6 text-xs font-semibold text-white tracking-wider">
          <div className="hidden sm:flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span>Global</span>
          </div>

          <div className="border-l border-white/15 pl-6">
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* ВЫПАДАЮЩАЯ ПАНЕЛЬ С МОДЕЛЯМИ (MEGA MENU) */}
      {isModelsOpen && (
        <div
          className="w-full bg-white text-black border-t border-gray-200 shadow-2xl transition-all duration-300 py-10 px-8 md:px-16"
          onMouseEnter={() => setIsModelsOpen(true)}
          onMouseLeave={() => setIsModelsOpen(false)}
        >
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row gap-12">

            {/* Левый фильтр: Elektromobillar / Gibrid */}
            <div className="w-full md:w-56 flex flex-col space-y-6 pt-2">
              <button
                onClick={() => setActiveTab('electric')}
                className={`text-left text-base font-bold tracking-wide transition-all ${
                  activeTab === 'electric'
                    ? 'text-black border-b-2 border-black pb-1 w-fit'
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                Elektromobillar
              </button>

              {hasHybrid && (
                <button
                  onClick={() => setActiveTab('hybrid')}
                  className={`text-left text-base font-bold tracking-wide transition-all ${
                    activeTab === 'hybrid'
                      ? 'text-black border-b-2 border-black pb-1 w-fit'
                      : 'text-gray-400 hover:text-black'
                  }`}
                >
                  Gibrid
                </button>
              )}
            </div>

            {/* Сетка автомобилей справа */}
            {currentCars.length > 0 ? (
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-start">
                {currentCars.map((car) => (
                  <div key={car.id || car.slug} className="flex flex-col items-center text-center group">
                    {/* Название авто */}
                    <h3 className="text-xs font-bold text-black tracking-wider uppercase mb-6 h-8 flex items-center justify-center">
                      {car.title}
                    </h3>

                    {/* Картинка авто */}
                    <div className="w-full h-24 flex items-center justify-center mb-6">
                      <img
                        src={resolveImage(car.coverImage || car.images?.[0]) || '/hero/slide-1.svg'}
                        alt={car.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Ссылка "KO'PROQ O'RGANING" */}
                    <Link
                      href={`/${locale}/models/${car.slug}`}
                      onClick={() => setIsModelsOpen(false)}
                      className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase group-hover:text-black group-hover:underline transition-colors"
                    >
                      KO'PROQ O'RGANING
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center text-sm text-gray-400 uppercase tracking-widest">
                Modellar hali qo'shilmagan
              </div>
            )}

          </div>
        </div>
      )}
    </header>
  );
}
