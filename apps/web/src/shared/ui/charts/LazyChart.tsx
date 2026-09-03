'use client'

import type { CSSProperties, ReactNode } from 'react'

import { Skeleton } from '@repo/ui'

import { useInViewport } from '@/shared/hooks/useInViewport'

type LazyChartProps = {
  /** Reserved height (px) — must match the chart's own height so the swap never shifts layout. */
  height: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}

/**
 * Reserves vertical space and shows a Skeleton until the slot scrolls near the
 * viewport, then renders `children` (a `next/dynamic` chart) — so amCharts is
 * neither fetched nor initialised for charts the user never scrolls to.
 */
export default function LazyChart({ height, className, style, children }: LazyChartProps) {
  const { ref, inView } = useInViewport<HTMLDivElement>()

  return (
    <div ref={ref} className={className} style={{ minHeight: height, ...style }}>
      {inView ? children : <Skeleton variant='rectangular' width='100%' height={height} />}
    </div>
  )
}
