import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  /** Magnetic strength — how much the button nudges toward cursor (0-1). Default 0.3. */
  strength?: number;
  /** Pixels of cursor radius that triggers the effect. Default 80. */
  radius?: number;
}

/**
 * Magnetic button — nudges toward the cursor on hover (idea #162).
 *
 *   - Only active on `(pointer: fine) and (prefers-reduced-motion: no-preference)`
 *   - GPU-composited transform — no layout reflow
 *   - Resets smoothly on pointer leave
 *
 * Use sparingly on hero CTAs + featured pricing cards. Heavy use feels gimmicky.
 */
export function MagneticButton({
  children,
  strength = 0.3,
  radius = 80,
  className,
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = ref.current;
    if (!btn) return;
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) return;
      const factor = 1 - dist / radius;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        btn.style.transform = `translate(${dx * strength * factor}px, ${dy * strength * factor}px)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      btn.style.transform = '';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    btn.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      btn.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength, radius]);

  return (
    <button
      ref={ref}
      className={cn('magnetic-btn transition-transform duration-200', className)}
      style={{ willChange: 'transform' }}
      {...rest}
    >
      {children}
    </button>
  );
}

export default MagneticButton;
