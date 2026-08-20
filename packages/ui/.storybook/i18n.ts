import i18n, { type i18n as I18n } from 'i18next'

import { resources as sharedResources } from '@repo/i18n'

import ar from './locales/ar'
import en from './locales/en'

const resources = {
  en: { ...sharedResources.en, stories: en },
  ar: { ...sharedResources.ar, stories: ar }
}

export const storybookI18n: I18n = i18n.createInstance()

await storybookI18n.init({
  resources,
  fallbackLng: 'en',
  ns: ['common', 'ui', 'stories'],
  defaultNS: 'common',
  fallbackNS: ['ui', 'stories'],
  interpolation: {
    escapeValue: false
  }
})

export default storybookI18n
