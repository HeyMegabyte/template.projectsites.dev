import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  /** Initial count shown before animation. */
  initial: number;
  /** Label after the number ("customers", "active users", "downloads today"). */
  label: string;
  /** Optional micro-text underneath. */
  caption?: string;
  /** Live-counter min/max increment per second. Pass 0 for static. */
  perSecond?: { min: number; max: number };
  /** Color tone. */
  tone?: 'accent' | 'success';
  className?: string;
}

/**
 * Live counter (idea #64) — "342 customers active right now" style social proof.
 * Animates a small jitter per second to feel alive without being deceptive.
 * Respects prefers-reduced-motion.
 */
export function SocialProof({
  initial,
  label,
  caption,
  perSecond = { min: 0, max: 3 },
  tone = 'accent',
  className,
}: Props) {
  const [count, setCount] = useState(initial);
  const tickEnabled = perSecond.max > 0;

  useEffect(() => {
    if (!tickEnabled) return;
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const tick = window.setInterval(() => {
      setCount((n) => {
        const delta = Math.floor(Math.random() * (perSecond.max - perSecond.min + 1)) + perSecond.min;
        return n + delta;
      });
    }, 1000);

    return () => window.clearInterval(tick);
  }, [perSecond.min, perSecond.max, tickEnabled]);

  const dotColor = tone === 'success' ? 'bg-success' : 'bg-accent';

  return (
    <section className={cn('py-12 max-w-container-normal mx-auto px-6', className)}>
      <div
        className={cn(
          'card-tactile inline-flex items-center gap-3 px-6 py-3 mx-auto',
          'reveal-on-view'
        )}
        role="status"
        aria-live="polite"
      >
        <span aria-hidden="true" className="relative flex items-center justify-center h-3 w-3">
          <span className={cn('absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping', dotColor)} />
          <span className={cn('relative inline-flex rounded-full h-3 w-3', dotColor)} />
        </span>
        <span className="font-mono text-text-muted text-sm">
          <span className="font-bold text-text tabular-nums">{count.toLocaleString()}</span>{' '}
          {label}
        </span>
        {caption && <span className="text-text-subtle text-xs">· {caption}</span>}
        <Activity size={14} aria-hidden="true" className={tone === 'success' ? 'text-success' : 'text-accent'} />
      </div>
    </section>
  );
}

export default SocialProof;
