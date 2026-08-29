import type { Meta, StoryObj } from '@storybook/react';
import HeroWithPhoto from './HeroWithPhoto';

/**
 * `HeroWithPhoto` — a full-bleed photo hero. The image slowly Ken-Burns-drifts behind a
 * theme-aware gradient (dark up top for legible white text, fading to the page background at
 * the bottom), the badge / kinetic clamp() headline / tagline / CTAs cascade in on load, and
 * an animated chevron cues the scroll. All motion is reduced-motion gated.
 */
const meta = {
  title: 'Local/HeroWithPhoto',
  component: HeroWithPhoto,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HeroWithPhoto>;

export default meta;
type Story = StoryObj<typeof meta>;

const IMG =
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?crop=entropy&cs=tinysrgb&fit=max&auto=format&q=80&w=1920';

/** Full hero — rating badge, both CTAs, Ken-Burns image, scroll cue. */
export const FullHero: Story = {
  args: {
    businessName: 'Veranda Wellness & Spa',
    tagline: 'A tranquil retreat for massage, facials, and restorative calm in the heart of Asheville.',
    heroImage: IMG,
    phone: '(828) 555-0173',
    directionsUrl: '#',
    rating: 4.9,
    reviewCount: 214,
  },
};

/** No rating, phone only — headline still leads, gradient keeps the copy legible. */
export const NoRatingPhoneOnly: Story = {
  args: {
    businessName: 'Cardinal Heating & Cooling',
    tagline: 'Reliable, same-day HVAC service done right the first time.',
    heroImage: IMG,
    phone: '(555) 123-4567',
  },
};
