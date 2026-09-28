import { NavLink, useNavigate } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { useChecklist } from '@/lib/checklist-state'
import type { GuideScene } from '@/lib/guide-scripts'
import { cn } from '@/lib/utils'

const SCENES: { to: string; label: string; scene: GuideScene }[] = [
  { to: '/', label: 'Welcome', scene: 'welcome' },
  { to: '/checklist', label: 'Checklist', scene: 'checklist' },
  { to: '/complete', label: 'Home', scene: 'complete' },
  { to: '/maintenance', label: 'Maintenance', scene: 'maintenance' },
  { to: '/nudges', label: 'Nudges', scene: 'nudges' },
  { to: '/measure', label: 'Measure', scene: 'measure' },
]

export function DemoSwitcher() {
  const navigate = useNavigate()
  const { lastSource, resetDemo, seedForScene } = useChecklist()

  function jumpTo(to: string, scene: GuideScene) {
    seedForScene(scene)
    navigate(to)
  }

  function handleReset() {
    resetDemo()
    navigate('/')
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <nav
          aria-label="Demo scenes"
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
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="size-3" />
          Reset demo
        </button>
      </div>
      {lastSource === 'scripted' && (
        <p className="text-[10px] text-muted-foreground/80">Demo mode · scripted replies</p>
      )}
    </div>
  )
}
