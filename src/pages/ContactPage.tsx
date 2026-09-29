import { Clock, Mail, Phone, PhoneCall, UserRound } from 'lucide-react'
import { PROPERTY_CONTACT, RESIDENT } from '@/lib/resident'

const OFFICE_ROWS = [
  {
    label: 'Property manager',
    value: `${PROPERTY_CONTACT.managerName}, ${PROPERTY_CONTACT.managerTitle}`,
    icon: UserRound,
  },
  {
    label: 'Phone',
    value: PROPERTY_CONTACT.phoneDisplay,
    icon: Phone,
  },
  {
    label: 'Email',
    value: PROPERTY_CONTACT.email,
    icon: Mail,
  },
  {
    label: 'Office hours',
    value: PROPERTY_CONTACT.officeHours,
    icon: Clock,
  },
] as const

export function ContactPage() {
  return (
    <div className="space-y-5 animate-soft-rise">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">Contact</h1>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          Reach the {RESIDENT.community} office for leasing questions, account help, and routine
          requests.
        </p>
      </div>

      <section className="rounded-xl border border-border/80 bg-card/90 p-5 shadow-sm">
        <h2 className="text-sm font-medium text-foreground">{RESIDENT.community}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{RESIDENT.city}</p>
        <ul className="mt-4 space-y-3">
          {OFFICE_ROWS.map(({ label, value, icon: Icon }) => (
            <li key={label} className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-foreground">{value}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-destructive/25 bg-destructive/5 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <PhoneCall className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-destructive/80">
              Emergency maintenance
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold tracking-tight text-foreground tabular-nums">
              {PROPERTY_CONTACT.emergencyLine}
            </p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Call first for gas smell, fire, active flooding, no heat in winter, or sparking
              outlets. Don&apos;t wait on a work order.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
