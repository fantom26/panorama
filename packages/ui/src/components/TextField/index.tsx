import type { ReactNode } from 'react'

import { Input as BaseInput } from '@base-ui/react/input'
import clsx from 'clsx'

import styles from '@/components/TextField/index.module.css'

export type TextFieldProps = React.ComponentProps<typeof BaseInput> & {
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  error?: boolean
  /** Aligns digits with mono tabular values — use for numeric fields. */
  tabular?: boolean
}

export default function TextField({
  startAdornment,
  endAdornment,
  error,
  tabular,
  disabled,
  className,
  ...rest
}: TextFieldProps) {
  return (
    <div
      className={clsx(styles.root, tabular && styles.tabular, className)}
      data-invalid={error || undefined}
      data-disabled={disabled || undefined}
    >
      {startAdornment && <span className={styles.adornment}>{startAdornment}</span>}
      <BaseInput
        className={styles.input}
        disabled={disabled}
        aria-invalid={error || undefined}
        {...rest}
      />
      {endAdornment && <span className={styles.adornment}>{endAdornment}</span>}
    </div>
  )
}
