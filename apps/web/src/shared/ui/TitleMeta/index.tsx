import clsx from 'clsx'

import styles from './index.module.css'

export type TitleMetaProps = {
  children: React.ReactNode
  className?: string
}

export default function TitleMeta({ children, className }: TitleMetaProps) {
  return <div className={clsx(styles.titleMeta, className)}>{children}</div>
}
