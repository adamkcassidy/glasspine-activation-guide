import { AlertTriangle, CheckCircle2, Droplets } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useChecklist } from '@/lib/checklist-state'
import { cn } from '@/lib/utils'

export function MaintenancePage() {
  const {
    maintenancePriority: priority,
    maintenanceSubmitted: submitted,
    setMaintenancePriority: setPriority,
    setMaintenanceSubmitted: setSubmitted,
  } = useChecklist()

  return (
    <div className="space-y-4 animate-soft-rise">
      <div>
        <Badge variant="secondary" className="mb-2 font-normal">
          Maintenance
        </Badge>
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          Something needs attention
        </h1>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          Guide helps you set the right priority and submit a clear request.
        </p>
      </div>

      <div
        className={cn(
          'rounded-xl border bg-card/90 p-4 shadow-sm transition-colors',
          submitted ? 'border-primary/30' : 'border-border/80',
        )}
      >
        <div className="mb-3 flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent">
            <Droplets className="size-4 text-accent-foreground" />
          </div>
          <div>
            <h2 className="font-medium">Kitchen faucet dripping</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Steady drip under the sink · Apt 4B kitchen
            </p>
          </div>
        </div>

        {!submitted ? (
          <>
            <p className="mb-3 text-sm text-muted-foreground">
              Is this an emergency? Guide will set the right priority before you submit.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={priority === 'emergency' ? 'default' : 'outline'}
                onClick={() => setPriority('emergency')}
              >
                <AlertTriangle className="size-3.5" />
                Emergency
              </Button>
              <Button
                type="button"
                size="sm"
                variant={priority === 'routine' ? 'default' : 'outline'}
                onClick={() => setPriority('routine')}
              >
                Routine
              </Button>
            </div>
            {priority && (
              <Button
                type="button"
                className="mt-3 w-full sm:w-auto"
                onClick={() => setSubmitted(true)}
              >
                Submit {priority} request
              </Button>
            )}
          </>
        ) : (
          <div className="flex items-start gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-3 text-sm animate-check-pop">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="font-medium">
                Request submitted · {priority === 'emergency' ? 'Urgent' : 'Routine'}
              </p>
              <p className="mt-0.5 text-muted-foreground">
                Maintenance will follow up. Guide captured priority so the first ticket has what
                they need.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
