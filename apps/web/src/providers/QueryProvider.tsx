'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// The Statistics of the World API allows 1,000 unauthenticated requests/day per IP,
// and its data updates on a monthly cadence at most — so treat every fetch as
// effectively static for the session: never refetch on window focus, and never
// consider cached data stale, to avoid burning the daily budget on redundant calls.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // never trigger a refetch until the Query is invalidated manually
      gcTime: 24 * 60 * 60 * 1000, // by default, "inactive" queries are garbage collected after 5 minutes
      refetchOnWindowFocus: false,
      retry: 1 // default 3
    }
  }
})

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
