import clsx from 'clsx'

import styles from '@/components/StatCard/index.module.css'
import type { ComponentProps, ReactNode } from 'react'

export type StatCardProps = ComponentProps<'div'> & {
  label: string
  value: ReactNode
  trend?: string
  trendColor?: 'default' | 'success' | 'error'
}

export default function StatCard({
  label,
  value,
  trend,
  trendColor = 'default',
  className,
  ...rest
}: StatCardProps) {
  return (
    <div className={clsx(styles.StatCard, className)} {...rest}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      {trend && <div className={clsx(styles.trend, styles[trendColor])}>{trend}</div>}
    </div>
  )
}