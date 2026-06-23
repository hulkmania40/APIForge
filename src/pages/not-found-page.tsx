import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(102,93,232,0.12),_transparent_45%),linear-gradient(180deg,_var(--background),_color-mix(in_oklch,var(--background),black_3%))] px-4 text-foreground">
      <Card className="max-w-md w-full glass-card shadow-2xl relative overflow-hidden text-center p-6">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-violet-500" />
        
        <CardHeader className="pb-2">
          <AlertCircle className="size-12 text-rose-400 mx-auto mb-3 animate-pulse" />
          <CardTitle className="text-xl font-extrabold tracking-tight">404 - Page Not Found</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            The requested route is not part of the APIForge canvas.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-2">
          <p className="text-xs text-muted-foreground/80 leading-relaxed">
            The link you followed may be broken or the workspace parameters have expired. Make sure you have open access permissions.
          </p>
          <Button asChild className="mx-auto block w-fit font-semibold bg-primary text-primary-foreground">
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}