import withBundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // @repo/ui ships raw TS/JSX source (no build step) — this tells Next to
  // compile it like first-party app code instead of treating it as a
  // pre-built node_modules package.
  transpilePackages: ['@repo/ui']
}

// Off unless `ANALYZE=true` (the `analyze` script) — no effect on `build` / CI.
const analyzer = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })

export default analyzer(nextConfig)
