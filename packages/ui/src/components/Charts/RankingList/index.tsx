import clsx from 'clsx'

import Progress from '../../Feedback/Progress'
import styles from './index.module.css'

export type RankingListDatum = { label: string; value: number; id?: string }

export type RankingListProps = {
  data: RankingListDatum[]
  formatValue?: (value: number) => string
  /** When set, each row renders as a button and fires this with the datum's `id` on click. */
  onSelect?: (id: string) => void
  className?: string
}

export default function RankingList({
  data,
  formatValue = (value) => value.toLocaleString(),
  onSelect,
  className
}: RankingListProps) {
  const max = Math.max(...data.map((datum) => datum.value))

  return (
    <div className={clsx(styles.root, className)}>
      {data.map((datum) => {
        const { id, label, value } = datum
        const row = (
          <Progress.Root value={(value / max) * 100}>
            <Progress.Label>{label}</Progress.Label>
            <Progress.Track>
              <Progress.Indicator />
            </Progress.Track>
            <Progress.Value className={styles.value}>{() => formatValue(value)}</Progress.Value>
          </Progress.Root>
        )

        return onSelect && id != null ? (
          <button key={id} type='button' className={styles.row} onClick={() => onSelect(id)}>
            {row}
          </button>
        ) : (
          <div key={id ?? label} className={styles.staticRow}>
            {row}
          </div>
        )
      })}
    </div>
  )
}
