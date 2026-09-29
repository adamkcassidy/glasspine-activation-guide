import { CheckCircle2, Inbox, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChecklist } from '@/lib/checklist-state'

function formatSubmittedAt(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function MaintenancePage() {
  const { submittedRequest, startMaintenanceReport } = useChecklist()

  return (
    <div className="space-y-4 animate-soft-rise max-w-lg">
      <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
        Need something fixed?
      </h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Tell Guide what&apos;s going on in the chat — free text or a suggested chip. Guide will ask
        whether it&apos;s an emergency, then submit a clear request for you. True emergencies (gas,
        fire, flooding, no heat in winter, sparking outlets): call{' '}
        <strong className="whitespace-nowrap text-foreground">555-0142</strong> first.
      </p>

      <Button type="button" onClick={startMaintenanceReport}>
        <Wrench className="size-4" />
        Report an issue
      </Button>

      {submittedRequest ? (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 shadow-sm animate-soft-rise">
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="size-4 shrink-0" />
            <p className="font-medium">Request submitted</p>
          </div>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Ticket ID</dt>
              <dd className="font-medium tabular-nums">{submittedRequest.ticketId}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Category</dt>
              <dd className="font-medium">{submittedRequest.issue}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Priority</dt>
              <dd className="font-medium capitalize">{submittedRequest.priority}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Submitted</dt>
              <dd className="font-medium">{formatSubmittedAt(submittedRequest.submittedAt)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-muted-foreground">
            You&apos;ll get email and SMS updates on this request.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-6 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Inbox className="size-5" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground">No active requests right now.</p>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            When you report an issue, the confirmation will show up here.
          </p>
        </div>
      )}
    </div>
  )
}
