import { useQuery } from '@tanstack/react-query'
import { Clock3 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { historyApi } from '@/services/history'

export function HistoryPage() {
  const historyQuery = useQuery({ queryKey: ['history'], queryFn: historyApi.list })

  return (
    <Card className="border-border/80 bg-card/80">
      <CardHeader>
        <CardTitle>Request history</CardTitle>
        <CardDescription>View recently executed requests, statuses, and timings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {historyQuery.data?.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Badge tone={item.status < 300 ? 'success' : 'danger'}>{item.method}</Badge>
                <span className="truncate font-medium">{item.url}</span>
              </div>
              <p className="text-sm text-muted-foreground">{item.timestamp}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{item.status}</span>
              <span>{item.durationMs ?? '—'} ms</span>
              <Clock3 className="size-4" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}