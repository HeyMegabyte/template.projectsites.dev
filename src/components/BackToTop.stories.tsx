import type { Meta, StoryObj } from '@storybook/react';
import BackToTop from './BackToTop';

/**
 * `BackToTop` — a cinematic scroll-to-top button fixed at the bottom-right. It
 * **fades + scales in** once the visitor scrolls past ~600px, **lifts with an
 * accent glow-ring** on hover/focus, and **dips with a springy overshoot** on
 * press. Its ink uses the `--color-on-accent` token so it stays WCAG-correct on
 * light + dark verticals, and the smooth scroll respects `prefers-reduced-motion`.
 *
 * It listens to the real window scroll and toggles visibility at 600px, so to
 * see it appear you must scroll the preview past the tall spacer below. When
 * hidden it stays mounted (so the entrance animates) but is `aria-hidden` and
 * removed from the tab order.
 */
const meta = {
  title: 'Components/BackToTop',
  component: BackToTop,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '220vh' }}>
        <p className="p-8 text-text-muted">Scroll down ~600px — the accent button fades + scales in at the bottom-right.</p>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BackToTop>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — scroll the preview past ~600px to reveal the button. */
export const Default: Story = {};

/** On a light vertical — the accent fill, on-accent ink, and ring flip for free. */
export const OnLightTheme: Story = {
  decorators: [
    (Story) => (
      <div data-theme="light" className="bg-background" style={{ minHeight: '220vh' }}>
        <p className="p-8 text-text-muted">Light theme: fill + ink + glow-ring re-derive from the theme tokens.</p>
        <Story />
      </div>
    ),
  ],
};
