'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main aria-label='Error'>
      <h1>Something went wrong</h1>
      <p>The page hit an unexpected error.</p>
      <button type='button' onClick={reset}>
        Try again
      </button>
    </main>
  )
}
