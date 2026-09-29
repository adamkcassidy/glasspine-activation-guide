import { useEffect, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { DemoSwitcher } from '@/components/DemoSwitcher'
import { GuideDock } from '@/components/guide/GuideDock'
import { MetaBar } from '@/components/MetaBar'
import { PineMark } from '@/components/PineMark'
import { useChecklist } from '@/lib/checklist-state'

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { bootGuideForPath } = useChecklist()

  useEffect(() => {
    bootGuideForPath(location.pathname)
  }, [location.pathname, bootGuideForPath])

  return (
    <div className="flex min-h-svh w-full flex-col">
      <MetaBar />

      <div className="mx-auto flex w-full max-w-[960px] flex-1 flex-col px-4 pt-4 sm:px-6">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <PineMark className="size-9 sm:size-10" />
            <p className="font-serif text-xl font-semibold tracking-tight text-foreground sm:text-[1.35rem]">
              Glasspine Resident
            </p>
          </Link>
          <DemoSwitcher />
        </header>

        <main className="min-w-0 flex-1 pb-8">{children}</main>

        <footer className="space-y-1 pb-4 text-center">
          <p className="text-[11px] text-muted-foreground">
            © 2026 Glasspine Property Management Co.
          </p>
          <p className="text-[10px] text-muted-foreground/75">
            Glasspine Guide is AI and can make mistakes · Powered by Gemini · A design exercise by
            Adam Cassidy
          </p>
        </footer>
      </div>

      <GuideDock />
    </div>
  )
}
