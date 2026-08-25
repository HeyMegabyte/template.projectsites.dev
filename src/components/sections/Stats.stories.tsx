import type { Meta, StoryObj } from '@storybook/react';
import { Stats } from './Stats';

/**
 * `Stats` — animated count-up metrics in a responsive grid. Column count is
 * derived from `stats.length` (capped at 4) unless `columns` is set.
 */
const meta = {
  title: 'Sections/Stats',
  component: Stats,
} satisfies Meta<typeof Stats>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const TwoColumn: Story = {
  args: {
    columns: 2,
    stats: [
      { value: 15, suffix: 'min', label: 'Average wait time' },
      { value: 0, label: 'Surprise bills', caption: 'transparent pricing, always' },
    ],
  },
};

/** Locks in decimal precision (4.9 never rounds to 5) + locale thousands separators. */
export const PrecisionAndSeparators: Story = {
  args: {
    eyebrow: 'Precision check',
    headline: 'Decimals and big numbers render correctly',
    stats: [
      { value: 4.9, label: 'Average rating' },
      { value: 1250000, suffix: '+', label: 'Meals served' },
      { value: 99.9, suffix: '%', label: 'Uptime' },
    ],
  },
};
