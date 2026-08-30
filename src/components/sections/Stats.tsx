import { useEffect, useRef, useState, type CSSProperties } from 'react';
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

/**
 * Component-scoped styles. Every class is prefixed `.pst-` so it never collides
 * with global/shared styles. ALL animation is double-gated: count-up + entrance
 * stagger run ONLY when both `prefers-reduced-motion: no-preference` AND
 * `prefers-reduced-data: no-preference` hold. When either is reduced, the final
 * values render immediately with no motion (mirrored in JS and in CSS).
 */
const SCOPED_CSS = `
.pst-stats { --pst-accent: oklch(0.82 0.16 205); --pst-accent-2: oklch(0.72 0.19 285); }
.pst-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; }
@media (min-width: 768px) { .pst-grid { gap: 2.5rem; } }

.pst-tile {
  position: relative;
  text-align: center;
  padding: clamp(1.1rem, 2vw, 1.75rem) clamp(0.85rem, 2vw, 1.5rem);
  border-radius: 22px;
  border: 1px solid oklch(1 0 0 / 0.08);
  background: linear-gradient(180deg, oklch(1 0 0 / 0.05), oklch(1 0 0 / 0.015));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 1px 0 oklch(1 0 0 / 0.06) inset, 0 18px 44px -30px oklch(0 0 0 / 0.85);
  overflow: hidden;
}
/* Accent hairline that lights the top edge of every tile. */
.pst-tile::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--pst-accent), transparent);
  opacity: 0.65;
}
/* Soft accent aura behind the numeral. */
.pst-tile::after {
  content: '';
  position: absolute;
  inset: -40% 0 auto 0;
  height: 70%;
  background: radial-gradient(60% 60% at 50% 0%, oklch(0.82 0.16 205 / 0.14), transparent 70%);
  pointer-events: none;
}

.pst-figure {
  display: block;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
  font-size: clamp(2.5rem, 1.4rem + 4.4vw, 4rem);
  background: linear-gradient(135deg, var(--pst-accent), var(--pst-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-variant-numeric: tabular-nums;
}
.pst-suffix { -webkit-text-fill-color: currentColor; }

.pst-underline {
  display: block;
  height: 2px;
  width: 2.75rem;
  margin: 0.75rem auto 0;
  border-radius: 9999px;
  background: linear-gradient(90deg, var(--pst-accent), transparent);
}
/* text-wrap: balance keeps labels from ragging into one-word orphan lines. */
.pst-label { display: block; margin-top: 0.5rem; font-weight: 500; text-wrap: balance; }
.pst-caption { display: block; margin-top: 0.25rem; font-size: 0.875rem; opacity: 0.72; text-wrap: balance; }

/* Screen-reader value is always in the DOM; the animated overlay is aria-hidden
   so assistive tech always announces the correct FINAL number. */
.pst-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* --- Motion: enabled ONLY when BOTH media features are "no-preference". --- */
@media (prefers-reduced-motion: no-preference) and (prefers-reduced-data: no-preference) {
  .pst-tile {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .pst-stats[data-inview='true'] .pst-tile {
    animation: pst-rise 0.66s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: calc(var(--pst-i, 0) * 110ms);
  }
  .pst-tile:hover { transform: translateY(-4px) scale(1); box-shadow: 0 1px 0 oklch(1 0 0 / 0.1) inset, 0 26px 60px -30px oklch(0.82 0.16 205 / 0.5); }
  @keyframes pst-rise {
    from { opacity: 0; transform: translateY(18px) scale(0.985); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
}

/* --- Reduced motion OR reduced data: no animation, final state shown. --- */
@media (prefers-reduced-motion: reduce), (prefers-reduced-data: reduce) {
  .pst-tile { opacity: 1 !important; transform: none !important; animation: none !important; transition: none !important; }
}
`;

/**
 * Reads the two "no-preference" media queries. When either is unavailable or the
 * user has opted into reduced motion/data, count-up is skipped and final values
 * render immediately. SSR-safe (returns `false` without `window`).
 */
function motionAllowed(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return (
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches &&
    window.matchMedia('(prefers-reduced-data: no-preference)').matches
  );
}

/** Match source precision (4.9 stays 4.9) + locale thousands separators. */
function makeFormatter(value: number) {
  const decimals = Number.isInteger(value) ? 0 : (value.toString().split('.')[1]?.length ?? 1);
  return (x: number) =>
    x.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/**
 * Count-up figure. The FINAL formatted value + suffix is always present in the
 * DOM as `.pst-sr` text (screen-reader correct). A separate `aria-hidden` span
 * paints the animated number. Count-up runs once, on first intersection, and
 * ONLY when {@link motionAllowed} is true — otherwise the final value paints at
 * mount with zero motion.
 */
function StatFigure({ value, suffix = '', durationMs = 1600 }: { value: number; suffix?: string; durationMs?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = makeFormatter(value);
  const finalText = `${format(value)}${suffix}`;
  // Start at the final value so the very first paint (and every no-motion path)
  // is already correct; count-up resets to 0 only when it is actually allowed.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed() || !('IntersectionObserver' in window)) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    let started = false;
    setDisplay(0);
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          setDisplay(t < 1 ? ease(t) * value : value);
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
    <span ref={ref} className="pst-figure">
      <span className="pst-sr">{finalText}</span>
      <span aria-hidden="true">
        {format(display)}
        <span className="pst-suffix">{suffix}</span>
      </span>
    </span>
  );
}

export function Stats({ stats, eyebrow, headline, columns, className }: Props) {
  const safeEyebrow = scrubText(eyebrow);
  const safeHeadline = scrubText(headline);
  // Drop stats whose label is an unresolved token; scrub the optional caption.
  const safeStats = stats
    .map((s) => ({ ...s, label: scrubText(s.label), caption: scrubText(s.caption) || undefined }))
    .filter((s) => s.label.length > 0);

  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  // Toggle the entrance-stagger only once the band scrolls in, and only when
  // motion is allowed (otherwise tiles are shown immediately by the CSS gate).
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !motionAllowed() || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (safeStats.length === 0) return null;
  const cols = columns ?? (Math.min(4, Math.max(2, safeStats.length)) as 2 | 3 | 4);

  return (
    <section
      ref={rootRef}
      data-inview={inView ? 'true' : 'false'}
      className={cn('pst-stats py-20 md:py-28 max-w-container-wide mx-auto px-6', className)}
    >
      <style>{SCOPED_CSS}</style>
      {(safeEyebrow || safeHeadline) && (
        <div className="text-center mb-12">
          {safeEyebrow && <span className="text-accent text-sm font-mono tracking-widest uppercase">{safeEyebrow}</span>}
          {safeHeadline && (
            <h2 className="text-3xl md:text-5xl font-bold font-heading mt-4 text-text">{safeHeadline}</h2>
          )}
        </div>
      )}
      <dl className={cn('pst-grid', COLS[cols])}>
        {safeStats.map((s, i) => (
          <div
            key={`${s.label}-${i}`}
            style={{ '--pst-i': i } as CSSProperties}
            className="pst-tile"
          >
            {/*
              WCAG: <dl> direct children must only be <dt>/<dd>/<div>/<script>/<template>.
              When <div> wraps a row, its children must be only <dt> + <dd>.
              We keep the sr-only <dt> for screen readers and put the visible
              label inside the <dd> alongside the number.
            */}
            <dt className="pst-sr">{s.label}</dt>
            <dd>
              <StatFigure value={s.value} suffix={s.suffix} />
              <span aria-hidden="true" className="pst-underline" />
              <span className="pst-label text-text">{s.label}</span>
              {s.caption && <span className="pst-caption text-text-subtle">{s.caption}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default Stats;
