import { Progress as BaseProgress } from '@base-ui/react/progress'
import clsx from 'clsx'

import styles from '@/components/Progress/index.module.css'

function Root({ className, ...rest }: React.ComponentProps<typeof BaseProgress.Root>) {
  return <BaseProgress.Root className={clsx(styles.root, className)} {...rest} />
}

function Track({ className, ...rest }: React.ComponentProps<typeof BaseProgress.Track>) {
  return <BaseProgress.Track className={clsx(styles.track, className)} {...rest} />
}

function Indicator({ className, ...rest }: React.ComponentProps<typeof BaseProgress.Indicator>) {
  return <BaseProgress.Indicator className={clsx(styles.indicator, className)} {...rest} />
}

const Progress = { Root, Track, Indicator }

export default Progress
