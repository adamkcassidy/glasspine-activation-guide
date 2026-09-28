import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChecklist } from '@/lib/checklist-state'
import { RESIDENT } from '@/lib/resident'

export function CompletePage() {
  const { photos, household, allDone } = useChecklist()
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

      <div className="animate-soft-rise [animation-delay:120ms] rounded-xl border border-border/80 bg-card/80 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Wrench className="size-4" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-primary/80">
                Next milestone
              </p>
              <h2 className="mt-0.5 font-medium">Know your maintenance basics</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                When something needs attention, Guide helps you submit a clear request the first
                time.
              </p>
            </div>
            <Button asChild variant="secondary" size="sm">
              <Link to="/maintenance">
                See maintenance basics
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
