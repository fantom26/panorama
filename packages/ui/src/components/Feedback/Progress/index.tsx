import { Progress as BaseProgress } from '@base-ui/react/progress'
import clsx from 'clsx'

import Typography from '@/components/DataDisplay/Typography'

import styles from './index.module.css'

function Root({ className, ...rest }: React.ComponentProps<typeof BaseProgress.Root>) {
  return <BaseProgress.Root className={clsx(styles.root, className)} {...rest} />
}

function Label({ className, ...rest }: React.ComponentProps<typeof BaseProgress.Label>) {
  return (
    <BaseProgress.Label
      render={<Typography component='span' variant='body-sm' />}
      className={clsx(styles.label, className)}
      {...rest}
    />
  )
}

function Track({ className, ...rest }: React.ComponentProps<typeof BaseProgress.Track>) {
  return <BaseProgress.Track className={clsx(styles.track, className)} {...rest} />
}

function Indicator({ className, ...rest }: React.ComponentProps<typeof BaseProgress.Indicator>) {
  return <BaseProgress.Indicator className={clsx(styles.indicator, className)} {...rest} />
}

function Value({ className, ...rest }: React.ComponentProps<typeof BaseProgress.Value>) {
  return (
    <BaseProgress.Value
      render={<Typography component='span' variant='body-sm' />}
      className={clsx(styles.value, className)}
      {...rest}
    />
  )
}

const Progress = { Root, Label, Track, Indicator, Value }

export default Progress
