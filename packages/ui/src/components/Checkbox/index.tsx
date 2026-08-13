import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import clsx from 'clsx'

import styles from '@/components/Checkbox/index.module.css'
import Icon from '@/components/Icon'
import Typography from '@/components/Typography'

export type CheckboxProps = React.ComponentProps<typeof BaseCheckbox.Root> & {
  label?: string
  hint?: string
  error?: boolean
}

export default function Checkbox({
  label,
  hint,
  error,
  disabled,
  indeterminate,
  className,
  ...rest
}: CheckboxProps) {
  return (
    <label className={styles.root} data-disabled={disabled || undefined}>
      <BaseCheckbox.Root
        disabled={disabled}
        indeterminate={indeterminate}
        className={clsx(styles.checkbox, className)}
        data-invalid={error || undefined}
        {...rest}
      >
        <BaseCheckbox.Indicator className={styles.indicator}>
          <Icon name={indeterminate ? 'minus' : 'check'} size={13} />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {(label || hint) && (
        <span className={styles.text}>
          {label && (
            <Typography component='span' variant='label-sm'>
              {label}
            </Typography>
          )}
          {hint && (
            <Typography component='span' variant='meta-sm' color='subtle'>
              {hint}
            </Typography>
          )}
        </span>
      )}
    </label>
  )
}
