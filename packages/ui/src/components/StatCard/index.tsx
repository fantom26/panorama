import clsx from 'clsx'

import Skeleton from '@/components/Skeleton'
import styles from '@/components/StatCard/index.module.css'
import type { ComponentProps, ReactNode } from 'react'

export type StatCardProps = ComponentProps<'div'> & {
  label: string
  value: ReactNode
  trend?: string
  trendColor?: 'default' | 'success' | 'error'
  loading?: boolean
}

export default function StatCard({
  label,
  value,
  trend,
  trendColor = 'default',
  loading = false,
  className,
  ...rest
}: StatCardProps) {
  const content = loading ? (
    <>
      <Skeleton className={styles.label} width='50%' />
      <Skeleton className={styles.value} width='70%' height='1.75rem' />
      {trend && <Skeleton className={styles.trend} width='40%' />}
    </>
  ) : (
    <>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      {trend && <div className={clsx(styles.trend, styles[trendColor])}>{trend}</div>}
    </>
  )

  return (
    <div className={clsx(styles.statCard, className)} aria-busy={loading || undefined} {...rest}>
      {content}
    </div>
  )
}