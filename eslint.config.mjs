// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      '**/.next/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/dist/**',
      // Backend test files for performance
      'backend/routes/__tests__/*.js',
      'backend/controllers/__tests__/*.js',
      'backend/utils/__tests__/*.js',
      'backend/models/__tests__/*.js',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...storybook.configs['flat/recommended'],
];

export default eslintConfig;
