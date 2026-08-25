import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { FeatureSplit } from './FeatureSplit';

/**
 * `FeatureSplit` — image-left / image-right feature block with optional
 * bullet list and CTA. Bullets render as check-in-accent-circle markers; the
 * image zooms + gains a depth scrim on hover (motion-reduce safe). The CTA
 * renders a `react-router-dom` `<Link>`, so stories wrap it in a `MemoryRouter`.
 */
const meta = {
  title: 'Sections/FeatureSplit',
  component: FeatureSplit,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof FeatureSplit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InvisalignImageRight: Story = {
  args: {
    eyebrow: 'Straighten with confidence',
    headline: 'Invisalign, done right the first time',
    description:
      'We use 3D scans — not goopy molds — to map your exact treatment before you commit. See your future smile on day one.',
    bullets: [
      'No metal brackets, no wires, no food restrictions',
      'Most cases finish in 6–12 months',
      'Flexible monthly payment plans with 0% APR',
    ],
    cta: { label: 'Get your free scan', href: '/contact' },
    image: {
      src: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80',
      alt: 'Patient holding a set of clear Invisalign aligners',
    },
    imagePosition: 'right',
  },
};

export const ImageLeft: Story = {
  args: {
    eyebrow: 'Comfort first',
    headline: 'Anxiety-free visits, every time',
    description:
      'Noise-cancelling headphones, sedation options, and a team that explains every step before it happens.',
    bullets: ['Nitrous & oral sedation available', 'Warm blankets and streaming TV'],
    cta: { label: 'Meet the team', href: '/about' },
    image: {
      src: 'https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?auto=format&fit=crop&w=1200&q=80',
      alt: 'Friendly dentist talking with a relaxed patient',
    },
    imagePosition: 'left',
  },
};
