import type { Meta, StoryObj } from '@storybook/react';
import TestimonialCarousel from './TestimonialCarousel';

/**
 * `TestimonialCarousel` — an auto-advancing review carousel. A `card-tactile` glass card
 * over a soft OKLCH accent aura + ghost quote mark; each review crossfades + rises in, the
 * stars pop in staggered, the active dot elongates with an accent glow, and a 5s progress
 * rail fills across the top (pausing on hover/focus). Legible on light and dark verticals.
 */
const meta = {
  title: 'Local/TestimonialCarousel',
  component: TestimonialCarousel,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TestimonialCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const REVIEWS = [
  {
    author: 'Maria Delgado',
    rating: 5,
    text: 'Dr. Okafor took the time to actually listen. Same-day appointment when my son spiked a fever, and the whole family is now seen here. Genuinely the most reassuring care we have had.',
    date: '2 weeks ago',
  },
  {
    author: 'James Whitfield',
    rating: 5,
    text: 'They caught my blood pressure creeping up at a routine physical and set me on a plan before it became a problem. On-site labs meant no second trip. Highly recommend.',
    date: '1 month ago',
  },
  {
    author: 'Priya Nair',
    rating: 4,
    text: 'Telehealth visit was quick and easy, and the front desk sorted out my insurance without any drama. Warm, unhurried, and clearly they know their patients.',
    date: '2 months ago',
  },
];

/** Multiple reviews — auto-advances, progress rail fills, dots elongate. */
export const ThreeReviews: Story = {
  args: { reviews: REVIEWS, googleReviewUrl: '#' },
};

/** Single review — controls, dots, and rail hide; card still floats with the aura + quote. */
export const SingleReview: Story = {
  args: { reviews: [REVIEWS[0]], googleReviewUrl: '#' },
};

/** Empty — invites the first review with a themed CTA. */
export const EmptyWithCta: Story = {
  args: { reviews: [], googleReviewUrl: '#' },
};
