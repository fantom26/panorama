import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'

import '../src/styles/index.css'

// Registers the msw addon
initialize()

const preview: Preview = {
  tags: ['autodocs'], // to automatically generate documentation for our components
  parameters: {
    options: {
      storySort: {
        order: ['Design Tokens', '*']
      }
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    // https://github.com/UX-and-I/storybook-design-token
    designToken: {
      disable: true,
      pageSize: Number.MAX_VALUE
    }
  },
  loaders: [mswLoader],
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark'
      },
      defaultTheme: 'light',
      attributeName: 'data-theme'
    })
  ]
}

export default preview
