import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

/**
 * `Breadcrumbs` — the breadcrumb trail on sub-pages (default export). Emits a
 * JSON-LD `BreadcrumbList`, marks the final crumb with `aria-current="page"`,
 * and derives the trail from the current path unless an explicit `trail` is
 * passed. Returns `null` on single-crumb routes (e.g. the homepage).
 *
 * It uses `react-router-dom` `<Link>` + `useLocation`, so every story wraps it
 * in a `MemoryRouter` (with `initialEntries` to drive the derived trail).
 *
 * Cinematic layer (all motion-gated behind `prefers-reduced-motion`, base states
 * fully visible): an `@starting-style` **fade-in** from just below on first
 * paint, an **accent underline** that grows from the centre on each crumb link,
 * **accent-tinted chevron** separators that nudge on hover, a Home icon that
 * **warms to accent**, and a current page marked with an **accent dot** +
 * emphasised ink.
 */
const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/services/web-design']}>
        <div className="bg-background min-h-[40vh]">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default: trail derived from the `MemoryRouter` path
 * (`/services/web-design` → Home › Services › Web Design). The final crumb is
 * the current page (accent dot, no link).
 */
export const Default: Story = {};

/**
 * A deeper explicit `trail` with a `baseUrl` — proves crumb links, the animated
 * chevrons, and the JSON-LD `item` URLs all track the props rather than the
 * router path.
 */
export const ExplicitTrail: Story = {
  args: {
    baseUrl: 'https://example.com',
    trail: [
      { label: 'Home', to: '/' },
      { label: 'Blog', to: '/blog' },
      { label: 'Guides', to: '/blog/guides' },
      { label: 'Choosing a Contractor' },
    ],
  },
};

/**
 * Renders on a LIGHT vertical (`data-theme="light"`) to prove the accent
 * underline, chevrons, Home icon, and current-page dot all stay legible +
 * on-brand without any hardcoded white — the theme tokens flip for free.
 */
export const LightVertical: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/about/team']}>
        <div data-theme="light" className="bg-background min-h-[40vh]">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};
