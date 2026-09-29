import { Link } from 'react-router-dom'
import { ArrowRight, Bell, Building2, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RESIDENT } from '@/lib/resident'

const TILES = [
  {
    label: 'Photos',
    icon: Camera,
    description:
      'Protect your deposit with a shared record you and your manager both trust.',
  },
  {
    label: 'Notifications',
    icon: Bell,
    description:
      'Stay in the loop all tenancy — maintenance, rent reminders, and more.',
  },
  {
    label: 'Autopay',
    icon: Building2,
    description:
      'Never miss rent — connect once so drafts land on time, no late fees.',
  },
] as const

export function WelcomePage() {
  return (
    <div className="animate-soft-rise space-y-6 lg:pt-6">
      <div className="space-y-4">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Welcome home, {RESIDENT.firstName}.
        </h1>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground">
          A few short steps to get {RESIDENT.unit} set up at {RESIDENT.community}.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-3">
        {TILES.map(({ label, icon: Icon, description }) => (
          <li
            key={label}
            className="rounded-xl border border-border/80 bg-card/90 px-4 py-4 shadow-sm"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Icon className="size-4" />
            </span>
            <h2 className="mt-3 text-sm font-semibold tracking-tight text-foreground">{label}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </li>
        ))}
      </ul>

      <Button asChild size="lg">
        <Link to="/checklist">
          Start move-in checklist
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  )
}
