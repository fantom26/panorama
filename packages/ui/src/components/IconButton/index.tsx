import { Button as BaseButton } from '@base-ui/react/button'
import clsx from 'clsx'

import type { ButtonProps } from '@/components/Button'
import styles from '@/components/IconButton/index.module.css'

export type IconButtonProps = ButtonProps & {
  size?: 'sm' | 'md'
}

const sizeClassNames = {
  sm: styles.sm,
  md: styles.md
}

export default function IconButton({
  variant = 'outlined',
  size = 'md',
  className,
  ...rest
}: IconButtonProps) {
  return (
    <BaseButton
      className={clsx(
        styles.button,
        sizeClassNames[size],
        variant === 'contained' ? styles.contained : styles.outlined,
        className
      )}
      {...rest}
    />
  )
}
