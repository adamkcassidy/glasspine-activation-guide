import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

/** In-app resident navigation — deliverables live in MetaBar. */
const SCENES = [
  { to: '/', label: 'Welcome' },
  { to: '/checklist', label: 'Checklist' },
  { to: '/complete', label: 'Dashboard' },
  { to: '/maintenance', label: 'Maintenance' },
] as const

export function DemoSwitcher() {
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
