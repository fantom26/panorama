'use client'

import { useIsFetching } from '@tanstack/react-query'

import styles from './RouteProgress.module.css'

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
