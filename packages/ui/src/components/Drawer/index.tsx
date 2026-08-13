import { Drawer as BaseDrawer } from '@base-ui/react/drawer'
import clsx from 'clsx'

import BackdropComponent from '@/components/Backdrop'
import CloseButton from '@/components/CloseButton'
import styles from '@/components/Drawer/index.module.css'
import Typography from '@/components/Typography'

export type DrawerAnchor = 'top' | 'bottom' | 'left' | 'right'

const anchorToSwipeDirection = {
  top: 'up',
  bottom: 'down',
  left: 'left',
  right: 'right'
} as const satisfies Record<
  DrawerAnchor,
  React.ComponentProps<typeof BaseDrawer.Root>['swipeDirection']
>

function Root({
  anchor = 'right',
  ...rest
}: Omit<React.ComponentProps<typeof BaseDrawer.Root>, 'swipeDirection'> & {
  anchor?: DrawerAnchor
}) {
  return <BaseDrawer.Root swipeDirection={anchorToSwipeDirection[anchor]} {...rest} />
}

function Backdrop({
  className,
  ...rest
}: Omit<React.ComponentProps<typeof BaseDrawer.Backdrop>, 'children'>) {
  return <BaseDrawer.Backdrop render={<BackdropComponent />} className={className} {...rest} />
}

function Viewport({ className, ...rest }: React.ComponentProps<typeof BaseDrawer.Viewport>) {
  return <BaseDrawer.Viewport className={clsx(styles.viewport, className)} {...rest} />
}

function Popup({ className, ...rest }: React.ComponentProps<typeof BaseDrawer.Popup>) {
  return <BaseDrawer.Popup className={clsx(styles.popup, className)} {...rest} />
}

function Content({ className, ...rest }: React.ComponentProps<typeof BaseDrawer.Content>) {
  return <BaseDrawer.Content className={clsx(styles.content, className)} {...rest} />
}

function Header({ className, ...rest }: React.ComponentProps<'div'>) {
  return <div className={clsx(styles.header, className)} {...rest} />
}

function Footer({ className, ...rest }: React.ComponentProps<'div'>) {
  return <div className={clsx(styles.footer, className)} {...rest} />
}

function Title({ className, ...rest }: React.ComponentProps<typeof BaseDrawer.Title>) {
  return (
    <BaseDrawer.Title
      render={<Typography component='h2' variant='title-sm' />}
      className={className}
      {...rest}
    />
  )
}

function Description({ className, ...rest }: React.ComponentProps<typeof BaseDrawer.Description>) {
  return (
    <BaseDrawer.Description
      render={<Typography component='p' variant='body-sm' color='subtle' />}
      className={className}
      {...rest}
    />
  )
}

function Close({
  className,
  ...rest
}: Omit<React.ComponentProps<typeof BaseDrawer.Close>, 'children'>) {
  return (
    <BaseDrawer.Close
      render={<CloseButton className={clsx(styles.close, className)} />}
      {...rest}
    />
  )
}

const Drawer = {
  Root,
  Trigger: BaseDrawer.Trigger,
  Portal: BaseDrawer.Portal,
  Backdrop,
  Viewport,
  Popup,
  Content,
  Header,
  Footer,
  Title,
  Description,
  Close
}

export default Drawer
