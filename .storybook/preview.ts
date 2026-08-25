import type { Preview } from '@storybook/react';
import '../src/index.css';
import { applyBrand } from '../src/brand';

/**
 * Global preview config. Imports the app stylesheet (Tailwind + brand CSS
 * custom properties + component classes like `card-tactile`, `gradient-text`)
 * and runs `applyBrand()` so every story renders with the same brand theme
 * (colors, fonts, radii, motion) the live site gets from `main.tsx`.
 *
 * `applyBrand()` defaults its target to `document.documentElement`; in the
 * Storybook preview iframe `document` is defined, so it writes the same
 * `--color-*` / `--font-*` custom properties the components read.
 */
applyBrand();

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'brand',
      values: [
        { name: 'brand', value: 'var(--color-background, #0a0a1a)' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
};

export default preview;
