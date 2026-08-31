import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from './Timeline';

/**
 * `Timeline` — the historical / "our story" band on generated About pages.
 * Renders `vertical` (default) or `horizontal` (snap-scrolling cards).
 *
 * Cinematic layer (fully component-scoped, `.tl-` class prefix, base state always
 * shows every event + a fully-drawn rail):
 * - **OKLCH accent rail** (cyan → violet) that DRAWS DOWN on scroll via a
 *   `scaleY` scroll-timeline, with a soft glow.
 * - Per-event **entrance stagger** keyed on the inline `--tl-i`, plus a node that
 *   pops in with an expanding accent **pulse ring**.
 * - `clamp()` fluid year/title sizing, `text-wrap: balance` headings /
 *   `text-wrap: pretty` copy, glass hover-lift on the horizontal cards.
 *
 * All motion is **double-gated**: rail-draw + stagger + node pulse + hover-lift run
 * only when both `prefers-reduced-motion: no-preference` AND
 * `prefers-reduced-data: no-preference` hold. When either is reduced, every event
 * renders in its final state with zero motion and the rail is fully drawn — nothing
 * is hidden behind an un-fired animation. Semantics stay an ordered `<ol>` of `<time>`
 * events, so the chronology is correct for assistive tech regardless of motion.
 */
const meta = {
  title: 'Sections/Timeline',
  component: Timeline,
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const STORY = [
  {
    year: '2004',
    title: 'The doors open',
    description: 'A single chair, a hand-lettered sign, and a promise to treat every neighbor like family.',
  },
  {
    year: '2011',
    title: 'We outgrow the block',
    description: 'Demand doubled two years running, so we moved into the corner building and tripled our team.',
    link: { href: 'https://example.com/press', label: 'Read the local coverage' },
  },
  {
    year: '2018',
    title: 'Recognized statewide',
    description: 'Voted "Best in the region" three years in a row by readers who kept coming back.',
  },
  {
    year: '2024',
    title: 'Twenty years strong',
    description: 'Twenty-five thousand families served and still counting — same chair, same promise.',
  },
];

/** Default — the four-event "our story" band shown on most generated About pages. */
export const OurStory: Story = {
  args: {
    eyebrow: 'Our story',
    headline: 'Two decades of showing up',
    description: 'A short history of how a one-chair shop became a neighborhood institution.',
    events: STORY,
  },
};

/** Horizontal — snap-scrolling glass cards for a denser, gallery-style layout. */
export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    eyebrow: 'Milestones',
    headline: 'How we got here',
    events: STORY,
  },
};

/** With a primary-source image on the first dated event. */
export const WithImage: Story = {
  args: {
    eyebrow: 'Our story',
    headline: 'From one chair to a landmark',
    events: [
      {
        year: '2004',
        title: 'The doors open',
        description: 'A single chair, a hand-lettered sign, and a promise to treat every neighbor like family.',
        image: 'https://placehold.co/600x360/060610/00e5ff?text=1904+Archive',
        imageAlt: 'The original storefront on opening day',
      },
      ...STORY.slice(1),
    ],
  },
};

/** Minimal — two events, no header (exercises the header-less path). */
export const MinimalTwoEvent: Story = {
  args: {
    events: STORY.slice(0, 2),
  },
};
