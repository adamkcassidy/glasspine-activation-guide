import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChecklist } from '@/lib/checklist-state'
import { cn } from '@/lib/utils'

const RELATIONSHIPS = ['Roommate', 'Spouse/Partner', 'Child', 'Other'] as const

export function HouseholdForm() {
  const { household, householdDone, addHouseholdMember, removeHouseholdMember, completeHousehold } =
    useChecklist()
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState<string>('')

  return (
    <div className="space-y-3">
      {household.length > 0 && (
        <ul className="space-y-1.5">
          {household.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-sm"
            >
              <span>
                <span className="font-medium">{m.name}</span>
                <span className="text-muted-foreground"> · {m.relationship}</span>
              </span>
              {!householdDone && (
                <button
                  type="button"
                  className="text-xs text-muted-foreground underline-offset-2 hover:underline"
                  onClick={() => removeHouseholdMember(m.id)}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {!householdDone && (
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault()
            if (!name.trim() || !relationship) return
            addHouseholdMember(name, relationship)
            setName('')
            setRelationship('')
          }}
        >
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-background"
            autoComplete="off"
          />
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            aria-label="Relationship"
            className={cn(
              'h-8 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 text-sm outline-none',
              'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
              !relationship && 'text-muted-foreground',
            )}
          >
            <option value="" disabled>
              Relationship
            </option>
            {RELATIONSHIPS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <Button type="submit" variant="outline" size="sm" className="shrink-0">
            Add
          </Button>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {!householdDone && (
          <Button type="button" size="sm" disabled={household.length === 0} onClick={completeHousehold}>
            Save household
          </Button>
        )}
        {householdDone && (
          <p className="text-sm text-primary">{household.length} member(s) on the lease record</p>
        )}
      </div>
    </div>
  )
}
