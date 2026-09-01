export const queryKeys = {
  catalog: ['countries'] as const,
  dashboard: ['dashboard'] as const,
  country: (id: string) => ['country', id] as const,
  history: (id: string, indicator: string) => ['history', id, indicator] as const,
  ranking: (indicator: string) => ['ranking', indicator] as const
} as const
