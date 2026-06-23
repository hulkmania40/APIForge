import { useQuery } from '@tanstack/react-query'
import { Mail, Shield, UserPlus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { invitations, members } from '@/mocks/data'
import { workspacesApi } from '@/services/workspaces'
import { useParams } from 'react-router-dom'

export function SettingsPage() {
  const { workspaceId } = useParams()
  const workspaceQuery = useQuery({ queryKey: ['workspace-settings', workspaceId], queryFn: () => (workspaceId ? workspacesApi.getById(workspaceId) : undefined) })

  return (
    <div className="space-y-4">
      <Card className="border-border/80 bg-card/80">
        <CardHeader>
          <CardTitle>{workspaceQuery.data?.name ?? 'Workspace settings'}</CardTitle>
          <CardDescription>Manage members, roles, and invitations.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          <SettingTile title="Members" count={members.length} icon={<Shield className="size-4" />} />
          <SettingTile title="Roles" count={3} icon={<UserPlus className="size-4" />} />
          <SettingTile title="Invitations" count={invitations.length} icon={<Mail className="size-4" />} />
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border-border/80 bg-card/80">
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>Workspace membership and access level.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-2xl border border-border bg-background/70 px-4 py-3">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <Badge tone="outline">Member</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/80">
          <CardHeader>
            <CardTitle>Invitations</CardTitle>
            <CardDescription>Pending and accepted invitations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between rounded-2xl border border-border bg-background/70 px-4 py-3">
                <div>
                  <p className="font-medium">{invitation.email}</p>
                  <p className="text-sm text-muted-foreground">Role: {invitation.role}</p>
                </div>
                <Badge tone={invitation.status === 'Pending' ? 'warning' : 'success'}>{invitation.status}</Badge>
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
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{title}</span>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-semibold">{count}</p>
    </div>
  )
}