import { useState } from 'react'
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Droplets,
  ExternalLink,
  Phone,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChecklist } from '@/lib/checklist-state'
import { cn } from '@/lib/utils'

const LOCATIONS = [
  'Apt 4B kitchen',
  'Apt 4B bathroom',
  'Apt 4B bedroom',
  'Apt 4B living room',
  'Apt 4B hallway',
  'Building common area',
] as const

export function MaintenancePage() {
  const {
    maintenancePhase,
    maintenanceDraft,
    beginMaintenanceClarifying,
    chooseMaintenanceEmergency,
    chooseMaintenanceRoutine,
    updateMaintenanceDraft,
    submitMaintenanceRequest,
    resetMaintenance,
  } = useChecklist()

  const [photoFailed, setPhotoFailed] = useState(false)

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
          Guide asks a couple of questions, then helps you submit a clear request — or hand off
          true emergencies to 555-0142.
        </p>
      </div>

      {maintenancePhase === 'listening' && (
        <div className="rounded-xl border border-border/80 bg-card/90 p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Describe the issue in Guide, or start with a common one:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => beginMaintenanceClarifying('Kitchen faucet dripping')}
            >
              <Droplets className="size-3.5" />
              Kitchen faucet dripping
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                beginMaintenanceClarifying('Possible gas smell')
                chooseMaintenanceEmergency()
              }}
            >
              <AlertTriangle className="size-3.5" />
              Gas smell
            </Button>
          </div>
        </div>
      )}

      {maintenancePhase === 'clarifying' && (
        <div className="rounded-xl border border-border/80 bg-card/90 p-4 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent">
              <Droplets className="size-4 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-medium">{maintenanceDraft.issue || 'Maintenance issue'}</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Quick check — is this an emergency, or routine?
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Emergencies (gas, fire, flooding, no heat in winter, sparking outlets): call{' '}
            <strong className="text-foreground">555-0142</strong> first.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={chooseMaintenanceEmergency}>
              <AlertTriangle className="size-3.5" />
              It&apos;s an emergency
            </Button>
            <Button type="button" size="sm" onClick={chooseMaintenanceRoutine}>
              Routine
            </Button>
          </div>
        </div>
      )}

      {maintenancePhase === 'emergency_handoff' && (
        <div className="rounded-xl border border-destructive/30 bg-card/90 p-4 shadow-sm space-y-3 animate-soft-rise">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <Phone className="size-4" />
            </div>
            <div>
              <h2 className="font-medium">Call the emergency line</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                For gas smell, fire, flooding, no heat in winter, or sparking outlets, contact
                on-call maintenance now. Guide won&apos;t file a normal work order until you&apos;re
                safe.
              </p>
            </div>
          </div>
          <Button type="button" asChild>
            <a href="tel:5550142">
              <Phone className="size-4" />
              Call 555-0142
            </a>
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={chooseMaintenanceRoutine}>
            Actually, it&apos;s not that urgent
          </Button>
        </div>
      )}

      {maintenancePhase === 'drafting' && (
        <div className="rounded-xl border border-border/80 bg-card/90 p-4 shadow-sm space-y-4">
          <div>
            <h2 className="font-medium">Maintenance request</h2>
            <p className="text-sm text-muted-foreground">Edit details before submitting.</p>
          </div>

          <label className="block space-y-1.5 text-sm">
            <span className="text-xs font-medium text-muted-foreground">Issue</span>
            <Input
              value={maintenanceDraft.issue}
              onChange={(e) => updateMaintenanceDraft({ issue: e.target.value })}
              className="bg-background"
            />
          </label>

          <label className="block space-y-1.5 text-sm">
            <span className="text-xs font-medium text-muted-foreground">Location</span>
            <select
              value={maintenanceDraft.location}
              onChange={(e) => updateMaintenanceDraft({ location: e.target.value })}
              className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Priority</span>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={maintenanceDraft.priority === 'routine' ? 'default' : 'outline'}
                onClick={() => updateMaintenanceDraft({ priority: 'routine' })}
              >
                Routine
              </Button>
              <Button
                type="button"
                size="sm"
                variant={maintenanceDraft.priority === 'emergency' ? 'default' : 'outline'}
                onClick={() => {
                  updateMaintenanceDraft({ priority: 'emergency' })
                  chooseMaintenanceEmergency()
                }}
              >
                Emergency
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Photo</span>
            <div className="relative aspect-video max-w-xs overflow-hidden rounded-lg border border-border/80 bg-muted/60">
              {maintenanceDraft.photoSrc && !photoFailed ? (
                <img
                  src={maintenanceDraft.photoSrc}
                  alt="Issue photo"
                  className="size-full object-cover"
                  onError={() => setPhotoFailed(true)}
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground">
                  <Camera className="size-5" />
                  <span className="text-xs">Photo attached (mock)</span>
                </div>
              )}
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setPhotoFailed(false)
                updateMaintenanceDraft({ photoSrc: '/rooms/room-1.jpg' })
              }}
            >
              <Camera className="size-3.5" />
              Attach kitchen photo
            </Button>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={maintenanceDraft.permissionToEnter}
              onChange={(e) => updateMaintenanceDraft({ permissionToEnter: e.target.checked })}
              className="size-4 rounded border-input"
            />
            Permission to enter if I&apos;m not home
          </label>

          <Button
            type="button"
            disabled={!maintenanceDraft.issue.trim()}
            onClick={submitMaintenanceRequest}
          >
            Submit request
          </Button>
        </div>
      )}

      {maintenancePhase === 'submitted' && (
        <div
          className={cn(
            'rounded-xl border border-primary/30 bg-card/90 p-4 shadow-sm space-y-3 animate-check-pop',
          )}
        >
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="font-medium">
                Request submitted · {maintenanceDraft.ticketId ?? 'WO-pending'}
              </p>
              <p className="mt-1 text-muted-foreground">
                {maintenanceDraft.issue} · {maintenanceDraft.location}. Expected response within 1–2
                business days for routine jobs.
              </p>
            </div>
          </div>
          <a
            href="#track"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-2 hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            Track request
            <ExternalLink className="size-3.5" />
            <span className="text-[10px] font-normal text-muted-foreground">(mocked)</span>
          </a>
          <Button type="button" size="sm" variant="ghost" onClick={resetMaintenance}>
            Start another request
          </Button>
        </div>
      )}
    </div>
  )
}
