import { ChevronDown, Sparkles } from 'lucide-react'
import { GuideChat } from '@/components/guide/GuideChat'
import { Button } from '@/components/ui/button'
import { useChecklist } from '@/lib/checklist-state'
import { cn } from '@/lib/utils'

export function GuideDock({ className }: { className?: string }) {
  const { chatCollapsed, setChatCollapsed } = useChecklist()

  if (chatCollapsed) {
    return (
      <Button
        type="button"
        size="icon"
        className={cn(
          'fixed bottom-5 right-5 z-40 size-12 rounded-full shadow-md',
          className,
        )}
        onClick={() => setChatCollapsed(false)}
        aria-label="Open Glasspine Guide"
      >
        <Sparkles className="size-5" />
      </Button>
    )
  }

  return (
    <div
      className={cn(
        'fixed bottom-5 right-5 z-40 flex w-[min(100vw-1.5rem,400px)] flex-col',
        'h-[min(82svh,680px)]',
        className,
      )}
    >
      <div className="relative min-h-0 flex-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1 z-10 h-7 gap-1 px-2 text-xs text-muted-foreground"
          onClick={() => setChatCollapsed(true)}
          aria-label="Collapse Guide"
        >
          <ChevronDown className="size-3.5" />
          <span className="sr-only">Minimize</span>
        </Button>
        <GuideChat className="h-full shadow-lg" />
      </div>
    </div>
  )
}
