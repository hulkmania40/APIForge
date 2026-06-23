import { ChevronRight, History, LayoutDashboard, Settings, SidebarClose, SidebarOpen } from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { collectionsApi } from '@/services/collections'
import { workspacesApi } from '@/services/workspaces'
import { useUiStore } from '@/stores/ui-store'
import type { CollectionFolderModel, CollectionModel } from '@/types/models'

function WorkspaceCollectionTree({ collections }: { collections: CollectionModel[] }) {
  return (
    <div className="space-y-3">
      {collections.map((collection) => (
        <details key={collection.id} open className="group rounded-xl border border-border bg-card/80 p-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-foreground outline-none">
            <span>{collection.name}</span>
            <ChevronRight className="size-4 text-muted-foreground transition-transform group-open:rotate-90" />
          </summary>
          <p className="mt-1 text-xs text-muted-foreground">{collection.description}</p>
          <div className="mt-3 space-y-2 pl-2">
            {collection.folders.map((folder) => (
              <FolderNode key={folder.id} folder={folder} />
            ))}
          </div>
        </details>
      ))}
    </div>
  )
}

function FolderNode({ folder }: { folder: CollectionFolderModel }) {
  return (
    <details open className="group rounded-lg border border-border/70 bg-background/60 p-2">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm outline-none">
        <span className="font-medium text-foreground">{folder.name}</span>
        <Badge tone="outline">{folder.requestCount}</Badge>
      </summary>
      <div className="mt-2 space-y-1 pl-1">
        {folder.requests.map((request) => (
          <NavLink
            key={request.id}
            to={`/workspace/${request.workspaceId}/request/${request.id}`}
            className={({ isActive }) =>
              [
                'flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors',
                isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              ].join(' ')
            }
          >
            <Badge tone="outline">{request.method}</Badge>
            <span className="truncate">{request.name}</span>
          </NavLink>
        ))}
      </div>
    </details>
  )
}

export function AppShell() {
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const activeWorkspaceId = useUiStore((state) => state.activeWorkspaceId)
  const setActiveWorkspaceId = useUiStore((state) => state.setActiveWorkspaceId)
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const workspaceId = params.workspaceId ?? activeWorkspaceId

  const workspaceQuery = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: () => workspacesApi.getById(workspaceId),
  })

  const collectionsQuery = useQuery({
    queryKey: ['collections', workspaceId],
    queryFn: () => collectionsApi.listByWorkspace(workspaceId),
  })

  const isWorkspaceRoute = location.pathname.startsWith('/workspace/')

  const middlePanel = isWorkspaceRoute ? (
    <Card className="h-full border-border/80 bg-card/80">
      <CardHeader>
        <CardTitle>Collections</CardTitle>
      </CardHeader>
      <CardContent>
        {collectionsQuery.isLoading ? (
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-xl bg-muted" />
            <div className="h-20 animate-pulse rounded-xl bg-muted" />
          </div>
        ) : collectionsQuery.data?.length ? (
          <WorkspaceCollectionTree collections={collectionsQuery.data} />
        ) : (
          <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
            No collections found for this workspace.
          </div>
        )}
      </CardContent>
    </Card>
  ) : (
    <Card className="h-full border-border/80 bg-card/80">
      <CardHeader>
        <CardTitle>Quick Switch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/')}>Dashboard</Button>
        <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/history')}>History</Button>
        {workspaceQuery.data?.id ? (
          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={() => {
              const workspace = workspaceQuery.data
              if (workspace !== undefined) {
                navigate(`/workspace/${workspace.id}`)
              }
            }}
          >
            Continue {workspaceQuery.data.name}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(251,146,60,0.10),_transparent_24%),linear-gradient(180deg,_var(--background),_color-mix(in_oklch,var(--background),black_3%))] text-foreground">
      <aside className={sidebarCollapsed ? 'w-20' : 'w-68'}>
        <div className="flex h-full flex-col border-r border-border/80 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-4">
            {!sidebarCollapsed ? (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">APIForge</p>
                <h1 className="text-lg font-semibold">Request Studio</h1>
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card text-sm font-semibold">AF</div>
            )}
            <Button variant="ghost" size="icon-sm" onClick={toggleSidebar} aria-label="Toggle sidebar">
              {sidebarCollapsed ? <SidebarOpen className="size-4" /> : <SidebarClose className="size-4" />}
            </Button>
          </div>

          <Separator />

          <nav className="space-y-2 px-3 py-4">
            {[
              { to: '/', label: 'Dashboard', icon: LayoutDashboard },
              { to: '/history', label: 'History', icon: History },
              { to: `/workspace/${workspaceId}/settings`, label: 'Settings', icon: Settings },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                  ].join(' ')
                }
              >
                <item.icon className="size-4" />
                {!sidebarCollapsed ? <span>{item.label}</span> : null}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto px-4 pb-4">
            <Card className="border-border/80 bg-card/90">
              <CardContent className="space-y-3 p-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Active workspace</p>
                  <p className="font-medium">{workspaceQuery.data?.name ?? 'Loading…'}</p>
                </div>
                <Button className="w-full" variant="outline" onClick={() => workspaceQuery.data && (setActiveWorkspaceId(workspaceQuery.data.id), navigate(`/workspace/${workspaceQuery.data.id}`))}>
                  Open workspace
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border/80 bg-background/70 px-6 py-4 backdrop-blur-xl">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Developer API workspace</p>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{workspaceQuery.data?.name ?? 'APIForge'}</h2>
              <Badge tone="outline">⌘K</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Keyboard-ready</span>
          </div>
        </header>

        <div className="grid flex-1 gap-4 p-4 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
          <section className="min-w-0">
            <Outlet />
          </section>

          <section className="min-w-0">{middlePanel}</section>

          <section className="min-w-0">
            <Card className="h-full border-border/80 bg-card/80">
              <CardHeader>
                <CardTitle>Workspace Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-border bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Status</p>
                  <p className="mt-1 text-sm">{workspaceQuery.isLoading ? 'Loading workspace…' : 'Ready for requests'}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-2xl border border-border bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Members</p>
                    <p className="mt-1 text-2xl font-semibold">{workspaceQuery.data?.memberCount ?? 0}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Requests</p>
                    <p className="mt-1 text-2xl font-semibold">{workspaceQuery.data?.requestCount ?? 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}