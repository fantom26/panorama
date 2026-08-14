import { type ComponentProps, useLayoutEffect, useRef } from 'react'

import * as am5 from '@amcharts/amcharts5'
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow'
import * as am5map from '@amcharts/amcharts5/map'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import clsx from 'clsx'

import {
  CHART_RANK_OPACITIES,
  createPanoramaChartTheme,
  mountReactiveChart,
  readPanoramaChartPalette
} from '@/components/Charts/theme'

import styles from './index.module.css'

export type WorldMapDatum = { id: string; value?: number | null }

export type WorldMapProps = Omit<ComponentProps<'div'>, 'children'> & {
  data?: WorldMapDatum[]
  /** heat = value-shaded choropleth; lit = flat dim base with only `highlight` inked. */
  mode?: 'heat' | 'lit'
  /** ISO 3166-1 alpha-2 country codes rendered at full ink, e.g. selection or region scope. */
  highlight?: string[]
  /** Choropleth steps down the shared rank ramp. */
  buckets?: number
  /** Formats the tooltip value. Default: the raw value. */
  format?: (value: number) => string
  onSelect?: (id: string, name: string) => void
  height?: number
}

type WorldMapDataContext = { id: string; value?: number | null; name?: string }

export default function WorldMap({
  data = [],
  mode = 'heat',
  highlight = [],
  buckets = 4,
  format,
  onSelect,
  height = 420,
  className,
  style,
  ...rest
}: WorldMapProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const container = chartRef.current
    if (!container) return

    function build(container: HTMLDivElement) {
      const root = am5.Root.new(container)
      const palette = readPanoramaChartPalette(container)
      root.setThemes([am5themes_Animated.new(root), createPanoramaChartTheme(root, palette)])

      const chart = root.container.children.push(
        am5map.MapChart.new(root, {
          projection: am5map.geoNaturalEarth1(),
          panX: 'none',
          panY: 'none',
          wheelX: 'none',
          wheelY: 'none'
        })
      )

      const series = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
          valueField: 'value'
        })
      )

      const highlightSet = new Set(highlight)
      const values = data.map((d) => d.value).filter((v): v is number => v != null)
      const min = values.length ? Math.min(...values) : 0
      const range = (values.length ? Math.max(...values) : 1) - min || 1

      function bucketOpacity(value: number) {
        const normalized = (value - min) / range
        const step = Math.min(buckets - 1, Math.floor(normalized * buckets))
        const opacityIndex = Math.min(buckets - 1 - step, CHART_RANK_OPACITIES.length - 1)
        return CHART_RANK_OPACITIES[opacityIndex]
      }

      series.mapPolygons.template.setAll({
        interactive: true,
        strokeOpacity: 1,
        ...(onSelect ? { cursorOverStyle: 'pointer' } : {})
      })

      series.mapPolygons.template.adapters.add('fill', (fill, target) => {
        const context = target.dataItem?.dataContext as WorldMapDataContext | undefined
        if (context?.id && highlightSet.has(context.id)) return palette.textDefault ?? fill
        if (mode === 'lit') return palette.textDefault ?? fill
        return context?.value == null ? (palette.noData ?? fill) : (palette.textDefault ?? fill)
      })

      series.mapPolygons.template.adapters.add('fillOpacity', (_opacity, target) => {
        const context = target.dataItem?.dataContext as WorldMapDataContext | undefined
        if (context?.id && highlightSet.has(context.id)) return 1
        if (mode === 'lit') return CHART_RANK_OPACITIES[CHART_RANK_OPACITIES.length - 1]
        return context?.value == null ? 1 : bucketOpacity(context.value)
      })

      series.mapPolygons.template.adapters.add('stroke', (stroke, target) => {
        const context = target.dataItem?.dataContext as WorldMapDataContext | undefined
        return context?.id && highlightSet.has(context.id)
          ? (palette.textDefault ?? stroke)
          : (palette.surface ?? stroke)
      })

      series.mapPolygons.template.adapters.add('strokeWidth', (_strokeWidth, target) => {
        const context = target.dataItem?.dataContext as WorldMapDataContext | undefined
        return context?.id && highlightSet.has(context.id) ? 1 : 0.5
      })

      series.mapPolygons.template.adapters.add('tooltipText', (_text, target) => {
        const context = target.dataItem?.dataContext as WorldMapDataContext | undefined
        const value = context?.value
        const label = value == null ? 'No data' : format ? format(value) : String(value)
        return `${context?.name ?? ''}: ${label}`
      })

      if (palette.textDefault) {
        series.mapPolygons.template.states.create('hover', {
          fill: palette.textDefault,
          fillOpacity: 1
        })
      }

      if (onSelect) {
        series.mapPolygons.template.events.on('click', (ev) => {
          const context = ev.target.dataItem?.dataContext as WorldMapDataContext | undefined
          if (context?.id) onSelect(context.id, context.name ?? '')
        })
      }

      series.data.setAll(data)

      return root
    }

    return mountReactiveChart(container, build)
  }, [data, mode, highlight, buckets, format, onSelect])

  return (
    <div
      ref={chartRef}
      className={clsx(styles.root, className)}
      style={{ height, ...style }}
      {...rest}
    />
  )
}
