'use client'

import { useIsFetching } from '@tanstack/react-query'

import styles from './RouteProgress.module.css'

/**
 * Thin top progress strip driven purely by React Query's in-flight count — no manual
 * loading flag. Advances while any query is fetching, then completes and fades out.
 */
export default function RouteProgress() {
  const fetching = useIsFetching()

  return (
    <div
      className={styles.bar}
      data-active={fetching > 0 ? 'true' : undefined}
      role='presentation'
      aria-hidden='true'
    />
  )
}
