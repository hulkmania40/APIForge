import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="max-w-lg border-border/80 bg-card/80">
        <CardHeader>
          <CardTitle>Page not found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">The requested route is not part of the APIForge shell.</p>
          <Button asChild>
            <Link to="/">Return home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}