/**
 * Central React Query key factory. Keeping the keys in one place stops two call sites
 * from disagreeing on a key shape and silently splitting the cache. `catalog` keeps the
 * bare `['countries']` literal so the dashboard dataset, the search modal and the global
 * stats all read the same cached request.
 */
export const queryKeys = {
  catalog: ['countries'] as const,
  dashboard: ['dashboard'] as const,
  country: (id: string) => ['country', id] as const,
  history: (id: string, indicator: string) => ['history', id, indicator] as const
} as const
