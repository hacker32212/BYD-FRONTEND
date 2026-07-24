'use client';
import { useEffect, useState } from 'react';

// Signature element: a top progress bar styled like a battery charge indicator,
// filling with the volt-green accent as the visitor scrolls through the page.
export default function ChargeProgressBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function onScroll() {
      const h = document.documentElement;
      const scrollable = h.scrollHeight - h.clientHeight;
      const progress = scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0;
      setPct(progress);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-ink-800">
      <div
        className="h-full bg-gradient-to-r from-volt to-current transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
