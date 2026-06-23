import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Play, Sparkles, FolderTree, Settings, ShieldAlert, Cpu, Database, Users, Terminal } from 'lucide-react'
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

  const workspaceQuery = useQuery({ 
    queryKey: ['workspace', workspaceId], 
    queryFn: () => (workspaceId ? workspacesApi.getById(workspaceId) : undefined) 
  })
  
  const collectionsQuery = useQuery({ 
    queryKey: ['workspace-collections', workspaceId], 
    queryFn: () => (workspaceId ? collectionsApi.listByWorkspace(workspaceId) : []) 
  })
  
  const requestsQuery = useQuery({ 
    queryKey: ['workspace-requests', workspaceId], 
    queryFn: () => (workspaceId ? requestsApi.listByWorkspace(workspaceId) : []) 
  })

  return (
    <div className="space-y-6">
      
      {/* Workspace banner card */}
      <Card className="border-border/60 bg-zinc-900/40 backdrop-blur-xl relative overflow-hidden shadow-lg">
        <div 
          className="absolute right-0 top-0 w-32 h-32 blur-3xl opacity-20 rounded-full pointer-events-none"
          style={{ backgroundColor: workspaceQuery.data?.color ?? 'var(--primary)' }}
        />
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: workspaceQuery.data?.color }} />
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Active workspace Space</span>
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-tight mt-1">
            {workspaceQuery.data?.name ?? 'Workspace Studio'}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground/80 mt-1 max-w-2xl">
            {workspaceQuery.data?.description ?? 'Organize, manage, test, and save collections and HTTP configurations.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-4 sm:grid-cols-3 pt-2">
          <Stat label="Total Collections" value={collectionsQuery.data?.length ?? 0} icon={<FolderTree className="size-4 text-primary" />} />
          <Stat label="Requests Registered" value={requestsQuery.data?.length ?? 0} icon={<Terminal className="size-4 text-sky-400" />} />
          <Stat label="Collaborators" value={workspaceQuery.data?.memberCount ?? 0} icon={<Users className="size-4 text-emerald-400" />} />
        </CardContent>
      </Card>

      {/* Main landing grids */}
      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Getting started panel */}
        <Card className="border-border/60 bg-zinc-900/40 backdrop-blur-xl shadow-lg">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Cpu className="size-4 text-primary" />
              <span>Workspace Checklist</span>
            </CardTitle>
            <CardDescription className="text-xs">Quick shortcuts to kickstart request actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Button 
              className="w-full justify-start gap-2.5 text-xs font-semibold rounded-lg hover:border-primary/30 transition-all p-4 border border-border bg-background/20" 
              variant="outline" 
              onClick={() => navigate(`/workspace/${workspaceId}/request/request-me`)}
            >
              <Play className="size-4 text-emerald-400 shrink-0" />
              <span>Launch Request Builder Studio</span>
            </Button>
            
            <Button 
              className="w-full justify-start gap-2.5 text-xs font-semibold rounded-lg hover:border-primary/30 transition-all p-4 border border-border bg-background/20" 
              variant="outline" 
              onClick={() => navigate(`/workspace/${workspaceId}/environments`)}
            >
              <Database className="size-4 text-sky-400 shrink-0" />
              <span>Configure Environment variables</span>
            </Button>
            
            <Button 
              className="w-full justify-start gap-2.5 text-xs font-semibold rounded-lg hover:border-primary/30 transition-all p-4 border border-border bg-background/20" 
              variant="outline" 
              onClick={() => navigate(`/workspace/${workspaceId}/settings`)}
            >
              <Settings className="size-4 text-amber-500 shrink-0" />
              <span>Manage Workspace settings</span>
            </Button>
          </CardContent>
        </Card>

        {/* Latest workspace endpoints */}
        <Card className="border-border/60 bg-zinc-900/40 backdrop-blur-xl shadow-lg">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="size-4 text-sky-400" />
              <span>Latest Workspace endpoints</span>
            </CardTitle>
            <CardDescription className="text-xs">Recently integrated actions for testing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {requestsQuery.isLoading ? (
              <div className="space-y-2">
                <div className="h-12 animate-pulse rounded-xl bg-muted/40" />
                <div className="h-12 animate-pulse rounded-xl bg-muted/40" />
              </div>
            ) : requestsQuery.data?.length === 0 ? (
              <div className="text-center text-xs text-muted-foreground py-8">
                No endpoints created yet in this workspace.
              </div>
            ) : requestsQuery.data?.slice(0, 3).map((request) => {
              const methodColors: Record<string, string> = {
                GET: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
                POST: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
                PUT: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
                PATCH: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
                DELETE: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
              }
              
              return (
                <button 
                  key={request.id} 
                  type="button" 
                  className="w-full rounded-xl border border-border/80 bg-background/30 p-3 text-left transition-all duration-200 hover:bg-accent/40 hover:border-primary/20 group flex justify-between items-center" 
                  onClick={() => navigate(`/workspace/${request.workspaceId}/request/${request.id}`)}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold font-mono px-1 py-0.2 rounded border shrink-0 min-w-[34px] text-center ${methodColors[request.method] || 'bg-muted text-muted-foreground border-border'}`}>
                        {request.method}
                      </span>
                      <span className="truncate text-xs font-semibold text-foreground/90 group-hover:text-foreground">{request.name}</span>
                    </div>
                    <p className="truncate text-[10px] text-muted-foreground/70 font-mono mt-1 pl-1">{request.url}</p>
                  </div>
                  
                  <Play className="size-3 text-muted-foreground/50 shrink-0 group-hover:text-primary transition-colors" />
                </button>
              )
            })}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-4 flex items-center justify-between transition-all duration-300 hover:border-primary/25 group">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-black text-foreground group-hover:scale-105 origin-left transition-transform duration-200">{value}</p>
      </div>
      <div className="size-8 rounded-lg bg-zinc-950/50 border border-border/60 flex items-center justify-center shrink-0">
        {icon}
      </div>
    </div>
  )
}