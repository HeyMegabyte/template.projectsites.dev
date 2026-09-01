import type { Meta, StoryObj } from '@storybook/react';
import { LocationMap } from './LocationMap';

/**
 * `LocationMap` — a "where to find us" band: a real, keyless, address-driven Google Maps
 * embed + a service-area line + a hours card + a Get-Directions CTA. When the `hours`
 * string parses, it renders a **weekly Mon→Sun grid** with the current day highlighted and
 * a live **"Open now / Closed now"** chip (the visitor's local clock, refreshed each
 * minute) — the visible twin of the `OpeningHoursSpecification` JSON-LD (both from the same
 * `parseHours`). When `hours` is free-form / by-appointment, it falls back to the raw line.
 * Reads `brand.business` by default; these stories pass overrides so the section renders in
 * Storybook (the default brand has no address → the section self-hides). The map is an
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
 * Free-form / by-appointment hours don't parse into a weekly grid — the component falls
 * back to showing the raw hours line verbatim (never a malformed grid).
 */
export const ByAppointment: Story = {
  args: {
    name: 'Atelier North',
    address: '210 SW Yamhill St, Portland, OR 97204',
    hours: 'By appointment only — call to schedule',
  },
};

/**
 * No hours supplied — the hours block is omitted, the map + address + directions still render.
 */
export const AddressOnly: Story = {
  args: {
    name: 'Copper & Vine',
    address: '88 Market Street, San Francisco, CA 94103',
  },
};
