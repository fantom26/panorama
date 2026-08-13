import { Toast as BaseToast } from '@base-ui/react/toast'
import clsx from 'clsx'

import CloseButton from '@/components/Buttons/CloseButton'
import Typography from '@/components/DataDisplay/Typography'
import styles from '@/components/Feedback/Toast/index.module.css'

export type ToastVariant = 'info' | 'success' | 'error' | 'warning'

function Viewport({ className, ...rest }: React.ComponentProps<typeof BaseToast.Viewport>) {
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport className={clsx(styles.viewport, className)} {...rest} />
    </BaseToast.Portal>
  )
}

function Root({ className, ...rest }: React.ComponentProps<typeof BaseToast.Root>) {
  return (
    <BaseToast.Root className={clsx(styles.root, className)} {...rest}>
      <BaseToast.Title
        render={<Typography component='h2' variant='label-sm' />}
        className={styles.title}
      />
      <BaseToast.Description
        render={<Typography component='p' variant='body-sm' color='subtle' />}
        className={styles.description}
      />
      <BaseToast.Action className={styles.action} />
      <BaseToast.Close render={<CloseButton size='sm' className={styles.close} />} />
    </BaseToast.Root>
  )
}

const Toast = {
  Provider: BaseToast.Provider,
  Viewport,
  Root
}

export default Toast
