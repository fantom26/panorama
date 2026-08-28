import { type CSSProperties, Fragment } from 'react'

import { Flag, Skeleton, Typography } from '@repo/ui'

import type { CompareColumn } from '@/hooks/useCompareCountries'
import { useTranslation } from '@/i18n'
import { buildCompareRows, COMPARE_ROW_KEYS, type CompareRowKey } from '@/lib/compare-matrix'
import { formatCompactNumber, formatGdp, formatPercent, formatUsd } from '@/utils/format'

import styles from './index.module.css'

const FORMATTERS: Record<CompareRowKey, (value: number) => string> = {
  population: formatCompactNumber,
  gdp: formatGdp,
  gdpPerCapita: formatUsd,
  inflation: formatPercent,
  unemployment: formatPercent
}

function formatCell(key: CompareRowKey, value: number | null) {
  return value === null ? '—' : FORMATTERS[key](value)
}

export type CompareMatrixProps = {
  columns: CompareColumn[]
  loading?: boolean
}

/**
 * Transposed indicator table: one row per headline indicator, one column per
 * compared country. Each cell shows the value and a bar sized to its share of the
 * row's maximum.
 */
export default function CompareMatrix({ columns, loading = false }: CompareMatrixProps) {
  const { t } = useTranslation('compare')
  const rows = buildCompareRows(columns.map((column) => column.stats))
  const gridStyle = { '--columns': columns.length } as CSSProperties

  return (
    <div className={styles.scroll}>
      <div className={styles.matrix} style={gridStyle}>
        <div className={styles.corner} />
        {columns.map((column) => (
          <div key={column.code} className={styles.head}>
            {column.country ? (
              <Flag code={column.country.iso2} />
            ) : (
              <span className={styles.flagFallback} />
            )}
            <span className={styles.headText}>
              <Typography variant='body-sm' component='span'>
                {column.country?.name ?? column.code}
              </Typography>
              <Typography variant='meta-sm' color='muted' component='span'>
                {column.code}
              </Typography>
            </span>
          </div>
        ))}

        {COMPARE_ROW_KEYS.map((key, rowIndex) => (
          <Fragment key={key}>
            <div className={styles.rowLabel}>
              <Typography variant='meta-sm' color='muted' component='span'>
                {t(`matrix.${key}`)}
              </Typography>
            </div>
            {columns.map((column, columnIndex) => {
              const cell = rows[rowIndex]?.cells[columnIndex] ?? null

              return (
                <div key={column.code} className={styles.cell}>
                  {loading ? (
                    <Skeleton width='55%' />
                  ) : (
                    <>
                      <Typography variant='title-default' component='span' className={styles.value}>
                        {formatCell(key, cell?.value ?? null)}
                      </Typography>
                      <span className={styles.bar}>
                        <span
                          className={styles.barFill}
                          style={{ inlineSize: `${(cell?.ratio ?? 0) * 100}%` }}
                        />
                      </span>
                    </>
                  )}
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
