import { Link } from 'react-router-dom'
import { ArrowRight, Bell, Building2, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RESIDENT } from '@/lib/resident'

const PREVIEW = [
  { label: 'Photos', icon: Camera },
  { label: 'Notifications', icon: Bell },
  { label: 'Autopay', icon: Building2 },
] as const

export function WelcomePage() {
  return (
    <div className="animate-soft-rise space-y-4 lg:pt-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Welcome home, {RESIDENT.firstName}.
      </h1>
      <p className="max-w-md text-base leading-relaxed text-muted-foreground">
        A few short steps to get {RESIDENT.unit} set up at {RESIDENT.community}.
      </p>
      <Button asChild size="lg" className="mt-2">
        <Link to="/checklist">
          Start move-in checklist
          <ArrowRight className="size-4" />
        </Link>
      </Button>
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs text-muted-foreground">
        {PREVIEW.map(({ label, icon: Icon }) => (
          <li key={label} className="inline-flex items-center gap-1.5">
            <span className="flex size-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Icon className="size-3" />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
