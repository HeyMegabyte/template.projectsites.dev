import type { Meta, StoryObj } from '@storybook/react';
import { CalendarCheck, Stethoscope, Smile } from 'lucide-react';
import { ProcessSteps } from './ProcessSteps';

/**
 * `ProcessSteps` — numbered flow joined by a gradient connector line (md+
 * horizontal row); cards lift on hover (motion-gated). Steps may carry an
 * optional icon. Three-or-more steps lay out horizontally on md+.
 */
const meta = {
  title: 'Sections/ProcessSteps',
  component: ProcessSteps,
} satisfies Meta<typeof ProcessSteps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewPatientJourney: Story = {
  args: {
    eyebrow: 'How it works',
    headline: 'Your first visit in three easy steps',
    description: 'No paperwork surprises, no long waits — here is exactly what to expect.',
    steps: [
      {
        title: 'Book online',
        description: 'Pick a time that works in under a minute. We verify your insurance for you.',
        icon: <CalendarCheck className="h-6 w-6" />,
      },
      {
        title: 'Comprehensive exam',
        description: 'A full 3D scan, X-rays, and a clear, jargon-free treatment plan.',
        icon: <Stethoscope className="h-6 w-6" />,
      },
      {
        title: 'Leave smiling',
        description: 'Same-day cleaning when possible, plus a written estimate before any work.',
        icon: <Smile className="h-6 w-6" />,
      },
    ],
  },
};

export const NoIcons: Story = {
  args: {
    headline: 'Simple, transparent process',
    steps: [
      { title: 'Consultation', description: 'We listen to your goals and concerns.' },
      { title: 'Custom plan', description: 'A phased plan that fits your budget.' },
      { title: 'Ongoing care', description: 'Automated reminders keep you on track.' },
    ],
  },
};
