import type { ReactNode } from 'react'
import { Check, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type ChecklistItemProps = {
  title: string
  description: string
  done: boolean
  icon: LucideIcon
  children: ReactNode
  className?: string
}

export function ChecklistItem({
  title,
  description,
  done,
  icon: Icon,
  children,
  className,
}: ChecklistItemProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border/80 bg-card/90 p-4 shadow-sm transition-colors',
        done && 'border-primary/30 bg-primary/[0.04]',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full',
            done
              ? 'animate-check-pop bg-primary text-primary-foreground'
              : 'bg-accent text-accent-foreground',
          )}
        >
          {done ? <Check className="size-4" /> : <Icon className="size-4" />}
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h3 className="font-medium leading-tight">{title}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}
