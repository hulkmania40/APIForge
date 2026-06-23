import { useQuery } from '@tanstack/react-query'
import { Mail, Shield, UserPlus, Settings, Users, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { invitations, members } from '@/mocks/data'
import { workspacesApi } from '@/services/workspaces'
import { useParams } from 'react-router-dom'

export function SettingsPage() {
  const { workspaceId } = useParams()
  const workspaceQuery = useQuery({ 
    queryKey: ['workspace-settings', workspaceId], 
    queryFn: () => (workspaceId ? workspacesApi.getById(workspaceId) : undefined) 
  })

  return (
    <div className="space-y-6">
      
      {/* Settings Header Panel */}
      <Card className="border-border/60 bg-background/70 dark:bg-zinc-950/70 relative overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="size-4 text-primary" />
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Workspace Settings</span>
          </div>
          <CardTitle className="text-xl font-extrabold tracking-tight mt-1">
            {workspaceQuery.data?.name ?? 'Workspace settings'}
          </CardTitle>
          <CardDescription className="text-xs">
            Administer workspace identity, invite team collaborators, and control permissions.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-4 sm:grid-cols-3 pt-2">
          <SettingTile title="Workspace Members" count={members.length} icon={<Users className="size-4 text-primary" />} />
          <SettingTile title="Roles Defined" count={3} icon={<Shield className="size-4 text-emerald-400" />} />
          <SettingTile title="Pending Invites" count={invitations.length} icon={<Mail className="size-4 text-amber-500" />} />
        </CardContent>
      </Card>

      {/* Grid lists for Members and Invites */}
      <div className="grid gap-6 xl:grid-cols-2">
        
        {/* Members Management */}
        <Card className="border-border/60 bg-background/70 dark:bg-zinc-950/70">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Active Members</CardTitle>
                <CardDescription className="text-xs">Active accounts authorized to view and edit collections.</CardDescription>
              </div>
              <button 
                onClick={() => alert('Invite member flow')}
                className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
              >
                <UserPlus className="size-3.5" />
                <span>Invite user</span>
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {members.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between rounded-xl border border-border/80 bg-background/30 dark:bg-zinc-950/60 p-3.5 hover:border-primary/20 transition-all duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-linear-to-tr from-primary/10 to-violet-500/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0 select-none">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-foreground">{member.name}</p>
                    <p className="text-[10px] text-muted-foreground/80 mt-0.5 font-medium">{member.role}</p>
                  </div>
                </div>
                
                <Badge tone={member.role === 'Owner' ? 'default' : 'outline'} className="text-[10px] px-2 py-0.5 h-5 border-border/60">
                  {member.role === 'Owner' ? 'Admin' : 'Editor'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Invitations Management */}
        <Card className="border-border/60 bg-background/70 dark:bg-zinc-950/70">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="text-base font-bold">Pending Invitations</CardTitle>
            <CardDescription className="text-xs">Outstanding and accepted team invitations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {invitations.map((invitation) => (
              <div 
                key={invitation.id} 
                className="flex items-center justify-between rounded-xl border border-border/80 bg-background/30 dark:bg-zinc-950/60 p-3.5 hover:border-primary/20 transition-all duration-150"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-xs text-foreground truncate select-all">{invitation.email}</p>
                  <p className="text-[10px] text-muted-foreground/80 mt-0.5 font-medium">Access: {invitation.role}</p>
                </div>
                
                <Badge 
                  tone={invitation.status === 'Pending' ? 'warning' : 'success'} 
                  className="text-[10px] px-2 py-0.5 h-5 shrink-0"
                >
                  {invitation.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

function SettingTile({ title, count, icon }: { title: string; count: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 dark:bg-zinc-950/60 p-4 flex items-center justify-between transition-all duration-300 hover:border-primary/25 group">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
        <p className="mt-2 text-2xl font-black text-foreground group-hover:scale-105 origin-left transition-transform duration-200">{count}</p>
      </div>
      <div className="size-8 rounded-lg bg-background/70 dark:bg-zinc-950/80 border border-border/60 flex items-center justify-center shrink-0">
        {icon}
      </div>
    </div>
  )
}