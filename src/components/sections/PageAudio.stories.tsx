import type { Meta, StoryObj } from '@storybook/react';
import { PageAudio } from './PageAudio';

/**
 * `PageAudio` — an AI-native "Listen to this page" player built on the browser's
 * Web Speech API (`window.speechSynthesis`). Zero backend, zero deps, zero keys:
 * the visitor's own device narrates the page's main text aloud on demand.
 *
 * Cinematic layer (fully component-scoped, `.psa-` class prefix):
 * - Glass shell with an OKLCH accent aura + accent hairline, `clamp()` fluid sizing,
 *   and a `text-wrap: balance` label.
 * - While playing, an animated **equalizer** dances and the aura **breathes**.
 * - Real `<button>`s with `aria-pressed`, descriptive `aria-label`s, a visible focus
 *   ring, and an `aria-live="polite"` status ("Playing…" / "Paused" / "Finished").
 *
 * All VISUAL motion is **double-gated**: the equalizer + aura animate only when both
 * `prefers-reduced-motion: no-preference` AND `prefers-reduced-data: no-preference`
 * hold — otherwise the bars are static ticks and the aura is still, while the AUDIO
 * still works.
 *
 * SSR-safe + progressive: every browser access is behind `useEffect` +
 * `typeof window !== 'undefined'`, and the component renders `null` when
 * `speechSynthesis` is unavailable (so it self-hides in unsupported environments).
 * It NEVER autoplays — audio starts only from a real click.
 */
const meta = {
  title: 'Sections/PageAudio',
  component: PageAudio,
} satisfies Meta<typeof PageAudio>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default — reads the page's own `<main>` text at click time (falls back to the
 * document body). In Storybook the "page" is the story canvas, so pressing Play
 * narrates whatever text is on screen.
 */
export const Default: Story = {
  args: {},
};

/**
 * WithCustomText — a curated read: the `text` prop overrides the auto-extracted
 * page text, and `label` overrides the caption. Useful for reading a specific
 * summary, welcome message, or story aloud rather than the whole page.
 */
export const WithCustomText: Story = {
  args: {
    label: 'Hear our welcome',
    text: 'Welcome. We build professionally crafted websites, hosted, secured, and delivered fast — so you can focus on your business while we handle the web. Press play any time to hear this page read aloud.',
  },
};
