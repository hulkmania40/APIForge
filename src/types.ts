export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type WorkspaceModel = {
  id: string
  name: string
  color: string
  memberCount: number
  requestCount: number
  lastOpenedAt: string
  slug: string
  description: string
  updatedAt: string
}

export type CollectionNodeType = 'workspace' | 'collection' | 'folder' | 'request'

export type CollectionNode = {
  id: string
  type: CollectionNodeType
  name: string
  method?: HttpMethod
  path?: string
  children?: CollectionNode[]
}

export type RequestModel = {
  id: string
  name: string
  method: HttpMethod
  url: string
  folder: string
  authType: 'none' | 'bearer'
  status: number
  durationMs: number
  size: string
  responseBody: string
  headers: Array<{ key: string; value: string }>
  params: Array<{ key: string; value: string }>
  body: string
}

export type EnvironmentVariable = {
  id: string
  workspaceId: string
  key: string
  value: string
  description: string
}

export type HistoryItem = {
  id: string
  method: HttpMethod
  url: string
  status: number
  timestamp: string
}

export type Member = {
  id: string
  name: string
  role: string
}

export type Invitation = {
  id: string
  email: string
  role: string
  status: 'Pending' | 'Accepted'
}
