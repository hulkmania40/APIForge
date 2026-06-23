import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.15),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.12),_transparent_24%),linear-gradient(180deg,_var(--background),_color-mix(in_oklch,var(--background),black_5%))] px-4 py-10 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center space-y-6 rounded-[2rem] border border-border/70 bg-card/70 p-8 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">APIForge</p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
            <p className="max-w-xl text-base text-muted-foreground">{description}</p>
            <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background/70 p-4">Dark mode first</div>
              <div className="rounded-2xl border border-border bg-background/70 p-4">Request builder focus</div>
              <div className="rounded-2xl border border-border bg-background/70 p-4">Workspace-aware layout</div>
            </div>
            <Link className="text-sm text-primary hover:underline" to="/">Continue to dashboard</Link>
          </div>

          <Card className="border-border/70 bg-card/85 shadow-xl shadow-black/20">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">{children}</CardContent>
            <div className="border-t border-border px-6 py-4 text-sm text-muted-foreground">{footer}</div>
          </Card>
        </div>
      </div>
    </div>
  )
}