import clsx from 'clsx'

import Typography, { type TypographyColor } from '@/components/DataDisplay/Typography'
import Skeleton from '@/components/Feedback/Skeleton'

import styles from './index.module.css'

export type StatCardProps = React.ComponentProps<'div'> & {
  label: string
  value: React.ReactNode
  trend?: string
  trendColor?: 'default' | 'success' | 'error'
  loading?: boolean
}

const trendColorMap: Record<NonNullable<StatCardProps['trendColor']>, TypographyColor> = {
  default: 'subtle',
  success: 'utility-success',
  error: 'utility-error'
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
      <Skeleton width='50%' />
      <Skeleton className={styles.value} width='70%' height='1.75rem' />
      {trend && <Skeleton className={styles.trend} width='40%' />}
    </>
  ) : (
    <>
      <Typography variant='meta-sm' color='subtle' component='div'>
        {label}
      </Typography>
      <Typography variant='headline-sm' component='div' className={styles.value}>
        {value}
      </Typography>
      {trend && (
        <Typography
          variant='body-sm'
          color={trendColorMap[trendColor]}
          component='div'
          className={styles.trend}
        >
          {trend}
        </Typography>
      )}
    </>
  )

  return (
    <div className={clsx(styles.statCard, className)} aria-busy={loading || undefined} {...rest}>
      {content}
    </div>
  )
}
