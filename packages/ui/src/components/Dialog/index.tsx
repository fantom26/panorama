import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import clsx from 'clsx'

import BackdropComponent from '@/components/Backdrop'
import CloseButton from '@/components/CloseButton'
import styles from '@/components/Dialog/index.module.css'
import Typography from '@/components/Typography'

function Backdrop({
  className,
  ...rest
}: Omit<React.ComponentProps<typeof BaseDialog.Backdrop>, 'children'>) {
  return <BaseDialog.Backdrop render={<BackdropComponent />} className={className} {...rest} />
}

function Popup({ className, ...rest }: React.ComponentProps<typeof BaseDialog.Popup>) {
  return <BaseDialog.Popup className={clsx(styles.popup, className)} {...rest} />
}

function Title({ className, ...rest }: React.ComponentProps<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      render={<Typography component='h2' variant='title-sm' />}
      className={clsx(styles.title, className)}
      {...rest}
    />
  )
}

function Description({ className, ...rest }: React.ComponentProps<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      render={<Typography component='p' variant='body-sm' />}
      className={className}
      {...rest}
    />
  )
}

function Close({
  className,
  ...rest
}: Omit<React.ComponentProps<typeof BaseDialog.Close>, 'children'>) {
  return (
    <BaseDialog.Close
      render={<CloseButton className={clsx(styles.close, className)} />}
      {...rest}
    />
  )
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
