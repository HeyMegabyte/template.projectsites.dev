import type { Meta, StoryObj } from '@storybook/react';
import { LocationMap } from './LocationMap';

/**
 * `LocationMap` — a "where to find us" band: a real, keyless, address-driven Google Maps
 * embed + a service-area line + hours + a Get-Directions CTA. It reads `brand.business` by
 * default; these stories pass explicit overrides so the section renders in Storybook (the
 * default brand has no address, in which case the section self-hides). The map is an
 * enhancement — the address/hours/directions render regardless of the embed.
 */
const meta = {
  title: 'Sections/LocationMap',
  component: LocationMap,
} satisfies Meta<typeof LocationMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LocalService: Story = {
  args: {
    name: 'Summit Ridge Plumbing & Heating',
    address: '4500 Federal Blvd, Denver, CO 80211',
    hours: 'Mon–Fri 7am–6pm · Sat 8am–2pm · 24/7 emergency service',
  },
};

export const Restaurant: Story = {
  args: {
    name: 'Larkspur Kitchen',
    address: '1200 E 6th St, Austin, TX 78702',
    hours: 'Tue–Sun 5pm–10pm · Brunch Sat–Sun 10am–2pm',
  },
};

/**
 * No hours supplied — the hours row is omitted, the map + address + directions still render.
 */
export const AddressOnly: Story = {
  args: {
    name: 'Copper & Vine',
    address: '88 Market Street, San Francisco, CA 94103',
  },
};
