import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { DemoSwitcher } from '@/components/DemoSwitcher'
import { GuideDock } from '@/components/guide/GuideDock'
import { MetaBar } from '@/components/MetaBar'
import { PineMark } from '@/components/PineMark'
import { RESIDENT } from '@/lib/resident'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh w-full flex-col">
      <MetaBar />

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pt-4 sm:px-6">
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

        <main className="min-w-0 flex-1 pb-8">{children}</main>

        <footer className="pb-4 text-center text-[11px] text-muted-foreground">
          Glasspine Guide is AI and can make mistakes · Powered by Gemini · A design exercise by Adam
          Cassidy
        </footer>
      </div>

      <GuideDock />
    </div>
  )
}
