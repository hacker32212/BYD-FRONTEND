export default function AboutPage() {
  return (
    <div className="bg-byd-dark text-white min-h-screen pt-36 pb-28">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        
        {/* Заголовок */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-byd-accent text-xs font-mono uppercase tracking-[0.3em] font-bold block mb-3">
            TECHNOLOGY & INNOVATION
          </span>
          <h1 className="text-4xl md:text-7xl font-black tracking-tight uppercase mb-6">
            Build Your Dreams
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            BYD — глобальный лидер в области технологий электромобильности, развивающий экосистему чистой энергии от солнечных батарей и накопителей до интеллектуальных автомобилей.
          </p>
        </div>

        {/* Грид ключевых технологий */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="byd-glass p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-byd-cyan text-xs font-mono font-bold uppercase tracking-widest block mb-2">01. SAFETY</span>
              <h3 className="text-2xl font-black uppercase mb-4">Blade Battery</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Инновационная структурированная батарея, выдерживающая экстремальные тесты на прокол гвоздем без возгорания и задымления.
              </p>
            </div>
          </div>

          <div className="byd-glass p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-byd-accent text-xs font-mono font-bold uppercase tracking-widest block mb-2">02. ARCHITECTURE</span>
              <h3 className="text-2xl font-black uppercase mb-4">e-Platform 3.0</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Высокоинтегрированная 8-в-1 электрическая силовая передача, обеспечивающая КПД более 89% и увеличенную жесткость кузова.
              </p>
            </div>
          </div>

          <div className="byd-glass p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-byd-cyan text-xs font-mono font-bold uppercase tracking-widest block mb-2">03. HYBRID</span>
              <h3 className="text-2xl font-black uppercase mb-4">DM-i Super Hybrid</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Революционная гибридная система с приоритетом электропривода, обеспечивающая суммарный запас хода свыше 1100 км.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}