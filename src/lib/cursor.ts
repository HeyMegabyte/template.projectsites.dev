// Click-ripple-only cursor system. Native cursor stays visible.
// Cursor-ring removed 2026-05-02 — felt clingy, hurt accessibility, fought OS cursor themes.
// See ~/.claude/rules/always.md "Every desktop site (CLICK RIPPLE ONLY)".

const RIPPLE_DURATION_MS = 600;

export function initCursorRipple(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const fine = window.matchMedia('(min-width: 768px) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!fine.matches || reducedMotion.matches) return;

  document.addEventListener(
    'pointerdown',
    (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const ripple = document.createElement('span');
      ripple.className = 'cursor-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), RIPPLE_DURATION_MS + 50);
    },
    { passive: true }
  );
}
