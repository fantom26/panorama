import clsx from 'clsx'

import styles from '@/components/Skeleton/index.module.css'

export type SkeletonProps = React.ComponentProps<'span'> & {
  variant?: 'text' | 'rectangular'
  width?: number | string
  height?: number | string
}

export default function Skeleton({
  variant = 'text',
  width,
  height,
  className,
  style,
  ...rest
}: SkeletonProps) {
  return (
    <span
      className={clsx(styles.skeleton, styles[variant], className)}
      style={{ width, height, ...style }}
      aria-hidden='true'
      {...rest}
    />
  )
}
