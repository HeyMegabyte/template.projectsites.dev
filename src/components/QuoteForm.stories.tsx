import type { Meta, StoryObj } from '@storybook/react';
import { QuoteForm } from './QuoteForm';

/**
 * `QuoteForm` — service-business quote request with drag-and-drop photo upload
 * (up to 4, auto-downscaled to a 1280px JPEG data-URL). Validates with Zod on
 * submit and POSTs JSON to `/api/contact-form/{slug}`; in Storybook the POST
 * simply fails (no worker), which exercises the human-readable error path.
 */
const meta = {
  title: 'Components/QuoteForm',
  component: QuoteForm,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-2xl mx-auto">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof QuoteForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Standard render bound to a realistic tenant slug. */
export const Default: Story = {
  args: {
    slug: 'summit-hvac',
  },
};

/**
 * Points at an explicit `endpoint`, overriding the `/api/contact-form/{slug}`
 * default — useful for a preview environment or a mock server.
 */
export const CustomEndpoint: Story = {
  args: {
    slug: 'summit-hvac',
    endpoint: 'https://example.com/mock/quote',
  },
};
