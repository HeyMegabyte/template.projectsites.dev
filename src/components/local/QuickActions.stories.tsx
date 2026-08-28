import type { Meta, StoryObj } from '@storybook/react';
import QuickActions from './QuickActions';

/**
 * `QuickActions` — a mobile-only fixed bottom action bar (call / directions / book / menu / text /
 * hours). `card-tactile` tiles rise in staggered on mount and press with a spring; each keeps its
 * semantic icon tint. Mobile-only (`md:hidden`) — view these stories at a narrow viewport.
 */
const meta = {
  title: 'Local/QuickActions',
  component: QuickActions,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'mobile1' } },
} satisfies Meta<typeof QuickActions>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full bar — call, directions, book, text, and an open/closed hours pill (6 actions → 3-col). */
export const AllActions: Story = {
  args: {
    phone: '(303) 555-0176',
    directionsUrl: '#',
    bookingUrl: '#',
    hoursOpen: true,
  },
};

/** Minimal — call + directions only (2 actions → 2-col). */
export const CallAndDirections: Story = {
  args: {
    phone: '(303) 555-0176',
    directionsUrl: '#',
  },
};
