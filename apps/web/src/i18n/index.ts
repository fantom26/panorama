import i18n from '@repo/ui/i18n'

import ar from '@/i18n/locales/ar'
import en from '@/i18n/locales/en'

// Extend the shared @repo/ui i18n instance with apps/web's own `global` namespace.
i18n.addResourceBundle('en', 'global', en, true, true)
i18n.addResourceBundle('ar', 'global', ar, true, true)

export { useTranslation } from '@repo/ui/i18n'
export default i18n
