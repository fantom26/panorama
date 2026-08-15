import type { Preview } from '@storybook/react-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'

import '../src/styles/index.css'
import { decorators } from './decorators'

// Registers the msw addon
initialize()

const preview: Preview = {
  tags: ['autodocs'], // to automatically generate documentation for our components
  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'ar', title: 'العربية' }
        ]
      }
    }
  },
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
  decorators
}

export default preview
