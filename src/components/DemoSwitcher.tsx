import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const SCENES = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/maintenance', label: 'Maintenance', end: false },
  { to: '/contact', label: 'Contact', end: false },
] as const

export function DemoSwitcher() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function onPointerDown(e: PointerEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [menuOpen])

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <nav
        aria-label="Resident app"
        className="flex h-8 items-center gap-0.5 rounded-full border border-border/70 bg-card/90 p-0.5 text-[11px] shadow-sm backdrop-blur"
      >
        {SCENES.map((scene) => (
          <NavLink
            key={scene.to}
            to={scene.to}
            end={scene.end}
            className={({ isActive }) =>
              cn(
                'inline-flex h-7 items-center rounded-full px-2.5 font-medium text-muted-foreground transition-colors',
                isActive && 'bg-primary text-primary-foreground',
              )
            }
          >
            {scene.label}
          </NavLink>
        ))}
      </nav>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className={cn(
            'inline-flex h-8 items-center gap-1 rounded-full border border-border/70 bg-card/90 p-0.5 pr-1.5 shadow-sm transition-colors',
            'hover:border-primary/30',
            menuOpen && 'border-primary/40',
          )}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label="Account menu"
        >
          <img src="/jordan-hale.jpg" alt="" className="size-7 rounded-full object-cover" />
          <ChevronDown className="size-3 text-muted-foreground" />
        </button>
        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 z-50 mt-1.5 min-w-[9rem] rounded-xl border border-border/80 bg-card p-1 shadow-md animate-soft-rise"
          >
            <div
              role="menuitem"
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground"
            >
              Profile
            </div>
            <div
              role="menuitem"
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground"
            >
              Log out
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
