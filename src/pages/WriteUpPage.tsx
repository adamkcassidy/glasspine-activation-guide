import { RATIONALE_SECTIONS } from '@/lib/rationale'

export function WriteUpPage() {
  return (
    <div className="animate-soft-rise mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">Write-up</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Source: RATIONALE.md — the thinking behind this prototype.
        </p>
      </div>
      <article className="space-y-4 rounded-xl border border-border/80 bg-card/90 p-5 shadow-sm sm:p-6">
        {RATIONALE_SECTIONS.map((section) => (
          <section key={section.title} className="space-y-1.5">
            <h2 className="font-serif text-lg font-semibold">{section.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </article>
    </div>
  )
}
