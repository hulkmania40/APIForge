import { useState } from 'react'
import { ChevronRight, History, LayoutDashboard, Settings, SidebarClose, SidebarOpen, Folder, FolderPlus, Plus, PlusCircle, Database, ChevronDown, Check, Braces, Sparkles, FolderTree, ArrowRight, User, Sun, Moon } from 'lucide-react'
import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { collectionsApi } from '@/services/collections'
import { workspacesApi } from '@/services/workspaces'
import { useUiStore } from '@/stores/ui-store'
import type { CollectionFolderModel, CollectionModel } from '@/types/models'

const methodBadgeColors: Record<string, string> = {
  GET: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25',
  POST: 'bg-amber-500/10 text-amber-400 border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25',
  PUT: 'bg-sky-500/10 text-sky-400 border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/25',
  PATCH: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/25',
  DELETE: 'bg-rose-500/10 text-rose-400 border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/25',
}

function WorkspaceCollectionTree({ collections }: { collections: CollectionModel[] }) {
  return (
    <div className="space-y-1 pr-1 select-none">
      {collections.map((collection) => (
        <details key={collection.id} open className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent/40 hover:text-foreground transition-all duration-150 outline-none">
            <div className="flex items-center gap-2 truncate">
              <ChevronRight className="size-3 text-muted-foreground/60 transition-transform group-open:rotate-90" />
              <Folder className="size-3.5 text-primary/70 shrink-0" />
              <span className="truncate">{collection.name}</span>
            </div>
            <button 
              type="button" 
              className="opacity-0 group-hover:opacity-100 hover:text-primary transition-opacity size-4 flex items-center justify-center rounded hover:bg-muted"
              onClick={(e) => {
                e.preventDefault();
                alert(`Add Request under Collection: ${collection.name}`);
              }}
              title="Add Request"
            >
              <Plus className="size-3" />
            </button>
          </summary>
          
          <div className="mt-0.5 space-y-0.5 pl-3 border-l border-border/40 ml-3.5">
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
    <details open className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent/40 hover:text-foreground transition-all duration-150 outline-none">
        <div className="flex items-center gap-2 truncate">
          <ChevronRight className="size-3 text-muted-foreground/60 transition-transform group-open:rotate-90" />
          <Folder className="size-3.5 text-muted-foreground/60 shrink-0" />
          <span className="truncate">{folder.name}</span>
        </div>
        <Badge tone="outline" className="text-[10px] px-1 py-0 h-4 border-border/60 bg-transparent text-muted-foreground/80">{folder.requestCount}</Badge>
      </summary>
      <div className="mt-0.5 space-y-0.5 pl-3 border-l border-border/40 ml-3.5">
        {folder.requests.map((request) => (
          <NavLink
            key={request.id}
            to={`/workspace/${request.workspaceId}/request/${request.id}`}
            className={({ isActive }) =>
              [
                'flex items-center justify-between gap-2 rounded-lg px-2.5 py-1 text-xs transition-all duration-150 group/item border',
                isActive 
                  ? 'bg-primary/10 border-primary/20 text-foreground font-medium shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]' 
                  : 'border-transparent text-muted-foreground hover:bg-accent/30 hover:text-foreground',
              ].join(' ')
            }
          >
            <div className="flex items-center gap-2 truncate">
              <span className={`text-[9px] font-bold font-mono px-1 py-0.2 rounded border shrink-0 min-w-[34px] text-center ${methodBadgeColors[request.method] || 'bg-muted text-muted-foreground border-border'}`}>
                {request.method}
              </span>
              <span className="truncate">{request.name}</span>
            </div>
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
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)
  
  const [explorerCollapsed, setExplorerCollapsed] = useState(false)
  const [isWorkspaceSelectOpen, setIsWorkspaceSelectOpen] = useState(false)
  const [activeEnv, setActiveEnv] = useState('Development')
  
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const workspaceId = params.workspaceId ?? activeWorkspaceId

  const workspacesQuery = useQuery({
    queryKey: ['workspaces'],
    queryFn: workspacesApi.list,
  })

  const workspaceQuery = useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: () => workspacesApi.getById(workspaceId),
  })

  const collectionsQuery = useQuery({
    queryKey: ['collections', workspaceId],
    queryFn: () => collectionsApi.listByWorkspace(workspaceId),
  })

  const isWorkspaceRoute = location.pathname.startsWith('/workspace/')
  const activeWorkspace = workspaceQuery.data ?? workspacesQuery.data?.find(w => w.id === workspaceId)

  // Navigate to selected workspace
  const handleWorkspaceChange = (id: string) => {
    setActiveWorkspaceId(id)
    navigate(`/workspace/${id}`)
    setIsWorkspaceSelectOpen(false)
  }

  // explorer sidebar header/content
  const explorerPanel = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
          {isWorkspaceRoute ? 'Collections' : 'Quick Explorer'}
        </h2>
        {isWorkspaceRoute && (
          <button 
            type="button" 
            className="text-muted-foreground hover:text-foreground hover:bg-accent/40 rounded p-1 transition-all"
            onClick={() => alert('Create new Collection flow')}
            title="Create Collection"
          >
            <FolderPlus className="size-4" />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto px-2">
        {isWorkspaceRoute ? (
          collectionsQuery.isLoading ? (
            <div className="space-y-2 p-2">
              <div className="h-6 animate-pulse rounded bg-muted/60" />
              <div className="h-6 animate-pulse rounded bg-muted/60" />
              <div className="h-6 animate-pulse rounded bg-muted/60" />
            </div>
          ) : collectionsQuery.data?.length ? (
            <WorkspaceCollectionTree collections={collectionsQuery.data} />
          ) : (
            <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              No collections found.
            </div>
          )
        ) : (
          <div className="space-y-1">
            <div className="text-muted-foreground text-xs px-2 py-1 mb-2">Navigation Shortcuts</div>
            <button
              onClick={() => navigate('/')}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent/30 hover:text-foreground transition-all text-left"
            >
              <LayoutDashboard className="size-3.5 text-primary" />
              <span>Studio Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/history')}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent/30 hover:text-foreground transition-all text-left"
            >
              <History className="size-3.5 text-amber-500" />
              <span>Request History</span>
            </button>
            {activeWorkspace && (
              <button
                onClick={() => navigate(`/workspace/${activeWorkspace.id}`)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent/30 hover:text-foreground transition-all text-left"
              >
                <FolderTree className="size-3.5 text-sky-500" />
                <span>Go to {activeWorkspace.name}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      
      {/* 1. Sleek Navigation Aside Panel (VSCode-Style) */}
      <aside className={`flex h-full flex-col border-r border-border/60 bg-zinc-950/5 dark:bg-zinc-950/70 backdrop-blur-xl shrink-0 transition-all duration-200 ${sidebarCollapsed ? 'w-14' : 'w-56'}`}>
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between px-3 border-b border-border/40">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2 px-1">
              <div className="size-6 rounded-lg bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center shadow-lg shadow-primary/25">
                <Sparkles className="size-3 text-white" />
              </div>
              <span className="font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-sm">
                API<span className="text-primary font-black">Forge</span>
              </span>
            </div>
          ) : (
            <div className="mx-auto size-6 rounded-lg bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="size-3 text-white" />
            </div>
          )}
          
          {!sidebarCollapsed && (
            <Button variant="ghost" size="icon-xs" className="hover:bg-accent/40" onClick={toggleSidebar} title="Collapse Sidebar">
              <SidebarClose className="size-3.5" />
            </Button>
          )}
        </div>

        {/* Workspace Dropdown Switcher */}
        <div className="p-2 border-b border-border/40 relative">
          {sidebarCollapsed ? (
            <button 
              className="mx-auto size-8 rounded-lg border border-border flex items-center justify-center text-xs font-semibold hover:bg-accent/30 transition-all hover:border-primary/40"
              style={{ borderLeftColor: activeWorkspace?.color ?? 'var(--border)' }}
              onClick={toggleSidebar}
              title="Switch Workspace"
            >
              {activeWorkspace?.name.charAt(0) ?? 'W'}
            </button>
          ) : (
            <div>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-1.5 rounded-lg border border-border bg-background/50 px-2.5 py-1.5 text-left text-xs font-medium hover:bg-accent/30 hover:border-primary/40 transition-all"
                onClick={() => setIsWorkspaceSelectOpen(!isWorkspaceSelectOpen)}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="h-2 w-2 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: activeWorkspace?.color }} />
                  <span className="truncate">{activeWorkspace?.name ?? 'Select Workspace'}</span>
                </div>
                <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
              </button>
              
              {isWorkspaceSelectOpen && (
                <div className="absolute left-2 right-2 top-full mt-1 z-50 rounded-lg border border-border bg-popover p-1 shadow-xl shadow-black/40 backdrop-blur-lg">
                  {workspacesQuery.data?.map((ws) => (
                    <button
                      key={ws.id}
                      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-left hover:bg-accent hover:text-foreground transition-all duration-100"
                      onClick={() => handleWorkspaceChange(ws.id)}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ws.color }} />
                        <span className="truncate">{ws.name}</span>
                      </div>
                      {ws.id === workspaceId && <Check className="size-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 space-y-1 p-2">
          {[
            { to: '/', label: 'Dashboard', icon: LayoutDashboard },
            { to: `/workspace/${workspaceId}`, label: 'Workspace', icon: FolderTree },
            { to: `/workspace/${workspaceId}/environments`, label: 'Environments', icon: Braces },
            { to: '/history', label: 'History', icon: History },
            { to: `/workspace/${workspaceId}/settings`, label: 'Settings', icon: Settings },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.label === 'Workspace'}
              className={({ isActive }) =>
                [
                  'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-150',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10' 
                    : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground',
                  sidebarCollapsed ? 'justify-center' : '',
                ].join(' ')
              }
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className="size-4 shrink-0" />
              {!sidebarCollapsed ? <span>{item.label}</span> : null}
            </NavLink>
          ))}
        </nav>

        {/* Collapse button when sidebar is collapsed */}
        {sidebarCollapsed && (
          <div className="p-2 border-t border-border/40">
            <Button variant="ghost" size="icon-xs" className="w-full hover:bg-accent/40" onClick={toggleSidebar} title="Expand Sidebar">
              <SidebarOpen className="size-3.5" />
            </Button>
          </div>
        )}
      </aside>

      {/* 2. Secondary Explorer Sidebar (Collections/Workspace details) */}
      <div className={`h-full border-r border-border/60 bg-zinc-950/2 dark:bg-zinc-950/20 backdrop-blur-md flex-col shrink-0 transition-all duration-200 ${explorerCollapsed ? 'w-0 overflow-hidden' : 'w-72 flex'}`}>
        {explorerPanel}
      </div>

      {/* 3. Main Workspace Area (Breadcrumbs, Toolbar, Viewport) */}
      <main className="flex min-w-0 flex-1 flex-col h-full bg-[radial-gradient(ellipse_at_top,_var(--accent)/15%,_transparent_50%)]">
        {/* Workspace Toolbar Header */}
        <header className="flex h-14 items-center justify-between gap-4 border-b border-border/60 px-6 shrink-0 bg-background/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setExplorerCollapsed(!explorerCollapsed)}
              className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent/40 transition-all shrink-0"
              title="Toggle Explorer Sidebar"
            >
              <FolderTree className="size-4" />
            </button>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
              <span>APIForge</span>
              <ChevronRight className="size-3 shrink-0" />
              <span className="font-semibold text-foreground/80 truncate">{activeWorkspace?.name ?? 'Loading…'}</span>
              {location.pathname.includes('/request/') && (
                <>
                  <ChevronRight className="size-3 shrink-0" />
                  <span className="font-mono text-primary truncate">Active Request</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Active Environment Indicator Selector */}
            <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-background/40 px-2.5 py-1 text-xs">
              <Database className="size-3.5 text-primary" />
              <span className="text-muted-foreground/80 font-medium select-none">Env:</span>
              <select 
                className="bg-transparent border-none text-foreground font-semibold outline-none cursor-pointer pr-1"
                value={activeEnv}
                onChange={(e) => setActiveEnv(e.target.value)}
              >
                <option value="Development" className="bg-popover text-foreground">Development</option>
                <option value="Staging" className="bg-popover text-foreground">Staging</option>
                <option value="Production" className="bg-popover text-foreground">Production</option>
              </select>
            </div>

            {/* Sleek Theme Switcher Button */}
            <Button
              variant="outline"
              size="icon-xs"
              className="rounded-lg border-border hover:bg-accent/40 size-8 transition-all shrink-0"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? (
                <Moon className="size-4 text-muted-foreground" />
              ) : (
                <Sun className="size-4 text-amber-500" />
              )}
            </Button>
          </div>
        </header>

        {/* Viewport Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
      
    </div>
  )
}