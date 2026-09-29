import { useEffect, useId, useState } from 'react'
import { Building2, Check, Loader2, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChecklist } from '@/lib/checklist-state'
import { RENT_DUE_DAY } from '@/lib/resident'
import { cn } from '@/lib/utils'

const BANKS = [
  { id: 'first-oak', name: 'First Oak Bank', detail: 'Personal checking' },
  { id: 'river-credit', name: 'River Credit Union', detail: 'Everyday checking' },
  { id: 'summit', name: 'Summit National', detail: 'Preferred checking' },
  { id: 'harbor', name: 'Harbor Mutual', detail: 'Online banking' },
] as const

type Step = 'pick' | 'verifying' | 'success'

export function AutopaySetup() {
  const { autopay, autopayDone, completeAutopay } = useChecklist()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('pick')
  const [selected, setSelected] = useState<string>('first-oak')
  const titleId = useId()

  useEffect(() => {
    if (!open || step !== 'verifying') return
    const t = window.setTimeout(() => setStep('success'), 1400)
    return () => window.clearTimeout(t)
  }, [open, step])

  useEffect(() => {
    if (!open || step !== 'success') return
    const t = window.setTimeout(() => {
      completeAutopay('Checking ••1234 connected')
      setOpen(false)
      setStep('pick')
      setSelected('first-oak')
    }, 1100)
    return () => window.clearTimeout(t)
  }, [open, step, selected, completeAutopay])

  if (autopayDone && autopay) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5 text-sm">
        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
        <div>
          <p className="font-medium text-primary">{autopay.accountLabel}</p>
          <p className="mt-0.5 text-muted-foreground">
            We&apos;ll draft your rent on the 1st of each month
          </p>
        </div>
      </div>
    )
  }

  function openModal() {
    setSelected('first-oak')
    setStep('pick')
    setOpen(true)
  }

  function closeModal() {
    if (step === 'verifying') return
    setOpen(false)
    setStep('pick')
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Rent is paid by bank transfer. Connect your account once — we&apos;ll draft on the{' '}
        {RENT_DUE_DAY === 1 ? '1st' : `${RENT_DUE_DAY}th`} each month (your lease due date).
      </p>
      <Button type="button" size="sm" onClick={openModal}>
        <Building2 className="size-4" />
        Connect your bank account
      </Button>
      <p className="text-[11px] text-muted-foreground">
        Mock Plaid-style connect — nothing is charged in this demo.
      </p>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-[2px]"
          role="presentation"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-sm rounded-2xl border border-border/80 bg-card p-4 shadow-lg animate-soft-rise"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <h2 id={titleId} className="font-medium">
                  Connect your bank
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Mock institution search — nothing is linked for real.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                onClick={closeModal}
                disabled={step === 'verifying'}
                aria-label="Close"
              >
                <X className="size-4" />
              </Button>
            </div>

            {step === 'pick' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-muted/40 px-2.5 py-2 text-sm text-muted-foreground">
                  <Search className="size-3.5 shrink-0" />
                  Search banks…
                </div>
                <ul className="space-y-1.5">
                  {BANKS.map((bank) => (
                    <li key={bank.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(bank.id)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                          selected === bank.id
                            ? 'border-primary/40 bg-primary/5'
                            : 'border-border/70 hover:bg-muted/50',
                        )}
                      >
                        <span
                          className={cn(
                            'flex size-4 shrink-0 items-center justify-center rounded-full border',
                            selected === bank.id
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-input',
                          )}
                        >
                          {selected === bank.id && <Check className="size-2.5" />}
                        </span>
                        <span>
                          <span className="font-medium">{bank.name}</span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {bank.detail}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => setStep('verifying')}
                  disabled={!selected}
                >
                  Continue with {BANKS.find((b) => b.id === selected)?.name ?? 'bank'}
                </Button>
              </div>
            )}

            {step === 'verifying' && (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <Loader2 className="size-8 animate-spin text-primary" />
                <div>
                  <p className="font-medium">Verifying…</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Securely connecting to {BANKS.find((b) => b.id === selected)?.name}.
                  </p>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center gap-3 py-8 text-center animate-check-pop">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-6" />
                </div>
                <div>
                  <p className="font-medium">Checking ••1234 connected</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {BANKS.find((b) => b.id === selected)?.name} is ready for autopay.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
