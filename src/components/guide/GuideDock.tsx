import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Sparkles, X } from 'lucide-react'
import { GuideChat } from '@/components/guide/GuideChat'
import { Button } from '@/components/ui/button'
import { useChecklist } from '@/lib/checklist-state'
import { cn } from '@/lib/utils'

function nudgeCopyForPath(pathname: string): string {
  if (pathname.startsWith('/maintenance')) {
    return 'Need to report an issue? I can help triage and file it.'
  }
  if (pathname.startsWith('/checklist')) {
    return 'Questions on photos, notifications, or autopay? Ask me anytime.'
  }
  if (pathname.startsWith('/complete')) {
    return 'You’re set — ask me about rent or maintenance anytime.'
  }
  if (pathname.startsWith('/measure')) {
    return 'Curious how we’d measure activation? I can walk you through it.'
  }
  if (pathname.startsWith('/nudges')) {
    return 'Want the plain-language take on these reminders? Ask away.'
  }
  if (pathname.startsWith('/write-up')) {
    return 'Questions about the Guide-led move-in flow? I’m here.'
  }
  return 'Questions about your move-in checklist? I’m here to help.'
}

export function GuideDock({ className }: { className?: string }) {
  const location = useLocation()
  const { chatCollapsed, setChatCollapsed, chatOpenedThisSession } = useChecklist()
  const [nudgeReady, setNudgeReady] = useState(false)
  const [nudgeDismissed, setNudgeDismissed] = useState(false)

  useEffect(() => {
    if (!chatCollapsed || chatOpenedThisSession || nudgeDismissed) {
      setNudgeReady(false)
      return
    }
    const t = window.setTimeout(() => setNudgeReady(true), 2800)
    return () => window.clearTimeout(t)
  }, [chatCollapsed, chatOpenedThisSession, nudgeDismissed, location.pathname])

  const showNudge =
    chatCollapsed && !chatOpenedThisSession && !nudgeDismissed && nudgeReady

  if (chatCollapsed) {
    return (
      <div className={cn('fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2', className)}>
        {showNudge && (
          <div
            role="status"
            className="animate-soft-rise flex max-w-[240px] items-start gap-2 rounded-2xl rounded-br-md border border-border/80 bg-card px-3 py-2.5 text-sm shadow-md"
          >
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="size-3" />
            </span>
            <button
              type="button"
              className="min-w-0 flex-1 text-left leading-snug text-foreground"
              onClick={() => setChatCollapsed(false)}
            >
              {nudgeCopyForPath(location.pathname)}
            </button>
            <button
              type="button"
              className="mt-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Dismiss Guide tip"
              onClick={() => setNudgeDismissed(true)}
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}
        <Button
          type="button"
          size="icon"
          className="size-12 rounded-full shadow-md animate-guide-pulse"
          onClick={() => setChatCollapsed(false)}
          aria-label="Open Glasspine Guide"
        >
          <Sparkles className="size-5" />
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'fixed bottom-5 right-5 z-40 flex w-[min(100vw-1.5rem,340px)] flex-col',
        'h-[min(82svh,640px)]',
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
