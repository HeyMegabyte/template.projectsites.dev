import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

/**
 * Count-up that triggers when scrolled into view.
 *
 * Respects `prefers-reduced-motion` (renders the final value immediately) and
 * falls back to the final value when `IntersectionObserver` is unavailable.
 * The suffix is rendered with `aria-hidden` so screen readers announce the
 * number cleanly.
 */
export function AnimatedNumber({ value, suffix = '', durationMs = 1600, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setN(value);
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      setN(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        const start = performance.now();
        const ease = (t: number) => 1 - Math.pow(1 - t, 3);
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          setN(Math.round(ease(t) * value));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        observer.unobserve(el);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {n}
      <span aria-hidden="true">{suffix}</span>
    </span>
  );
}

export default AnimatedNumber;
