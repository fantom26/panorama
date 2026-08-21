import clsx from 'clsx'

import Skeleton from '../../Feedback/Skeleton'
import Typography, { type TypographyColor } from '../Typography'
import styles from './index.module.css'

export type StatCardProps = React.ComponentProps<'div'> & {
  label: string
  value: React.ReactNode
  trend?: string
  trendColor?: 'default' | 'success' | 'error'
  loading?: boolean
  /** 'card': bordered, standalone tile. 'row': flush cell in a divided strip. */
  variant?: 'card' | 'row'
}

const trendColorMap: Record<NonNullable<StatCardProps['trendColor']>, TypographyColor> = {
  default: 'muted',
  success: 'utility-success',
  error: 'utility-error'
}

export default function StatCard({
  label,
  value,
  trend,
  trendColor = 'default',
  loading = false,
  variant = 'card',
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
      <Typography variant='meta-sm' color='muted' component='div'>
        {label}
      </Typography>
      <Typography variant='title-default' component='div' className={styles.value}>
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
    <div
      className={clsx(styles.statCard, variant === 'row' && styles.row, className)}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </div>
  )
}
