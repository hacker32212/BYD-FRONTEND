'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: 'BYD HAN',
    subtitle: 'LUXURY ELECTRIC SEDAN',
    tagline: 'Переопределяя стандарты производительности и роскоши.',
    range: '610 км',
    accel: '3.9 с',
    image: '/hero/slide-1.svg',
    link: '/models/byd-han'
  },
  {
    id: 2,
    title: 'BYD TANG',
    subtitle: '7-SEAT ELECTRIC SUV',
    tagline: 'Пространство, сила и инновационная безопасность Blade Battery.',
    range: '530 км',
    accel: '4.4 с',
    image: '/hero/slide-2.svg',
    link: '/models/byd-tang'
  },
  {
    id: 3,
    title: 'BYD SEAL',
    subtitle: 'DYNAMIC SPORT SEDAN',
    tagline: 'Технология CTB (Cell-to-Body) для абсолютной управляемости.',
    range: '570 км',
    accel: '3.8 с',
    image: '/hero/slide-3.svg',
    link: '/models/byd-seal'
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black select-none">
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Темный градиентный оверлей BYD */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-black/30 to-black/60 z-10" />

          {/* Фоновое изображение */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-out"
          />

          {/* Текстовый контент слайда */}
          <div className="absolute inset-0 z-20 max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col justify-end pb-24 md:pb-28">
            <div className="max-w-3xl">
              <span className="text-byd-accent text-xs md:text-sm font-mono font-bold uppercase tracking-[0.3em] block mb-3">
                {slide.subtitle}
              </span>
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight leading-none uppercase mb-4">
                {slide.title}
              </h1>
              <p className="text-gray-300 text-sm md:text-base font-normal max-w-xl mb-8 leading-relaxed">
                {slide.tagline}
              </p>

              {/* Мини-характеристики на баннере */}
              <div className="flex items-center gap-8 mb-8 pb-6 border-b border-white/10 max-w-md">
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-white block tracking-tight">
                    {slide.range}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                    Запас хода (WLTP)
                  </span>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div>
                  <span className="text-2xl md:text-3xl font-extrabold text-white block tracking-tight">
                    {slide.accel}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                    0-100 км/ч
                  </span>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={slide.link}
                  className="bg-white text-black hover:bg-byd-accent hover:text-white font-bold px-8 py-4 rounded-full text-xs uppercase tracking-[0.2em] transition-all duration-300 transform hover:scale-105"
                >
                  Узнать больше
                </Link>
                <Link
                  href="/contact"
                  className="byd-glass text-white hover:bg-white/10 font-bold px-8 py-4 rounded-full text-xs uppercase tracking-[0.2em] transition-all duration-300 border border-white/20"
                >
                  Тест-драйв
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Переключатель слайдов (Буллеты BYD) */}
      <div className="absolute bottom-10 right-6 md:right-12 z-30 flex space-x-3 items-center">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === current ? 'w-12 bg-byd-accent' : 'w-4 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}