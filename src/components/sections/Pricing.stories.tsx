import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { Pricing } from './Pricing';

/**
 * `Pricing` — monthly/yearly toggle, featured-tier highlight, per-tier Product
 * JSON-LD. The featured tier stands proud (accent ring, subtle scale-up, glass
 * wash + soft OKLCH glow + drifting aura + a slow-rotating conic accent halo) so
 * the eye lands there first; every card lifts + reveals an accent hairline on
 * hover/focus-within, and its feature rows STAGGER in top-to-bottom; the amount
 * is fluid (`clamp()`), tier names use `text-wrap: balance`, and on toggle flip
 * the price scales + un-blurs as it settles while the `/period` suffix
 * crossfades; the grid staggers in on scroll. All motion is double-gated behind
 * `prefers-reduced-motion` + `prefers-reduced-data` and every CTA carries a
 * keyboard-visible accent ring. Wrapped in a router (CTAs are `<Link>`).
 */
const meta = {
  title: 'Sections/Pricing',
  component: Pricing,
  parameters: {
    a11y: { config: { rules: [] } },
  },
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

/**
 * Two-tier, no toggle — a single featured tier so the accent ring, scale-up,
 * glass wash and aura read in isolation. Hover either card to see the lift +
 * hairline; tab to a CTA to see the keyboard-visible ring.
 */
export const FeaturedHighlight: Story = {
  args: {
    eyebrow: 'Membership',
    headline: 'One plan, everything included',
    description: 'No usage tiers, no surprises — pick monthly or annual and go.',
    showToggle: false,
    tiers: [
      {
        id: 'basic',
        name: 'Basic',
        description: 'The essentials to get online.',
        monthly: 19,
        yearly: 190,
        features: ['1 site', 'SSL + hosting', 'Email support'],
        cta: { label: 'Get started', href: '/contact' },
      },
      {
        id: 'pro',
        name: 'Pro',
        description: 'Everything, unlocked.',
        monthly: 39,
        yearly: 390,
        features: [
          'Unlimited sites',
          'Priority AI generation',
          'Custom domains',
          'Analytics + SEO suite',
          'White-glove support',
        ],
        featured: true,
        badge: 'Best value',
        cta: { label: 'Go Pro', href: '/contact' },
      },
    ],
  },
};

/**
 * Long feature list on the featured tier — hover (or tab into) the "Enterprise"
 * card to watch the checkmarks stagger in top-to-bottom (keyed on `--pce-fi`),
 * and the conic accent ring rotate behind it. Flip the toggle to see the amount
 * scale + un-blur as it settles.
 */
export const ManyFeatures: Story = {
  args: {
    eyebrow: 'Pricing',
    headline: 'Everything you need to scale',
    description: 'Rich feature lists show the per-card staggered reveal on hover.',
    tiers: [
      {
        id: 'team',
        name: 'Team',
        description: 'For focused teams shipping fast.',
        monthly: 29,
        yearly: 290,
        features: ['5 seats included', '250k events / mo', 'Dashboards', 'Slack alerts'],
        cta: { label: 'Start trial', href: '/contact' },
      },
      {
        id: 'enterprise',
        name: 'Enterprise Platform',
        description: 'Everything, at organization scale.',
        monthly: 499,
        yearly: 4790,
        features: [
          'Unlimited seats',
          '50M events / mo',
          'Session replay + heatmaps',
          'Funnels, cohorts & retention',
          'SSO / SAML + SCIM',
          'Audit logs + data residency',
          'Dedicated success manager',
          '99.99% uptime SLA',
        ],
        featured: true,
        badge: 'Most popular',
        cta: { label: 'Contact sales', href: '/contact' },
      },
    ],
  },
};
