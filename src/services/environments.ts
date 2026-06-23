import { environments } from '@/mocks/data'
import { delay } from '@/services/api'
import type { EnvironmentVariableModel } from '@/types/models'

export const environmentsApi = {
  listByWorkspace: async (workspaceId: string): Promise<EnvironmentVariableModel[]> =>
    delay(
      environments
        .filter((environment) => environment.workspaceId === workspaceId)
        .map((environment) => ({
          id: environment.id,
          workspaceId: environment.workspaceId,
          key: environment.key,
          value: environment.value,
          description: environment.description,
        })),
      160,
    ),
}