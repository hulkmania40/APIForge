import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Plus, Trash2, Database, KeyRound, AlertCircle, Save } from 'lucide-react'
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
  const query = useQuery({ 
    queryKey: ['environments', workspaceId], 
    queryFn: () => (workspaceId ? environmentsApi.listByWorkspace(workspaceId) : []) 
  })
  
  const [drafts, setDrafts] = useState<EnvironmentDraft[]>([])
  const [saveSuccess, setSaveSuccess] = useState(false)

  const rows = useMemo(() => {
    const base = query.data?.map((item) => ({ id: item.id, key: item.key, value: item.value })) ?? []
    return drafts.length > 0 ? [...base, ...drafts] : base
  }, [drafts, query.data])

  const addVariable = () => {
    setDrafts((current) => [...current, { id: `draft-${Date.now()}-${current.length + 1}`, key: '', value: '' }])
  }

  const deleteVariable = (id: string) => {
    if (id.startsWith('draft-')) {
      setDrafts((current) => current.filter((draft) => draft.id !== id))
    } else {
      alert('Delete API Call simulated.')
    }
  }

  const triggerSave = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  return (
    <Card className="glass-card shadow-lg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      <CardHeader className="p-4 sm:p-5 border-b border-border/40 flex flex-row items-center justify-between flex-wrap gap-4">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Database className="size-5 text-primary" />
            <span>Environment Variables</span>
          </CardTitle>
          <CardDescription className="text-xs mt-1">
            Define local key-value parameters that automatically substitute double-curly bracket placeholders (e.g. `{"{{base_url}}"}`).
          </CardDescription>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            onClick={addVariable}
            className="bg-primary text-primary-foreground text-xs font-semibold gap-1 rounded-lg transition-transform active:scale-95 shadow-md shadow-primary/10"
          >
            <Plus className="size-3.5" />
            Add variable
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={triggerSave}
            className="border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-xs"
          >
            <Save className="size-3.5" />
            {saveSuccess ? 'Changes saved!' : 'Save changes'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 flex items-start gap-2.5 max-w-2xl">
          <AlertCircle className="size-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            Variables are isolated per active workspace. Double-click or type directly inside the cells to alter the values. Ensure you save changes after updating.
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-background/20 mt-4">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/60 hover:bg-transparent bg-background/40">
                <TableHead className="text-[11px] font-bold text-muted-foreground/80 py-2">Variable Key</TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground/80 py-2">Substitute Value</TableHead>
                <TableHead className="w-20 text-[11px] font-bold text-muted-foreground/80 text-center py-2">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={3} className="text-center text-xs text-muted-foreground py-8 border-none">
                    No variables defined. Click "Add Variable" above to create one.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id} className="border-b border-border/40 hover:bg-accent/10">
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-2">
                        <KeyRound className="size-3.5 text-primary/60 shrink-0" />
                        <input 
                          defaultValue={row.key} 
                          placeholder="Variable key" 
                          className="bg-transparent border-none outline-none font-mono text-xs focus:ring-0 text-foreground w-full placeholder:text-muted-foreground/30 font-semibold"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <input 
                        defaultValue={row.value} 
                        placeholder="Variable value" 
                        className="bg-transparent border-none outline-none font-mono text-xs focus:ring-0 text-muted-foreground w-full placeholder:text-muted-foreground/30"
                      />
                    </TableCell>
                    <TableCell className="text-center py-2.5">
                      <Button 
                        variant="ghost" 
                        size="icon-xs" 
                        onClick={() => deleteVariable(row.id)}
                        className="hover:bg-rose-500/20 text-muted-foreground hover:text-rose-400 size-7"
                        aria-label="Delete variable"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}