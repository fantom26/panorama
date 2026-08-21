import { useState } from 'react'

import { Button as BaseButton } from '@base-ui/react/button'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import Icon from '../../DataDisplay/Icon'
import styles from './index.module.css'

export type Theme = 'light' | 'dark'

export type ThemeToggleProps = Omit<React.ComponentProps<typeof BaseButton>, 'children' | 'onClick'>

function readDocumentTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export default function ThemeToggle({ className, ...rest }: ThemeToggleProps) {
  const { t } = useTranslation()
  const [theme, setTheme] = useState<Theme>(readDocumentTheme)

  function handleClick() {
    const next = theme === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.theme = next
    setTheme(next)
  }

  return (
    <BaseButton
      className={clsx(styles.toggle, className)}
      aria-label={t('themeToggle.ariaLabel')}
      onClick={handleClick}
      {...rest}
    >
      <Icon name={theme === 'light' ? 'sun' : 'moon'} />
      <span className='visually-hidden'>{t(`themeToggle.${theme}`)}</span>
    </BaseButton>
  )
}
