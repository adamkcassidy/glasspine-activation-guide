import { Bell, Check, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChecklist } from '@/lib/checklist-state'
import { cn } from '@/lib/utils'

const CHANNELS: { key: 'email' | 'sms'; label: string; hint: string }[] = [
  {
    key: 'email',
    label: 'Email',
    hint: 'Checklist reminders and move-in tips in your inbox',
  },
  {
    key: 'sms',
    label: 'SMS',
    hint: 'Short text reminders if a step is still open',
  },
]

export function NotificationSetup() {
  const {
    notifications,
    notificationsDone,
    setNotificationPrefs,
    completeNotifications,
  } = useChecklist()

  const anySelected = notifications.email || notifications.sms

  function toggle(key: 'email' | 'sms') {
    if (notificationsDone) return
    setNotificationPrefs({ ...notifications, [key]: !notifications[key] })
  }

  function downloadApp() {
    if (notificationsDone) return
    setNotificationPrefs({ ...notifications, push: true })
  }

  if (notificationsDone) {
    const on = CHANNELS.filter((c) => notifications[c.key]).map((c) => c.label)
    if (notifications.push) on.push('App alerts')
    return (
      <div className="space-y-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5 text-sm">
        <div className="flex items-center gap-2 text-primary">
          <Bell className="size-4" />
          <span className="font-medium">Notifications on</span>
        </div>
        <p className="text-muted-foreground">
          {on.length > 0 ? on.join(' · ') : 'Saved'} — we&apos;ll use these channels for
          maintenance updates, rent reminders, and anything that needs your attention.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Opt in so Glasspine can reach you about open checklist steps, maintenance updates, and rent
        reminders for as long as you live here.
      </p>
      <div className="flex flex-col gap-2">
        {CHANNELS.map(({ key, label, hint }) => (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            className={cn(
              'flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
              notifications[key]
                ? 'border-primary/40 bg-primary/5'
                : 'border-border/80 hover:bg-muted/50',
            )}
          >
            <span
              className={cn(
                'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border',
                notifications[key]
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input',
              )}
            >
              {notifications[key] && <Check className="size-3" />}
            </span>
            <span>
              <span className="font-medium">{label}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border/80 bg-muted/30 px-3 py-3">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Smartphone className="size-4" />
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <p className="text-sm font-medium">Want instant alerts?</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Download the Glasspine app for push notifications on your phone.
              </p>
            </div>
            <button
              type="button"
              onClick={downloadApp}
              className={cn(
                'inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors',
                notifications.push
                  ? 'bg-primary/10 text-primary'
                  : 'bg-foreground text-background hover:bg-foreground/90',
              )}
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-background/15">
                <Smartphone className="size-3.5" />
              </span>
              <span className="leading-tight">
                <span className="block text-[10px] opacity-80">
                  {notifications.push ? 'Ready on your phone' : 'Get it on'}
                </span>
                <span className="block text-sm font-semibold tracking-tight">
                  {notifications.push ? 'Glasspine App' : 'Glasspine App Store'}
                </span>
              </span>
              {notifications.push && <Check className="ml-1 size-3.5 shrink-0" />}
            </button>
          </div>
        </div>
      </div>

      <Button type="button" size="sm" disabled={!anySelected} onClick={completeNotifications}>
        Save notification preferences
      </Button>
    </div>
  )
}
