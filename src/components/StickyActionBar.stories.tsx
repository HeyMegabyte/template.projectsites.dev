import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { StickyActionBar } from './StickyActionBar';

/**
 * `StickyActionBar` — mobile-only (`md:hidden`) bottom-fixed conversion bar.
 * It reveals after the visitor scrolls past ~60vh and collapses while a form
 * field is focused, so preview it at a phone viewport and scroll to see it
 * slide up. The CTA renders a `react-router-dom` `<Link>`, so stories wrap it
 * in a `MemoryRouter`. Contents (Call button + Quote/Contact CTA) derive from
 * `@/brand`, so this renders whatever the current brand fixture declares.
 */
const meta = {
  title: 'Components/StickyActionBar',
  component: StickyActionBar,
  parameters: {
    // Phone viewport so the md:hidden bar is actually rendered.
    viewport: { defaultViewport: 'mobile1' },
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        {/* Tall spacer forces past the 60vh reveal threshold on load. */}
        <div style={{ minHeight: '160vh' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof StickyActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default: the bar as the brand fixture configures it. Scroll the preview
 * (or shrink the frame) to trigger the reveal — it sits below `md`.
 */
export const Default: Story = {};
