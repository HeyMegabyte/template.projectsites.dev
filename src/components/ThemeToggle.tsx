import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

type Mode = 'dark' | 'light' | 'auto';
const ORDER: Mode[] = ['dark', 'light', 'auto'];
const STORAGE_KEY = 'projectsites:theme';

/**
 * Theme cycle toggle (dark → light → auto) with a delightful micro-interaction:
 * the three glyphs are stacked and cross-fade + rotate + scale into place as the
 * mode changes (only the active one is opaque + upright), the button springs on
 * press, and it carries an accent focus ring for keyboard users.
 *
 * Behavior is unchanged from before: it reads the stored/inline theme on mount,
 * writes `document.documentElement.dataset.theme`, and persists to localStorage.
 * All motion is gated behind `prefers-reduced-motion` via the `.theme-toggle`
 * CSS (base states are fully legible), so reduced-motion users get an instant
 * swap. `aria-label` announces the current mode + action; `aria-pressed`
 * reflects whether a non-system theme is forced.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = useState<Mode>('dark');

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Mode | null) ?? (document.documentElement.dataset.theme as Mode) ?? 'dark';
    setMode(stored);
    document.documentElement.dataset.theme = stored;
  }, []);

  function cycle() {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    setMode(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* private mode */ }
  }

  return (
    <button
      type="button"
      onClick={cycle}
      data-mode={mode}
      className={`theme-toggle relative h-10 w-10 rounded-full border border-border bg-surface hover:bg-surface-elevated flex items-center justify-center text-text ${className ?? ''}`}
      aria-label={`Theme: ${mode}. Click to cycle.`}
      aria-pressed={mode !== 'auto'}
      title={`Theme: ${mode}`}
    >
      {/* Stacked glyphs — the active one is opaque + upright, the others fade,
          rotate, and scale away. `.theme-toggle` CSS keys the active glyph off
          the button's `data-mode`. Decorative: the label lives on the button. */}
      <span className="theme-toggle__glyphs" aria-hidden="true">
        <Sun className="theme-toggle__icon" data-for="light" size={18} strokeWidth={2.25} />
        <Moon className="theme-toggle__icon" data-for="dark" size={18} strokeWidth={2.25} />
        <Monitor className="theme-toggle__icon" data-for="auto" size={18} strokeWidth={2.25} />
      </span>
    </button>
  );
}

export default ThemeToggle;
