import { Button as BaseButton } from '@base-ui/react/button'
import clsx from 'clsx'

import Icon from '@/components/DataDisplay/Icon'

import styles from './index.module.css'

export type ChipProps = Omit<React.ComponentPropsWithoutRef<'span'>, 'onClick' | 'children'> & {
  variant?: 'outlined'
  label: string
  startIcon?: React.ReactNode
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onDelete?: (
    event: React.MouseEvent<HTMLSpanElement> | React.KeyboardEvent<HTMLButtonElement>
  ) => void
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
      onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => {
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
