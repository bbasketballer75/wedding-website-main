import type { Preview } from '@storybook/nextjs-vite';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const preview: Preview = {
  decorators: [
    (Story) =>
      React.createElement(
        MemoryRouter,
        { future: { v7_startTransition: true, v7_relativeSplatPath: true } },
        React.createElement(Story)
      ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Actions addon configuration
    actions: { argTypesRegex: '^on[A-Z].*' },
    // Docs configuration
    docs: {
      story: {
        inline: true,
      },
    },
    // A11y addon configuration
    a11y: {
      config: {},
      options: {
        checks: { 'color-contrast': { options: { noScroll: true } } },
        restoreScroll: true,
      },
    },
    // Backgrounds addon configuration for testing different themes
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#333333',
        },
      ],
    },
  },
  // Global decorators for consistent styling
  decorators: [
    (Story) =>
      React.createElement(
        'div',
        { style: { margin: '3em', fontFamily: 'Arial, sans-serif' } },
        React.createElement(Story)
      ),
  ],
};

export default preview;
