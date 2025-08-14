// Modern ESLint flat config for Next.js
import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Ignore patterns
  {
    ignores: [
      '**/.next/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/.vercel/**',
      '**/public/sw.js',
      '**/public/utils/**',
      '**/public/analytics.js',
      '**/*.min.js',
      '**/build/**',
      '**/static/**',
      'backend/routes/__tests__/*.js',
      'backend/controllers/__tests__/*.js',
      'backend/utils/__tests__/*.js',
      'backend/models/__tests__/*.js',
      'scripts/analyze-bundle.js',
      'scripts/convert-to-webp.js',
    ],
  },

  // Base Next.js config
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Global rules
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-this-alias': 'warn',
      '@next/next/no-img-element': 'warn', // Convert to warning for performance
    },
  },

  // Performance-specific overrides for memory-vault
  {
    files: ['src/app/memory-vault/**/*.tsx'],
    rules: {
      '@next/next/no-img-element': 'off', // User-uploaded content - acceptable
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
    },
  },
];

export default eslintConfig;
