import { useCallback, useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Cinematic back-to-top button.
 *
 * Fades + scales in once the visitor scrolls past a threshold (~600px), then
 * lifts with an accent glow-ring on hover/focus and dips with a springy
 * overshoot on press. The ink color uses the `--color-on-accent` token so it
 * stays WCAG-correct on light AND dark verticals. Smooth-scroll respects
 * `prefers-reduced-motion` (jumps instantly for reduced-motion users). Stays
 * mounted (rather than unmounting) so the entrance/exit actually animates;
 * `aria-hidden` + `tabIndex=-1` keep it out of the tab order while hidden, and
 * `aria-label` names it for assistive tech when shown.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        'back-to-top fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full',
        'bg-accent text-[color:var(--color-on-accent)] shadow-lg',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        'focus-visible:ring-offset-background',
        visible ? 'back-to-top--in' : 'back-to-top--out',
      )}
    >
      <ArrowUp size={20} strokeWidth={2.25} aria-hidden="true" />
      <style>{`
        .back-to-top {
          transition:
            opacity 260ms var(--ease),
            transform 260ms var(--ease),
            box-shadow 200ms var(--ease);
        }
        .back-to-top--out {
          opacity: 0;
          transform: translateY(12px) scale(0.85);
          pointer-events: none;
        }
        .back-to-top--in {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }
        @media (prefers-reduced-motion: no-preference) {
          .back-to-top--in:hover,
          .back-to-top--in:focus-visible {
            transform: translateY(-3px) scale(1.06);
            box-shadow:
              0 16px 34px -12px color-mix(in oklch, var(--color-accent) 60%, transparent),
              0 0 0 1px color-mix(in oklch, var(--color-accent) 45%, transparent);
          }
          .back-to-top--in:active {
            transform: translateY(-1px) scale(0.94);
            transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .back-to-top { transition: opacity 120ms linear; }
          .back-to-top--out { transform: none; }
          .back-to-top--in { transform: none; }
        }
      `}</style>
    </button>
  );
}
