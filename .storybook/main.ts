import type { StorybookConfig } from '@storybook/web-components-vite';
import { fileURLToPath } from 'url';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-vitest'
  ],

  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },

  async viteFinal(config) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
    };
    return config;
  },
};

export default config;
