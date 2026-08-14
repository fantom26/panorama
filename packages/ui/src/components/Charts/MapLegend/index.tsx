import { type ComponentProps } from 'react'

import clsx from 'clsx'

import { CHART_RANK_OPACITIES } from '@/components/Charts/theme'
import Typography from '@/components/DataDisplay/Typography'

import styles from './index.module.css'

export type MapLegendProps = Omit<ComponentProps<'div'>, 'children'> & {
  from?: string
  to?: string
  range?: string
}

// Low → high reads light → dark, i.e. the ramp in reverse rank order.
const RAMP_LOW_TO_HIGH = [...CHART_RANK_OPACITIES].reverse()

export default function MapLegend({
  from = 'Low',
  to = 'High',
  range,
  className,
  ...rest
}: MapLegendProps) {
  return (
    <div className={clsx(styles.root, className)} {...rest}>
      <Typography variant='meta-sm' color='subtle' component='span'>
        {from}
      </Typography>
      <div className={styles.ramp}>
        {RAMP_LOW_TO_HIGH.map((opacity) => (
          <div key={opacity} className={styles.step} style={{ opacity }} />
        ))}
      </div>
      <Typography variant='meta-sm' color='subtle' component='span'>
        {to}
      </Typography>
      {range && (
        <Typography variant='meta-sm' color='subtle' component='span' className={styles.range}>
          {range}
        </Typography>
      )}
    </div>
  )
}
