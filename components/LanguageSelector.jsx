'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

const LANGUAGES = [
  { code: 'uz', label: "O'zbekcha", region: "O'zbekiston" },
  { code: 'ru', label: 'Русский', region: 'Россия и СНГ' },
  { code: 'en', label: 'English', region: 'International' },
];

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  function pathWithoutLocale() {
    const parts = pathname.split('/');
    parts.splice(1, 1);
    return parts.join('/') || '/';
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Change language"
        className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 text-white hover:border-volt hover:text-volt transition"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 3.8 6 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-6-3.8-9s1.3-6.3 3.8-9z" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-ink-950/97 backdrop-blur-sm flex flex-col animate-fadeIn">
          <div className="flex justify-end p-6">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white hover:border-volt hover:text-volt transition"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="w-full max-w-3xl">
              <p className="text-ink-400 uppercase tracking-[0.3em] text-xs text-center mb-10">
                Select your language
              </p>
              <div className="grid sm:grid-cols-3 gap-5">
                {LANGUAGES.map((lang) => (
                  <Link
                    key={lang.code}
                    href={`/${lang.code}${pathWithoutLocale()}`}
                    onClick={() => setOpen(false)}
                    className={`group rounded-2xl border px-6 py-8 text-center transition ${
                      lang.code === locale
                        ? 'border-volt bg-volt/10'
                        : 'border-white/15 hover:border-volt/60 hover:bg-white/5'
                    }`}
                  >
                    <span
                      className={`block font-display text-2xl font-bold mb-2 ${
                        lang.code === locale ? 'text-volt' : 'text-white group-hover:text-volt'
                      }`}
                    >
                      {lang.label}
                    </span>
                    <span className="block text-ink-400 text-sm">{lang.region}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
