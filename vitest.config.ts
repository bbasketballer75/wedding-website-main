import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-globals.js', './src/setupTests.js'],
    exclude: [
      'backend/**/*',
      'node_modules/**/*',
      '.netlify/**/*',
      'coverage/**/*',
      'cypress/**/*',
      'dist/**/*',
      '.next/**/*',
      '*.config.js',
      '*.config.ts',
      'netlify/**/*',
    ],
    include: ['src/**/*.test.{js,jsx,ts,tsx}'],
  },
});
