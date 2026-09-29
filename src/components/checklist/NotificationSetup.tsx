import { Bell, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChecklist, type NotificationPrefs } from '@/lib/checklist-state'
import { cn } from '@/lib/utils'

const CHANNELS: { key: keyof NotificationPrefs; label: string; hint: string }[] = [
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
  {
    key: 'push',
    label: 'Push',
    hint: 'App alerts — requires the Glasspine mobile app',
  },
]

export function NotificationSetup() {
  const {
    notifications,
    notificationsDone,
    setNotificationPrefs,
    completeNotifications,
  } = useChecklist()

  const anySelected = notifications.email || notifications.sms || notifications.push

  function toggle(key: keyof NotificationPrefs) {
    if (notificationsDone) return
    setNotificationPrefs({ ...notifications, [key]: !notifications[key] })
  }

  if (notificationsDone) {
    const on = CHANNELS.filter((c) => notifications[c.key]).map((c) => c.label)
    return (
      <div className="space-y-2 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5 text-sm">
        <div className="flex items-center gap-2 text-primary">
          <Bell className="size-4" />
          <span className="font-medium">Notifications on</span>
        </div>
        <p className="text-muted-foreground">
          {on.length > 0 ? on.join(' · ') : 'Saved'} — this is how move-in reminders can reach you
          later (see the Nudges scene).
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Opt in so Glasspine can remind you if photos or autopay are still open. Without this step,
        the nudge sequence later has no way to reach you.
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
      <Button type="button" size="sm" disabled={!anySelected} onClick={completeNotifications}>
        Save notification preferences
      </Button>
    </div>
  )
}
