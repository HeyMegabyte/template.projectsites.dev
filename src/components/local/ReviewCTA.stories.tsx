import type { Meta, StoryObj } from '@storybook/react';
import ReviewCTA from './ReviewCTA';

/**
 * `ReviewCTA` — a smart review gate: 4-5 stars route to a public Google review, 1-3 stars open a
 * private feedback form (protects the public rating while capturing the signal). A `card-tactile`
 * panel over a soft OKLCH accent aura; the star badge carries an accent ring, the picker stars glow
 * + spring on hover, and the card reveals on scroll. Legible on both light and dark verticals.
 */
const meta = {
  title: 'Local/ReviewCTA',
  component: ReviewCTA,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ReviewCTA>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — click 4-5 stars to route to Google, 1-3 to reveal the private feedback form. */
export const StarGate: Story = {
  args: {
    placeId: 'ChIJexampleplaceid',
    businessName: 'Ironwood Landscaping',
  },
};

/** With a QR code for in-person review capture (table tents, receipts). */
export const WithQrCode: Story = {
  args: {
    placeId: 'ChIJexampleplaceid',
    businessName: 'Ironwood Landscaping',
    qrCodeSrc:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112"><rect width="112" height="112" fill="white"/><rect x="12" y="12" width="88" height="88" fill="black"/><rect x="24" y="24" width="64" height="64" fill="white"/></svg>',
  },
};
