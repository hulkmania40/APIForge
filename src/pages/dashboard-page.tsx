import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, Clock3, FolderTree, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { collectionsApi } from '@/services/collections'
import { requestsApi } from '@/services/requests'
import { workspacesApi } from '@/services/workspaces'
import { useUiStore } from '@/stores/ui-store'

export function DashboardPage() {
  const navigate = useNavigate()
  const setActiveWorkspaceId = useUiStore((state) => state.setActiveWorkspaceId)
  const workspacesQuery = useQuery({ queryKey: ['workspaces'], queryFn: workspacesApi.list })
  const collectionsQuery = useQuery({
    queryKey: ['dashboard-collections'],
    queryFn: async () => {
      const workspace = await workspacesApi.getById('ws-1')
      return workspace ? collectionsApi.listByWorkspace(workspace.id) : []
    },
  })
  const requestsQuery = useQuery({ queryKey: ['dashboard-requests'], queryFn: async () => requestsApi.listByWorkspace('ws-1') })

  return (
    <div className="space-y-4">
      <Card className="border-border/80 bg-card/80">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Workspace overview, recent collections, and fast access to request flows.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          <MetricCard label="Workspaces" value={workspacesQuery.data?.length ?? 0} icon={<FolderTree className="size-4" />} />
          <MetricCard label="Collections" value={collectionsQuery.data?.length ?? 0} icon={<ArrowUpRight className="size-4" />} />
          <MetricCard label="Requests" value={requestsQuery.data?.length ?? 0} icon={<Play className="size-4" />} />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
        <Card className="border-border/80 bg-card/80">
          <CardHeader>
            <CardTitle>Recent workspaces</CardTitle>
            <CardDescription>Jump back into a workspace with one click.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {workspacesQuery.data?.map((workspace) => (
              <button
                key={workspace.id}
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-background/70 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                onClick={() => {
                  setActiveWorkspaceId(workspace.id)
                  navigate(`/workspace/${workspace.id}`)
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: workspace.color }} />
                    <span className="font-medium">{workspace.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{workspace.description}</p>
                </div>
                <Badge tone="outline">Open</Badge>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/80">
          <CardHeader>
            <CardTitle>Recent requests</CardTitle>
            <CardDescription>Recently used requests across the active workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {requestsQuery.data?.slice(0, 4).map((request) => (
              <button
                key={request.id}
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-background/70 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                onClick={() => navigate(`/workspace/${request.workspaceId}/request/${request.id}`)}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge tone={request.method === 'GET' ? 'success' : 'warning'}>{request.method}</Badge>
                    <span className="truncate font-medium">{request.name}</span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{request.url}</p>
                </div>
                <Clock3 className="size-4 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{label}</span>
        {icon}
      </div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
    </div>
  )
}