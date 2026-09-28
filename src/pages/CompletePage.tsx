import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Car,
  FileText,
  Lock,
  PawPrint,
  Users,
  Wrench,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useChecklist } from '@/lib/checklist-state'
import { RESIDENT } from '@/lib/resident'
import { cn } from '@/lib/utils'

const COMING_SOON = [
  { title: 'Review your lease', icon: FileText },
  { title: 'Add a roommate', icon: Users },
  { title: 'Add a pet', icon: PawPrint },
  { title: 'Parking permit', icon: Car },
] as const

export function CompletePage() {
  const { photos, household, allDone, autopay, autopayDone } = useChecklist()
  const photoCount = photos.length
  const householdCount = household.length
  const photoLabel =
    photoCount > 0 ? ` (${photoCount} photo${photoCount === 1 ? '' : 's'})` : ''
  const householdLabel =
    householdCount > 0 ? `, household of ${householdCount + 1}` : ''

  return (
    <div className="space-y-6">
      <div className="animate-soft-rise rounded-2xl border border-primary/25 bg-card/90 p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary animate-check-pop">
          <BadgeCheck className="size-8" />
        </div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          Move-in record saved
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Nice work, {RESIDENT.firstName}. Your move-in day unit condition{photoLabel}
          {householdLabel}, and autopay setup
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
                  Autopay on · {autopay.accountLabel} · drafts the {ordinal(autopay.draftDay)}
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

        {COMING_SOON.map(({ title, icon: Icon }) => (
          <div
            key={title}
            className={cn(
              'rounded-xl border border-dashed border-border/70 bg-card/50 p-4 opacity-80',
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="size-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-medium text-muted-foreground">{title}</h2>
                  <Badge variant="secondary" className="h-5 gap-1 text-[10px] font-normal">
                    <Lock className="size-2.5" />
                    Coming soon
                  </Badge>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">Not available in this demo.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`
}
