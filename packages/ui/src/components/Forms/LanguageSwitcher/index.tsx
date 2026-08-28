import { Button as BaseButton } from '@base-ui/react/button'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import Typography from '../../DataDisplay/Typography'
import styles from './index.module.css'

export type LanguageOption = { code: string; label: string }

export type LanguageSwitcherProps = {
  languages: LanguageOption[]
  value: string
  onChange: (code: string) => void
  className?: string
}

export default function LanguageSwitcher({
  languages,
  value,
  onChange,
  className
}: LanguageSwitcherProps) {
  const { t } = useTranslation()

  return (
    <div
      role='group'
      aria-label={t('languageSwitcher.ariaLabel')}
      className={clsx(styles.root, className)}
    >
      {languages.map((language) => {
        const active = language.code === value
        return (
          <BaseButton
            key={language.code}
            className={styles.option}
            aria-pressed={active}
            onClick={() => onChange(language.code)}
          >
            <Typography
              variant='meta-sm'
              color={active ? 'brand' : 'muted'}
              component='span'
              className={styles.label}
            >
              {language.label}
            </Typography>
          </BaseButton>
        )
      })}
    </div>
  )
}
