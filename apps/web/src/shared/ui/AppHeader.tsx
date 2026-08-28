'use client'

import { Divider, ExpandableSearch, LanguageSwitcher, Logo, ThemeToggle } from '@repo/ui'

import { useTranslation } from '@/i18n'

import styles from './AppHeader.module.css'
import CompareIndicator from './CompareIndicator'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' }
]

export type AppHeaderProps = {
  /** The variable slot next to the logo: a static page label on the home page, Breadcrumbs elsewhere. */
  children: React.ReactNode
}

export default function AppHeader({ children }: AppHeaderProps) {
  const { t, i18n } = useTranslation()

  function handleLanguageChange(code: string) {
    i18n.changeLanguage(code)
    const root = document.documentElement
    root.lang = code
    root.dir = i18n.dir(code)
  }

  return (
    <header className={styles.topBar}>
      <div className={styles.brand}>
        <Logo />
        {children}
      </div>
      <div className={styles.iconControls}>
        <CompareIndicator />
        <LanguageSwitcher
          languages={languages}
          value={i18n.language}
          onChange={handleLanguageChange}
        />
        <span className={styles.dividerWrap}>
          <Divider orientation='vertical' />
        </span>
        <ThemeToggle />
      </div>
      <ExpandableSearch
        placeholder={t('search.placeholder', { ns: 'global' })}
        className={styles.search}
      />
    </header>
  )
}
