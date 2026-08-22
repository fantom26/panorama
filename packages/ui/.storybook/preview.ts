import type { Preview } from '@storybook/react-vite'

import { decorators } from './decorators'

import '../src/styles/index.css'

const preview: Preview = {
  // to automatically generate documentation for our components
  tags: ['autodocs'],

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
    // fail the Vitest run on any accessibility violation (@storybook/addon-a11y + @storybook/addon-vitest)
    a11y: {
      test: 'error'
    },

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

  decorators
}

export default preview
