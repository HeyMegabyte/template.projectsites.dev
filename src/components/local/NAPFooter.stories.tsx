import type { Meta, StoryObj } from '@storybook/react';
import NAPFooter from './NAPFooter';

/**
 * `NAPFooter` — the Name/Address/Phone + hours + social footer with schema.org
 * `LocalBusiness` microdata. An accent hairline traces the top edge over a soft OKLCH wash;
 * the three columns reveal on scroll, contact rows nudge their icon + warm to the accent on
 * hover, today's hours glow with a live pulse dot, and the social chips lift into an accent
 * fill. Legible on both light and dark verticals.
 */
const meta = {
  title: 'Local/NAPFooter',
  component: NAPFooter,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof NAPFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

const HOURS = {
  Monday: '8:00 AM – 5:00 PM',
  Tuesday: '8:00 AM – 5:00 PM',
  Wednesday: '8:00 AM – 5:00 PM',
  Thursday: '8:00 AM – 7:00 PM',
  Friday: '8:00 AM – 4:00 PM',
  Saturday: 'By appointment',
  Sunday: 'Closed',
};

/** Full footer — logo, NAP, a week of hours (today highlighted + pulsing), and social chips. */
export const FullFooter: Story = {
  args: {
    businessName: 'Brightwater Dental Studio',
    address: '915 NW Wall St, Bend, OR 97703',
    phone: '(541) 555-0188',
    email: 'hello@brightwaterdental.com',
    hours: HOURS,
    socialLinks: [
      { platform: 'facebook', url: '#' },
      { platform: 'instagram', url: '#' },
      { platform: 'tiktok', url: '#' },
      { platform: 'youtube', url: '#' },
    ],
  },
};

/** No logo, minimal social — the column layout still balances. */
export const MinimalNoLogo: Story = {
  args: {
    businessName: 'Northshore Family Medicine',
    address: '1420 London Rd, Duluth, MN 55805',
    phone: '(218) 555-0142',
    email: 'care@northshorefammed.com',
    hours: HOURS,
    socialLinks: [{ platform: 'facebook', url: '#' }],
  },
};
