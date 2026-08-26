import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

/**
 * `Footer` — the site footer (default export), present on every page. Brand
 * name + blurb, a vertical-aware nav (quote vs pricing via `featureOn`), the
 * contact block (address / phone / email / "Send us a message"), legal links
 * incl. `/sitemap.xml`, optional social buttons, and the copyright row.
 *
 * It uses `react-router-dom` `<Link>`, so every story wraps it in a
 * `MemoryRouter`.
 *
 * Cinematic layer (all motion-gated behind `prefers-reduced-motion`, base states
 * fully visible + legible): a glowing OKLCH **accent hairline** on the top edge,
 * a drifting twin-tone **accent wash + grain** for depth, **scroll-staggered**
 * column reveal (keyed on the inline `--col-i` index), **social buttons** that
 * lift + glow to accent on hover/focus, and an **accent underline** that grows
 * from the centre on every nav / legal / contact link.
 */
const meta = {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="bg-background">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default: nav + contact + legal exactly as the active brand fixture configures
 * them. No socials passed, so the social row is omitted.
 */
export const Default: Story = {};

/**
 * With social buttons — proves the accent lift + glow on hover/focus. Each
 * button renders the first two letters of its label.
 */
export const WithSocials: Story = {
  args: {
    socials: [
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: 'Facebook', href: 'https://facebook.com' },
      { label: 'LinkedIn', href: 'https://linkedin.com' },
      { label: 'YouTube', href: 'https://youtube.com' },
    ],
  },
};

/**
 * Explicit route set — proves the footer nav renders whatever `routes` it is
 * handed, with the accent underline-grow on every link.
 */
export const CustomRoutes: Story = {
  args: {
    routes: [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About' },
      { to: '/services', label: 'Services' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/blog', label: 'Journal' },
      { to: '/contact', label: 'Contact' },
    ],
  },
};

/**
 * Renders on a LIGHT vertical (`data-theme="light"`) to prove the accent
 * hairline, wash, grain, social buttons, and underline-grow links all stay
 * legible + on-brand without any hardcoded white — the theme tokens flip for
 * free.
 */
export const LightVertical: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div data-theme="light" className="bg-background">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  args: {
    socials: [
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: 'Facebook', href: 'https://facebook.com' },
    ],
  },
};
