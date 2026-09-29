import { useState } from 'react'
import { Building2, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChecklist } from '@/lib/checklist-state'
import { RENT_DUE_DAY } from '@/lib/resident'

export function AutopaySetup() {
  const { autopay, autopayDone, completeAutopay } = useChecklist()
  const [connecting, setConnecting] = useState(false)

  if (autopayDone && autopay) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5 text-sm">
        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
        <div>
          <p className="font-medium text-primary">Bank connected · autopay on</p>
          <p className="mt-0.5 text-muted-foreground">
            We&apos;ll draft your rent on the 1st of each month
          </p>
        </div>
      </div>
    )
  }

  async function handleConnect() {
    setConnecting(true)
    await new Promise((r) => window.setTimeout(r, 700))
    completeAutopay()
    setConnecting(false)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Rent is paid by bank transfer. Connect your account once — we&apos;ll draft on the{' '}
        {RENT_DUE_DAY === 1 ? '1st' : `${RENT_DUE_DAY}th`} each month (your lease due date).
      </p>
      <Button type="button" size="sm" disabled={connecting} onClick={() => void handleConnect()}>
        {connecting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Connecting…
          </>
        ) : (
          <>
            <Building2 className="size-4" />
            Connect your bank account
          </>
        )}
      </Button>
      <p className="text-[11px] text-muted-foreground">
        Mock Plaid-style connect — nothing is charged in this demo.
      </p>
    </div>
  )
}
