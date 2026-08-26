import type { Meta, StoryObj } from '@storybook/react';
import Timeline from './Timeline';

/**
 * `Timeline` — a vertical event history on a cinematic accent spine. The gradient
 * spine draws top-to-bottom as the list scrolls into view (`view()` scroll-
 * timeline, feature-detected), each entry blur-rises on a staggered delay, and
 * every node dot carries an accent ring with a soft settle-pulse. Type is fluid
 * (`clamp()`), all motion is gated behind `prefers-reduced-motion` (base state is
 * fully drawn + visible), and it uses theme tokens only — so it reads on light
 * and dark verticals alike.
 */
const meta = {
  title: 'Components/Timeline',
  component: Timeline,
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompanyStory: Story = {
  args: {
    eyebrow: 'Our journey',
    headline: 'A decade of building',
    events: [
      {
        year: '2014',
        title: 'Founded in a garage',
        description:
          'Two engineers and a whiteboard set out to make site delivery instant and effortless.',
      },
      {
        year: '2017',
        title: 'First 1,000 customers',
        description:
          'Word-of-mouth carried us past our first thousand businesses served across the region.',
      },
      {
        year: '2020',
        title: 'Went fully edge-native',
        description:
          'Rebuilt the platform on Cloudflare Workers — sub-50ms responses worldwide, no cold starts.',
        link: { href: '/about', label: 'Read the story' },
      },
      {
        year: '2024',
        title: 'AI-native site generation',
        description:
          'Launched one-prompt site builds — describe your business, get a complete, deployed website.',
      },
    ],
  },
};

/** A shorter three-entry milestone strip with an external link. */
export const Milestones: Story = {
  args: {
    events: [
      { year: 'Q1', title: 'Discovery', description: 'We learn your goals, audience, and brand.' },
      { year: 'Q2', title: 'Build', description: 'We design, write, and ship your site — fast.' },
      {
        year: 'Q3',
        title: 'Grow',
        description: 'We measure, refine, and scale what converts.',
        link: { href: 'https://example.com', label: 'See results' },
      },
    ],
  },
};
