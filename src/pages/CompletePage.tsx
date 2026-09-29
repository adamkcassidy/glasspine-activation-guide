import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Car,
  ClipboardList,
  CloudSun,
  FileText,
  MapPin,
  PawPrint,
  UserPlus,
  Wrench,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChecklist } from '@/lib/checklist-state'
import { RESIDENT } from '@/lib/resident'
import { cn } from '@/lib/utils'

const SECONDARY_TILES = [
  {
    title: 'Rent due',
    description: 'Due on the 1st · 5-day grace period',
    icon: Building2,
    action: 'View',
    kind: 'rent' as const,
  },
  {
    title: 'Report a maintenance issue',
    description: 'Guide helps triage and capture a clear ticket.',
    icon: Wrench,
    action: 'Report',
    kind: 'maintenance' as const,
  },
  {
    title: 'Refer a friend',
    description: 'Give them a discount, get one yourself.',
    icon: UserPlus,
    action: 'Refer',
    kind: 'soon' as const,
  },
  {
    title: 'Review your lease',
    description: 'See key terms, dates, and renewal options.',
    icon: FileText,
    action: 'View',
    kind: 'soon' as const,
  },
  {
    title: 'Add a pet',
    description: 'Submit pet details and get approval.',
    icon: PawPrint,
    action: 'Add',
    kind: 'soon' as const,
  },
  {
    title: 'Parking permit',
    description: 'Request or renew your assigned spot.',
    icon: Car,
    action: 'Reserve',
    kind: 'soon' as const,
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
  const { allDone, autopay, autopayDone, completedCount, totalCount } = useChecklist()
  const [toast, setToast] = useState<string | null>(null)
  const [celebrate, setCelebrate] = useState(false)
  const [heroFailed, setHeroFailed] = useState(false)

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
    <div className="space-y-5">
      <section className="animate-soft-rise overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-sm">
        <div className="relative aspect-[21/9] min-h-[140px] w-full bg-muted sm:min-h-[180px]">
          {!heroFailed ? (
            <img
              src="/apartment-hero.jpg"
              alt={`${RESIDENT.unit} at ${RESIDENT.community}`}
              className="size-full object-cover"
              onError={() => setHeroFailed(true)}
            />
          ) : (
            <div
              className="size-full bg-gradient-to-br from-accent via-secondary to-muted"
              aria-hidden
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {RESIDENT.fullName}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/90">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5 shrink-0 opacity-80" />
                {RESIDENT.unit}, {RESIDENT.community}
              </span>
              <span className="text-white/70">{RESIDENT.city}</span>
              <span className="inline-flex items-center gap-1 text-white/85">
                <CloudSun className="size-3.5 shrink-0 opacity-80" />
                {RESIDENT.weather}
                <span className="text-[10px] uppercase tracking-wider text-white/55">static</span>
              </span>
            </p>
          </div>
        </div>
      </section>

      {!allDone ? (
        <Link
          to="/checklist"
          className={cn(
            'animate-soft-rise relative flex items-start gap-4 overflow-hidden rounded-2xl border-2 border-primary/35 bg-primary/5 p-5 shadow-sm transition-colors',
            'hover:border-primary/50 hover:bg-primary/[0.08]',
          )}
        >
          <SoftConfetti play={false} />
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ClipboardList className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-primary/80">
              Get settled
            </p>
            <h2 className="mt-0.5 font-serif text-xl font-semibold tracking-tight text-foreground">
              Move-In Checklist
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {completedCount} of {totalCount} complete — photos, notifications, and autopay.
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Continue checklist
              <ArrowRight className="size-4" />
            </span>
          </div>
        </Link>
      ) : (
        <div className="animate-soft-rise relative overflow-hidden rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 shadow-sm">
          <SoftConfetti play={celebrate} />
          <div className="relative flex items-center gap-3">
            <div
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground',
                celebrate && 'animate-check-spring',
              )}
            >
              <BadgeCheck className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">Checklist complete</p>
              <p className="text-xs text-muted-foreground">
                Your move-in record for {RESIDENT.unit} is saved.
              </p>
            </div>
            <Button asChild size="sm" variant="secondary">
              <Link to="/checklist">View</Link>
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 animate-soft-rise [animation-delay:100ms]">
        {SECONDARY_TILES.map(({ title, description, icon: Icon, action, kind }) => {
          const actionLabel = kind === 'rent' && !autopayDone ? 'Set up autopay' : action
          const body = (
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <h2 className="font-medium">{title}</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
                  {kind === 'rent' && autopayDone && autopay && (
                    <p className="mt-2 text-sm text-primary">
                      Autopay on · we&apos;ll draft your rent on the 1st of each month
                    </p>
                  )}
                </div>
                <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/80 bg-secondary px-2.5 text-xs font-medium text-secondary-foreground">
                  {actionLabel}
                  <ArrowRight className="size-3.5" />
                </span>
              </div>
            </div>
          )

          if (kind === 'maintenance') {
            return (
              <Link
                key={title}
                to="/maintenance"
                className="rounded-xl border border-border/80 bg-card/90 p-4 shadow-sm transition-colors hover:border-primary/35 hover:bg-card"
              >
                {body}
              </Link>
            )
          }

          if (kind === 'rent' && !autopayDone) {
            return (
              <Link
                key={title}
                to="/checklist"
                className="rounded-xl border border-border/80 bg-card/90 p-4 shadow-sm transition-colors hover:border-primary/35 hover:bg-card"
              >
                {body}
              </Link>
            )
          }

          return (
            <button
              key={title}
              type="button"
              onClick={() => setToast('Coming soon')}
              className={cn(
                'rounded-xl border border-border/80 bg-card/90 p-4 text-left shadow-sm transition-colors',
                'hover:border-primary/35 hover:bg-card',
              )}
            >
              {body}
            </button>
          )
        })}
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
