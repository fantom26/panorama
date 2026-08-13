import clsx from 'clsx'

import styles from '@/components/Overlays/Backdrop/index.module.css'

export type BackdropProps = React.ComponentProps<'div'>

export default function Backdrop({ className, ...rest }: BackdropProps) {
  return <div className={clsx(styles.backdrop, className)} {...rest} />
}
