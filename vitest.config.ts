import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js'
  }
});
        test: {
          environment: 'jsdom',
    setupFiles: './src/setupTests.js'
          // Exclude story files from regular tests
          exclude: ['src/**/*.stories.?(m)[jt]s?(x)', 'node_modules/**'],
          include: ['src/**/*.test.?(m)[jt]s?(x)'],
        },
      },
    ],
  },
});
