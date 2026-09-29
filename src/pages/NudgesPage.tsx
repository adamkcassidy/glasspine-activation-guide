import { Link } from 'react-router-dom'
import { CheckCircle2, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useChecklist, type NotificationPrefs } from '@/lib/checklist-state'
import { cn } from '@/lib/utils'

type NudgeState = {
  photosDone: boolean
  notificationsDone: boolean
  autopayDone: boolean
  notifications: NotificationPrefs
}

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
  isStopped: (s: NudgeState) => boolean
  /** Channel must be opted in for this frame to be "reachable" */
  needsChannel: keyof NotificationPrefs
}

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
    isStopped: () => false,
    needsChannel: 'email',
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
    isStopped: (s) => s.photosDone,
    needsChannel: 'sms',
  },
  {
    id: 'day2-push',
    dayLabel: 'Day 2',
    channel: 'push',
    title: 'Photos still open for Apt 4B',
    body: 'Document your unit while it’s fresh — takes a few minutes.',
    ctaLabel: 'Continue photos',
    to: '/checklist',
    isStopped: (s) => s.photosDone,
    needsChannel: 'push',
  },
  {
    id: 'day5-nudge',
    dayLabel: 'Day 5',
    channel: 'push',
    title: '2 move-in steps still open',
    body: 'Notifications or autopay still open? Complete them this week to finish activation.',
    ctaLabel: 'Finish remaining steps',
    to: '/checklist',
    isStopped: (s) => s.notificationsDone && s.autopayDone,
    needsChannel: 'push',
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
  const { photosDone, notificationsDone, autopayDone, notifications } = useChecklist()
  const state: NudgeState = { photosDone, notificationsDone, autopayDone, notifications }

  const optedChannels = (['email', 'sms', 'push'] as const)
    .filter((k) => notifications[k])
    .map((k) => CHANNEL_LABEL[k])

  const day5Parts: string[] = []
  if (!notificationsDone) day5Parts.push('notifications')
  if (!autopayDone) day5Parts.push('autopay')
  const day5Title =
    day5Parts.length === 2
      ? 'Notifications and autopay still open'
      : day5Parts.length === 1
        ? `${day5Parts[0]![0]!.toUpperCase()}${day5Parts[0]!.slice(1)} still open`
        : 'Move-in steps complete'
  const day5Body =
    day5Parts.length > 0
      ? `${day5Parts.join(' and ').replace(/^\w/, (c) => c.toUpperCase())} still open for Apt 4B. Finish this week to complete activation.`
      : 'All remaining steps are done — this nudge would stop.'

  const frames = FRAMES.map((frame) =>
    frame.id === 'day5-nudge' ? { ...frame, title: day5Title, body: day5Body } : frame,
  )

  return (
    <div className="space-y-5 animate-soft-rise">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          Activation nudges
        </h1>
        <p className="mt-1 max-w-lg text-sm text-muted-foreground">
          Reminder timeline tied to the checklist. Frames stop once the linked item is done in this
          session.
        </p>
        <p className="mt-2 max-w-lg rounded-lg border border-border/70 bg-card/70 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          {notificationsDone && optedChannels.length > 0 ? (
            <>
              Jordan turned on <strong className="text-foreground">{optedChannels.join(', ')}</strong>{' '}
              in the checklist — that&apos;s why this sequence can reach Apt 4B. Push only works
              after the Glasspine app is installed (called out in email/SMS).
            </>
          ) : (
            <>
              Without <strong className="text-foreground">Turn on notifications</strong> on the
              checklist, these reminders would have no channel to reach the resident. Opt in there
              to make this sequence real.
            </>
          )}
        </p>
      </div>

      <ol className="relative space-y-4 border-l border-border/80 pl-5">
        {frames.map((frame) => {
          const stopped = frame.isStopped(state)
          const channelOn = notifications[frame.needsChannel]
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
                  <Badge variant="secondary" className="h-5 text-[10px] font-normal">
                    {CHANNEL_LABEL[frame.channel]}
                  </Badge>
                  {stopped && (
                    <Badge variant="secondary" className="h-5 text-[10px] font-normal">
                      Stopped — item done
                    </Badge>
                  )}
                  {!channelOn && (
                    <Badge variant="secondary" className="h-5 text-[10px] font-normal">
                      Channel not opted in
                    </Badge>
                  )}
                </div>
                <h2 className="mt-1.5 text-sm font-medium leading-snug">{frame.title}</h2>
                <p className="mt-1.5 whitespace-pre-wrap text-sm text-muted-foreground">
                  {frame.body}
                </p>
                {frame.appBridge && (
                  <p className="mt-2 text-xs font-medium text-foreground/80">{frame.appBridge}</p>
                )}
                {!stopped && (
                  <Button asChild size="sm" className="mt-3">
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
