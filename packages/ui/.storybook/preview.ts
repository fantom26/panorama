
import type { Preview } from '@storybook/react-vite';

import { initialize, mswLoader } from 'msw-storybook-addon';

import '../src/styles/index.css';

// Registers the msw addon
initialize();

const preview: Preview = {
  tags: ['autodocs'], // to automatically generate documentation for our components
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  loaders: [mswLoader],
};

export default preview;