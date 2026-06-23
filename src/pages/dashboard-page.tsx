import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, Clock3, FolderTree, Play, Sparkles, Plus, PlusCircle, Compass } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getApiMethodChipClasses } from '@/lib/utils'
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
      const workspace = await workspacesApi.getById('ws-api-forge')
      return workspace ? collectionsApi.listByWorkspace(workspace.id) : []
    },
  })
  
  const requestsQuery = useQuery({ 
    queryKey: ['dashboard-requests'], 
    queryFn: async () => requestsApi.listByWorkspace('ws-api-forge') 
  })

  return (
    <div className="space-y-6">
      
      {/* Welcome Card Panel */}
      <Card className="glass-card relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-widest">
            <Sparkles className="size-3.5" />
            <span>Developer Workspace Studio</span>
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-tight mt-1">Dashboard Overview</CardTitle>
          <CardDescription className="text-sm text-muted-foreground/80">
            Design collections, configure environments, and execute API requests in a unified, lightweight canvas.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-4 sm:grid-cols-3 pt-2">
          <MetricCard 
            label="Workspaces" 
            value={workspacesQuery.data?.length ?? 0} 
            icon={<FolderTree className="size-4 text-primary" />} 
          />
          <MetricCard 
            label="Collections" 
            value={collectionsQuery.data?.length ?? 0} 
            icon={<Compass className="size-4 text-sky-400" />} 
          />
          <MetricCard 
            label="Requests" 
            value={requestsQuery.data?.length ?? 0} 
            icon={<Play className="size-4 text-emerald-400" />} 
          />
        </CardContent>
      </Card>

      {/* Main Lists Grid */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        
        {/* Recent Workspaces Card */}
        <Card className="glass-card">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Active Workspaces</CardTitle>
                <CardDescription className="text-xs">Quick switch or create a workspace space.</CardDescription>
              </div>
              <button 
                onClick={() => alert('Create new Workspace flow')}
                className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
              >
                <PlusCircle className="size-3.5" />
                <span>New workspace</span>
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {workspacesQuery.isLoading ? (
              <div className="space-y-2">
                <div className="h-14 animate-pulse rounded-xl bg-muted/40" />
                <div className="h-14 animate-pulse rounded-xl bg-muted/40" />
              </div>
            ) : workspacesQuery.data?.map((workspace) => (
              <button
                key={workspace.id}
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-border/80 bg-background/30 p-4 text-left transition-all duration-200 hover:bg-accent/40 hover:border-primary/20 hover:translate-x-1 group"
                onClick={() => {
                  setActiveWorkspaceId(workspace.id)
                  navigate(`/workspace/${workspace.id}`)
                }}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: workspace.color }} />
                    <span className="font-bold text-sm text-foreground/90 group-hover:text-foreground">{workspace.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground/80 font-medium pl-5">{workspace.description}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground/60 mr-1 select-none">Open</span>
                  <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Requests Card */}
        <Card className="glass-card">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="text-base font-bold">Recent Requests</CardTitle>
            <CardDescription className="text-xs">Executed requests across the workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {requestsQuery.isLoading ? (
              <div className="space-y-2">
                <div className="h-12 animate-pulse rounded-xl bg-muted/40" />
                <div className="h-12 animate-pulse rounded-xl bg-muted/40" />
              </div>
            ) : requestsQuery.data?.slice(0, 5).map((request) => {
              return (
                <button
                  key={request.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-border/80 bg-background/30 p-3 text-left transition-all duration-200 hover:bg-accent/40 hover:border-primary/20 group"
                  onClick={() => navigate(`/workspace/${request.workspaceId}/request/${request.id}`)}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex min-w-16 items-center justify-center rounded-md border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.22em] leading-none font-mono ${getApiMethodChipClasses(request.method)}`}>
                        {request.method}
                      </span>
                      <span className="truncate text-xs font-semibold text-foreground/90 group-hover:text-foreground">{request.name}</span>
                    </div>
                    <p className="truncate text-[10px] text-muted-foreground/70 font-mono mt-1 pl-1">{request.url}</p>
                  </div>
                  <Clock3 className="size-3.5 text-muted-foreground/50 shrink-0 group-hover:text-primary transition-colors" />
                </button>
              )
            })}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

function MetricCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-4 transition-all duration-300 hover:border-primary/30 group">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>{label}</span>
        {icon}
      </div>
      <div className="mt-2.5 text-2xl font-black text-foreground group-hover:scale-105 origin-left transition-transform duration-200">
        {value}
      </div>
    </div>
  )
}