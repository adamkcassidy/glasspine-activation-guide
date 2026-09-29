import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Building2, Camera } from 'lucide-react'
import { AutopaySetup } from '@/components/checklist/AutopaySetup'
import { ChecklistItem } from '@/components/checklist/ChecklistItem'
import { NotificationSetup } from '@/components/checklist/NotificationSetup'
import { PhotoUpload } from '@/components/checklist/PhotoUpload'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useChecklist } from '@/lib/checklist-state'

export function ChecklistPage() {
  const { completedCount, totalCount, allDone, photosDone, notificationsDone, autopayDone } =
    useChecklist()
  const navigate = useNavigate()
  const progress = (completedCount / totalCount) * 100

  useEffect(() => {
    if (allDone) {
      const t = window.setTimeout(() => navigate('/complete'), 600)
      return () => window.clearTimeout(t)
    }
  }, [allDone, navigate])

  return (
    <div className="space-y-4 animate-soft-rise">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          Move-In Checklist
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {completedCount} of {totalCount} complete — photos, notifications, then autopay
        </p>
      </div>

      <Progress value={progress} className="h-2" />

      <ChecklistItem
        title="Document unit condition"
        description="Photo each room — a dated record from move-in day"
        done={photosDone}
        icon={Camera}
      >
        <PhotoUpload />
      </ChecklistItem>

      <ChecklistItem
        title="Turn on notifications"
        description="Opt into email, SMS, and/or push so reminders can reach you"
        done={notificationsDone}
        icon={Bell}
      >
        <NotificationSetup />
      </ChecklistItem>

      <ChecklistItem
        title="Set up autopay"
        description="Connect your bank — rent drafts on the 1st"
        done={autopayDone}
        icon={Building2}
      >
        <AutopaySetup />
      </ChecklistItem>

      {allDone && (
        <Button asChild className="w-full sm:w-auto">
          <Link to="/complete">See confirmation</Link>
        </Button>
      )}
    </div>
  )
}
