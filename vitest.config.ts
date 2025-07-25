import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    // Environment separation for different test types
    environment: 'jsdom',
    globals: true,
    projects: [
      // Storybook test project
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            // Additional options for better performance
            storybookScript: 'npm run storybook',
          }),
        ],
        test: {
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
          // Note: test.include is removed as per Storybook 8.5+ recommendations
          // The stories field in main.ts will determine which files to test
        },
      },
      // Regular unit tests project
      {
        test: {
          environment: 'jsdom',
          setupFiles: ['src/setupTests.js'],
          // Exclude story files from regular tests
          exclude: ['src/**/*.stories.?(m)[jt]s?(x)', 'node_modules/**'],
          include: ['src/**/*.test.?(m)[jt]s?(x)'],
        },
      },
    ],
  },
});
