import type { ComponentPropsWithoutRef, KeyboardEvent, MouseEvent, ReactNode } from 'react'

import { Button as BaseButton } from '@base-ui/react/button'
import clsx from 'clsx'

import styles from '@/components/Chip/index.module.css'
import Icon from '@/components/Icon'

export type ChipProps = Omit<ComponentPropsWithoutRef<'span'>, 'onClick' | 'children'> & {
  variant?: 'outlined'
  label: string
  startIcon?: ReactNode
  disabled?: boolean
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  onDelete?: (event: MouseEvent<HTMLSpanElement> | KeyboardEvent<HTMLButtonElement>) => void
}

export default function Chip({
  variant = 'outlined',
  label,
  startIcon,
  disabled,
  onClick,
  onDelete,
  className,
  ...rest
}: ChipProps) {
  const interactive = Boolean(onClick || onDelete)

  const content = (
    <>
      {startIcon && (
        <span className={styles.icon} aria-hidden='true'>
          {startIcon}
        </span>
      )}
      {label}
      {onDelete && (
        <span
          className={styles.deleteIcon}
          aria-hidden='true'
          onClick={(event) => {
            if (disabled) return
            event.stopPropagation()
            onDelete(event)
          }}
        >
          <Icon name='x' size={14} />
        </span>
      )}
    </>
  )

  const classNames = clsx(
    styles.chip,
    variant === 'outlined' && styles.outlined,
    interactive && styles.interactive,
    className
  )

  if (!interactive) {
    return (
      <span className={classNames} {...rest}>
        {content}
      </span>
    )
  }

  return (
    <BaseButton
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
        if (onDelete && (event.key === 'Delete' || event.key === 'Backspace')) {
          event.preventDefault()
          onDelete(event)
        }
      }}
      {...rest}
    >
      {content}
    </BaseButton>
  )
}
