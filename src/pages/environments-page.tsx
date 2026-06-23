import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { environmentsApi } from '@/services/environments'

interface EnvironmentDraft {
  id: string
  key: string
  value: string
}

export function EnvironmentsPage() {
  const { workspaceId } = useParams()
  const query = useQuery({ queryKey: ['environments', workspaceId], queryFn: () => (workspaceId ? environmentsApi.listByWorkspace(workspaceId) : []) })
  const [drafts, setDrafts] = useState<EnvironmentDraft[]>([])

  const rows = useMemo(() => {
    const base = query.data?.map((item) => ({ id: item.id, key: item.key, value: item.value })) ?? []
    return drafts.length > 0 ? [...base, ...drafts] : base
  }, [drafts, query.data])

  return (
    <Card className="border-border/80 bg-card/80">
      <CardHeader>
        <CardTitle>Environments</CardTitle>
        <CardDescription>Manage workspace variables like base_url and token.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <Label>Editable variables</Label>
            <p className="text-sm text-muted-foreground">Variables render as double braces in future request resolution.</p>
          </div>
          <Button size="sm" onClick={() => setDrafts((current) => [...current, { id: `draft-${current.length + 1}`, key: '', value: '' }])}>
            <Plus className="size-4" />
            Add variable
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Variable</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-20">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell><Input defaultValue={row.key} placeholder="Variable" /></TableCell>
                  <TableCell><Input defaultValue={row.value} placeholder="Value" /></TableCell>
                  <TableCell><Button variant="ghost" size="icon-sm" aria-label="Delete variable"><Trash2 className="size-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}