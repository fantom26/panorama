import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { resources } from '@repo/i18n'

// Re-exported so consumers share this package's single react-i18next module
// instance — importing the hook from their own copy throws NO_I18NEXT_INSTANCE
// when workspace React versions differ.
export { useTranslation } from 'react-i18next'

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  lng: 'en',
  ns: ['common', 'ui'],
  defaultNS: 'common',
  fallbackNS: 'ui',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
