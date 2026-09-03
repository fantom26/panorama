import { useLayoutEffect, useMemo, useRef } from 'react'

import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import clsx from 'clsx'

import {
  applyPanoramaChartLocale,
  buildChartThemes,
  CHART_RANK_OPACITIES,
  isRtlContainer,
  mountReactiveChart,
  readPanoramaChartPalette
} from '../theme'
import styles from './index.module.css'

export type BarChartDatum = { label: string; value: number; id?: string }

export type BarChartProps = {
  data: BarChartDatum[]
  formatValue?: (value: number) => string
  /** When set, each bar becomes clickable and fires this with the datum's `id`. */
  onSelect?: (id: string) => void
  height?: number
  className?: string
  style?: React.CSSProperties
}

type BarRow = BarChartDatum & { valueLabel: string }

export default function BarChart({
  data,
  formatValue = (value) => value.toLocaleString(),
  onSelect,
  height = 420,
  className,
  style
}: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // amCharts number formats can't take a JS callback, so the display string is
  // precomputed into the dataset and bound as `{valueLabel}`.
  const dataset: BarRow[] = useMemo(
    () => data.map((datum) => ({ ...datum, valueLabel: formatValue(datum.value) })),
    [data, formatValue]
  )

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    function build(container: HTMLDivElement) {
      const root = am5.Root.new(container)
      const rtl = isRtlContainer(container)
      const palette = readPanoramaChartPalette(container)
      root.setThemes(buildChartThemes(root, palette, rtl))
      applyPanoramaChartLocale(root, rtl)

      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: 'none',
          wheelY: 'none',
          layout: root.verticalLayout
        })
      )

      // Category on Y, value on X — `inversed` keeps the highest-ranked bar on top.
      const yRenderer = am5xy.AxisRendererY.new(root, {
        inversed: true,
        cellStartLocation: 0.15,
        cellEndLocation: 0.85,
        minGridDistance: 16
      })
      yRenderer.grid.template.set('visible', false)
      yRenderer.ticks.template.set('visible', false)
      yRenderer.setAll({ strokeOpacity: 0 })

      const categoryAxis = chart.yAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: 'label',
          renderer: yRenderer
        })
      )
      categoryAxis.data.setAll(dataset)

      // The bar's own end label carries the value, so the axis scale is redundant.
      // `inversed` under RTL grows bars right-to-left, mirroring the plot.
      const xRenderer = am5xy.AxisRendererX.new(root, { inversed: rtl })
      xRenderer.grid.template.set('visible', false)
      xRenderer.ticks.template.set('visible', false)
      xRenderer.labels.template.set('visible', false)
      xRenderer.setAll({ strokeOpacity: 0 })

      const valueAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: xRenderer,
          min: 0,
          // Headroom so the longest bar's trailing label stays inside the plot.
          extraMax: 0.25
        })
      )

      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          xAxis: valueAxis,
          yAxis: categoryAxis,
          valueXField: 'value',
          categoryYField: 'label',
          tooltip: am5.Tooltip.new(root, { labelText: '{categoryY}: {valueLabel}' })
        })
      )

      series.columns.template.setAll({
        cornerRadiusTR: 4,
        cornerRadiusBR: 4,
        strokeOpacity: 0,
        height: am5.percent(100),
        ...(palette.textDefault ? { fill: palette.textDefault } : {}),
        ...(onSelect ? { cursorOverStyle: 'pointer' } : {})
      })

      // One ink at one opacity: every bar is the same series, so the rank ramp
      // (which clamps after 5 steps) would flat-line across a top-N chart.
      series.columns.template.states.create('hover', {
        fillOpacity: CHART_RANK_OPACITIES[1]
      })

      if (onSelect) {
        series.columns.template.events.on('click', (event) => {
          const { id } = (event.target.dataItem?.dataContext ?? {}) as Partial<BarRow>
          if (id) onSelect(id)
        })
      }

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          locationX: 1,
          sprite: am5.Label.new(root, {
            text: '{valueLabel}',
            populateText: true,
            centerY: am5.p50,
            // Flip the label to the bar's visual trailing edge under RTL (the anchor point
            // itself, `locationX: 1`, already tracks the bar's end regardless of `inversed`).
            centerX: rtl ? am5.p100 : am5.p0,
            paddingLeft: rtl ? 0 : 8,
            paddingRight: rtl ? 8 : 0,
            ...(palette.textSubtle ? { fill: palette.textSubtle } : {})
          })
        })
      )

      series.data.setAll(dataset)

      return root
    }

    return mountReactiveChart(container, build)
  }, [dataset, onSelect])

  return (
    <div ref={containerRef} className={clsx(styles.root, className)} style={{ height, ...style }} />
  )
}
