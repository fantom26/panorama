import { Suspense, useEffect } from 'react'

import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Decorator } from '@storybook/react-vite'
import { I18nextProvider } from 'react-i18next'

import i18n from '../src/i18n'

// When The language changes, set the document direction
i18n.on('languageChanged', (locale) => {
  const direction = i18n.dir(locale)
  document.dir = direction
})

const WithI18next: Decorator = (Story, context) => {
  const { locale } = context.globals

  // When the locale global changes
  // Set the new locale in i18n
  useEffect(() => {
    i18n.changeLanguage(locale)
  }, [locale])

  return (
    <Suspense fallback={<div>loading translations...</div>}>
      <I18nextProvider i18n={i18n}>
        <Story />
      </I18nextProvider>
    </Suspense>
  )
}

const themeDecorator = withThemeByDataAttribute({
  themes: {
    light: 'light',
    dark: 'dark'
  },
  defaultTheme: 'light',
  attributeName: 'data-theme'
})

// Scopes normalize.css to our own components instead of Storybook's docs/controls UI,
// which shares the same preview iframe as the story canvas.
const WithNormalize: Decorator = (Story) => (
  <div className='panorama-normalize'>
    <Story />
  </div>
)

export const decorators = [themeDecorator, WithI18next, WithNormalize]
