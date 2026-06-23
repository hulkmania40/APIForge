import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { collectionsApi } from '@/services/collections'
import { requestsApi } from '@/services/requests'
import { workspacesApi } from '@/services/workspaces'
import { useUiStore } from '@/stores/ui-store'

export function WorkspacePage() {
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const setActiveWorkspaceId = useUiStore((state) => state.setActiveWorkspaceId)

  if (workspaceId !== undefined) {
    setActiveWorkspaceId(workspaceId)
  }

  const workspaceQuery = useQuery({ queryKey: ['workspace', workspaceId], queryFn: () => (workspaceId ? workspacesApi.getById(workspaceId) : undefined) })
  const collectionsQuery = useQuery({ queryKey: ['workspace-collections', workspaceId], queryFn: () => (workspaceId ? collectionsApi.listByWorkspace(workspaceId) : []) })
  const requestsQuery = useQuery({ queryKey: ['workspace-requests', workspaceId], queryFn: () => (workspaceId ? requestsApi.listByWorkspace(workspaceId) : []) })

  return (
    <div className="space-y-4">
      <Card className="border-border/80 bg-card/80">
        <CardHeader>
          <CardTitle>{workspaceQuery.data?.name ?? 'Workspace'}</CardTitle>
          <CardDescription>{workspaceQuery.data?.description ?? 'Collections and requests in a developer-first layout.'}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Stat label="Collections" value={collectionsQuery.data?.length ?? 0} />
          <Stat label="Requests" value={requestsQuery.data?.length ?? 0} />
          <Stat label="Members" value={workspaceQuery.data?.memberCount ?? 0} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/80 bg-card/80">
          <CardHeader>
            <CardTitle>Getting started</CardTitle>
            <CardDescription>Use the request builder or jump into workspace settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate(`/workspace/${workspaceId}/request/request-me`)}>Open request builder</Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate(`/workspace/${workspaceId}/environments`)}>Manage environments</Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => navigate(`/workspace/${workspaceId}/settings`)}>Workspace settings</Button>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/80">
          <CardHeader>
            <CardTitle>Latest requests</CardTitle>
            <CardDescription>Recent requests tied to this workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {requestsQuery.data?.slice(0, 3).map((request) => (
              <button key={request.id} type="button" className="w-full rounded-2xl border border-border bg-background/70 px-4 py-3 text-left transition-colors hover:bg-muted/50" onClick={() => navigate(`/workspace/${request.workspaceId}/request/${request.id}`)}>
                <p className="font-medium">{request.name}</p>
                <p className="text-sm text-muted-foreground">{request.url}</p>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  )
}