import Link from 'next/link'

import { Flag, Typography } from '@repo/ui'

import { ROUTES } from '@/shared/routes'
import type { Alpha2Code } from '@/shared/types/iso'

import styles from './index.module.css'

export type CountryCardMetric = { label: string; value: string }

export type CountryCardProps = {
  id: string
  iso2: string
  name: string
  /** Pre-formatted, already-translated label/value pairs. */
  metrics: CountryCardMetric[]
  className?: string
}

export default function CountryCard({ id, iso2, name, metrics, className }: CountryCardProps) {
  return (
    <Link
      href={ROUTES.country(id)}
      className={className ? `${styles.card} ${className}` : styles.card}
    >
      <span className={styles.head}>
        <Flag code={iso2 as Alpha2Code} />
        <Typography variant='body-sm' component='span'>
          {name}
        </Typography>
      </span>
      <dl className={styles.metrics}>
        {metrics.map((metric) => (
          <div key={metric.label} className={styles.metric}>
            <Typography variant='meta-sm' color='muted' component='dt'>
              {metric.label}
            </Typography>
            <Typography variant='body-sm' component='dd'>
              {metric.value}
            </Typography>
          </div>
        ))}
      </dl>
    </Link>
  )
}
