import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Clock3, History, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { historyApi } from '@/services/history'

const methodColors: Record<string, string> = {
  GET: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  POST: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  PUT: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
  PATCH: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
  DELETE: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
}

const statusColors = (status: number) => {
  if (status >= 200 && status < 300) return 'text-emerald-400 font-semibold'
  if (status >= 300 && status < 500) return 'text-amber-400 font-semibold'
  return 'text-rose-400 font-semibold'
}

export function HistoryPage() {
  const navigate = useNavigate()
  const historyQuery = useQuery({ queryKey: ['history'], queryFn: historyApi.list })

  return (
    <Card className="glass-card shadow-lg relative overflow-hidden">
      <CardHeader className="p-4 sm:p-5 border-b border-border/40">
        <div className="flex items-center gap-2">
          <History className="size-4 text-primary" />
          <CardTitle className="text-base font-bold">Request Execution Logs</CardTitle>
        </div>
        <CardDescription className="text-xs">
          View recently executed endpoint history, statuses, and performance timings.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-5 space-y-2.5">
        {historyQuery.isLoading ? (
          <div className="space-y-2">
            <div className="h-12 animate-pulse rounded-xl bg-muted/40" />
            <div className="h-12 animate-pulse rounded-xl bg-muted/40" />
          </div>
        ) : historyQuery.data?.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground py-8">
            No executed requests found. Try sending a request in the Request Studio.
          </div>
        ) : (
          historyQuery.data?.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/workspace/ws-api-forge/request/request-me`)}
              className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-background/30 px-4 py-3 text-left transition-all duration-200 hover:bg-accent/40 hover:border-primary/20 group cursor-pointer"
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2.5">
                    <span className={`text-[9px] font-bold font-mono px-1 py-0.2 rounded border shrink-0 min-w-8.5 text-center ${methodColors[item.method] || 'bg-muted text-muted-foreground border-border'}`}>
                    {item.method}
                  </span>
                  <span className="truncate text-xs font-mono text-foreground/90 font-semibold">{item.url}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-1 pl-1">{item.timestamp}</p>
              </div>
              
              <div className="flex items-center gap-5 text-xs text-muted-foreground/80 shrink-0">
                <span className={statusColors(item.status)}>{item.status}</span>
                <span className="font-mono">{item.durationMs ?? '—'} ms</span>
                <Clock3 className="size-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                <ArrowRight className="size-3 text-muted-foreground/0 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </button>
          ))
        )}
      </CardContent>
    </Card>
  )
}