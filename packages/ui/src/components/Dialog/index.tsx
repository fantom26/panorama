import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import clsx from 'clsx'

import styles from '@/components/Dialog/index.module.css'

function Backdrop({ className, ...rest }: React.ComponentProps<typeof BaseDialog.Backdrop>) {
  return <BaseDialog.Backdrop className={clsx(styles.Backdrop, className)} {...rest} />
}

function Popup({ className, ...rest }: React.ComponentProps<typeof BaseDialog.Popup>) {
  return <BaseDialog.Popup className={clsx(styles.Popup, className)} {...rest} />
}

function Title({ className, ...rest }: React.ComponentProps<typeof BaseDialog.Title>) {
  return <BaseDialog.Title className={clsx(styles.Title, className)} {...rest} />
}

function Description({ className, ...rest }: React.ComponentProps<typeof BaseDialog.Description>) {
  return <BaseDialog.Description className={clsx(styles.Description, className)} {...rest} />
}

function Close({ className, ...rest }: React.ComponentProps<typeof BaseDialog.Close>) {
  return <BaseDialog.Close className={clsx(styles.Close, className)} {...rest} />
}

const Dialog = {
  Root: BaseDialog.Root,
  Trigger: BaseDialog.Trigger,
  Portal: BaseDialog.Portal,
  Backdrop,
  Popup,
  Title,
  Description,
  Close
}

export default Dialog
