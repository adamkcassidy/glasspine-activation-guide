import { Sparkles } from 'lucide-react'
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
      <GuideChat
        className="h-full shadow-lg"
        onCollapse={() => setChatCollapsed(true)}
      />
    </div>
  )
}
