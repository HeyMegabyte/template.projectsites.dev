import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

/**
 * `Header` — the cinematic sticky top nav (default export). Logo, primary links,
 * a command-palette button (⌘K / Ctrl K), `ThemeToggle`, a dominant CTA, and an
 * accessible mobile menu. The primary "offer" link + CTA are vertical-aware,
 * derived from `@/brand` via `featureOn('quote' | 'pricing')`, so the Default
 * story renders whatever the current brand fixture declares.
 *
 * It uses `react-router-dom` `<Link>` + `useLocation`, so every story wraps it in
 * a `MemoryRouter` (with `initialEntries` to drive the active-link state).
 *
 * Cinematic layer (all motion-gated behind `prefers-reduced-motion`, base states
 * fully visible): an `@starting-style` **slide-in** on first paint, a deeper
 * **glass** panel + a hair-thin OKLCH **accent underline** once scrolled, an
 * **active-link underline** that grows from center, and a **slide + staggered**
 * mobile-menu open. Focus rings stay visible; the mobile menu keeps
 * `aria-expanded` + `aria-controls` + focus order intact.
 */
const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/services']}>
        {/* Tall spacer so the fixed header has a page to sit over; scroll the
            preview to see the glass + accent-hairline scrolled state. */}
        <div style={{ minHeight: '220vh' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default: links + CTA exactly as the active brand fixture configures them.
 * `/services` is the active route, so its nav link shows the accent underline.
 */
export const Default: Story = {};

/**
 * Explicit link set + custom CTA — proves the animated active underline tracks
 * the current route (`/pricing`) and the command-palette button + ThemeToggle
 * still render alongside.
 */
export const CustomLinks: Story = {
  args: {
    links: [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About' },
      { to: '/services', label: 'Services' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/contact', label: 'Contact' },
    ],
    ctaLabel: 'Start free trial',
    ctaHref: '/pricing',
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/pricing']}>
        <div style={{ minHeight: '220vh' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

/**
 * Renders on a LIGHT vertical (`data-theme="light"`) to prove the glass panel,
 * accent underline, scroll hairline, and mobile-menu surfaces all stay legible +
 * on-brand without any hardcoded white — the theme tokens flip for free.
 */
export const LightVertical: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/about']}>
        <div data-theme="light" className="bg-background" style={{ minHeight: '220vh' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  args: {
    ctaLabel: 'Book a consult',
    ctaHref: '/contact',
  },
};
