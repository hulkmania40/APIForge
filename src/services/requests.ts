import { collections, mockResponse } from '@/mocks/data'
import { delay } from '@/services/api'
import type { ApiRequestModel, ResponseModel } from '@/types/models'

const flatRequests: ApiRequestModel[] = collections.flatMap((collection) =>
  collection.folders.flatMap((folder) => folder.requests),
)

export const requestsApi = {
  listByWorkspace: async (workspaceId: string): Promise<ApiRequestModel[]> =>
    delay(flatRequests.filter((request) => request.workspaceId === workspaceId), 160),
  getById: async (requestId: string): Promise<ApiRequestModel | undefined> =>
    delay(flatRequests.find((request) => request.id === requestId), 160),
  send: async (request: ApiRequestModel): Promise<ResponseModel> =>
    delay(
      {
        status: request.method === 'POST' ? 201 : 200,
        durationMs: 183,
        sizeBytes: 2418,
        headers: mockResponse.headers,
        body: JSON.stringify(
          {
            request: {
              method: request.method,
              url: request.url,
              authType: request.authType,
              queryParams: request.queryParams.filter((row) => row.enabled),
              headers: request.headers.filter((row) => row.enabled),
            },
            data: {
              success: true,
              id: 'mock-response',
            },
          },
          null,
          2,
        ),
      },
      350,
    ),
}