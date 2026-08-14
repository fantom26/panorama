import { type ComponentProps, useLayoutEffect, useMemo, useRef } from 'react'

import * as am5 from '@amcharts/amcharts5'
import * as am5percent from '@amcharts/amcharts5/percent'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import clsx from 'clsx'

import {
  CHART_RANK_OPACITIES,
  createPanoramaChartTheme,
  mountReactiveChart,
  readPanoramaChartPalette
} from '@/components/Charts/theme'
import Typography from '@/components/DataDisplay/Typography'

import styles from './index.module.css'

export type DonutChartDatum = { label: string; value: number }

export type DonutChartProps = Omit<ComponentProps<'div'>, 'children'> & {
  data: DonutChartDatum[]
  size?: number
  legend?: boolean
  layout?: 'row' | 'column'
}

// Ramp has 5 steps and clamps rather than wraps, so a 6th+ item would otherwise repeat
// the last shade — group anything past the 4th-ranked item into a single "Other" slice.
const MAX_SLICES = CHART_RANK_OPACITIES.length

function groupTail(data: DonutChartDatum[]): DonutChartDatum[] {
  if (data.length <= MAX_SLICES) return data
  const head = data.slice(0, MAX_SLICES - 1)
  const tailTotal = data.slice(MAX_SLICES - 1).reduce((sum, d) => sum + d.value, 0)
  return [...head, { label: 'Other', value: tailTotal }]
}

export default function DonutChart({
  data,
  size = 200,
  legend = true,
  layout = 'row',
  className,
  style,
  ...rest
}: DonutChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartData = useMemo(() => groupTail(data), [data])
  const total = chartData.reduce((sum, d) => sum + d.value, 0)

  useLayoutEffect(() => {
    const container = chartRef.current
    if (!container) return

    function build(container: HTMLDivElement) {
      const root = am5.Root.new(container)
      const palette = readPanoramaChartPalette(container)
      root.setThemes([am5themes_Animated.new(root), createPanoramaChartTheme(root, palette)])

      const chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout,
          innerRadius: am5.percent(80)
        })
      )

      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          categoryField: 'label',
          valueField: 'value'
        })
      )
      series.labels.template.set('visible', false)
      series.ticks.template.set('visible', false)
      series.slices.template.set('strokeOpacity', 0)

      if (palette.textDefault) {
        const textDefault = palette.textDefault
        series.slices.template.adapters.add('fill', () => textDefault)
      }
      series.slices.template.adapters.add('fillOpacity', (_opacity, target) => {
        const dataItem = target.dataItem as am5.DataItem<am5percent.IPieSeriesDataItem> | undefined
        const index = chartData.findIndex((datum) => datum.label === dataItem?.get('category'))
        return CHART_RANK_OPACITIES[Math.min(Math.max(index, 0), CHART_RANK_OPACITIES.length - 1)]
      })

      series.data.setAll(chartData)

      return root
    }

    return mountReactiveChart(container, build)
  }, [chartData])

  return (
    <div className={clsx(styles.root, styles[layout], className)} style={style} {...rest}>
      <div ref={chartRef} className={styles.chart} style={{ width: size, height: size }} />
      {legend && (
        <div className={styles.legend}>
          {chartData.map((datum, index) => (
            <div key={datum.label} className={styles.legendRow}>
              <div className={styles.legendLabel}>
                <span
                  className={styles.swatch}
                  style={{
                    opacity: CHART_RANK_OPACITIES[Math.min(index, CHART_RANK_OPACITIES.length - 1)]
                  }}
                />
                <Typography variant='body-sm' component='span'>
                  {datum.label}
                </Typography>
              </div>
              <Typography
                variant='meta-sm'
                color='subtle'
                component='span'
                className={styles.legendValue}
              >
                {`${((datum.value / total) * 100).toFixed(1)}%`}
              </Typography>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
