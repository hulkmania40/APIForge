export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface KeyValueRow {
  key: string
  value: string
  enabled: boolean
}

export interface WorkspaceModel {
  id: string
  name: string
  description: string
  color: string
  memberCount: number
  requestCount: number
  lastOpenedAt: string
}

export interface ApiRequestModel {
  id: string
  workspaceId: string
  collectionId: string
  folderId?: string
  name: string
  method: HttpMethod
  url: string
  authType: 'none' | 'bearer'
  token?: string
  description: string
  queryParams: KeyValueRow[]
  headers: KeyValueRow[]
  body: string
}

export interface CollectionFolderModel {
  id: string
  name: string
  requestCount: number
  requests: ApiRequestModel[]
  folders?: CollectionFolderModel[]
}

export interface CollectionModel {
  id: string
  workspaceId: string
  name: string
  description: string
  folders: CollectionFolderModel[]
}

export interface EnvironmentVariableModel {
  id: string
  workspaceId: string
  key: string
  value: string
  description: string
}

export interface HistoryItemModel {
  id: string
  method: HttpMethod
  url: string
  status: number
  timestamp: string
  durationMs: number
}

export interface MemberModel {
  id: string
  name: string
  email: string
  role: 'Owner' | 'Editor' | 'Viewer'
}

export interface InvitationModel {
  id: string
  email: string
  role: 'Editor' | 'Viewer'
  status: 'Pending' | 'Accepted'
}

export interface ResponseModel {
  status: number
  durationMs: number
  sizeBytes: number
  headers: KeyValueRow[]
  body: string
}
