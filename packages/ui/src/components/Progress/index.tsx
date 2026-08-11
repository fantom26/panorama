import { Progress as BaseProgress } from '@base-ui/react/progress'
import clsx from 'clsx'

import styles from '@/components/Progress/index.module.css'

function Root({ className, ...rest }: React.ComponentProps<typeof BaseProgress.Root>) {
  return <BaseProgress.Root className={clsx(styles.Root, className)} {...rest} />
}

function Track({ className, ...rest }: React.ComponentProps<typeof BaseProgress.Track>) {
  return <BaseProgress.Track className={clsx(styles.Track, className)} {...rest} />
}

function Indicator({ className, ...rest }: React.ComponentProps<typeof BaseProgress.Indicator>) {
  return <BaseProgress.Indicator className={clsx(styles.Indicator, className)} {...rest} />
}

const Progress = { Root, Track, Indicator }

export default Progress
