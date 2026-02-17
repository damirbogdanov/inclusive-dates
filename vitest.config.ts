import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    projects: [
      {
        // Unit tests project - tests source files directly
        test: {
          name: 'unit',
          include: ['src/**/*.spec.{ts,tsx}'],
          globals: true,
          environment: 'node',
          // Unit tests for utilities
        },
      },
      {
        // Storybook integration tests project - NO COVERAGE
        test: {
          name: 'storybook',
          include: ['src/**/*.stories.{ts,tsx}'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{
              browser: 'chromium'
            }],
          },
          setupFiles: ['.storybook/vitest.setup.ts']
        },
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })
        ],
      }
    ],
  },

});
