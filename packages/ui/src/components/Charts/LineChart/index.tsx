import { type ComponentProps, useLayoutEffect, useRef } from 'react'

import * as am5 from '@amcharts/amcharts5'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import * as am5xy from '@amcharts/amcharts5/xy'
import clsx from 'clsx'

import styles from '@/components/Charts/LineChart/index.module.css'
import {
  createPanoramaChartTheme,
  mountReactiveChart,
  readPanoramaChartPalette
} from '@/components/Charts/theme'

export type LineChartDatum = Record<string, string | number | null>

export type LineChartProps = Omit<ComponentProps<'div'>, 'children'> & {
  dataset: LineChartDatum[]
  xAxis: { dataKey: string }
  series: {
    dataKey: string
    label?: string
    valueFormatter?: (value: number) => string
  }
  height?: number
}

export default function LineChart({
  dataset,
  xAxis,
  series,
  height = 280,
  className,
  style,
  ...rest
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    function build(container: HTMLDivElement) {
      const root = am5.Root.new(container)
      const palette = readPanoramaChartPalette(container)
      root.setThemes([am5themes_Animated.new(root), createPanoramaChartTheme(root, palette)])

      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: 'none',
          wheelY: 'none',
          layout: root.verticalLayout
        })
      )

      const xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 48 })
      xRenderer.grid.template.set('visible', false)
      xRenderer.ticks.template.set('visible', false)
      xRenderer.setAll({ strokeOpacity: 0 })

      const categoryAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: xAxis.dataKey,
          renderer: xRenderer
        })
      )
      categoryAxis.data.setAll(dataset)

      const yRenderer = am5xy.AxisRendererY.new(root, {})
      yRenderer.ticks.template.set('visible', false)
      yRenderer.setAll({ strokeOpacity: 0 })

      const valueAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: yRenderer,
          extraMax: 0.1
        })
      )

      const lineSeries = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: series.label ?? series.dataKey,
          xAxis: categoryAxis,
          yAxis: valueAxis,
          categoryXField: xAxis.dataKey,
          valueYField: series.dataKey,
          connect: false,
          stroke: palette.textDefault
        })
      )
      lineSeries.strokes.template.set('strokeWidth', 2)

      const bulletTemplate = am5.Template.new<am5.Circle>({})
      lineSeries.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, { radius: 4, strokeWidth: 2 }, bulletTemplate)
        })
      )
      bulletTemplate.setAll({ fill: palette.surface, stroke: palette.textDefault })

      lineSeries.data.setAll(dataset)

      const cursor = chart.set(
        'cursor',
        am5xy.XYCursor.new(root, {
          xAxis: categoryAxis,
          behavior: 'none',
          snapToSeries: [lineSeries]
        })
      )
      cursor.lineY.set('visible', false)

      const tooltip = am5.Tooltip.new(root, { pointerOrientation: 'vertical' })
      tooltip.label.set('text', '{valueY}')
      lineSeries.set('tooltip', tooltip)

      return root
    }

    return mountReactiveChart(container, build)
  }, [dataset, xAxis, series, series.dataKey, series.label, series.valueFormatter])

  return (
    <div
      ref={containerRef}
      className={clsx(styles.root, className)}
      style={{ height, ...style }}
      {...rest}
    />
  )
}
