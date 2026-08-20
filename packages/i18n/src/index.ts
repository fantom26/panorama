import arCommon from './ar/common'
import arUi from './ar/ui'
import enCommon from './en/common'
import enUi from './en/ui'

export const resources = {
  en: {
    common: enCommon,
    ui: enUi
  },
  ar: {
    common: arCommon,
    ui: arUi
  }
} as const
