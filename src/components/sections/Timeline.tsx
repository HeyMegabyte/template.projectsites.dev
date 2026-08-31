import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  link?: { href: string; label: string };
  image?: string;
  imageAlt?: string;
}

interface Props {
  events: TimelineEvent[];
  eyebrow?: string;
  headline?: string;
  description?: string;
  className?: string;
  /** Direction the timeline grows. Default `vertical`. */
  orientation?: 'vertical' | 'horizontal';
}

/**
 * Component-scoped cinematic styles. Every class is prefixed `.tl-` so it never
 * collides with global/shared styles. ALL motion is DOUBLE-gated: the scroll-drawn
 * accent rail, the per-event entrance stagger, the node "pop" pulse, and the hover
 * lift run ONLY when both `prefers-reduced-motion: no-preference` AND
 * `prefers-reduced-data: no-preference` hold. When either is reduced, every event is
 * shown in its final state with zero motion (mirrored in the JS gate + a CSS reset),
 * and the rail renders fully drawn — so the section is always legible and complete.
 *
 * Cinematic layer:
 * - OKLCH accent gradient rail (cyan → violet) that DRAWS DOWN on scroll via a
 *   `scaleY` scroll-timeline, with a soft travelling glow.
 * - Per-event entrance stagger keyed on the inline `--tl-i`, plus a node that
 *   pops in with an expanding accent pulse ring.
 * - `clamp()` fluid year/title sizing, `text-wrap: balance` headings /
 *   `text-wrap: pretty` copy, glass hover-lift on horizontal cards.
 */
const SCOPED_CSS = `
.tl-root { --tl-accent: oklch(0.82 0.16 205); --tl-accent-2: oklch(0.72 0.19 285); }

/* ---------- Vertical rail ---------- */
.tl-list { position: relative; margin: 0; padding: 0 0 0 2.25rem; list-style: none; }
/* The static base rail — always visible, low-opacity guide line. */
.tl-list::before {
  content: '';
  position: absolute;
  left: 0; top: 0.35rem; bottom: 0.35rem;
  width: 2px;
  border-radius: 9999px;
  background: linear-gradient(180deg, oklch(1 0 0 / 0.14), oklch(1 0 0 / 0.05));
}
/* The bright accent rail that draws down over the base line on scroll. */
.tl-list::after {
  content: '';
  position: absolute;
  left: 0; top: 0.35rem; bottom: 0.35rem;
  width: 2px;
  border-radius: 9999px;
  transform-origin: top;
  background: linear-gradient(180deg, var(--tl-accent), var(--tl-accent-2) 70%, transparent);
  box-shadow: 0 0 12px -1px oklch(0.82 0.16 205 / 0.55);
}

.tl-item { position: relative; padding-bottom: 2.5rem; }
.tl-item:last-child { padding-bottom: 0; }

/* Node marker sitting on the rail. */
.tl-node {
  position: absolute;
  left: calc(-2.25rem - 1px);
  top: 0.4rem;
  transform: translateX(-50%);
  height: 1rem; width: 1rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, var(--tl-accent), var(--tl-accent-2));
  box-shadow: 0 0 0 4px var(--color-background, #060610), 0 0 14px -1px oklch(0.82 0.16 205 / 0.7);
}

.tl-year {
  display: inline-block;
  font-size: clamp(0.8rem, 0.72rem + 0.3vw, 0.95rem);
  letter-spacing: 0.18em;
  font-variant-numeric: tabular-nums;
}
.tl-title {
  margin: 0.35rem 0 0.6rem;
  font-weight: 800;
  letter-spacing: -0.015em;
  line-height: 1.1;
  font-size: clamp(1.15rem, 1rem + 0.8vw, 1.6rem);
  text-wrap: balance;
}
.tl-desc { line-height: 1.65; text-wrap: pretty; }
.tl-fig { margin: 1rem 0; max-width: 28rem; }
.tl-fig img { border-radius: 12px; border: 1px solid oklch(1 0 0 / 0.1); }

/* ---------- Horizontal cards ---------- */
.tl-track { display: flex; gap: 1.5rem; overflow-x: auto; padding-bottom: 1rem; scroll-snap-type: x mandatory; }
.tl-card {
  position: relative;
  min-width: 280px;
  scroll-snap-align: start;
  padding: 1.5rem;
  border-radius: 18px;
  border: 1px solid oklch(1 0 0 / 0.08);
  background: linear-gradient(180deg, oklch(1 0 0 / 0.05), oklch(1 0 0 / 0.015));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 1px 0 oklch(1 0 0 / 0.06) inset, 0 18px 44px -30px oklch(0 0 0 / 0.85);
}
.tl-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--tl-accent), transparent);
  opacity: 0.6;
}

/* --- Motion: enabled ONLY when BOTH media features are "no-preference". --- */
@media (prefers-reduced-motion: no-preference) and (prefers-reduced-data: no-preference) {
  /* Rail draws down as the list scrolls through the viewport. */
  .tl-list::after {
    transform: scaleY(0);
    animation: tl-draw linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 60%;
  }
  @keyframes tl-draw { to { transform: scaleY(1); } }

  /* Entrance stagger — toggled by the JS IntersectionObserver on the root. */
  .tl-item { opacity: 0; transform: translateY(18px); }
  .tl-root[data-inview='true'] .tl-item {
    animation: tl-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: calc(var(--tl-i, 0) * 90ms);
  }
  @keyframes tl-rise {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Node pops with an expanding accent pulse ring once the list is in view. */
  .tl-node { transform: translateX(-50%) scale(0); }
  .tl-root[data-inview='true'] .tl-node {
    animation: tl-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    animation-delay: calc(var(--tl-i, 0) * 90ms + 60ms);
  }
  @keyframes tl-pop { to { transform: translateX(-50%) scale(1); } }
  .tl-node::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 9999px;
    border: 1px solid var(--tl-accent);
  }
  .tl-root[data-inview='true'] .tl-node::after {
    animation: tl-ring 1.4s ease-out both;
    animation-delay: calc(var(--tl-i, 0) * 90ms + 220ms);
  }
  @keyframes tl-ring {
    from { opacity: 0.7; transform: scale(0.6); }
    to   { opacity: 0; transform: scale(2.4); }
  }

  .tl-item:hover .tl-node { box-shadow: 0 0 0 4px var(--color-background, #060610), 0 0 22px 0 oklch(0.82 0.16 205 / 0.8); }
  .tl-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .tl-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 1px 0 oklch(1 0 0 / 0.1) inset, 0 26px 60px -30px oklch(0.82 0.16 205 / 0.5);
  }
}

/* --- Reduced motion OR reduced data: static, final state, rail fully drawn. --- */
@media (prefers-reduced-motion: reduce), (prefers-reduced-data: reduce) {
  .tl-list::after { transform: none !important; animation: none !important; }
  .tl-item { opacity: 1 !important; transform: none !important; animation: none !important; }
  .tl-node { transform: translateX(-50%) !important; animation: none !important; }
  .tl-node::after { display: none !important; }
  .tl-card { transform: none !important; transition: none !important; }
}
`;

/**
 * Reads the two "no-preference" media queries. When either is unavailable or the
 * user has opted into reduced motion/data, the entrance-stagger is skipped and every
 * event renders in its final state. SSR-safe (returns `false` without `window`).
 */
function motionAllowed(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return (
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches &&
    window.matchMedia('(prefers-reduced-data: no-preference)').matches
  );
}

/**
 * Historical timeline section.
 *
 * For real historical content with dated events, use `image` carefully —
 * see `~/.claude/rules/always.md` rule "Every historical timeline" — only
 * primary-source photos (Wikimedia Commons, Library of Congress, NPGallery,
 * archive material). Never AI-generated or "evocative" stock next to a
 * dated event. Blank entry > faked entry.
 *
 * Cinematic layer is fully component-scoped (`.tl-` prefix) and double-gated —
 * see {@link SCOPED_CSS}. The base (no-motion) state always shows every event and
 * a fully-drawn accent rail, so nothing is hidden behind an un-fired animation.
 */
export function Timeline({
  events,
  eyebrow,
  headline,
  description,
  orientation = 'vertical',
  className,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  // Toggle the entrance-stagger only once the band scrolls in, and only when
  // motion is allowed (otherwise items are shown immediately by the CSS gate).
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
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (events.length === 0) return null;

  return (
    <section
      ref={rootRef}
      data-inview={inView ? 'true' : 'false'}
      className={cn('tl-root py-24 md:py-32 max-w-container-normal mx-auto px-6', className)}
    >
      <style>{SCOPED_CSS}</style>
      {(eyebrow || headline) && (
        <div className="text-center mb-16 reveal-on-view">
          {eyebrow && <span className="text-accent text-sm font-mono tracking-widest uppercase">{eyebrow}</span>}
          {headline && (
            <h2 className="text-balance text-3xl md:text-5xl font-bold font-heading mt-4 mb-4 text-text">{headline}</h2>
          )}
          {description && <p className="text-pretty text-text-muted max-w-2xl mx-auto">{description}</p>}
        </div>
      )}

      {orientation === 'vertical' ? (
        <ol className="tl-list">
          {events.map((e, i) => (
            <li key={`${e.year}-${i}`} className="tl-item" style={{ '--tl-i': i } as CSSProperties}>
              <span aria-hidden="true" className="tl-node" />
              <time className="tl-year font-mono text-accent" dateTime={e.year}>
                {e.year}
              </time>
              <h3 className="tl-title text-text font-heading">{e.title}</h3>
              {e.image && (
                <figure className="tl-fig">
                  <img src={e.image} alt={e.imageAlt ?? ''} loading="lazy" />
                </figure>
              )}
              <p className="tl-desc text-text-muted">{e.description}</p>
              {e.link && (
                <a
                  href={e.link.href}
                  className="inline-block mt-3 text-sm text-accent underline-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded"
                  {...(e.link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {e.link.label} →
                </a>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <ol className="tl-track">
          {events.map((e, i) => (
            <li key={`${e.year}-${i}`} className="tl-card tl-item" style={{ '--tl-i': i } as CSSProperties}>
              <time className="tl-year font-mono text-accent" dateTime={e.year}>
                {e.year}
              </time>
              <h3 className="tl-title text-text font-heading" style={{ fontSize: 'clamp(1.05rem, 0.95rem + 0.5vw, 1.3rem)' }}>
                {e.title}
              </h3>
              <p className="tl-desc text-text-muted text-sm">{e.description}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default Timeline;
