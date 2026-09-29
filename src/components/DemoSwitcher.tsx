import { NavLink, useNavigate } from 'react-router-dom'
import { useChecklist } from '@/lib/checklist-state'
import type { GuideScene } from '@/lib/guide-scripts'
import { cn } from '@/lib/utils'

/** In-app resident navigation — deliverables live in MetaBar. */
const SCENES: { to: string; label: string; scene: GuideScene }[] = [
  { to: '/', label: 'Welcome', scene: 'welcome' },
  { to: '/checklist', label: 'Checklist', scene: 'checklist' },
  { to: '/complete', label: 'Dashboard', scene: 'complete' },
  { to: '/maintenance', label: 'Maintenance', scene: 'maintenance' },
]

export function DemoSwitcher() {
  const navigate = useNavigate()
  const { seedForScene } = useChecklist()

  function jumpTo(to: string, scene: GuideScene) {
    seedForScene(scene)
    navigate(to)
  }

  return (
    <nav
      aria-label="Resident app"
      className="flex flex-wrap items-center justify-end gap-0.5 rounded-full border border-border/70 bg-card/90 p-0.5 text-[11px] shadow-sm backdrop-blur"
    >
      {SCENES.map((scene) => (
        <NavLink
          key={scene.to}
          to={scene.to}
          end={scene.to === '/'}
          onClick={(e) => {
            e.preventDefault()
            jumpTo(scene.to, scene.scene)
          }}
          className={({ isActive }) =>
            cn(
              'rounded-full px-2 py-1 font-medium text-muted-foreground transition-colors',
              isActive && 'bg-primary text-primary-foreground',
            )
          }
        >
          {scene.label}
        </NavLink>
      ))}
    </nav>
  )
}
