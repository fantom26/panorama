import { Field as BaseField } from '@base-ui/react/field'

import type { FormFieldProps } from '../../../types/form.types'
import Typography from '../../DataDisplay/Typography'
import Hint from '../Hint'
import styles from './index.module.css'

export type FieldProps = Omit<React.ComponentProps<typeof BaseField.Root>, 'invalid'> &
  FormFieldProps & {
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
        <BaseField.Error match>
          <Hint error text={error} />
        </BaseField.Error>
      ) : (
        hint && (
          <BaseField.Description>
            <Hint text={hint} />
          </BaseField.Description>
        )
      )}
    </BaseField.Root>
  )
}
