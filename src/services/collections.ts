import { collections } from '@/mocks/data'
import { delay } from '@/services/api'
import type { CollectionModel } from '@/types/models'

export const collectionsApi = {
  listByWorkspace: async (workspaceId: string): Promise<CollectionModel[]> =>
    delay(collections.filter((collection) => collection.workspaceId === workspaceId), 180),
  getById: async (collectionId: string): Promise<CollectionModel | undefined> =>
    delay(collections.find((collection) => collection.id === collectionId), 180),
}