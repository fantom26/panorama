import { useLayoutEffect, useRef } from 'react'

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

export type LineChartDatum = Record<string, string | number | null>

export type LineChartSeries = {
  dataKey: string
  label?: string
  valueFormatter?: (value: number) => string
}

export type LineChartProps = {
  dataset: LineChartDatum[]
  xAxis: { dataKey: string }
  series: LineChartSeries[]
  height?: number
  className?: string
  style?: React.CSSProperties
}

// Series separate by shade AND dash pattern together, so they stay legible in grayscale,
// print, and for color-blind reading — shade rank alone isn't enough past 2-3 series.
const DASH_PATTERNS: (number[] | undefined)[] = [undefined, undefined, [4, 3], [2, 3]]

export default function LineChart({
  dataset,
  xAxis,
  series,
  height = 280,
  className,
  style
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

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

      // `inversed` under RTL reads categories right-to-left, mirroring the plot.
      const xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 48, inversed: rtl })
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

      // `opposite` under RTL moves the single value axis to the right side, mirroring the plot.
      const yRenderer = am5xy.AxisRendererY.new(root, { opposite: rtl })
      yRenderer.ticks.template.set('visible', false)
      yRenderer.setAll({ strokeOpacity: 0 })

      const valueAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: yRenderer,
          extraMax: 0.1
        })
      )

      const showSeriesName = series.length > 1

      const lineSeriesList = series.map((s, index) => {
        const rankOpacity = CHART_RANK_OPACITIES[Math.min(index, CHART_RANK_OPACITIES.length - 1)]

        const lineSeries = chart.series.push(
          am5xy.LineSeries.new(root, {
            name: s.label ?? s.dataKey,
            xAxis: categoryAxis,
            yAxis: valueAxis,
            categoryXField: xAxis.dataKey,
            valueYField: s.dataKey,
            connect: false,
            ...(palette.textDefault ? { stroke: palette.textDefault } : {})
          })
        )
        lineSeries.strokes.template.setAll({
          strokeWidth: 2,
          strokeOpacity: rankOpacity,
          strokeDasharray: DASH_PATTERNS[index % DASH_PATTERNS.length]
        })

        const bulletTemplate = am5.Template.new<am5.Circle>({})
        lineSeries.bullets.push(() =>
          am5.Bullet.new(root, {
            sprite: am5.Circle.new(root, { radius: 4, strokeWidth: 2 }, bulletTemplate)
          })
        )
        if (palette.surface && palette.textDefault) {
          bulletTemplate.setAll({
            fill: palette.surface,
            stroke: palette.textDefault,
            fillOpacity: rankOpacity,
            strokeOpacity: rankOpacity
          })
        }

        lineSeries.data.setAll(dataset)

        const tooltip = am5.Tooltip.new(root, { pointerOrientation: 'vertical' })
        tooltip.label.set('text', showSeriesName ? '{name}: {valueY}' : '{valueY}')
        lineSeries.set('tooltip', tooltip)

        return lineSeries
      })

      const cursor = chart.set(
        'cursor',
        am5xy.XYCursor.new(root, {
          xAxis: categoryAxis,
          behavior: 'none',
          snapToSeries: lineSeriesList
        })
      )
      cursor.lineY.set('visible', false)

      return root
    }

    return mountReactiveChart(container, build)
  }, [dataset, xAxis, series])

  return (
    <div ref={containerRef} className={clsx(styles.root, className)} style={{ height, ...style }} />
  )
}
