import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { HeroCenter } from './HeroVariants';

/**
 * `HeroCenter` — centered cinematic hero (no image). Named export from
 * `HeroVariants.tsx`; its CTAs use `react-router-dom` `<Link>`, so stories wrap
 * it in a `MemoryRouter`.
 *
 * Cinematic layer (all decorative + motion-gated behind `prefers-reduced-motion`):
 * a single centered OKLCH accent **aura** + slow **conic halo** blooming behind
 * the headline, a token-tinted **masked grid**, a fine **grain** wash, a
 * `clamp()` **fluid gradient headline**, a staggered `@starting-style`
 * **entrance** (eyebrow → headline → subhead → CTAs → trust), refined CTA
 * **lift + accent glow-ring** on hover, and a slim **scroll cue** at the fold.
 * Distinct from `HeroSplit`: symmetric + centered with one centered bloom and no
 * LCP photo — so nothing here competes for the LCP element.
 */
const meta = {
  title: 'Sections/HeroCenter',
  component: HeroCenter,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof HeroCenter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SaaSLaunch: Story = {
  args: {
    eyebrow: 'Now in public beta',
    headline: 'Ship your idea before the coffee gets cold',
    subheadline:
      'Describe what you want in plain English and watch a production-ready site build itself — hosted, fast, and yours in minutes.',
    primary: { label: 'Start building free', href: '/contact' },
    secondary: { label: 'See how it works', href: '/services' },
    trustBadges: [
      { icon: 'star', label: 'Loved by 12,000+ builders' },
      { icon: 'shield', label: 'SOC 2 Type II' },
      { icon: 'award', label: 'Product Hunt #1 of the day' },
    ],
  },
};

/** Minimal variant — no eyebrow, no secondary CTA, no trust row. Proves every
 *  optional block is guarded and the centered composition stays balanced. */
export const HeadlineOnly: Story = {
  args: {
    headline: 'One prompt. A complete website.',
    primary: { label: 'Try it now', href: '/contact' },
  },
};

/**
 * Renders on a LIGHT vertical (`data-theme="light"`) to prove the centered aura,
 * halo, masked grid, grain, and gradient headline all stay legible + on-brand
 * with zero hardcoded white — the theme tokens flip for free.
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
    trustBadges: [
      { icon: 'shield', label: 'Fee-only fiduciary' },
      { icon: 'award', label: 'CFP® professionals' },
      { icon: 'star', label: '4.9 across 300+ client reviews' },
    ],
  },
};
