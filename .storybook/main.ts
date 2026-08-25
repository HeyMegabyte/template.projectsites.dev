import type { StorybookConfig } from '@storybook/react-vite';

/**
 * Storybook 8 config (Vite builder).
 *
 * The `@storybook/react-vite` framework auto-loads the project's
 * `vite.config.ts`, so the `@/*` path alias, `@vitejs/plugin-react`, and
 * Tailwind PostCSS pipeline all resolve here exactly as in the site build —
 * no duplicated Vite config needed.
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(tsx|ts)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
