import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';

/**
 * `ThemeToggle` — cycles the site theme (dark → light → auto) writing
 * `document.documentElement.dataset.theme` + persisting to localStorage.
 *
 * Micro-interaction (motion-gated behind `prefers-reduced-motion`): three glyphs
 * are **stacked** and only the active one is opaque + upright — the others
 * **cross-fade + rotate + scale** out on each toggle. The button has a **springy
 * press** (a gentle overshoot ease) and an **accent focus ring**. `aria-label`
 * announces the mode + action and `aria-pressed` reflects whether a non-system
 * theme is forced. Click it to watch the glyph morph; base states stay legible
 * with motion or JS off.
 */
const meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — starts on dark; click to cycle dark → light → auto. */
export const Default: Story = {};

/** On a dark surface (the common nav placement). */
export const OnDarkSurface: Story = {
  decorators: [
    (Story) => (
      <div data-theme="dark" className="bg-background p-10 rounded-xl">
        <Story />
      </div>
    ),
  ],
};

/** On a light vertical — proves the border, ring, and glyph tint flip for free. */
export const OnLightSurface: Story = {
  decorators: [
    (Story) => (
      <div data-theme="light" className="bg-background p-10 rounded-xl">
        <Story />
      </div>
    ),
  ],
};
