import clsx from 'clsx'

import Progress from '@/components/Feedback/Progress'

import styles from './index.module.css'

export type RankingListDatum = { label: string; value: number }

export type RankingListProps = Omit<React.ComponentProps<'div'>, 'children'> & {
  data: RankingListDatum[]
  formatValue?: (value: number) => string
}

export default function RankingList({
  data,
  formatValue = (value) => value.toLocaleString(),
  className,
  ...rest
}: RankingListProps) {
  const max = Math.max(...data.map((datum) => datum.value))

  return (
    <div className={clsx(styles.root, className)} {...rest}>
      {data.map((datum) => (
        <Progress.Root key={datum.label} value={(datum.value / max) * 100}>
          <Progress.Label>{datum.label}</Progress.Label>
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
          <Progress.Value className={styles.value}>{() => formatValue(datum.value)}</Progress.Value>
        </Progress.Root>
      ))}
    </div>
  )
}
