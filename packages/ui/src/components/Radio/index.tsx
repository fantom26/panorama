import { Radio as BaseRadio } from '@base-ui/react/radio'
import clsx from 'clsx'

import Hint from '@/components/Hint'
import styles from '@/components/Radio/index.module.css'
import Typography from '@/components/Typography'
import type { FormFieldProps } from '@/types/form.types'

export type RadioProps = React.ComponentProps<typeof BaseRadio.Root> & FormFieldProps

export default function Radio({ label, hint, error, disabled, className, ...rest }: RadioProps) {
  const message = error ?? hint

  return (
    <label className={styles.root} data-disabled={disabled || undefined}>
      <BaseRadio.Root
        disabled={disabled}
        className={clsx(styles.radio, className)}
        data-invalid={error || undefined}
        {...rest}
      >
        <BaseRadio.Indicator className={styles.indicator} />
      </BaseRadio.Root>
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
