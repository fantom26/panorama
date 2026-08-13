import { Radio as BaseRadio } from '@base-ui/react/radio'
import clsx from 'clsx'

import styles from '@/components/Radio/index.module.css'
import Typography from '@/components/Typography'

export type RadioProps = React.ComponentProps<typeof BaseRadio.Root> & {
  label?: string
  hint?: string
  error?: boolean
}

export default function Radio({ label, hint, error, disabled, className, ...rest }: RadioProps) {
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
