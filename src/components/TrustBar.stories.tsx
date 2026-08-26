import type { Meta, StoryObj } from '@storybook/react';
import { BadgeCheck, ShieldCheck, Clock, Star, Award, HeartHandshake } from 'lucide-react';
import { TrustBar } from './TrustBar';

/**
 * `TrustBar` — wordless credibility strip that sits directly beneath the hero.
 * Chips stagger-reveal on scroll (motion-gated; fully visible if motion/JS is
 * off), each icon sits in an OKLCH accent ring, and the whole strip carries a
 * grain + accent-wash texture. Pass real numbers via `items`; the fabrication-
 * free vertical-aware defaults render when omitted.
 */
const meta = {
  title: 'Components/TrustBar',
  component: TrustBar,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TrustBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Vertical-aware defaults derived from the current brand fixture. */
export const Defaults: Story = {};

/** Explicit service-promise signals — the shape a real research pass produces. */
export const ServicePromises: Story = {
  args: {
    items: [
      { icon: <BadgeCheck size={16} />, label: 'Free, no-obligation quotes' },
      { icon: <ShieldCheck size={16} />, label: 'Licensed & insured' },
      { icon: <Clock size={16} />, label: 'Same-day response' },
      { icon: <HeartHandshake size={16} />, label: 'Satisfaction guaranteed' },
    ],
  },
};

/** Community-trust variant for non-service verticals. */
export const CommunityTrust: Story = {
  args: {
    items: [
      { icon: <Star size={16} />, label: 'Trusted by our community' },
      { icon: <Award size={16} />, label: 'Experienced & professional' },
      { icon: <Clock size={16} />, label: 'Responsive support' },
    ],
  },
};
