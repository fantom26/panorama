import { Button as BaseButton } from '@base-ui/react/button'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import Typography from '../../DataDisplay/Typography'
import styles from './index.module.css'

export type LanguageOption = { code: string; label: string }

export type LanguageSwitcherProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  languages: LanguageOption[]
  value?: string
  onChange?: (code: string) => void
}

export default function LanguageSwitcher({
  languages,
  value,
  onChange,
  className,
  ...rest
}: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation()
  const current = value ?? i18n.language

  function handleSelect(code: string) {
    if (onChange) {
      onChange(code)
    } else {
      i18n.changeLanguage(code)
    }
  }

  return (
    <div
      role='group'
      aria-label={t('languageSwitcher.ariaLabel')}
      className={clsx(styles.root, className)}
      {...rest}
    >
      {languages.map((language) => {
        const active = language.code === current
        return (
          <BaseButton
            key={language.code}
            className={styles.option}
            aria-pressed={active}
            onClick={() => handleSelect(language.code)}
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
