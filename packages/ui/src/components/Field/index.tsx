import type { ReactNode } from 'react'

import { Field as BaseField } from '@base-ui/react/field'

import styles from '@/components/Field/index.module.css'
import Typography from '@/components/Typography'

export type FieldProps = Omit<React.ComponentProps<typeof BaseField.Root>, 'invalid'> & {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
}

export default function Field({ label, hint, error, required, children, ...rest }: FieldProps) {
  return (
    <BaseField.Root invalid={Boolean(error)} className={styles.field} {...rest}>
      {label && (
        <BaseField.Label
          render={<Typography component='label' variant='meta-sm' color='subtle' />}
          className={styles.label}
        >
          {label}
          {required && (
            <Typography component='span' variant='meta-sm' color='utility-error' aria-hidden='true'>
              *
            </Typography>
          )}
        </BaseField.Label>
      )}
      {children}
      {error ? (
        <BaseField.Error
          match
          render={<Typography component='div' variant='meta-sm' color='utility-error' />}
        >
          {error}
        </BaseField.Error>
      ) : (
        hint && (
          <BaseField.Description
            render={<Typography component='div' variant='meta-sm' color='subtle' />}
          >
            {hint}
          </BaseField.Description>
        )
      )}
    </BaseField.Root>
  )
}
