import type { Meta, StoryObj } from '@storybook/react';
import { LogoCloud } from './LogoCloud';

/**
 * `LogoCloud` — cinematic "trusted by" / partner logo strip. Two variants:
 * `marquee` (default, infinite scroll) and `grid` (static responsive grid).
 *
 * Cinematic layer (all motion-gated behind `prefers-reduced-motion`): each logo
 * sits **desaturated + dimmed** and lifts to **full color + full opacity** on
 * hover/focus; grid logos **stagger-reveal** on scroll; a hair-thin **OKLCH
 * accent divider** frames the strip. Missing logo files fall back to styled
 * wordmarks so the strip never has gaps. Calm + tasteful by design.
 */
const meta = {
  title: 'Sections/LogoCloud',
  component: LogoCloud,
} satisfies Meta<typeof LogoCloud>;

export default meta;
type Story = StoryObj<typeof meta>;

const WORDMARKS = [
  { name: 'Northwind' },
  { name: 'Contoso' },
  { name: 'Fabrikam' },
  { name: 'Tailspin' },
  { name: 'Proseware' },
  { name: 'Adventure Works' },
];

/** Default infinite-scroll marquee with wordmark fallbacks (no image files). */
export const Marquee: Story = {
  args: {
    eyebrow: 'Trusted by',
    headline: 'Teams that ship with us',
    variant: 'marquee',
    logos: WORDMARKS,
  },
};

/** Static responsive grid — proves the per-logo scroll-reveal stagger + rules. */
export const Grid: Story = {
  args: {
    eyebrow: 'As seen in',
    headline: 'Featured by leading publications',
    variant: 'grid',
    logos: WORDMARKS,
  },
};

/**
 * A LIGHT vertical (`data-theme="light"`) — proves the grayscale→color hover,
 * the OKLCH accent divider, and the wordmarks all stay legible + on-brand on a
 * light canvas (no hardcoded white).
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
    eyebrow: 'Trusted by',
    headline: 'Local businesses that grew with us',
    variant: 'grid',
    logos: WORDMARKS,
  },
};

/** No eyebrow / headline — a bare, calm strip that leads straight with logos. */
export const BareStrip: Story = {
  args: {
    variant: 'marquee',
    logos: WORDMARKS,
  },
};
