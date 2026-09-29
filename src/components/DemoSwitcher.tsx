import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RESIDENT } from '@/lib/resident'

const SCENES = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/maintenance', label: 'Maintenance', end: false },
] as const

export function DemoSwitcher() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function onPointerDown(e: PointerEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [menuOpen])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(t)
  }, [toast])

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <nav
          aria-label="Resident app"
          className="flex flex-wrap items-center gap-0.5 rounded-full border border-border/70 bg-card/90 p-0.5 text-[11px] shadow-sm backdrop-blur"
        >
          {SCENES.map((scene) => (
            <NavLink
              key={scene.to}
              to={scene.to}
              end={scene.end}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-2.5 py-1 font-medium text-muted-foreground transition-colors',
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
              'inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/90 p-0.5 pr-1.5 shadow-sm transition-colors',
              'hover:border-primary/30',
              menuOpen && 'border-primary/40',
            )}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Account menu"
          >
            <img
              src="/jordan-hale.jpg"
              alt=""
              className="size-7 rounded-full object-cover"
            />
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-1.5 min-w-[11.5rem] rounded-xl border border-border/80 bg-card px-3 py-2.5 text-xs leading-snug shadow-md animate-soft-rise"
            >
              <p className="font-medium text-foreground">{RESIDENT.fullName}</p>
              <p className="mt-0.5 text-muted-foreground">{RESIDENT.unit}</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setToast("Demo only — you're still signed in")}
          className="rounded-full border border-border/70 bg-card/90 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground shadow-sm transition-colors hover:border-primary/30 hover:text-foreground"
        >
          Log out
        </button>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium text-foreground shadow-md animate-soft-rise"
        >
          {toast}
        </div>
      )}
    </>
  )
}
