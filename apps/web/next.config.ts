import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // @repo/ui ships raw TS/JSX source (no build step) — this tells Next to
  // compile it like first-party app code instead of treating it as a
  // pre-built node_modules package.
  transpilePackages: ['@repo/ui']
}

export default nextConfig
