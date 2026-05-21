import { cn } from '@/lib/utils';

interface Props {
  /** Color of the progress bar. Default accent. */
  color?: string;
  /** Height of the bar in px. Default 3. */
  height?: number;
  /** Optional className passthrough. */
  className?: string;
}

/**
 * Pure-CSS scroll-progress bar (idea #161).
 *
 * Uses `animation-timeline: scroll(root)` to drive a width animation from 0
 * to 100% across the document scroll. Zero JS, GPU-composited, INP-safe.
 *
 * Falls back to invisible (no JS substitute) on browsers without scroll-driven
 * animations. Acceptable trade-off; the bar is decorative.
 *
 * Mount once in Layout.tsx near the top of <body>.
 */
export function ScrollProgress({ color = 'var(--color-accent)', height = 3, className }: Props) {
  return (
    <>
      <div
        aria-hidden="true"
        className={cn('fixed top-0 left-0 right-0 z-40 origin-left scroll-progress', className)}
        style={{ height, background: color }}
      />
      <style>{`
        .scroll-progress {
          transform: scaleX(0);
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
