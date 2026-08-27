import type { Meta, StoryObj } from '@storybook/react';
import ServiceCards from './ServiceCards';

/**
 * `ServiceCards` — a responsive grid of service tiles with an optional image,
 * price, and "Book Now" link. Theme-token `card-tactile` glass that lifts to an
 * accent border on hover; the image Ken-Burns-zooms and the grid reveals on
 * scroll. Legible on both light and dark verticals.
 */
const meta = {
  title: 'Local/ServiceCards',
  component: ServiceCards,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ServiceCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImagesAndPrices: Story = {
  args: {
    heading: 'What we do',
    services: [
      {
        name: 'AC Repair & Tune-Up',
        description: 'Fast, honest diagnostics and lasting fixes to keep your home cool all summer.',
        image:
          'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        price: 'From $89',
        bookingUrl: '#',
      },
      {
        name: 'Furnace Installation',
        description: 'Efficient, code-compliant heating systems sized right for your space.',
        image:
          'https://images.unsplash.com/photo-1631545806609-24f2b568d2e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
        price: 'Free quote',
        bookingUrl: '#',
      },
      {
        name: '24/7 Emergency Service',
        description: 'When something fails after hours, we are ready with same-day help.',
        price: 'Same day',
      },
    ],
  },
};

/** No images or prices — copy-only tiles still read cleanly. */
export const CopyOnly: Story = {
  args: {
    heading: 'Our programs',
    services: [
      { name: 'Food assistance', description: 'Weekly groceries and hot meals for neighbors in need.' },
      { name: 'Youth mentoring', description: 'After-school programs that keep kids learning and supported.' },
      { name: 'Emergency support', description: 'Rapid help for families facing an unexpected crisis.' },
    ],
  },
};
