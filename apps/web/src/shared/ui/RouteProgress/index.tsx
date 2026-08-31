'use client'

import { useEffect, useRef, useState } from 'react'

import { useIsFetching } from '@tanstack/react-query'

import styles from './index.module.css'

const MIN_VISIBLE_MS = 300
const FADE_MS = 320

type Phase = 'idle' | 'loading' | 'done'

export default function RouteProgress() {
  const fetching = useIsFetching()
  const [phase, setPhase] = useState<Phase>('idle')
  const startedAt = useRef(0)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const clear = () => {
      timers.current.forEach((id) => window.clearTimeout(id))
      timers.current = []
    }

    if (fetching > 0) {
      clear()
      if (startedAt.current === 0) startedAt.current = Date.now()
      setPhase('loading')
      return clear
    }

    if (startedAt.current === 0) return clear

    const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt.current))
    timers.current.push(
      window.setTimeout(() => setPhase('done'), wait),
      window.setTimeout(() => {
        setPhase('idle')
        startedAt.current = 0
      }, wait + FADE_MS)
    )

    return clear
  }, [fetching])

  return <div className={styles.bar} data-phase={phase} role='presentation' aria-hidden='true' />
}
