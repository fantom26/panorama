'use client'

import { Divider, LanguageSwitcher, Logo, ThemeToggle } from '@repo/ui'

import { useLocale } from '@/shared/hooks/useLocale'
import { useTheme } from '@/shared/hooks/useTheme'
import CompareIndicator from '@/shared/ui/CompareIndicator'
import CountrySearch from '@/shared/ui/CountrySearch'

import styles from './index.module.css'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' }
]

export type AppHeaderProps = {
  /** The variable slot next to the logo: a static page label on the home page, Breadcrumbs elsewhere. */
  children: React.ReactNode
}

export default function AppHeader({ children }: AppHeaderProps) {
  const { locale, setLocale } = useLocale()
  const { theme, setTheme } = useTheme()

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
          value={locale}
          onChange={(code) => setLocale(code === 'ar' ? 'ar' : 'en')}
        />
        <span className={styles.dividerWrap}>
          <Divider orientation='vertical' />
        </span>
        <ThemeToggle value={theme} onChange={setTheme} />
      </div>
      <div className={styles.search}>
        <CountrySearch />
      </div>
    </header>
  )
}
