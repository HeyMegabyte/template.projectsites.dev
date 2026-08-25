import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { Pricing } from './Pricing';

/**
 * `Pricing` — monthly/yearly toggle, featured-tier highlight, per-tier Product
 * JSON-LD. Cards lift on hover; the amount fades+rises when the toggle flips.
 * Wrapped in a router because each CTA renders a `<Link>`.
 */
const meta = {
  title: 'Sections/Pricing',
  component: Pricing,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Pricing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeTier: Story = {
  args: {
    eyebrow: 'Pricing',
    headline: 'Plans that scale with your team',
    description: 'Start free. Upgrade when you grow. Cancel anytime.',
    tiers: [
      {
        id: 'starter',
        name: 'Starter',
        description: 'For side projects and early teams.',
        monthly: 0,
        yearly: 0,
        features: ['Up to 3 projects', '10k events / mo', 'Community support'],
        cta: { label: 'Start free', href: '/contact' },
      },
      {
        id: 'growth',
        name: 'Growth',
        description: 'For growing product teams.',
        monthly: 49,
        yearly: 470,
        features: ['Unlimited projects', '1M events / mo', 'Funnels + cohorts', 'Email support'],
        featured: true,
        badge: 'Most popular',
        cta: { label: 'Start trial', href: '/contact' },
      },
      {
        id: 'scale',
        name: 'Scale',
        description: 'For scaling organizations.',
        monthly: 199,
        yearly: 1900,
        features: ['Everything in Growth', 'Session replay', 'SSO + audit logs', 'Priority support'],
        cta: { label: 'Contact sales', href: '/contact' },
      },
    ],
  },
};
