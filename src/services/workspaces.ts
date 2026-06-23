import { delay } from '@/services/api'
import { workspaces } from '@/mocks/data'
import type { WorkspaceModel } from '@/types/models'

export const workspacesApi = {
  list: async (): Promise<WorkspaceModel[]> => delay(workspaces, 180),
  getById: async (workspaceId: string): Promise<WorkspaceModel | undefined> =>
    delay(workspaces.find((workspace) => workspace.id === workspaceId), 160),
}