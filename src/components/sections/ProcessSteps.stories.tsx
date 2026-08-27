import type { Meta, StoryObj } from '@storybook/react';
import { CalendarCheck, Stethoscope, Smile } from 'lucide-react';
import { ProcessSteps } from './ProcessSteps';

/**
 * `ProcessSteps` — numbered flow joined by a connector line that DRAWS
 * left→right as the row scrolls into view; each editorial ghost number
 * scale-pops in, staggered per step (`--step-i`). Cards lift on hover. All
 * motion is `prefers-reduced-motion`-gated — base state is fully drawn +
 * visible. Steps may carry an optional icon; 3+ steps lay out horizontally
 * on md+ (4 fill the lg row).
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

/** Four steps fill the lg row — the clearest look at the connector draw + the
 * staggered per-step number pop (`--step-i` cascade). */
export const FourStepFlow: Story = {
  args: {
    eyebrow: 'How it works',
    headline: 'From first call to closing day',
    description: 'A clear path with no surprises, so you always know the next move.',
    steps: [
      { title: 'Reach out', description: 'Tell us your goals and timeline in a quick, no-pressure chat.' },
      { title: 'Get a plan', description: 'We map pricing, neighborhoods, and a realistic timeline together.' },
      { title: 'Go to market', description: 'We handle the listings, showings, and the hard negotiations for you.' },
      { title: 'Close with confidence', description: 'Paperwork, inspections, and keys — we stay in your corner to the end.' },
    ],
  },
};
