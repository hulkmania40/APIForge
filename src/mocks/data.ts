import type {
  CollectionNode,
  EnvironmentVariable,
  HistoryItem,
  Invitation,
  Member,
  RequestModel,
  WorkspaceModel,
} from '@/types'
import type { CollectionModel, ResponseModel } from '@/types/models'

export const workspaces: WorkspaceModel[] = [
  {
    id: 'ws-api-forge',
    name: 'APIForge Core',
    color: '#38bdf8',
    memberCount: 3,
    requestCount: 5,
    lastOpenedAt: '2 minutes ago',
    slug: 'apiforge-core',
    description: 'Primary workspace for collection design and request testing.',
    updatedAt: '2 minutes ago',
  },
  {
    id: 'ws-platform',
    name: 'Platform APIs',
    color: '#f97316',
    memberCount: 4,
    requestCount: 3,
    lastOpenedAt: '18 minutes ago',
    slug: 'platform-apis',
    description: 'Shared platform endpoints for internal services.',
    updatedAt: '18 minutes ago',
  },
  {
    id: 'ws-playground',
    name: 'Integration Playground',
    color: '#a855f7',
    memberCount: 2,
    requestCount: 1,
    lastOpenedAt: '1 hour ago',
    slug: 'integration-playground',
    description: 'Scratchpad for experiments and mock-backed flows.',
    updatedAt: '1 hour ago',
  },
]

export const collections: CollectionModel[] = [
  {
    id: 'collection-users',
    workspaceId: 'ws-api-forge',
    name: 'Users API',
    description: 'Authentication and profile workflows.',
    folders: [
      {
        id: 'folder-auth',
        name: 'Authentication',
        requestCount: 2,
        requests: [
          {
            id: 'request-login',
            workspaceId: 'ws-api-forge',
            collectionId: 'collection-users',
            folderId: 'folder-auth',
            name: 'Login',
            method: 'POST',
            url: 'https://api.example.com/auth/login',
            authType: 'none',
            description: 'Create a session token',
            queryParams: [{ key: 'remember', value: 'true', enabled: true }],
            headers: [{ key: 'Content-Type', value: 'application/json', enabled: true }],
            body: '{\n  "email": "avery@example.com",\n  "password": "password123"\n}',
          },
          {
            id: 'request-refresh',
            workspaceId: 'ws-api-forge',
            collectionId: 'collection-users',
            folderId: 'folder-auth',
            name: 'Refresh Token',
            method: 'POST',
            url: 'https://api.example.com/auth/refresh',
            authType: 'bearer',
            token: 'demo-token-123',
            description: 'Refresh an access token',
            queryParams: [],
            headers: [{ key: 'Authorization', value: 'Bearer demo-token-123', enabled: true }],
            body: '{\n  "refreshToken": "refresh_123"\n}',
          },
        ],
      },
      {
        id: 'folder-profile',
        name: 'Profiles',
        requestCount: 2,
        requests: [
          {
            id: 'request-me',
            workspaceId: 'ws-api-forge',
            collectionId: 'collection-users',
            folderId: 'folder-profile',
            name: 'Get Profile',
            method: 'GET',
            url: 'https://api.example.com/users/me',
            authType: 'bearer',
            token: 'demo-token-123',
            description: 'Fetch the current profile',
            queryParams: [],
            headers: [{ key: 'Accept', value: 'application/json', enabled: true }],
            body: '',
          },
          {
            id: 'request-update-profile',
            workspaceId: 'ws-api-forge',
            collectionId: 'collection-users',
            folderId: 'folder-profile',
            name: 'Update Profile',
            method: 'PATCH',
            url: 'https://api.example.com/users/me',
            authType: 'bearer',
            token: 'demo-token-123',
            description: 'Update the current profile',
            queryParams: [],
            headers: [{ key: 'Content-Type', value: 'application/json', enabled: true }],
            body: '{\n  "name": "Avery Chen"\n}',
          },
        ],
      },
    ],
  },
  {
    id: 'collection-billing',
    workspaceId: 'ws-api-forge',
    name: 'Billing API',
    description: 'Invoices and account billing.',
    folders: [
      {
        id: 'folder-invoices',
        name: 'Invoices',
        requestCount: 1,
        requests: [
          {
            id: 'request-list-invoices',
            workspaceId: 'ws-api-forge',
            collectionId: 'collection-billing',
            folderId: 'folder-invoices',
            name: 'List Invoices',
            method: 'GET',
            url: 'https://api.example.com/billing/invoices',
            authType: 'bearer',
            token: 'demo-token-123',
            description: 'List recent invoices',
            queryParams: [
              { key: 'page', value: '1', enabled: true },
              { key: 'limit', value: '20', enabled: true },
            ],
            headers: [{ key: 'Accept', value: 'application/json', enabled: true }],
            body: '',
          },
        ],
      },
    ],
  },
] satisfies Array<{
  id: string
  workspaceId: string
  name: string
  description: string
  folders: Array<{
    id: string
    name: string
    requestCount: number
    requests: Array<{
      id: string
      workspaceId: string
      collectionId: string
      folderId?: string
      name: string
      method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
      url: string
      authType: 'none' | 'bearer'
      token?: string
      description: string
      queryParams: Array<{ key: string; value: string; enabled: boolean }>
      headers: Array<{ key: string; value: string; enabled: boolean }>
      body: string
    }>
  }>
}>

export const collectionTree: CollectionNode[] = [
  {
    id: 'workspace-root',
    type: 'workspace',
    name: 'APIForge Core',
    children: [
      {
        id: 'collection-users',
        type: 'collection',
        name: 'Users API',
        children: [
          {
            id: 'folder-auth',
            type: 'folder',
            name: 'Authentication',
            children: [
              {
                id: 'request-login',
                type: 'request',
                name: 'Login',
                method: 'POST',
                path: '/auth/login',
              },
              {
                id: 'request-refresh',
                type: 'request',
                name: 'Refresh Token',
                method: 'POST',
                path: '/auth/refresh',
              },
            ],
          },
          {
            id: 'folder-profile',
            type: 'folder',
            name: 'Profiles',
            children: [
              {
                id: 'request-me',
                type: 'request',
                name: 'Get Profile',
                method: 'GET',
                path: '/users/me',
              },
              {
                id: 'request-update-profile',
                type: 'request',
                name: 'Update Profile',
                method: 'PATCH',
                path: '/users/me',
              },
            ],
          },
        ],
      },
      {
        id: 'collection-billing',
        type: 'collection',
        name: 'Billing API',
        children: [
          {
            id: 'folder-invoices',
            type: 'folder',
            name: 'Invoices',
            children: [
              {
                id: 'request-list-invoices',
                type: 'request',
                name: 'List Invoices',
                method: 'GET',
                path: '/billing/invoices',
              },
            ],
          },
        ],
      },
    ],
  },
]

export const requestById: Record<string, RequestModel> = {
  'request-login': {
    id: 'request-login',
    name: 'Login',
    method: 'POST',
    url: 'https://api.example.com/auth/login',
    folder: 'Authentication',
    authType: 'none',
    status: 200,
    durationMs: 84,
    size: '1.2 KB',
    responseBody: JSON.stringify(
      {
        token: 'eyJhbGciOi...mock',
        user: {
          id: 'usr_001',
          name: 'Avery Chen',
          email: 'avery@example.com',
        },
      },
      null,
      2,
    ),
    headers: [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Authorization', value: 'Bearer <token>' },
    ],
    params: [{ key: 'remember', value: 'true' }],
    body: JSON.stringify(
      {
        email: 'avery@example.com',
        password: '••••••••',
      },
      null,
      2,
    ),
  },
  'request-me': {
    id: 'request-me',
    name: 'Get Profile',
    method: 'GET',
    url: 'https://api.example.com/users/me',
    folder: 'Profiles',
    authType: 'bearer',
    status: 200,
    durationMs: 51,
    size: '864 B',
    responseBody: JSON.stringify(
      {
        id: 'usr_001',
        name: 'Avery Chen',
        email: 'avery@example.com',
        role: 'Owner',
      },
      null,
      2,
    ),
    headers: [{ key: 'Accept', value: 'application/json' }],
    params: [],
    body: '{\n  "preview": true\n}',
  },
  'request-list-invoices': {
    id: 'request-list-invoices',
    name: 'List Invoices',
    method: 'GET',
    url: 'https://api.example.com/billing/invoices',
    folder: 'Invoices',
    authType: 'bearer',
    status: 204,
    durationMs: 122,
    size: '0 B',
    responseBody: '{\n  "items": []\n}',
    headers: [{ key: 'Accept', value: 'application/json' }],
    params: [
      { key: 'page', value: '1' },
      { key: 'limit', value: '20' },
    ],
    body: '',
  },
}

export const environments: EnvironmentVariable[] = [
  { id: 'env-1', workspaceId: 'ws-api-forge', key: 'base_url', value: 'https://api.example.com', description: 'Primary API host' },
  { id: 'env-2', workspaceId: 'ws-api-forge', key: 'token', value: '{{auth_token}}', description: 'Bearer token' },
  { id: 'env-3', workspaceId: 'ws-api-forge', key: 'client_id', value: 'client_4f2e', description: 'OAuth client identifier' },
]

export const history: HistoryItem[] = [
  { id: 'hist-1', method: 'GET', url: '/users/me', status: 200, timestamp: '2 minutes ago' },
  { id: 'hist-2', method: 'POST', url: '/auth/login', status: 200, timestamp: '14 minutes ago' },
  { id: 'hist-3', method: 'PATCH', url: '/users/me', status: 204, timestamp: '41 minutes ago' },
]

export const historyItems = history.map((item) => ({
  ...item,
  durationMs: item.method === 'POST' ? 104 : 72,
}))

export const mockResponse: ResponseModel = {
  status: 200,
  durationMs: 183,
  sizeBytes: 2418,
  headers: [
    { key: 'content-type', value: 'application/json', enabled: true },
    { key: 'x-request-id', value: 'req_8c0b7d', enabled: true },
  ],
  body: JSON.stringify(
    {
      data: {
        id: 'usr_01',
        name: 'Avery Chen',
        email: 'avery@example.com',
        roles: ['owner', 'editor'],
        workspace: 'APIForge Core',
      },
      meta: {
        requestId: 'req_8c0b7d',
        servedFrom: 'mock-api',
      },
    },
    null,
    2,
  ),
}

export const members: Member[] = [
  { id: 'mem-1', name: 'Avery Chen', role: 'Owner' },
  { id: 'mem-2', name: 'Jordan Lee', role: 'Editor' },
  { id: 'mem-3', name: 'Sam Patel', role: 'Viewer' },
]

export const invitations: Invitation[] = [
  { id: 'inv-1', email: 'dev@apiforge.dev', role: 'Editor', status: 'Pending' },
  { id: 'inv-2', email: 'ops@apiforge.dev', role: 'Viewer', status: 'Accepted' },
]

export const recentRequests = [
  { id: 'request-login', name: 'Login', method: 'POST', status: 200 },
  { id: 'request-me', name: 'Get Profile', method: 'GET', status: 200 },
  { id: 'request-list-invoices', name: 'List Invoices', method: 'GET', status: 204 },
]
