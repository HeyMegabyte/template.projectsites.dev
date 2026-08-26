import type { Meta, StoryObj } from '@storybook/react';
import StatRollup from './StatRollup';

/**
 * `StatRollup` — a rolling metric strip. Each figure counts up when the strip
 * scrolls into view, carries a persistent OKLCH accent glow + a draw-in accent
 * tick, and the tiles stagger in. The count-up is decorative: animated digits are
 * `aria-hidden` and each tile exposes an `aria-label` with the *final* value, so
 * screen readers announce the real number and `prefers-reduced-motion` users see
 * it instantly. Theme tokens only — reads on light and dark verticals alike.
 */
const meta = {
  title: 'Components/StatRollup',
  component: StatRollup,
} satisfies Meta<typeof StatRollup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PracticeMetrics: Story = {
  args: {
    eyebrow: 'By the numbers',
    headline: 'Trusted by families since 2004',
    stats: [
      { value: 25000, suffix: '+', label: 'Patients treated', description: 'and counting' },
      { value: 20, suffix: 'yrs', label: 'Serving the community' },
      { value: 98, suffix: '%', label: 'Would recommend us' },
      { value: 600, suffix: '+', label: 'Five-star reviews' },
    ],
  },
};

/** Prefix + suffix formatting (currency, multipliers). */
export const RevenueImpact: Story = {
  args: {
    eyebrow: 'Impact',
    headline: 'Results our clients feel',
    stats: [
      { value: 4, prefix: '$', suffix: 'M', label: 'Revenue influenced' },
      { value: 3, suffix: 'x', label: 'Average conversion lift', description: 'vs. their prior site' },
      { value: 40, suffix: '%', label: 'Lower bounce rate' },
    ],
  },
};
