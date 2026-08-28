import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import Typography from '../../DataDisplay/Typography'
import { CHART_RANK_OPACITIES } from '../theme'
import styles from './index.module.css'

export type MapLegendProps = {
  from?: string
  to?: string
  range?: string
  className?: string
}

// Low → high reads light → dark, i.e. the ramp in reverse rank order.
const RAMP_LOW_TO_HIGH = [...CHART_RANK_OPACITIES].reverse()

export default function MapLegend({ from, to, range, className }: MapLegendProps) {
  const { t } = useTranslation()

  return (
    <div className={clsx(styles.root, className)}>
      <Typography variant='meta-sm' color='subtle' component='span'>
        {from ?? t('charts.mapLegend.low')}
      </Typography>
      <div className={styles.ramp}>
        {RAMP_LOW_TO_HIGH.map((opacity) => (
          <div key={opacity} className={styles.step} style={{ opacity }} />
        ))}
      </div>
      <Typography variant='meta-sm' color='subtle' component='span'>
        {to ?? t('charts.mapLegend.high')}
      </Typography>
      {range && (
        <Typography variant='meta-sm' color='subtle' component='span' className={styles.range}>
          {range}
        </Typography>
      )}
    </div>
  )
}
