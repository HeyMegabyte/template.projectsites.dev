import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { HeroSplit } from './HeroVariants';

/**
 * `HeroSplit` — asymmetric cinematic hero (copy left, LCP photo right). Named
 * export from `HeroVariants.tsx`. Requires an `image`; uses `react-router-dom`
 * `<Link>` for its CTAs, so stories wrap it in a `MemoryRouter`.
 *
 * Cinematic layer (all decorative + motion-gated behind `prefers-reduced-motion`):
 * a drifting OKLCH accent **aurora** + fine **grain** behind the copy, a
 * `clamp()` **fluid headline** scale, a staggered `@starting-style` **entrance**
 * on eyebrow → headline → subhead → CTA, an accent **ring/glow + vignette** framing
 * the photo, and a **scroll cue**. The hero `<img>` stays the eager,
 * high-priority LCP element — the overlays never outrank it.
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
    // The aurora + scroll cue are gated to the split layout, so this proves the
    // no-photo hero stays clean.
    image: { src: '', alt: '' },
  },
};

/**
 * Renders on a LIGHT vertical (`data-theme="light"`) to prove the aurora, grain,
 * ring/glow, and gradient headline all stay legible + on-brand without any
 * hardcoded white — the theme tokens flip for free.
 */
export const LightVertical: Story = {
  decorators: [
    (Story) => (
      <div data-theme="light" className="bg-background">
        <Story />
      </div>
    ),
  ],
  args: {
    eyebrow: 'Peak Ridge Wealth Advisors',
    headline: 'Retire on your terms, not the market’s',
    subheadline:
      'Fee-only fiduciary planning with a dedicated advisor, transparent pricing, and a plan you can actually read. Book a free 30-minute strategy call.',
    primary: { label: 'Book a strategy call', href: '/contact' },
    secondary: { label: 'See our approach', href: '/services' },
    image: {
      src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      alt: 'Advisory team reviewing a financial plan together at a bright table',
    },
    trustBadges: [
      { icon: 'shield', label: 'Fee-only fiduciary' },
      { icon: 'award', label: 'CFP® professionals' },
      { icon: 'star', label: '4.9 across 300+ client reviews' },
    ],
  },
};
