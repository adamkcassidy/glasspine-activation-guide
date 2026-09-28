import { Link } from 'react-router-dom'
import { Bell, CheckCircle2, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useChecklist } from '@/lib/checklist-state'
import { cn } from '@/lib/utils'

type NudgeFrame = {
  id: string
  dayLabel: string
  channel: 'email' | 'sms' | 'push'
  title: string
  body: string
  /** When true, this nudge is considered stopped */
  isStopped: (s: { photosDone: boolean; householdDone: boolean; autopayDone: boolean }) => boolean
  ctaLabel: string
  to: string
}

const FRAMES: NudgeFrame[] = [
  {
    id: 'day0-email',
    dayLabel: 'Move-in day',
    channel: 'email',
    title: 'Welcome to Oak Street',
    body: 'Jordan — your Move-In Checklist is ready. Start with unit photos so you and your manager share the same record.',
    isStopped: () => false,
    ctaLabel: 'Open checklist',
    to: '/checklist',
  },
  {
    id: 'day2-sms',
    dayLabel: 'Day 2',
    channel: 'sms',
    title: 'Photos still open',
    body: 'Quick reminder: unit photos aren’t finished for Apt 4B. Tap to continue — takes a few minutes.',
    isStopped: (s) => s.photosDone,
    ctaLabel: 'Finish photos',
    to: '/checklist',
  },
  {
    id: 'day2-push',
    dayLabel: 'Day 2',
    channel: 'push',
    title: 'Complete your move-in photos',
    body: 'Glasspine: Document Apt 4B condition while it’s fresh.',
    isStopped: (s) => s.photosDone,
    ctaLabel: 'Continue photos',
    to: '/checklist',
  },
  {
    id: 'day5-nudge',
    dayLabel: 'Day 5',
    channel: 'push',
    title: 'Finish remaining move-in steps',
    body: 'Household or autopay still open? Complete them this week to finish activation.',
    isStopped: (s) => s.householdDone && s.autopayDone,
    ctaLabel: 'Finish remaining steps',
    to: '/checklist',
  },
]

const CHANNEL_ICON = {
  email: Mail,
  sms: MessageSquare,
  push: Smartphone,
} as const

export function NudgesPage() {
  const { photosDone, householdDone, autopayDone } = useChecklist()
  const state = { photosDone, householdDone, autopayDone }

  const day5Parts: string[] = []
  if (!householdDone) day5Parts.push('household')
  if (!autopayDone) day5Parts.push('autopay')
  const day5Body =
    day5Parts.length > 0
      ? `Still open: ${day5Parts.join(' and ')}. Complete ${day5Parts.length === 1 ? 'it' : 'them'} this week to finish activation.`
      : 'All remaining steps are done — this nudge would stop.'

  const frames = FRAMES.map((frame) =>
    frame.id === 'day5-nudge' ? { ...frame, body: day5Body } : frame,
  )

  return (
    <div className="space-y-5 animate-soft-rise">
      <div>
        <Badge variant="secondary" className="mb-2 gap-1 font-normal">
          <Bell className="size-3" />
          Mocked
        </Badge>
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          Activation nudges
        </h1>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Illustrative timeline of reminders. Nothing is sent — frames stop once the linked item is
          done in this session.
        </p>
      </div>

      <ol className="relative space-y-4 border-l border-border/80 pl-5">
        {frames.map((frame) => {
          const stopped = frame.isStopped(state)
          const Icon = CHANNEL_ICON[frame.channel]
          return (
            <li key={frame.id} className="relative">
              <span
                className={cn(
                  'absolute -left-[1.55rem] top-1 flex size-5 items-center justify-center rounded-full border bg-background',
                  stopped ? 'border-primary/40 text-primary' : 'border-border text-muted-foreground',
                )}
              >
                {stopped ? <CheckCircle2 className="size-3" /> : <Icon className="size-3" />}
              </span>
              <div
                className={cn(
                  'rounded-xl border p-4 shadow-sm transition-opacity',
                  stopped
                    ? 'border-border/50 bg-muted/30 opacity-70'
                    : 'border-border/80 bg-card/90',
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-primary/80">
                    {frame.dayLabel}
                  </span>
                  <Badge variant="secondary" className="h-5 text-[10px] font-normal capitalize">
                    {frame.channel}
                  </Badge>
                  {stopped && (
                    <Badge variant="secondary" className="h-5 text-[10px] font-normal">
                      Stopped — item done
                    </Badge>
                  )}
                </div>
                <h2 className="mt-1.5 font-medium">{frame.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{frame.body}</p>
                {!stopped && (
                  <Button asChild size="sm" variant="secondary" className="mt-3">
                    <Link to={frame.to}>{frame.ctaLabel}</Link>
                  </Button>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
