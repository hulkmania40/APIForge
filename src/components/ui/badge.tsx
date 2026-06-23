import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'outline'
}

export function Badge({ className, tone = 'default', ...props }: BadgeProps) {
  const toneClasses = {
    default: 'border-border bg-secondary text-secondary-foreground',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    danger: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    outline: 'border-border bg-transparent text-muted-foreground',
  } as const

  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', toneClasses[tone], className)} {...props} />
}