import { useEffect } from 'react'
import { useChecklist } from '@/lib/checklist-state'

export function MaintenancePage() {
  const { setChatCollapsed } = useChecklist()

  useEffect(() => {
    setChatCollapsed(false)
  }, [setChatCollapsed])

  return (
    <div className="space-y-3 animate-soft-rise max-w-lg">
      <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
        Something needs attention
      </h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Tell Guide what&apos;s going on in the chat — free text or a suggested chip. Guide will ask
        whether it&apos;s an emergency, then submit a clear request for you. True emergencies (gas,
        fire, flooding, no heat in winter, sparking outlets): call{' '}
        <strong className="whitespace-nowrap text-foreground">555-0142</strong> first.
      </p>
    </div>
  )
}
