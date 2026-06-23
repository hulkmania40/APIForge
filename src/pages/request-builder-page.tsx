import { useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Clock3, Copy, FolderTree, Send, Shield, TimerReset } from 'lucide-react'
import { mockResponse } from '@/mocks/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { requestsApi } from '@/services/requests'
import type { ApiRequestModel, KeyValueRow, ResponseModel } from '@/types/models'

const methodColors: Record<ApiRequestModel['method'], 'success' | 'warning' | 'danger' | 'default'> = {
  GET: 'success',
  POST: 'warning',
  PUT: 'default',
  PATCH: 'default',
  DELETE: 'danger',
}

export function RequestBuilderPage() {
  const { requestId } = useParams()
  const requestQuery = useQuery({ queryKey: ['request', requestId], queryFn: () => (requestId ? requestsApi.getById(requestId) : undefined) })

  if (requestId !== undefined && requestQuery.isSuccess && requestQuery.data === undefined) {
    return <Navigate to="/workspace/ws-api-forge" replace />
  }

  return <RequestBuilderContent key={requestId ?? 'unknown-request'} request={requestQuery.data ?? null} />
}

function RequestBuilderContent({ request }: { request: ApiRequestModel | null }) {
  const [draft, setDraft] = useState<ApiRequestModel | null>(request)
  const [response, setResponse] = useState<ResponseModel>(mockResponse)
  const [activeTab, setActiveTab] = useState('params')
  const [isSending, setIsSending] = useState(false)

  const selectedRequest = draft ?? request
  const requestSummary = useMemo(() => (selectedRequest ? `${selectedRequest.method} ${selectedRequest.url}` : null), [selectedRequest])

  if (selectedRequest === null) {
    return <EmptyRequestState />
  }

  const updateRow = (collection: 'queryParams' | 'headers', index: number, field: keyof KeyValueRow, value: string | boolean) => {
    setDraft((current) => {
      if (current === null) {
        return current
      }

      const rows = [...current[collection]]
      rows[index] = { ...rows[index], [field]: value }
      return { ...current, [collection]: rows }
    })
  }

  const addRow = (collection: 'queryParams' | 'headers') => {
    setDraft((current) => (current === null ? current : { ...current, [collection]: [...current[collection], { key: '', value: '', enabled: true }] }))
  }

  const removeRow = (collection: 'queryParams' | 'headers', index: number) => {
    setDraft((current) => {
      if (current === null) {
        return current
      }

      return { ...current, [collection]: current[collection].filter((_, rowIndex) => rowIndex !== index) }
    })
  }

  const sendRequest = async () => {
    setIsSending(true)
    try {
      setResponse(
        await requestsApi.send(selectedRequest),
      )
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-border/80 bg-card/80">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Badge tone={methodColors[selectedRequest.method]}>{selectedRequest.method}</Badge>
                {selectedRequest.name}
              </CardTitle>
              <CardDescription>{requestSummary}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" type="button">
                <Copy className="size-4" />
                Copy request
              </Button>
              <Button size="sm" onClick={sendRequest} disabled={isSending}>
                <Send className="size-4" />
                {isSending ? 'Sending…' : 'Send'}
              </Button>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-[120px_minmax(0,1fr)_auto]">
            <Select value={selectedRequest.method} onChange={(event) => setDraft((current) => (current ? { ...current, method: event.target.value as ApiRequestModel['method'] } : current))}>
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>PATCH</option>
              <option>DELETE</option>
            </Select>
            <Input value={selectedRequest.url} onChange={(event) => setDraft((current) => (current ? { ...current, url: event.target.value } : current))} />
            <Button variant="outline" size="sm" type="button" onClick={() => navigator.clipboard.writeText(selectedRequest.url)}>
              <FolderTree className="size-4" />
              Save draft
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <Card className="border-border/80 bg-card/80">
          <CardHeader>
            <CardTitle>Request configuration</CardTitle>
            <CardDescription>Editable params, headers, auth, and body.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} defaultValue="params" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="params">Params</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
                <TabsTrigger value="auth">Auth</TabsTrigger>
                <TabsTrigger value="body">Body</TabsTrigger>
              </TabsList>

              <TabsContent value="params">
                <EditableRows rows={selectedRequest.queryParams} onAdd={() => addRow('queryParams')} onRemove={(index) => removeRow('queryParams', index)} onChange={(index, field, value) => updateRow('queryParams', index, field, value)} />
              </TabsContent>

              <TabsContent value="headers">
                <EditableRows rows={selectedRequest.headers} onAdd={() => addRow('headers')} onRemove={(index) => removeRow('headers', index)} onChange={(index, field, value) => updateRow('headers', index, field, value)} />
              </TabsContent>

              <TabsContent value="auth">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Authorization type</Label>
                    <Select value={selectedRequest.authType} onChange={(event) => setDraft((current) => (current ? { ...current, authType: event.target.value as ApiRequestModel['authType'] } : current))}>
                      <option value="none">None</option>
                      <option value="bearer">Bearer token</option>
                    </Select>
                  </div>
                  {selectedRequest.authType === 'bearer' ? (
                    <div className="space-y-2">
                      <Label>Bearer token</Label>
                      <Input value={selectedRequest.token ?? ''} onChange={(event) => setDraft((current) => (current ? { ...current, token: event.target.value } : current))} />
                    </div>
                  ) : null}
                </div>
              </TabsContent>

              <TabsContent value="body">
                <Textarea className="min-h-80 font-mono text-sm" value={selectedRequest.body} onChange={(event) => setDraft((current) => (current ? { ...current, body: event.target.value } : current))} placeholder="Request body" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/80">
          <CardHeader>
            <CardTitle>Response viewer</CardTitle>
            <CardDescription>Mocked response state with status, timing, and JSON payload.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Status" value={response.status.toString()} icon={<Shield className="size-4" />} />
              <Metric label="Duration" value={`${response.durationMs} ms`} icon={<TimerReset className="size-4" />} />
              <Metric label="Size" value={`${Math.round(response.sizeBytes / 1024)} KB`} icon={<Clock3 className="size-4" />} />
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium">Headers</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {response.headers.map((header) => (
                    <TableRow key={header.key}>
                      <TableCell className="font-mono text-xs">{header.key}</TableCell>
                      <TableCell className="font-mono text-xs">{header.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">JSON response</p>
              <pre className="overflow-auto rounded-2xl border border-border bg-background/80 p-4 font-mono text-xs leading-6 text-muted-foreground">{response.body}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function EditableRows({ rows, onAdd, onRemove, onChange }: { rows: KeyValueRow[]; onAdd: () => void; onRemove: (index: number) => void; onChange: (index: number, field: keyof KeyValueRow, value: string | boolean) => void }) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-9">On</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={`${row.key}-${index}`}>
                <TableCell>
                  <input type="checkbox" checked={row.enabled} onChange={(event) => onChange(index, 'enabled', event.target.checked)} />
                </TableCell>
                <TableCell>
                  <Input value={row.key} onChange={(event) => onChange(index, 'key', event.target.value)} placeholder="Key" />
                </TableCell>
                <TableCell>
                  <Input value={row.value} onChange={(event) => onChange(index, 'value', event.target.value)} placeholder="Value" />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon-sm" onClick={() => onRemove(index)} aria-label="Remove row">×</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button variant="outline" size="sm" type="button" onClick={onAdd}>Add row</Button>
    </div>
  )
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{label}</span>
        {icon}
      </div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  )
}

function EmptyRequestState() {
  return (
    <Card className="border-border/80 bg-card/80">
      <CardHeader>
        <CardTitle>No request selected</CardTitle>
        <CardDescription>Pick a request from the collections tree to load the builder.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-dashed border-border p-8 text-sm text-muted-foreground">The request builder is ready once you open a collection request from the tree.</div>
      </CardContent>
    </Card>
  )
}