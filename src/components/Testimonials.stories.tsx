import type { Meta, StoryObj } from '@storybook/react';
import Testimonials from './Testimonials';

/**
 * `Testimonials` — a wall of proof. Cards sit on glass with an accent ring +
 * glow on hover, two motion-gated aurora glows drift behind them, and the
 * heading uses a fluid `clamp()` scale. Emits `AggregateRating` JSON-LD from
 * the supplied ratings, so `itemName` is required.
 */
const meta = {
  title: 'Components/Testimonials',
  component: Testimonials,
} satisfies Meta<typeof Testimonials>;

export default meta;
type Story = StoryObj<typeof meta>;

const reviews = [
  {
    name: 'Maria Alvarez',
    role: 'Homeowner',
    company: 'Cedar Park',
    quote:
      'They diagnosed the AC issue in ten minutes and had cool air back the same afternoon. Straight pricing, no upsell.',
    rating: 5,
  },
  {
    name: 'James Whitfield',
    role: 'Property Manager',
    company: 'Whitfield Rentals',
    quote:
      'I manage twelve units and these are the only folks I trust for after-hours calls. Fast, tidy, and always on time.',
    rating: 5,
  },
  {
    name: 'Dana Cole',
    role: 'Restaurant Owner',
    quote:
      'Our walk-in went down on a Friday. They had a tech onsite within the hour and saved a weekend of inventory.',
    rating: 4,
  },
];

export const ThreeReviews: Story = {
  args: {
    itemName: 'Summit HVAC',
    eyebrow: 'Testimonials',
    headline: 'What our neighbors say',
    testimonials: reviews,
  },
};

/** Single review still renders a valid card + aggregate rating. */
export const SingleReview: Story = {
  args: {
    itemName: 'Summit HVAC',
    testimonials: [reviews[0]],
  },
};
