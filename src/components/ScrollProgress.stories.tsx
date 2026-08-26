import type { Meta, StoryObj } from '@storybook/react';
import { ScrollProgress } from './ScrollProgress';

/**
 * `ScrollProgress` — a cinematic pure-CSS scroll-progress bar pinned to the top
 * edge. An OKLCH **accent → primary → info** gradient with a soft accent glow
 * fills 0 → 100% as the document scrolls, driven entirely by
 * `animation-timeline: scroll(root)` (zero JS, INP-safe, no scroll listener).
 *
 * It's fixed to the top of the **document** scroller, so to see it fill you need
 * a tall page and to actually scroll the preview — the spacer below forces that.
 * Colors are theme tokens (legible on light + dark), motion is gated behind
 * `prefers-reduced-motion`, and it's `aria-hidden` (decorative). Mounted once in
 * `Layout.tsx` on the real site.
 */
const meta = {
  title: 'Components/ScrollProgress',
  component: ScrollProgress,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '260vh' }}>
        <Story />
        <p className="p-8 text-text-muted">Scroll this preview — the accent gradient bar fills along the very top edge.</p>
      </div>
    ),
  ],
} satisfies Meta<typeof ScrollProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — 3px accent gradient bar. Scroll the preview to watch it fill. */
export const Default: Story = {};

/** A chunkier 6px bar — same gradient + glow, more presence. */
export const Thick: Story = {
  args: { height: 6 },
};

/** On a light vertical — the gradient + glow flip to the light theme tokens. */
export const OnLightTheme: Story = {
  decorators: [
    (Story) => (
      <div data-theme="light" className="bg-background" style={{ minHeight: '260vh' }}>
        <Story />
        <p className="p-8 text-text-muted">Light theme: the bar re-tints from the theme tokens for free.</p>
      </div>
    ),
  ],
};
