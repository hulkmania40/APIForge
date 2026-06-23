import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function getApiMethodChipClasses(method: string) {
  switch (method) {
    case 'GET':
      return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
    case 'POST':
      return 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300'
    case 'PUT':
      return 'border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300'
    case 'PATCH':
      return 'border-indigo-500/25 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
    case 'DELETE':
      return 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300'
    default:
      return 'border-border bg-background text-muted-foreground'
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
