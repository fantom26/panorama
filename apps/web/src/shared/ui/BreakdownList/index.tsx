import Link from 'next/link'

import { Typography } from '@repo/ui'

import styles from './index.module.css'

export type BreakdownRow = {
  key: string
  label: string
  /** Muted text after the label, e.g. a slug. */
  sublabel?: string
  /** When set the row is a link; otherwise a plain row. */
  href?: string
  /** Pre-formatted, already-translated metric strings. */
  metrics: string[]
}

export type BreakdownListProps = {
  rows: BreakdownRow[]
  className?: string
}

export default function BreakdownList({ rows, className }: BreakdownListProps) {
  return (
    <div className={className ? `${styles.list} ${className}` : styles.list}>
      {rows.map((row) => {
        const content = (
          <>
            <span className={styles.name}>
              <Typography variant='body-sm' component='span'>
                {row.label}
              </Typography>
              {row.sublabel && (
                <Typography variant='meta-sm' color='muted' component='span'>
                  {row.sublabel}
                </Typography>
              )}
            </span>
            <span className={styles.metrics}>
              {row.metrics.map((metric, index) => (
                <Typography
                  key={`${row.key}:${index}`}
                  variant='meta-sm'
                  color='muted'
                  component='span'
                >
                  {metric}
                </Typography>
              ))}
            </span>
            <Typography variant='body-sm' color='muted' component='span' aria-hidden='true'>
              →
            </Typography>
          </>
        )

        return row.href ? (
          <Link key={row.key} href={row.href} className={styles.row}>
            {content}
          </Link>
        ) : (
          <div key={row.key} className={styles.row}>
            {content}
          </div>
        )
      })}
    </div>
  )
}
