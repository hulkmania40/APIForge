import { createContext, useContext, useMemo, useState, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  value: string
  setValue: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

interface TabsProps {
  value?: string
  defaultValue: string
  onValueChange?: (value: string) => void
  children: ReactNode
}

export function Tabs({ value, defaultValue, onValueChange, children }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const resolvedValue = value ?? internalValue

  const contextValue = useMemo<TabsContextValue>(
    () => ({
      value: resolvedValue,
      setValue: (nextValue) => {
        if (value === undefined) {
          setInternalValue(nextValue)
        }

        onValueChange?.(nextValue)
      },
    }),
    [onValueChange, resolvedValue, value],
  )

  return <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('inline-flex h-10 items-center rounded-xl border border-border bg-muted p-1 text-muted-foreground', className)} {...props} />
}

export function TabsTrigger({ className, value, ...props }: HTMLAttributes<HTMLButtonElement> & { value: string }) {
  const context = useContext(TabsContext)

  if (context === null) {
    throw new Error('TabsTrigger must be used within Tabs')
  }

  const isActive = context.value === value

  return <button type="button" role="tab" aria-selected={isActive} data-state={isActive ? 'active' : 'inactive'} className={cn('inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30', isActive ? 'bg-background text-foreground shadow-sm' : 'hover:text-foreground', className)} onClick={() => context.setValue(value)} {...props} />
}

export function TabsContent({ className, value, ...props }: HTMLAttributes<HTMLDivElement> & { value: string }) {
  const context = useContext(TabsContext)

  if (context === null) {
    throw new Error('TabsContent must be used within Tabs')
  }

  if (context.value !== value) {
    return null
  }

  return <div className={cn('mt-4', className)} role="tabpanel" {...props} />
}