import { Button as BaseButton } from '@base-ui/react/button'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import Icon, { type IconName } from '../../DataDisplay/Icon'
import styles from './index.module.css'

export type ThemePreference = 'system' | 'light' | 'dark'

/** Click order: whatever you're on → the next one, wrapping back to `system`. */
const NEXT: Record<ThemePreference, ThemePreference> = {
  system: 'light',
  light: 'dark',
  dark: 'system'
}

const ICON: Record<ThemePreference, IconName> = {
  system: 'monitor',
  light: 'sun',
  dark: 'moon'
}

export type ThemeToggleProps = Omit<
  React.ComponentProps<typeof BaseButton>,
  'children' | 'onClick' | 'onChange' | 'value'
> & {
  value: ThemePreference
  onChange: (next: ThemePreference) => void
}

export default function ThemeToggle({ value, onChange, className, ...rest }: ThemeToggleProps) {
  const { t } = useTranslation()

  return (
    <BaseButton
      className={clsx(styles.toggle, className)}
      aria-label={t('themeToggle.ariaLabel')}
      title={t(`themeToggle.${value}`)}
      onClick={() => onChange(NEXT[value])}
      {...rest}
    >
      <Icon name={ICON[value]} />
      <span className='visually-hidden'>{t(`themeToggle.${value}`)}</span>
    </BaseButton>
  )
}
