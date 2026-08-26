import { useEffect, useRef, useState } from 'react';

export interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description?: string;
}

interface Props {
  stats: Stat[];
  headline?: string;
  eyebrow?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, durationMs = 1400, start = false): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const tick = (ts: number) => {
      if (startTime === null) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      setValue(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, durationMs, start]);
  return value;
}

function StatTile({ stat, visible }: { stat: Stat; visible: boolean }) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const value = useCountUp(stat.value, 1400, visible && !reduced);
  const display = reduced ? stat.value : value;
  return (
    <div className="glass rounded-2xl p-8 text-center">
      <p className="text-4xl md:text-5xl font-bold font-heading gradient-text mb-2">
        {stat.prefix ?? ''}
        {display.toLocaleString()}
        {stat.suffix ?? ''}
      </p>
      <p className="text-text font-medium">{stat.label}</p>
      {stat.description && (
        <p className="text-text-muted text-sm mt-2 leading-relaxed">{stat.description}</p>
      )}
    </div>
  );
}

export default function StatRollup({ stats, headline, eyebrow }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {(eyebrow || headline) && (
          <div className="text-center mb-12">
            {eyebrow && (
              <span className="text-[var(--color-accent)] text-sm font-mono tracking-widest uppercase">
                {eyebrow}
              </span>
            )}
            {headline && (
              <h2 className="text-3xl md:text-5xl font-bold font-heading mt-4">
                {headline}
              </h2>
            )}
          </div>
        )}
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: `repeat(auto-fit,minmax(200px,1fr))` }}
        >
          {stats.map((s, i) => (
            <StatTile key={`${s.label}-${i}`} stat={s} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
