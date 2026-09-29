import { NavLink, useNavigate } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { useChecklist } from '@/lib/checklist-state'
import { cn } from '@/lib/utils'

const META_LINKS = [
  { to: '/write-up', label: 'Write-up' },
  { to: '/nudges', label: 'Nudges' },
  { to: '/measure', label: 'Measure' },
] as const

export function MetaBar() {
  const navigate = useNavigate()
  const { resetDemo } = useChecklist()

  function handleReset() {
    resetDemo()
    navigate('/')
  }

  return (
    <div className="w-full border-b border-primary/30 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-[960px] flex-wrap items-center justify-between gap-2 px-4 py-1.5 sm:px-6">
        <p className="text-[10px] font-medium uppercase tracking-wider text-primary-foreground/70">
          Design exercise
        </p>
        <nav aria-label="Exercise deliverables" className="flex flex-wrap items-center gap-0.5 text-[11px]">
          {META_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-2 py-0.5 font-medium text-primary-foreground/85 transition-colors hover:bg-primary-foreground/15 hover:text-primary-foreground',
                  isActive && 'bg-primary-foreground/20 text-primary-foreground',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleReset}
            className="ml-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium text-primary-foreground/85 transition-colors hover:bg-primary-foreground/15 hover:text-primary-foreground"
          >
            <RotateCcw className="size-3" />
            Reset demo
          </button>
        </nav>
      </div>
    </div>
  )
}
