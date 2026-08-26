import type { Meta, StoryObj } from '@storybook/react';
import { Newsletter } from './Newsletter';

/**
 * `Newsletter` — cinematic signup / lead-magnet section. POSTs to `endpoint`
 * (default `/api/newsletter`); the backend is wired separately. `inline` is the
 * default boxed panel, `bar` is a thin full-width strip, and `badge` adds a
 * lead-magnet pill above the headline.
 *
 * Cinematic layer (all decorative + motion-gated behind `prefers-reduced-motion`):
 * a **glass + grain** panel with a drifting twin-tone OKLCH accent **gradient
 * wash**, a `@starting-style` **entrance** + `reveal-on-view` scroll reveal, a
 * polished input whose mail icon + border warm to **accent on focus** with a
 * visible focus ring, a submit button whose paper-plane nudges on hover, and a
 * success state that swaps to an accent **check chip**. Theme tokens only — the
 * form stays fully accessible (label, `aria-*`, `role="status"` / `role="alert"`).
 */
const meta = {
  title: 'Sections/Newsletter',
  component: Newsletter,
} satisfies Meta<typeof Newsletter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  args: {
    headline: 'Stay in the loop',
    description: 'Monthly insights on modern web, AI, and shipping fast. No spam. Unsubscribe anytime.',
  },
};

/**
 * Lead-magnet variant — a badge pill sits above the headline to advertise the
 * download that gets emailed after opt-in.
 */
export const LeadMagnet: Story = {
  args: {
    badge: 'Free PDF · 28 pages',
    headline: 'The 2026 conversion playbook',
    description: 'Grab the exact checklist we use to turn traffic into booked calls. Sent straight to your inbox.',
  },
};

/**
 * `bar` variant — a thin, edge-to-edge strip that drops into the bottom of a
 * page. Same cinematic wash + focus polish, squared corners.
 */
export const Bar: Story = {
  args: {
    variant: 'bar',
    headline: 'Get the monthly recap',
    description: 'One email. The best of what we shipped and learned.',
  },
};

/**
 * Renders on a LIGHT vertical (`data-theme="light"`) to prove the accent wash,
 * grain, focus ring, and success/error chips all stay legible + on-brand without
 * any hardcoded white — the theme tokens flip for free.
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
    badge: 'Free guide',
    headline: 'Retirement-ready in 5 emails',
    description: 'A short, plain-English series on fee-only planning — no jargon, no sales pitch.',
  },
};
