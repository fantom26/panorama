import i18n from '@repo/ui/i18n'

import arCountry from '@/i18n/locales/ar/country'
import arGlobal from '@/i18n/locales/ar/global'
import enCountry from '@/i18n/locales/en/country'
import enGlobal from '@/i18n/locales/en/global'

// Extend the shared @repo/ui i18n instance with apps/web's own namespaces.
i18n.addResourceBundle('en', 'global', enGlobal, true, true)
i18n.addResourceBundle('ar', 'global', arGlobal, true, true)
i18n.addResourceBundle('en', 'country', enCountry, true, true)
i18n.addResourceBundle('ar', 'country', arCountry, true, true)

export { useTranslation } from '@repo/ui/i18n'
export default i18n
