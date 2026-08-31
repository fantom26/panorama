import clsx from 'clsx'

import { StatCard } from '@repo/ui'

import type { Stat } from '@/shared/model/stat'

import styles from './index.module.css'

export type StatTilesProps = {
  tiles: Stat<string>[]
  labelFor: (key: string) => string
  loading?: boolean
  /** Tile count once the grid goes multi-column at ≥768px. Default 5. */
  columns?: 4 | 5
  className?: string
}

export default function StatTiles({
  tiles,
  labelFor,
  loading,
  columns = 5,
  className
}: StatTilesProps) {
  return (
    <div className={clsx(styles.stats, columns === 4 ? styles.cols4 : styles.cols5, className)}>
      {tiles.map((tile) => (
        <StatCard
          key={tile.key}
          variant='row'
          label={labelFor(tile.key)}
          value={tile.value}
          loading={loading}
        />
      ))}
    </div>
  )
}
