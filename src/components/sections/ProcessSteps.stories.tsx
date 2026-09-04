import type { Meta, StoryObj } from '@storybook/react';
import { CalendarCheck, Stethoscope, Smile } from 'lucide-react';
import { ProcessSteps } from './ProcessSteps';

/**
 * `ProcessSteps` — a numbered flow joined by a glowing connector RAIL that
 * draws left→right through per-step flow-node waypoints as the row scrolls into
 * view. Each step CARD rises in sequence and each editorial ghost number
 * scale-pops, all staggered per step via the inline `--step-i` cascade. On
 * hover/focus a gradient hairline grows across the card top and the accent icon
 * tile warms + tilts. All motion is `prefers-reduced-motion`-gated — the resting
 * base state is fully drawn + legible with focus-visible preserved. Steps may
 * carry an optional icon; 3+ steps lay out horizontally on md+ (4 fill the lg
 * row), stacking vertically below md where the horizontal rail + nodes hide.
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

/** Two steps — the tightest layout, useful for eyeballing the connector rail,
 * the flow-node waypoints, and the per-card gradient hairline on hover/focus
 * without a full four-across cascade. */
export const TwoStep: Story = {
  args: {
    eyebrow: 'The process',
    headline: 'Two steps to launch',
    description: 'Deliberately simple — a look at the rail, nodes, and hover hairline in isolation.',
    steps: [
      {
        title: 'Share your goals',
        description: 'A short intake tells us what success looks like for you.',
        icon: <CalendarCheck className="h-6 w-6" />,
      },
      {
        title: 'We build + launch',
        description: 'You review, we polish, and your site goes live — hosted and SSL’d.',
        icon: <Smile className="h-6 w-6" />,
      },
    ],
  },
};
