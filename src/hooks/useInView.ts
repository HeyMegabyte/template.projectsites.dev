import { useEffect, useRef, useState } from 'react';

function shouldAnimate() {
  if (typeof window === 'undefined') return false;
  if (!('IntersectionObserver' in window)) return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState<boolean>(() => !shouldAnimate());

  useEffect(() => {
    if (!shouldAnimate()) {
      setIsInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px', ...options }
    );
    observer.observe(el);

    const fallback = window.setTimeout(() => setIsInView(true), 1500);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return { ref, isInView };
}
