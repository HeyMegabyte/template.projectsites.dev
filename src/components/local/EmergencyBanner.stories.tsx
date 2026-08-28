import type { Meta, StoryObj } from '@storybook/react';
import EmergencyBanner from './EmergencyBanner';

/**
 * `EmergencyBanner` — an after-hours alert bar (renders only outside business hours) offering a
 * one-tap emergency call. Announces via `role="alert"`, the warning icon pulses for attention, the
 * call button glows, and it can be dismissed. The red/white is intentional (a solid urgent alert),
 * correct on any theme. Stories force `businessHours` to Closed so the banner is always visible.
 */
const meta = {
  title: 'Local/EmergencyBanner',
  component: EmergencyBanner,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof EmergencyBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

const CLOSED_ALL_WEEK: Record<string, string> = {
  Monday: 'Closed',
  Tuesday: 'Closed',
  Wednesday: 'Closed',
  Thursday: 'Closed',
  Friday: 'Closed',
  Saturday: 'Closed',
  Sunday: 'Closed',
};

/** After-hours — the emergency call bar with a pulsing icon and dismiss button. */
export const AfterHours: Story = {
  args: {
    emergencyPhone: '(512) 555-0159',
    businessHours: CLOSED_ALL_WEEK,
  },
};
