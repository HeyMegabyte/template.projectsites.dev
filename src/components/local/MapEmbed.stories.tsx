import type { Meta, StoryObj } from '@storybook/react';
import MapEmbed from './MapEmbed';

/**
 * `MapEmbed` — the location section: a framed Google Maps embed beside address / phone / today-aware
 * hours. The map frame carries an accent hairline and warms to an accent border on hover, the columns
 * reveal on scroll, the info rows nudge their icon on hover, and today's hours glow with a live pulse
 * dot. `bg-surface` (theme-aware) — fixes the old hardcoded dark band on light verticals.
 */
const meta = {
  title: 'Local/MapEmbed',
  component: MapEmbed,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof MapEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

const HOURS = [
  { day: 'Monday', hours: '9:00 AM – 6:00 PM' },
  { day: 'Tuesday', hours: '9:00 AM – 6:00 PM' },
  { day: 'Wednesday', hours: '9:00 AM – 6:00 PM' },
  { day: 'Thursday', hours: '9:00 AM – 7:00 PM' },
  { day: 'Friday', hours: '9:00 AM – 5:00 PM' },
  { day: 'Saturday', hours: 'By appointment' },
  { day: 'Sunday', hours: 'Closed' },
];

/** Full — map, directions, phone, and a week of hours with today highlighted + pulsing. */
export const FullLocation: Story = {
  args: {
    lat: 37.789,
    lng: -122.4,
    address: '25 Jessie St, San Francisco, CA 94105',
    directionsUrl: '#',
    phone: '(415) 555-0133',
    hours: HOURS,
  },
};

/** Map + address only — no phone or hours. */
export const MapAndAddress: Story = {
  args: {
    lat: 37.789,
    lng: -122.4,
    address: '25 Jessie St, San Francisco, CA 94105',
    directionsUrl: '#',
  },
};
