import i18n from '@repo/ui/i18n'

import { ar as compareAr, en as compareEn } from '@/features/compare/locales'
import { ar as countryAr, en as countryEn } from '@/features/country/locales'
import { ar as globalAr, en as globalEn } from '@/features/global/locales'

// Extend the shared @repo/ui i18n instance with apps/web's own namespaces.
i18n.addResourceBundle('en', 'global', globalEn, true, true)
i18n.addResourceBundle('ar', 'global', globalAr, true, true)
i18n.addResourceBundle('en', 'country', countryEn, true, true)
i18n.addResourceBundle('ar', 'country', countryAr, true, true)
i18n.addResourceBundle('en', 'compare', compareEn, true, true)
i18n.addResourceBundle('ar', 'compare', compareAr, true, true)

export { useTranslation } from '@repo/ui/i18n'
export default i18n
