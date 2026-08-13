import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import clsx from 'clsx'

import styles from '@/components/Checkbox/index.module.css'
import Hint from '@/components/Hint'
import Icon from '@/components/Icon'
import Typography from '@/components/Typography'
import type { FormFieldProps } from '@/types/form.types'

export type CheckboxProps = React.ComponentProps<typeof BaseCheckbox.Root> & FormFieldProps

export default function Checkbox({
  label,
  hint,
  error,
  disabled,
  indeterminate,
  className,
  ...rest
}: CheckboxProps) {
  const message = error ?? hint

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
      {(label || message) && (
        <span className={styles.text}>
          {label && (
            <Typography component='span' variant='label-sm'>
              {label}
            </Typography>
          )}
          {message && <Hint error={Boolean(error)} text={message} />}
        </span>
      )}
    </label>
  )
}
