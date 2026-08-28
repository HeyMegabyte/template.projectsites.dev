import type { Meta, StoryObj } from '@storybook/react';
import TrustBadges from './TrustBadges';

/**
 * `TrustBadges` — a compact social-proof strip (Google rating + credential badges). A subtle
 * glass band framed by faint accent hairlines; each item fades up staggered on load, the rating
 * stars carry a soft glow, and every badge lifts a touch with an accent-tinted icon on hover.
 * Legible on both light and dark verticals.
 */
const meta = {
  title: 'Local/TrustBadges',
  component: TrustBadges,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TrustBadges>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rating + icon credential badges. */
export const RatingAndBadges: Story = {
  args: {
    rating: 4.9,
    reviewCount: 214,
    badges: [
      { label: 'Licensed & Insured', icon: 'shield' },
      { label: 'Best of 2025', icon: 'award', value: 'Best of Bend 2025' },
      { label: 'Top Rated', icon: 'star' },
    ],
  },
};

/** Badges only — no rating block. */
export const BadgesOnly: Story = {
  args: {
    badges: [
      { label: 'Family Owned', icon: 'shield' },
      { label: '20+ Years', icon: 'award', value: '20+ Years Serving Vermont' },
    ],
  },
};
