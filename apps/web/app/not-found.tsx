import Link from 'next/link'

export default function NotFound() {
  return (
    <main aria-label='Page not found'>
      <h1>404</h1>
      <p>This page doesn’t exist.</p>
      <Link href='/'>Back to home</Link>
    </main>
  )
}
