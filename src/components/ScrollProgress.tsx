import { cn } from '@/lib/utils';

interface Props {
  /** Height of the bar in px. Default 3. */
  height?: number;
  /** Optional className passthrough. */
  className?: string;
}

/**
 * Cinematic pure-CSS scroll-progress bar (idea #161).
 *
 * A GPU-composited OKLCH accent → primary → info gradient rides the top edge,
 * driven by `animation-timeline: scroll(root)` so it fills 0 → 100% across the
 * document scroll with **zero JS** (INP-safe, no scroll listener, no jank). A
 * soft accent glow under the bar and a faint leading-edge highlight give it
 * depth without stealing focus.
 *
 * All colors are theme tokens (`--color-accent/-primary/-info`), so it stays
 * gorgeous on light AND dark verticals. Motion is gated behind
 * `prefers-reduced-motion: no-preference`; when scroll-driven animations or
 * motion are unavailable the bar is simply invisible (decorative — acceptable).
 * `aria-hidden` keeps it out of the a11y tree. Mount once in `Layout.tsx`.
 */
export function ScrollProgress({ height = 3, className }: Props) {
  return (
    <>
      <div
        aria-hidden="true"
        className={cn('fixed inset-x-0 top-0 z-40 origin-left scroll-progress', className)}
        style={{ height }}
      />
      <style>{`
        .scroll-progress {
          transform: scaleX(0);
          background: linear-gradient(
            90deg,
            var(--color-accent) 0%,
            var(--color-primary) 55%,
            var(--color-info) 100%
          );
          box-shadow:
            0 0 12px -1px color-mix(in oklch, var(--color-accent) 65%, transparent),
            0 1px 0 0 color-mix(in oklch, var(--color-accent) 30%, transparent);
          will-change: transform;
        }
        /* Faint highlight riding the leading edge for a "wet ink" gleam. */
        .scroll-progress::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          width: 40px;
          background: linear-gradient(
            90deg,
            transparent,
            color-mix(in oklch, var(--color-accent) 90%, white 25%)
          );
          opacity: 0.85;
        }
        @supports (animation-timeline: scroll(root)) {
          @media (prefers-reduced-motion: no-preference) {
            .scroll-progress {
              animation: scroll-progress-grow linear both;
              animation-timeline: scroll(root);
            }
            @keyframes scroll-progress-grow {
              from { transform: scaleX(0); }
              to   { transform: scaleX(1); }
            }
          }
        }
      `}</style>
    </>
  );
}

export default ScrollProgress;
