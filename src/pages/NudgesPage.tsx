import { Link } from 'react-router-dom'
import { Mail, MessageSquare, Smartphone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type NudgeFrame = {
  id: string
  dayLabel: string
  channel: 'email' | 'sms' | 'push'
  /** Email subject / push title / SMS label */
  title: string
  body: string
  appBridge?: string
  ctaLabel: string
  to: string
}

/** Fixed illustrative frames — not tied to live checklist progress. */
const FRAMES: NudgeFrame[] = [
  {
    id: 'day0-email',
    dayLabel: 'Move-in day',
    channel: 'email',
    title: 'Subject: Welcome to Oak Street — your Move-In Checklist is ready',
    body: 'Hi Jordan — Apt 4B is ready for you. Start with unit photos so you and your property manager share the same dated record of condition. It only takes a few minutes.',
    appBridge: 'Get faster reminders — download the Glasspine app',
    ctaLabel: 'Open checklist',
    to: '/checklist',
  },
  {
    id: 'day2-sms',
    dayLabel: 'Day 2',
    channel: 'sms',
    title: 'SMS to Jordan',
    body: 'Glasspine: Apt 4B photos still open. Finish your move-in photos so your unit record is dated. Reply STOP to opt out.',
    appBridge: 'Get faster reminders — download the Glasspine app',
    ctaLabel: 'Finish photos',
    to: '/checklist',
  },
  {
    id: 'day2-push',
    dayLabel: 'Day 2',
    channel: 'push',
    title: 'Photos still open for Apt 4B',
    body: 'Document your unit while it’s fresh — takes a few minutes.',
    ctaLabel: 'Continue photos',
    to: '/checklist',
  },
  {
    id: 'day5-nudge',
    dayLabel: 'Day 5',
    channel: 'push',
    title: '2 move-in steps still open',
    body: 'Notifications or autopay still open? Complete them this week to finish activation.',
    ctaLabel: 'Finish remaining steps',
    to: '/checklist',
  },
]

const CHANNEL_ICON = {
  email: Mail,
  sms: MessageSquare,
  push: Smartphone,
} as const

const CHANNEL_LABEL = {
  email: 'Email',
  sms: 'SMS',
  push: 'Push',
} as const

export function NudgesPage() {
  return (
    <div className="max-w-2xl space-y-5 animate-soft-rise">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          Activation nudges
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Timed email, SMS, and push reminders that help residents finish move-in steps. Sent only
          when something is still open. Nudges tied to a completed step stop automatically.
        </p>
        <p className="mt-2 text-xs text-muted-foreground/80">
          Illustrative sample for the comms plan. Not tied to progress in this demo session.
        </p>
      </div>

      <ol className="relative ml-3 space-y-4 border-l border-border/80 pl-6">
        {FRAMES.map((frame) => {
          const Icon = CHANNEL_ICON[frame.channel]
          return (
            <li key={frame.id} className="relative">
              <span className="absolute -left-6 top-1.5 flex size-6 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                <Icon className="size-3.5" />
              </span>
              <div className="rounded-xl border border-border/80 bg-card/90 p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-primary/80">
                    {frame.dayLabel}
                  </span>
                  <Badge variant="secondary" className="h-5 text-[10px] font-normal">
                    {CHANNEL_LABEL[frame.channel]}
                  </Badge>
                </div>
                <h2 className="mt-1.5 text-sm font-medium leading-snug">{frame.title}</h2>
                <p className="mt-1.5 whitespace-pre-wrap text-sm text-muted-foreground">
                  {frame.body}
                </p>
                {frame.appBridge && (
                  <p className="mt-2 text-xs font-medium text-foreground/80">{frame.appBridge}</p>
                )}
                <Button asChild size="sm" className="mt-3">
                  <Link to={frame.to}>{frame.ctaLabel}</Link>
                </Button>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
