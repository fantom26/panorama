'use client'

import dynamic from 'next/dynamic'

import type { ComponentProps } from 'react'

import LazyChart from './LazyChart'

// One dynamic import per chart — each resolves to its own async chunk holding
// that chart + amCharts, kept out of every route's initial JS. `ssr: false`
// because the charts touch the DOM in `useLayoutEffect`; `loading` is handled
// by LazyChart's reserved-height Skeleton, so the dynamic fallback is empty.
const WorldMapImpl = dynamic(() => import('@repo/ui/charts/WorldMap'), {
  ssr: false,
  loading: () => null
})
const LineChartImpl = dynamic(() => import('@repo/ui/charts/LineChart'), {
  ssr: false,
  loading: () => null
})
const BarChartImpl = dynamic(() => import('@repo/ui/charts/BarChart'), {
  ssr: false,
  loading: () => null
})
const DonutChartImpl = dynamic(() => import('@repo/ui/charts/DonutChart'), {
  ssr: false,
  loading: () => null
})

type WorldMapProps = ComponentProps<typeof WorldMapImpl>
type LineChartProps = ComponentProps<typeof LineChartImpl>
type BarChartProps = ComponentProps<typeof BarChartImpl>
type DonutChartProps = ComponentProps<typeof DonutChartImpl>

// Mirror the `@repo/ui` component defaults so the reserved box matches the chart.
const WORLD_MAP_HEIGHT = 420
const BAR_CHART_HEIGHT = 420
const LINE_CHART_HEIGHT = 280
const DONUT_SIZE = 200
const DONUT_LEGEND_ROW = 27
const DONUT_COLUMN_GAP = 28

/** Total height a DonutChart occupies (square canvas + legend) for a given `size`/`layout`. */
export function donutReservedHeight({
  size = DONUT_SIZE,
  layout = 'row',
  rows = 5
}: Pick<DonutChartProps, 'size' | 'layout'> & { rows?: number }) {
  const legend = rows * DONUT_LEGEND_ROW
  return layout === 'column' ? size + DONUT_COLUMN_GAP + legend : Math.max(size, legend)
}

export function WorldMap({ height = WORLD_MAP_HEIGHT, className, style, ...rest }: WorldMapProps) {
  return (
    <LazyChart height={height} className={className} style={style}>
      <WorldMapImpl height={height} {...rest} />
    </LazyChart>
  )
}

export function LineChart({
  height = LINE_CHART_HEIGHT,
  className,
  style,
  ...rest
}: LineChartProps) {
  return (
    <LazyChart height={height} className={className} style={style}>
      <LineChartImpl height={height} {...rest} />
    </LazyChart>
  )
}

export function BarChart({ height = BAR_CHART_HEIGHT, className, style, ...rest }: BarChartProps) {
  return (
    <LazyChart height={height} className={className} style={style}>
      <BarChartImpl height={height} {...rest} />
    </LazyChart>
  )
}

export function DonutChart({ className, style, ...rest }: DonutChartProps) {
  return (
    <LazyChart height={donutReservedHeight(rest)} className={className} style={style}>
      <DonutChartImpl {...rest} />
    </LazyChart>
  )
}
