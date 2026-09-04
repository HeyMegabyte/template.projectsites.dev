import type { Meta, StoryObj } from '@storybook/react';
import { TeamGrid } from './TeamGrid';

/**
 * `TeamGrid` — a named "meet the humans behind the work" credibility section that
 * also emits Person JSON-LD for each member.
 *
 * Cinematic behaviour (all transform/opacity/filter-only, DOUBLE-gated behind
 * `prefers-reduced-motion: no-preference` + `prefers-reduced-data: no-preference`
 * and auto-neutralised for reduced-motion/-data users): cards **stagger-rise** as
 * the grid scrolls into view (offset keyed on the inline `--tm-i`), **lift** on
 * hover/focus-within, grow a gradient **top-accent bar** that draws in + brightens,
 * the **portrait slow-zooms** behind a fixed frame with an accent scrim, the ring
 * warms to accent with a soft glow, and the name shifts to accent. Headline + name
 * use `clamp()` fluid type. Theme-token colours only, so it reads correctly on both
 * light and dark verticals; every link keeps a focus-visible ring (Tab to a card's
 * links to see it). Under reduced-motion / reduced-data the section is static and
 * fully legible.
 */
const meta = {
  title: 'Sections/TeamGrid',
  component: TeamGrid,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TeamGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Photos + roles + bios + links — the full card treatment (hover for the lift, accent bar, and portrait zoom). */
export const WithPhotos: Story = {
  args: {
    eyebrow: 'Our team',
    headline: 'The humans behind the work',
    description: 'A small, senior team that owns your project end to end — hover a card for the accent lift.',
    members: [
      {
        name: 'Ava Reyes',
        role: 'Founder & Principal',
        bio: 'Fifteen years shipping design-led builds. Runs discovery and keeps every engagement on scope.',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&auto=format&fit=crop',
        links: [
          { label: 'LinkedIn', href: 'https://linkedin.com' },
          { label: 'Email', href: 'mailto:ava@example.com' },
        ],
      },
      {
        name: 'Marcus Lin',
        role: 'Lead Engineer',
        bio: 'Full-stack lead who turns rough ideas into resilient, well-tested systems that scale calmly.',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop',
        links: [{ label: 'GitHub', href: 'https://github.com' }],
      },
      {
        name: 'Priya Nair',
        role: 'Design Director',
        bio: 'Leads the visual system and motion language so every screen feels considered, not templated.',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80&auto=format&fit=crop',
        links: [{ label: 'Dribbble', href: 'https://dribbble.com' }],
      },
    ],
  },
};

/** No photos supplied — the accent monogram fallback fills each frame and shares the slow-zoom on hover. */
export const MonogramFallback: Story = {
  args: {
    eyebrow: 'Leadership',
    headline: 'People, not placeholders',
    description: 'When a portrait is missing, a monogram keeps the grid whole — never a broken image.',
    members: [
      { name: 'Jordan Blake', role: 'Managing Partner', bio: 'Owns client relationships and long-term strategy.' },
      { name: 'Sana Okafor', role: 'Head of Delivery', bio: 'Keeps timelines honest and quality uncompromising.' },
      { name: 'Diego Ramos', role: 'Client Success', bio: 'Your day-one point of contact through launch and beyond.' },
    ],
  },
};

/** Long roster — best for feeling the staggered scroll-in entrance across rows. */
export const LargeTeam: Story = {
  args: {
    eyebrow: 'Meet the team',
    headline: 'The whole crew',
    description: 'Scroll to watch each card stagger into view; hover any card for the accent lift + portrait zoom.',
    members: Array.from({ length: 6 }, (_, i) => ({
      name: `Team Member ${i + 1}`,
      role: ['Engineer', 'Designer', 'Strategist', 'Producer', 'Analyst', 'Advisor'][i % 6],
      bio: 'A senior contributor who owns their craft and cares about the outcome as much as you do.',
    })),
  },
};
