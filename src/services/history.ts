import { historyItems } from '@/mocks/data'
import { delay } from '@/services/api'
import type { HistoryItemModel } from '@/types/models'

export const historyApi = {
  list: async (): Promise<HistoryItemModel[]> => delay(historyItems, 160),
}