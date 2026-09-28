import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DemoSwitcher } from '@/components/DemoSwitcher'
import { GuideDock } from '@/components/guide/GuideDock'
import { PineMark } from '@/components/PineMark'
import { useChecklist } from '@/lib/checklist-state'
import { RESIDENT } from '@/lib/resident'
import { cn } from '@/lib/utils'

export function AppShell({ children }: { children: ReactNode }) {
  const { chatCollapsed } = useChecklist()

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col px-4 pt-4 sm:px-6">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <Link to="/" className="group flex items-start gap-2.5">
          <PineMark className="mt-0.5 transition-transform group-hover:scale-105" />
          <div className="leading-tight">
            <p className="font-serif text-lg font-semibold tracking-tight text-foreground">
              Glasspine Resident
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {RESIDENT.fullName} · {RESIDENT.unit} · {RESIDENT.community}
            </p>
          </div>
        </Link>
        <DemoSwitcher />
      </header>

      <div
        className={cn(
          'grid flex-1 gap-6 lg:items-start',
          !chatCollapsed && 'lg:grid-cols-[1fr_min(380px,36%)]',
          // Room for mobile bottom sheet when expanded
          !chatCollapsed && 'pb-[min(68svh,500px)] lg:pb-8',
          chatCollapsed && 'pb-8',
        )}
      >
        <main className="min-w-0">{children}</main>
        <aside
          className={cn(
            chatCollapsed ? 'contents' : 'contents lg:block lg:sticky lg:top-4',
          )}
        >
          <GuideDock />
        </aside>
      </div>

      <footer className="pb-4 text-center text-[11px] text-muted-foreground">
        Guide is AI and can make mistakes · Powered by Gemini · Design exercise with fictional data
      </footer>
    </div>
  )
}
