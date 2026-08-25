import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { HeroSplit } from './HeroVariants';

/**
 * `HeroSplit` — asymmetric hero (copy left, image right). Named export from
 * `HeroVariants.tsx`. Requires an `image`; uses `react-router-dom` `<Link>`
 * for its CTAs, so stories wrap it in a `MemoryRouter`.
 */
const meta = {
  title: 'Sections/HeroSplit',
  component: HeroSplit,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof HeroSplit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DentalPractice: Story = {
  args: {
    eyebrow: 'Serramonte Family Dental',
    headline: 'Gentle, modern dentistry your whole family will love',
    subheadline:
      'Same-day emergency visits, transparent pricing, and a team that remembers your name. Book online in under 60 seconds.',
    primary: { label: 'Book an appointment', href: '/contact' },
    secondary: { label: 'View our services', href: '/services' },
    image: {
      src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
      alt: 'Bright, modern dental treatment room with natural light',
    },
    trustBadges: [
      { icon: 'star', label: '4.9 on Google (600+ reviews)' },
      { icon: 'shield', label: 'Most PPO insurance accepted' },
      { icon: 'award', label: 'Invisalign Diamond Provider' },
    ],
  },
};

export const NoImageCentered: Story = {
  args: {
    eyebrow: 'New patients welcome',
    headline: 'Your best smile starts here',
    subheadline: 'Comprehensive care from a team that treats you like family.',
    primary: { label: 'Schedule now', href: '/contact' },
    // No real image → component renders the copy column full-width + centered.
    image: { src: '', alt: '' },
  },
};
