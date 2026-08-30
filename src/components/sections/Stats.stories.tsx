import type { Meta, StoryObj } from '@storybook/react';
import { Stats } from './Stats';

/**
 * `Stats` — the rolling-counter / key-metrics band on generated homepages.
 * Column count is derived from `stats.length` (capped at 4) unless `columns` is set.
 *
 * Cinematic layer (fully component-scoped, `.pst-` class prefix, base state
 * always shows the final value):
 * - Scroll-triggered **count-up** from 0 → target on first view (precision + locale
 *   separators preserved; prefix/suffix like `$`, `+`, `%`, `k` kept verbatim).
 * - **OKLCH accent gradient** on the numerals + soft aura, accent hairline / glass tiles.
 * - Per-stat **entrance stagger** keyed on the inline `--pst-i`, `clamp()` fluid number
 *   sizing, `text-wrap: balance` on labels.
 *
 * All motion is **double-gated**: count-up + stagger run only when both
 * `prefers-reduced-motion: no-preference` AND `prefers-reduced-data: no-preference`
 * hold. When either is reduced, the final values render immediately with zero motion.
 * The final value is always in the DOM as text, so screen readers stay correct.
 */
const meta = {
  title: 'Sections/Stats',
  component: Stats,
} satisfies Meta<typeof Stats>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — the four-stat practice band shown on most generated homepages. */
export const PracticeMetrics: Story = {
  args: {
    eyebrow: 'By the numbers',
    headline: 'Trusted by families since 2004',
    stats: [
      { value: 25000, suffix: '+', label: 'Patients treated', caption: 'and counting' },
      { value: 4.9, label: 'Average rating', caption: 'across 600+ reviews' },
      { value: 20, suffix: 'yrs', label: 'Serving the community' },
      { value: 98, suffix: '%', label: 'Would recommend us' },
    ],
  },
};

/** Minimal — a tight, headline-less three-stat set (auto 3-column). */
export const MinimalThreeStat: Story = {
  args: {
    stats: [
      { value: 15, suffix: 'min', label: 'Average wait time' },
      { value: 12, suffix: 'k', label: 'Appointments booked online' },
      { value: 0, label: 'Surprise bills', caption: 'transparent pricing, always' },
    ],
  },
};

/** Two-column layout with a leading-zero stat. */
export const TwoColumn: Story = {
  args: {
    columns: 2,
    stats: [
      { value: 15, suffix: 'min', label: 'Average wait time' },
      { value: 0, label: 'Surprise bills', caption: 'transparent pricing, always' },
    ],
  },
};

/** Exercises the prefix/suffix + precision paths ($, decimals, big separators). */
export const PrecisionAndSeparators: Story = {
  args: {
    eyebrow: 'Precision check',
    headline: 'Decimals, currency, and big numbers render correctly',
    stats: [
      { value: 4.9, label: 'Average rating' },
      { value: 1250000, suffix: '+', label: 'Meals served' },
      { value: 2, suffix: 'M raised', label: 'For local causes' },
      { value: 99.9, suffix: '%', label: 'Uptime' },
    ],
  },
};
