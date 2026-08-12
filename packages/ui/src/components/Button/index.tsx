import { Button as BaseButton } from '@base-ui/react/button'
import clsx from 'clsx'

import styles from '@/components/Button/index.module.css'

export type ButtonProps = React.ComponentProps<typeof BaseButton> & {
  variant?: 'contained' | 'outlined'
}

export default function Button({ variant = 'outlined', className, ...rest }: ButtonProps) {
  return (
    <BaseButton
      className={clsx(
        styles.button,
        variant === 'contained' ? styles.contained : styles.outlined,
        className
      )}
      {...rest}
    />
  )
}
