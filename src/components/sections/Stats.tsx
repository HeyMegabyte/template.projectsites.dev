import type { CSSProperties } from 'react';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { cn } from '@/lib/utils';
import { scrubText } from '@/lib/placeholders';

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
  caption?: string;
}

interface Props {
  stats: Stat[];
  eyebrow?: string;
  headline?: string;
  className?: string;
  /** Grid columns at md+. Default: derived from stats.length (max 4). */
  columns?: 2 | 3 | 4;
}

const COLS: Record<2 | 3 | 4, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

export function Stats({ stats, eyebrow, headline, columns, className }: Props) {
  const safeEyebrow = scrubText(eyebrow);
  const safeHeadline = scrubText(headline);
  // Drop stats whose label is an unresolved token; scrub the optional caption.
  const safeStats = stats
    .map((s) => ({ ...s, label: scrubText(s.label), caption: scrubText(s.caption) || undefined }))
    .filter((s) => s.label.length > 0);
  if (safeStats.length === 0) return null;
  const cols = columns ?? (Math.min(4, Math.max(2, safeStats.length)) as 2 | 3 | 4);
  return (
    <section className={cn('py-20 md:py-28 max-w-container-wide mx-auto px-6', className)}>
      {(safeEyebrow || safeHeadline) && (
        <div className="text-center mb-12 reveal-on-view">
          {safeEyebrow && <span className="text-accent text-sm font-mono tracking-widest uppercase">{safeEyebrow}</span>}
          {safeHeadline && (
            <h2 className="text-3xl md:text-5xl font-bold font-heading mt-4 text-text">{safeHeadline}</h2>
          )}
        </div>
      )}
      <dl className={cn('grid grid-cols-2 gap-6 md:gap-10', COLS[cols])}>
        {safeStats.map((s, i) => (
          <div
            key={`${s.label}-${i}`}
            style={{ '--stat-i': i } as CSSProperties}
            className="stat-tile text-center p-6 card-tactile transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {/*
              WCAG: <dl> direct children must only be <dt>/<dd>/<div>/<script>/<template>.
              When <div> wraps a row, its children must be only <dt> + <dd>.
              We put the visible label inside the <dd> (alongside the number) and
              keep the sr-only <dt> for screen readers.
            */}
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span
                className="font-heading text-5xl md:text-6xl font-extrabold tracking-tight gradient-text block"
                aria-label={`${s.value}${s.suffix ?? ''}`}
              >
                <AnimatedNumber value={s.value} suffix={s.suffix} />
              </span>
              <span
                aria-hidden="true"
                className="stat-underline mx-auto mt-3 block h-0.5 w-10 rounded-full bg-gradient-to-r from-accent to-transparent"
              />
              <span className="mt-2 text-text font-medium block">{s.label}</span>
              {s.caption && <span className="mt-1 text-sm text-text-subtle block">{s.caption}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default Stats;
