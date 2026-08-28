import type { Meta, StoryObj } from '@storybook/react';
import StickyPhoneCTA from './StickyPhoneCTA';

/**
 * `StickyPhoneCTA` — a mobile sticky call bar (fixed to the bottom, hides over the footer). It slides
 * up on reveal, the phone icon gives a gentle periodic "ring" wiggle, and a soft accent glow lifts it
 * off the page. Ink via `--color-on-accent` (theme-correct). Mobile-only (`md:hidden`) — view at a
 * narrow viewport.
 */
const meta = {
  title: 'Local/StickyPhoneCTA',
  component: StickyPhoneCTA,
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'mobile1' } },
} satisfies Meta<typeof StickyPhoneCTA>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default "Call Now" label. */
export const CallNow: Story = {
  args: { phone: '(614) 555-0121' },
};

/** Custom label. */
export const CustomLabel: Story = {
  args: { phone: '(614) 555-0121', label: 'Talk to a team member' },
};
