import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { CTASection } from './CTASection';

/**
 * `CTASection` — conversion anchor. `tone='emphatic'` layers a gradient + grain
 * plus two motion-gated aurora glows that slowly drift behind the content;
 * `tone='quiet'` uses a tactile card. Buttons render `react-router-dom`
 * `<Link>`s, so stories wrap it in a `MemoryRouter`.
 */
const meta = {
  title: 'Sections/CTASection',
  component: CTASection,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof CTASection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Emphatic: Story = {
  args: {
    eyebrow: 'New patients welcome',
    headline: 'Ready for a dentist you actually look forward to?',
    description:
      'Join 25,000 neighbors who trust us with their smiles. Book online today — most appointments available this week.',
    primary: { label: 'Book an appointment', href: '/contact' },
    secondary: { label: 'Call (650) 555-0142', href: 'tel:+16505550142' },
    tone: 'emphatic',
  },
};

export const Quiet: Story = {
  args: {
    headline: 'Have a question before you book?',
    description: 'Our front desk answers in plain English — no phone trees, no hold music.',
    primary: { label: 'Send us a message', href: '/contact' },
    tone: 'quiet',
  },
};
