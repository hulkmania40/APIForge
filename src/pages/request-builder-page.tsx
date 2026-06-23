import { useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Clock3, Copy, FolderTree, Send, Shield, TimerReset, Save, Plus, Trash2, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react'
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

const methodColors: Record<ApiRequestModel['method'], 'success' | 'warning' | 'default' | 'danger'> = {
  GET: 'success',
  POST: 'warning',
  PUT: 'default',
  PATCH: 'default',
  DELETE: 'danger',
}

const methodSelectTextColors: Record<ApiRequestModel['method'], string> = {
  GET: 'text-emerald-400 font-bold',
  POST: 'text-amber-400 font-bold',
  PUT: 'text-sky-400 font-bold',
  PATCH: 'text-indigo-400 font-bold',
  DELETE: 'text-rose-400 font-bold',
}

// Custom JSON syntax high-lighter
function JSONColorizer({ jsonString }: { jsonString: string }) {
  try {
    const formatted = typeof jsonString === 'string' 
      ? (jsonString.startsWith('{') || jsonString.startsWith('[') ? JSON.stringify(JSON.parse(jsonString), null, 2) : jsonString)
      : JSON.stringify(jsonString, null, 2);
    
    const tokens: React.ReactNode[] = [];
    const regex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|[{}[\],]|\s+)/g;
    
    let match;
    let index = 0;
    while ((match = regex.exec(formatted)) !== null) {
      const part = match[0];
      const key = `json-part-${index++}`;
      
      if (/^"/.test(part)) {
        if (/:$/.test(part)) {
          // Key
          tokens.push(<span key={key} className="text-sky-400 font-semibold">{part.slice(0, -1)}</span>);
          tokens.push(<span key={`${key}-colon`} className="text-muted-foreground/80">:</span>);
        } else {
          // String value
          tokens.push(<span key={key} className="text-emerald-400">{part}</span>);
        }
      } else if (/^(true|false|null)$/.test(part)) {
        // Boolean or Null
        tokens.push(<span key={key} className="text-indigo-400 font-bold">{part}</span>);
      } else if (/^-?\d/.test(part)) {
        // Number
        tokens.push(<span key={key} className="text-amber-400 font-semibold">{part}</span>);
      } else if (/^[{}[\],]/.test(part)) {
        // Punctuation
        tokens.push(<span key={key} className="text-muted-foreground/80">{part}</span>);
      } else {
        // Whitespace
        tokens.push(<span key={key}>{part}</span>);
      }
    }
    
    return (
      <code className="block font-mono text-xs whitespace-pre leading-relaxed select-text">
        {tokens.length > 0 ? tokens : formatted}
      </code>
    );
  } catch (e) {
    return <pre className="font-mono text-xs whitespace-pre-wrap select-text">{jsonString}</pre>;
  }
}

export function RequestBuilderPage() {
  const { requestId } = useParams()
  const requestQuery = useQuery({ 
    queryKey: ['request', requestId], 
    queryFn: () => (requestId ? requestsApi.getById(requestId) : undefined) 
  })

  if (requestId !== undefined && requestQuery.isSuccess && requestQuery.data === undefined) {
    return <Navigate to="/workspace/ws-api-forge" replace />
  }

  if (requestQuery.isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground font-mono">Loading builder...</span>
        </div>
      </div>
    )
  }

  return <RequestBuilderContent key={requestId ?? 'unknown-request'} request={requestQuery.data ?? null} />
}

function RequestBuilderContent({ request }: { request: ApiRequestModel | null }) {
  const [draft, setDraft] = useState<ApiRequestModel | null>(request)
  const [response, setResponse] = useState<ResponseModel | null>(null)
  const [activeTab, setActiveTab] = useState('params')
  const [isSending, setIsSending] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

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
      const res = await requestsApi.send(selectedRequest)
      setResponse(res)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSending(false)
    }
  }

  const saveRequest = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  return (
    <div className="space-y-4 max-w-full">
      
      {/* 1. Request Address and Method Bar Card */}
      <Card className="border-border/60 bg-zinc-900/50 backdrop-blur-xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <CardHeader className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Badge tone={methodColors[selectedRequest.method]} className="px-2 py-0.5 rounded text-[10px] tracking-wide font-black uppercase font-mono">
                  {selectedRequest.method}
                </Badge>
                <span className="text-foreground tracking-tight text-lg">{selectedRequest.name}</span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground/80 font-mono mt-0.5 break-all">
                {requestSummary}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => navigator.clipboard.writeText(JSON.stringify(selectedRequest, null, 2))} className="hover:bg-accent/40 text-xs">
                <Copy className="size-3.5" />
                Copy request JSON
              </Button>
              <Button size="sm" onClick={saveRequest} variant="outline" className="border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-xs">
                <Save className="size-3.5" />
                {saveSuccess ? 'Saved!' : 'Save changes'}
              </Button>
            </div>
          </div>

          {/* Unified URL Input Group */}
          <div className="flex items-center border border-border bg-background/50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all duration-200">
            <select 
              value={selectedRequest.method} 
              onChange={(event) => setDraft((current) => (current ? { ...current, method: event.target.value as ApiRequestModel['method'] } : current))}
              className={`h-10 pl-3 pr-2 bg-transparent text-sm outline-none border-r border-border cursor-pointer select-none font-bold shrink-0 ${methodSelectTextColors[selectedRequest.method] || 'text-foreground'}`}
            >
              <option className="bg-popover text-foreground">GET</option>
              <option className="bg-popover text-foreground">POST</option>
              <option className="bg-popover text-foreground">PUT</option>
              <option className="bg-popover text-foreground">PATCH</option>
              <option className="bg-popover text-foreground">DELETE</option>
            </select>
            
            <input 
              value={selectedRequest.url} 
              onChange={(event) => setDraft((current) => (current ? { ...current, url: event.target.value } : current))}
              placeholder="https://api.example.com/endpoint"
              className="flex-1 min-w-0 h-10 px-3 bg-transparent text-sm outline-none border-none placeholder:text-muted-foreground/60 font-mono"
            />
            
            <Button 
              size="sm" 
              onClick={sendRequest} 
              disabled={isSending}
              className="h-8 mr-1 gap-1.5 px-4 bg-primary text-primary-foreground font-semibold rounded-lg shrink-0 transition-transform active:scale-95 shadow-md shadow-primary/20"
            >
              {isSending ? (
                <>
                  <div className="size-3.5 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                  <span>Sending</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>Send</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* 2. Side-By-Side Request Config and Response Area */}
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] items-start">
        
        {/* REQUEST CONFIGURATION TABBED CARD */}
        <Card className="border-border/60 bg-zinc-900/40 backdrop-blur-xl shadow-lg min-h-[500px]">
          <CardHeader className="p-4 sm:p-5 border-b border-border/40 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/80 flex items-center gap-1.5">
                <Cpu className="size-3.5 text-primary" />
                Request Configuration
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5">
            <Tabs value={activeTab} defaultValue="params" onValueChange={setActiveTab}>
              <TabsList className="bg-background/40 border border-border/80 p-0.5 rounded-lg h-9">
                <TabsTrigger value="params" className="text-xs px-4 h-8 rounded-md transition-all">Params</TabsTrigger>
                <TabsTrigger value="headers" className="text-xs px-4 h-8 rounded-md transition-all">Headers</TabsTrigger>
                <TabsTrigger value="auth" className="text-xs px-4 h-8 rounded-md transition-all">Auth</TabsTrigger>
                <TabsTrigger value="body" className="text-xs px-4 h-8 rounded-md transition-all">Body</TabsTrigger>
              </TabsList>

              <TabsContent value="params" className="mt-4 focus-visible:outline-none">
                <EditableRows 
                  rows={selectedRequest.queryParams} 
                  onAdd={() => addRow('queryParams')} 
                  onRemove={(index) => removeRow('queryParams', index)} 
                  onChange={(index, field, value) => updateRow('queryParams', index, field, value)} 
                  placeholderKey="Query Key"
                  placeholderValue="Query Value"
                />
              </TabsContent>

              <TabsContent value="headers" className="mt-4 focus-visible:outline-none">
                <EditableRows 
                  rows={selectedRequest.headers} 
                  onAdd={() => addRow('headers')} 
                  onRemove={(index) => removeRow('headers', index)} 
                  onChange={(index, field, value) => updateRow('headers', index, field, value)} 
                  placeholderKey="Header Key"
                  placeholderValue="Header Value"
                />
              </TabsContent>

              <TabsContent value="auth" className="mt-4 focus-visible:outline-none">
                <div className="grid gap-4 max-w-md bg-background/20 p-4 rounded-xl border border-border/50">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground/80 font-medium">Authorization type</Label>
                    <Select value={selectedRequest.authType} onChange={(event) => setDraft((current) => (current ? { ...current, authType: event.target.value as ApiRequestModel['authType'] } : current))}>
                      <option value="none">None</option>
                      <option value="bearer">Bearer token</option>
                    </Select>
                  </div>
                  {selectedRequest.authType === 'bearer' ? (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground/80 font-medium">Bearer token</Label>
                      <Input 
                        value={selectedRequest.token ?? ''} 
                        onChange={(event) => setDraft((current) => (current ? { ...current, token: event.target.value } : current))} 
                        placeholder="Paste bearer token here"
                        className="font-mono text-xs bg-background/40"
                      />
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground/70 flex items-center gap-2 mt-2">
                      <Shield className="size-3.5" />
                      <span>This request will be executed without authentication headers.</span>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="body" className="mt-4 focus-visible:outline-none">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <span>JSON Body</span>
                    <span className="font-mono text-[10px]">application/json</span>
                  </div>
                  <Textarea 
                    className="min-h-[280px] font-mono text-xs bg-background/40 border-border/80 focus:border-primary/40 focus:ring-primary/20 placeholder:text-muted-foreground/30 leading-relaxed rounded-xl" 
                    value={selectedRequest.body} 
                    onChange={(event) => setDraft((current) => (current ? { ...current, body: event.target.value } : current))} 
                    placeholder='{\n  "key": "value"\n}' 
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* RESPONSE PREVIEW CARD */}
        <Card className="border-border/60 bg-zinc-900/40 backdrop-blur-xl shadow-lg min-h-[500px] flex flex-col">
          <CardHeader className="p-4 sm:p-5 border-b border-border/40">
            <CardTitle className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/80 flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-primary" />
              Response Viewer
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-start">
            {response === null ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border border-dashed border-border/60 rounded-xl bg-background/20 h-[360px]">
                <Send className="size-8 text-muted-foreground/40 mb-3 animate-pulse" />
                <h3 className="text-sm font-semibold text-foreground/80">Execute Request</h3>
                <p className="text-xs text-muted-foreground/80 mt-1 max-w-xs leading-relaxed">
                  Hit the Send button above to execute this request and see the status code, execution duration, and JSON response.
                </p>
              </div>
            ) : (
              <div className="space-y-4 flex-1 flex flex-col">
                {/* Metrics header */}
                <div className="grid grid-cols-3 gap-2.5">
                  <Metric 
                    label="Status" 
                    value={response.status.toString()} 
                    status={response.status}
                    icon={<Shield className="size-3.5 text-emerald-400" />} 
                  />
                  <Metric 
                    label="Duration" 
                    value={`${response.durationMs} ms`} 
                    icon={<TimerReset className="size-3.5 text-amber-400" />} 
                  />
                  <Metric 
                    label="Size" 
                    value={`${Math.round(response.sizeBytes / 102.4) / 10} KB`} 
                    icon={<Clock3 className="size-3.5 text-sky-400" />} 
                  />
                </div>
                
                {/* Tabs for Response details */}
                <Tabs defaultValue="body-view" className="flex-1 flex flex-col">
                  <TabsList className="bg-background/40 border border-border/80 p-0.5 rounded-lg h-8 self-start">
                    <TabsTrigger value="body-view" className="text-xs px-3 h-7 rounded-md">Body</TabsTrigger>
                    <TabsTrigger value="headers-view" className="text-xs px-3 h-7 rounded-md">Headers ({response.headers.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="body-view" className="mt-3 flex-1 flex flex-col min-h-[260px] focus-visible:outline-none">
                    <div className="relative flex-grow flex flex-col rounded-xl border border-border/80 bg-background/50 overflow-hidden">
                      <div className="absolute top-2 right-2 z-10">
                        <Button 
                          variant="ghost" 
                          size="icon-xs" 
                          className="hover:bg-accent/60 size-7" 
                          onClick={() => navigator.clipboard.writeText(response.body)}
                          title="Copy JSON Response"
                        >
                          <Copy className="size-3" />
                        </Button>
                      </div>
                      <div className="flex-grow p-4 overflow-auto max-h-[360px] leading-relaxed">
                        <JSONColorizer jsonString={response.body} />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="headers-view" className="mt-3 focus-visible:outline-none">
                    <div className="overflow-hidden rounded-xl border border-border/85 bg-background/40">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b border-border/60 hover:bg-transparent">
                            <TableHead className="text-[11px] font-bold text-muted-foreground/80 py-2">Header Key</TableHead>
                            <TableHead className="text-[11px] font-bold text-muted-foreground/80 py-2">Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {response.headers.map((header) => (
                            <TableRow key={header.key} className="border-b border-border/40 hover:bg-accent/10">
                              <TableCell className="font-mono text-xs py-2 text-foreground/90 font-medium">{header.key}</TableCell>
                              <TableCell className="font-mono text-xs py-2 text-muted-foreground/90 break-all select-all">{header.value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface EditableRowsProps {
  rows: KeyValueRow[]
  onAdd: () => void
  onRemove: (index: number) => void
  onChange: (index: number, field: keyof KeyValueRow, value: string | boolean) => void
  placeholderKey: string
  placeholderValue: string
}

function EditableRows({ rows, onAdd, onRemove, onChange, placeholderKey, placeholderValue }: EditableRowsProps) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-border bg-background/20">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/60 hover:bg-transparent bg-background/40">
              <TableHead className="w-12 text-[11px] font-bold text-muted-foreground/80 text-center py-2">On</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground/80 py-2">Key</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground/80 py-2">Value</TableHead>
              <TableHead className="w-12 text-[11px] font-bold text-muted-foreground/80 text-center py-2" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-6 border-none">
                  No variables defined. Click Add Row below to get started.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={`${row.key}-${index}`} className="border-b border-border/40 hover:bg-accent/10">
                  <TableCell className="text-center py-2">
                    <input 
                      type="checkbox" 
                      checked={row.enabled} 
                      onChange={(event) => onChange(index, 'enabled', event.target.checked)} 
                      className="rounded border-border/80 bg-background text-primary focus:ring-primary/20 accent-primary cursor-pointer size-3.5"
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <input 
                      value={row.key} 
                      onChange={(event) => onChange(index, 'key', event.target.value)} 
                      placeholder={placeholderKey}
                      className="w-full bg-transparent border-none outline-none font-mono text-xs focus:ring-0 text-foreground placeholder:text-muted-foreground/40"
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <input 
                      value={row.value} 
                      onChange={(event) => onChange(index, 'value', event.target.value)} 
                      placeholder={placeholderValue}
                      className="w-full bg-transparent border-none outline-none font-mono text-xs focus:ring-0 text-foreground placeholder:text-muted-foreground/40"
                    />
                  </TableCell>
                  <TableCell className="text-center py-2">
                    <Button 
                      variant="ghost" 
                      size="icon-xs" 
                      onClick={() => onRemove(index)} 
                      className="hover:bg-rose-500/20 text-muted-foreground hover:text-rose-400 size-6" 
                      aria-label="Remove row"
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
      <Button 
        variant="outline" 
        size="sm" 
        type="button" 
        onClick={onAdd}
        className="text-xs hover:bg-accent/40 gap-1 rounded-lg border-border/80"
      >
        <Plus className="size-3.5" />
        Add row
      </Button>
    </div>
  )
}

function Metric({ label, value, status, icon }: { label: string; value: string; status?: number; icon: React.ReactNode }) {
  const statusColor = useMemo(() => {
    if (status === undefined) {
      return 'text-foreground'
    }
    if (status >= 200 && status < 300) {
      return 'text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10'
    }
    if (status >= 300 && status < 500) {
      return 'text-amber-400 font-bold bg-amber-500/5 border border-amber-500/10'
    }
    return 'text-rose-400 font-bold bg-rose-500/5 border border-rose-500/10'
  }, [status])

  return (
    <div className={`rounded-xl border border-border bg-background/50 p-2.5 flex flex-col justify-between ${status !== undefined ? statusColor : ''}`}>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 font-medium uppercase tracking-wider">
        <span>{label}</span>
        {icon}
      </div>
      <div className="mt-1 text-sm font-semibold tracking-tight leading-none">{value}</div>
    </div>
  )
}

function EmptyRequestState() {
  return (
    <Card className="border-border/60 bg-zinc-900/40 backdrop-blur-xl p-8 max-w-md mx-auto text-center mt-12 shadow-lg">
      <CardHeader className="pb-2">
        <FolderTree className="size-10 text-primary/60 mx-auto mb-2 animate-bounce" />
        <CardTitle className="text-lg font-semibold text-foreground">No Request Opened</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Select an API request from the collections explorer sidebar to open the Request Studio.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 text-xs text-muted-foreground/75 leading-relaxed">
        The Request Studio allows you to customize the HTTP method, request parameters, headers, authorization details, and body payload, and executes live mock responses instantly.
      </CardContent>
    </Card>
  )
}