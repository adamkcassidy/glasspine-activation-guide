import { useState } from 'react'
import { Building2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChecklist } from '@/lib/checklist-state'
import { BANK_ACCOUNTS, DRAFT_DAYS } from '@/lib/resident'
import { cn } from '@/lib/utils'

type Step = 'account' | 'day' | 'confirm'

export function AutopaySetup() {
  const { autopay, autopayDone, completeAutopay } = useChecklist()
  const [step, setStep] = useState<Step>('account')
  const [accountId, setAccountId] = useState<string>('')
  const [draftDay, setDraftDay] = useState<number | null>(null)

  if (autopayDone && autopay) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5 text-sm">
        <Building2 className="size-4 text-primary" />
        <span>
          Autopay on · {autopay.accountLabel} · drafts on the {ordinal(autopay.draftDay)}
        </span>
      </div>
    )
  }

  const selectedAccount = BANK_ACCOUNTS.find((a) => a.id === accountId)

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Rent is paid by bank transfer. Link an account and choose a draft day.
      </p>

      {step === 'account' && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Choose an account</p>
          <div className="flex flex-col gap-2">
            {BANK_ACCOUNTS.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => setAccountId(account.id)}
                className={cn(
                  'flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                  accountId === account.id
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border/80 hover:bg-muted/50',
                )}
              >
                <Building2 className="size-4 shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{account.label}</p>
                  <p className="text-xs text-muted-foreground">{account.bank}</p>
                </div>
                {accountId === account.id && <Check className="size-4 text-primary" />}
              </button>
            ))}
          </div>
          <Button
            type="button"
            size="sm"
            disabled={!accountId}
            onClick={() => setStep('day')}
          >
            Continue
          </Button>
        </div>
      )}

      {step === 'day' && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Draft day each month</p>
          <div className="flex flex-wrap gap-2">
            {DRAFT_DAYS.map((day) => (
              <Button
                key={day}
                type="button"
                size="sm"
                variant={draftDay === day ? 'default' : 'outline'}
                onClick={() => setDraftDay(day)}
              >
                {ordinal(day)}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={() => setStep('account')}>
              Back
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={draftDay === null}
              onClick={() => setStep('confirm')}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 'confirm' && selectedAccount && draftDay !== null && (
        <div className="space-y-3">
          <div className="rounded-lg border border-border/80 bg-background/60 px-3 py-2.5 text-sm">
            <p className="font-medium">{selectedAccount.label}</p>
            <p className="text-muted-foreground">
              Drafts on the {ordinal(draftDay)} of each month
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={() => setStep('day')}>
              Back
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                completeAutopay({
                  accountId: selectedAccount.id,
                  accountLabel: selectedAccount.label,
                  draftDay,
                })
              }
            >
              Confirm autopay
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`
}
