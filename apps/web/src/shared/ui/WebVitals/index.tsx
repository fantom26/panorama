'use client'

import { useReportWebVitals } from 'next/web-vitals'

const ENDPOINT = process.env.NEXT_PUBLIC_VITALS_URL

/**
 * Reports Core Web Vitals (LCP, CLS, INP, FCP, TTFB). In development it logs each
 * metric; in any environment it beacons them to `NEXT_PUBLIC_VITALS_URL` when that
 * is set. Renders nothing.
 */
export default function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[web-vital] ${metric.name} ${Math.round(metric.value)} (${metric.rating})`)
    }

    if (ENDPOINT && typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(ENDPOINT, JSON.stringify({ ...metric, url: window.location.pathname }))
    }
  })

  return null
}
