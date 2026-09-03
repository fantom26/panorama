'use client'

import { useEffect, useRef, useState } from 'react'

type UseInViewportOptions = {
  /** Pre-load margin around the viewport before the element technically enters it. */
  rootMargin?: string
}

/**
 * Latches `true` once the element enters (or comes within `rootMargin` of) the
 * viewport, and stays `true` afterwards — so a gated subtree mounts once and is
 * never torn down on scroll-away.
 *
 * Returns `true` immediately where `IntersectionObserver` is unavailable (jsdom
 * without a stub, very old browsers) so gated content can never be permanently
 * hidden.
 */
export function useInViewport<T extends Element>({
  rootMargin = '200px'
}: UseInViewportOptions = {}) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (inView) return
    const element = ref.current
    if (!element) return

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [inView, rootMargin])

  return { ref, inView }
}
