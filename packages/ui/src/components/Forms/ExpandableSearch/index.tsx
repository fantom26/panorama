import { useEffect, useState } from 'react'

import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import Icon from '@/components/DataDisplay/Icon'
import Typography from '@/components/DataDisplay/Typography'
import styles from '@/components/Forms/ExpandableSearch/index.module.css'
import TextField from '@/components/Forms/TextField'
import Dialog from '@/components/Overlays/Dialog'

export type ExpandableSearchProps = {
  placeholder?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  children?: React.ReactNode
}

export default function ExpandableSearch({
  placeholder,
  value,
  defaultValue,
  onValueChange,
  className,
  children
}: ExpandableSearchProps) {
  const { t } = useTranslation()
  const resolvedPlaceholder = placeholder ?? t('expandableSearch.placeholder')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onValueChange?.(event.target.value)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => setOpen(next)}>
      <Dialog.Trigger className={clsx(styles.trigger, className)} aria-label={resolvedPlaceholder}>
        <span className={styles.adornment} aria-hidden='true'>
          <Icon name='search' />
        </span>
        <Typography
          component='span'
          variant='body-sm'
          color='subtle'
          className={styles.placeholder}
        >
          {resolvedPlaceholder}
        </Typography>
        <span className={styles.shortcut} aria-hidden='true'>
          {t('expandableSearch.shortcutHint')}
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup aria-label={resolvedPlaceholder}>
          <TextField
            autoFocus
            startAdornment={<Icon name='search' />}
            placeholder={resolvedPlaceholder}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
          />
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
