import { selectGlobalOverview } from '@/features/global/model/global-overview'
import { useDashboardOverview } from '@/shared/hooks/useDashboardOverview'

export type {
  GlobalOverview,
  GlobalStat,
  LabelledValue,
  TileKey
} from '@/features/global/model/global-overview'

export function useGlobalStats() {
  return useDashboardOverview(selectGlobalOverview)
}
