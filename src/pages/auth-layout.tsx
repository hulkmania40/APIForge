import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, CheckCircle } from 'lucide-react'

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(102,93,232,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_28%),linear-gradient(180deg,_var(--background),_color-mix(in_oklch,var(--background),black_4%))] px-4 py-8 text-foreground flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
          
          {/* Left Branding Area */}
          <div className="flex flex-col justify-between space-y-8 rounded-[2rem] border border-border/60 bg-zinc-950/40 p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Header / Logo */}
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center shadow-lg shadow-primary/25">
                <Sparkles className="size-3.5 text-white" />
              </div>
              <span className="font-extrabold tracking-wider text-sm uppercase text-foreground">
                API<span className="text-primary font-black">Forge</span>
              </span>
            </div>

            {/* Title / Description */}
            <div className="space-y-4">
              <h1 className="max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-foreground via-foreground/90 to-foreground/75 bg-clip-text">
                {title}
              </h1>
              <p className="max-w-md text-sm text-muted-foreground/90 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Feature Tags */}
            <div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-background/50 p-3.5 flex items-center gap-2">
                <CheckCircle className="size-3.5 text-primary shrink-0" />
                <span>Dark Mode First</span>
              </div>
              <div className="rounded-xl border border-border bg-background/50 p-3.5 flex items-center gap-2">
                <CheckCircle className="size-3.5 text-primary shrink-0" />
                <span>Request Studio</span>
              </div>
              <div className="rounded-xl border border-border bg-background/50 p-3.5 flex items-center gap-2">
                <CheckCircle className="size-3.5 text-primary shrink-0" />
                <span>Collaboration</span>
              </div>
            </div>

            {/* Back link */}
            <div className="pt-2 border-t border-border/40">
              <Link className="text-xs text-primary hover:underline flex items-center gap-1 w-fit" to="/">
                ← Continue as guest to dashboard
              </Link>
            </div>
          </div>

          {/* Right Form Card Panel */}
          <div className="rounded-[2rem] border border-border/60 bg-zinc-900/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[440px]">
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight">Credentials</h2>
                <p className="text-xs text-muted-foreground mt-1">Please enter your account authorization parameters below.</p>
              </div>
              
              <div className="space-y-4">
                {children}
              </div>
            </div>
            
            <div className="border-t border-border/40 pt-4 mt-6 text-xs text-muted-foreground text-center">
              {footer}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}