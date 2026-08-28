import clsx from 'clsx'

import styles from './index.module.css'

export type SkeletonProps = {
  variant?: 'text' | 'rectangular'
  width?: number | string
  height?: number | string
  className?: string
  style?: React.CSSProperties
}

export default function Skeleton({
  variant = 'text',
  width,
  height,
  className,
  style
}: SkeletonProps) {
  return (
    <span
      className={clsx(styles.skeleton, styles[variant], className)}
      style={{ width, height, ...style }}
      aria-hidden='true'
    />
  )
}
