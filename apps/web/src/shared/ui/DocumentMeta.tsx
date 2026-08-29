'use client'

import { useEffect } from 'react'

import { useTranslation } from '@/i18n'

export default function DocumentMeta() {
  const { t, i18n } = useTranslation('common')

  useEffect(() => {
    document.title = t('meta.title')

    let tag = document.head.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.name = 'description'
      document.head.appendChild(tag)
    }
    tag.content = t('meta.description')
  }, [t, i18n.language])

  return null
}
