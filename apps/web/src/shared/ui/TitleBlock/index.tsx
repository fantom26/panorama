import clsx from 'clsx'

import styles from './index.module.css'

export type TitleBlockProps = {
  children: React.ReactNode
  className?: string
}

export default function TitleBlock({ children, className }: TitleBlockProps) {
  return <div className={clsx(styles.titleBlock, className)}>{children}</div>
}
