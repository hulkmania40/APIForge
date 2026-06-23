import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/layouts/app-shell'
import { DashboardPage } from '@/pages/dashboard-page'
import { EnvironmentsPage } from '@/pages/environments-page'
import { HistoryPage } from '@/pages/history-page'
import { LoginPage } from '@/pages/login-page'
import { NotFoundPage } from '@/pages/not-found-page'
import { RegisterPage } from '@/pages/register-page'
import { RequestBuilderPage } from '@/pages/request-builder-page'
import { SettingsPage } from '@/pages/settings-page'
import { WorkspacePage } from '@/pages/workspace-page'

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'workspace/:workspaceId', element: <WorkspacePage /> },
      { path: 'workspace/:workspaceId/request/:requestId', element: <RequestBuilderPage /> },
      { path: 'workspace/:workspaceId/environments', element: <EnvironmentsPage /> },
      { path: 'workspace/:workspaceId/settings', element: <SettingsPage /> },
      { path: 'workspace/:workspaceId/*', element: <Navigate to="." replace /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '*', element: <NotFoundPage /> },
])