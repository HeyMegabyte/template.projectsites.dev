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
    </>
  );
}

export default ScrollProgress;
