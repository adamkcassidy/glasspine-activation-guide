import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Camera, Landmark } from 'lucide-react'
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
  // Only redirect on the incomplete → complete transition during this visit.
  const prevAllDoneRef = useRef(allDone)

  useEffect(() => {
    const justCompleted = allDone && !prevAllDoneRef.current
    prevAllDoneRef.current = allDone
    if (!justCompleted) return
    const t = window.setTimeout(() => navigate('/'), 600)
    return () => window.clearTimeout(t)
  }, [allDone, navigate])

  return (
    <div className="space-y-4 animate-soft-rise">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          Move-In Checklist
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {completedCount} of {totalCount} complete: photos, notifications, then autopay
        </p>
      </div>

      <Progress value={progress} className="h-2" />

      <ChecklistItem
        title="Document unit condition"
        description="Document each room now. A timestamped record protects your deposit and gives you and your property manager the same reference point if a dispute comes up later."
        done={photosDone}
        icon={Camera}
      >
        <PhotoUpload />
      </ChecklistItem>

      <ChecklistItem
        title="Turn on notifications"
        description="Stay in the loop for as long as you live here: maintenance updates, rent reminders, and anything that needs your attention, so nothing catches you off guard."
        done={notificationsDone}
        icon={Bell}
      >
        <NotificationSetup />
      </ChecklistItem>

      <ChecklistItem
        title="Set up autopay"
        description="Connect your bank so rent drafts on the 1st."
        done={autopayDone}
        icon={Landmark}
      >
        <AutopaySetup />
      </ChecklistItem>

      {allDone && (
        <Button asChild className="w-full sm:w-auto">
          <Link to="/">Go to Dashboard</Link>
        </Button>
      )}
    </div>
  )
}
