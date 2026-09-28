import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Camera, Users } from 'lucide-react'
import { AutopaySetup } from '@/components/checklist/AutopaySetup'
import { ChecklistItem } from '@/components/checklist/ChecklistItem'
import { HouseholdForm } from '@/components/checklist/HouseholdForm'
import { PhotoUpload } from '@/components/checklist/PhotoUpload'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useChecklist } from '@/lib/checklist-state'

export function ChecklistPage() {
  const { completedCount, totalCount, allDone, photosDone, householdDone, autopayDone } =
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
          {completedCount} of {totalCount} complete — start with photos on move-in day
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
        title="Add household members"
        description="Who else lives in Apt 4B?"
        done={householdDone}
        icon={Users}
      >
        <HouseholdForm />
      </ChecklistItem>

      <ChecklistItem
        title="Set up autopay"
        description="Link a bank account and choose a draft day"
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
