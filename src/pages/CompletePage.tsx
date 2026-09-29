import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Car,
  FileText,
  PawPrint,
  UserPlus,
  Wrench,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChecklist } from '@/lib/checklist-state'
import { RESIDENT } from '@/lib/resident'
import { cn } from '@/lib/utils'

const COMING_SOON = [
  {
    title: 'Review your lease',
    description: 'See key terms, dates, and renewal options.',
    icon: FileText,
  },
  {
    title: 'Refer a friend',
    description: 'Give them a discount, get one yourself.',
    icon: UserPlus,
  },
  {
    title: 'Add a pet',
    description: 'Submit pet details and get approval.',
    icon: PawPrint,
  },
  {
    title: 'Parking permit',
    description: 'Request or renew your assigned spot.',
    icon: Car,
  },
] as const

const CONFETTI_COLORS = [
  'oklch(0.42 0.08 140)',
  'oklch(0.55 0.1 140)',
  'oklch(0.7 0.08 90)',
  'oklch(0.6 0.08 100)',
  'oklch(0.45 0.06 160)',
] as const

function SoftConfetti({ play }: { play: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2 + (i % 3) * 0.2
        const dist = 48 + (i % 5) * 14
        return {
          id: i,
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist - 20}px`,
          rot: `${(i % 2 === 0 ? 1 : -1) * (140 + i * 12)}deg`,
          delay: `${(i % 6) * 40}ms`,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        }
      }),
    [],
  )

  if (!play) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={
            {
              '--dx': p.dx,
              '--dy': p.dy,
              '--rot': p.rot,
              backgroundColor: p.color,
              animationDelay: p.delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

export function CompletePage() {
  const { photos, notificationsDone, allDone, autopay, autopayDone } = useChecklist()
  const [toast, setToast] = useState<string | null>(null)
  const [celebrate, setCelebrate] = useState(false)
  const photoCount = photos.length
  const parts: string[] = []
  if (photoCount > 0) {
    parts.push(`unit condition (${photoCount} photo${photoCount === 1 ? '' : 's'})`)
  } else {
    parts.push('unit condition')
  }
  if (notificationsDone) parts.push('notification preferences')
  if (autopayDone) parts.push('autopay setup')
  const recordList =
    parts.length <= 1
      ? parts[0] ?? 'move-in details'
      : `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (!allDone) {
      setCelebrate(false)
      return
    }
    setCelebrate(true)
    const t = window.setTimeout(() => setCelebrate(false), 1800)
    return () => window.clearTimeout(t)
  }, [allDone])

  return (
    <div className="space-y-6">
      <div className="animate-soft-rise relative overflow-hidden rounded-2xl border border-primary/25 bg-card/90 p-6 text-center shadow-sm sm:p-8">
        <SoftConfetti play={celebrate} />
        <div
          className={cn(
            'relative mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary',
            allDone && 'animate-check-spring',
          )}
        >
          <BadgeCheck className="size-8" />
        </div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          Move-in record saved
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Nice work, {RESIDENT.firstName}. Your move-in day {recordList}
          {allDone ? ' are' : ' will be'} recorded for {RESIDENT.unit}.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 animate-soft-rise [animation-delay:100ms]">
        <div className="rounded-xl border border-border/80 bg-card/90 p-4 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Building2 className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-medium">Rent due</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Due on the 1st · 5-day grace period
              </p>
              {autopayDone && autopay ? (
                <p className="mt-2 text-sm text-primary">
                  Autopay on · we&apos;ll draft your rent on the 1st of each month
                </p>
              ) : (
                <Button asChild size="sm" className="mt-3" variant="secondary">
                  <Link to="/checklist">
                    Set up autopay
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card/90 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Wrench className="size-4" />
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <h2 className="font-medium">Submit a maintenance request</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Guide helps triage and capture a clear ticket.
                </p>
              </div>
              <Button asChild size="sm" variant="secondary">
                <Link to="/maintenance">
                  Open maintenance
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {COMING_SOON.map(({ title, description, icon: Icon }) => (
          <button
            key={title}
            type="button"
            onClick={() => setToast('Coming soon')}
            className={cn(
              'rounded-xl border border-border/80 bg-card/90 p-4 text-left shadow-sm transition-colors',
              'hover:border-primary/35 hover:bg-card',
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Icon className="size-4" />
              </div>
              <div>
                <h2 className="font-medium">{title}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium text-foreground shadow-md animate-soft-rise"
        >
          {toast}
        </div>
      )}
    </div>
  )
}
