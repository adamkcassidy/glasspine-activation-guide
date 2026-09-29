const QUOTES = [
  {
    who: 'New resident · illustrative',
    text: "I moved in and just… stared at the app. I didn't know what I was supposed to do first.",
  },
  {
    who: 'Renewing resident · illustrative',
    text: "Nobody told me unit photos mattered until there was a deposit question — by then I had nothing dated from move-in day.",
  },
  {
    who: 'First-time renter · illustrative',
    text: 'I ignored the welcome emails. If something had pinged me on my phone about the one step still open, I would have finished it.',
  },
] as const

const FUNNEL = [
  {
    step: 'Lease start',
    pct: '100%',
    why: 'Everyone begins here — the baseline for the rest of the funnel.',
    benefit: 'A clear starting point so move-in doesn’t feel like guesswork.',
  },
  {
    step: 'Notification opened',
    pct: '72%',
    why: 'Shows whether the first welcome message is even seen.',
    benefit: 'Residents who see the invite know there’s a short path forward.',
  },
  {
    step: 'Checklist started',
    pct: '54%',
    why: 'Marks the jump from awareness to action.',
    benefit: 'They’ve begun protecting their deposit and setting up rent.',
  },
  {
    step: 'All three items done',
    pct: '38%',
    why: 'Our activation definition — photos, notifications, autopay.',
    benefit: 'Unit documented, alerts on, rent on autopilot — settled in.',
  },
  {
    step: 'Active at 7 days',
    pct: '31%',
    why: 'Confirms activation sticks past the first busy week.',
    benefit: 'They’re using the home tools they’ll need for the whole lease.',
  },
] as const

const DOWNSTREAM = [
  {
    metric: 'Share of first maintenance requests correctly classified (emergency vs routine)',
    why: 'Tests whether Guide’s triage actually improves the first filed request.',
    benefit: 'Faster help for real emergencies; fewer false alarms that delay routine fixes.',
  },
  {
    metric: 'Renewal rate among activated vs non-activated residents (trailing 12 months)',
    why: 'Checks whether early activation predicts a healthier lease relationship.',
    benefit: 'Residents who feel set up from day one are more likely to stay.',
  },
  {
    metric: 'Referral submissions from activated residents',
    why: 'A lagging signal that activated residents recommend Oak Street.',
    benefit: 'Neighbors who had a smooth start become the best advocates.',
  },
] as const

const COHORT = [
  { label: 'Guide-led', activation: '41%', maintQuality: '68%', note: 'Checklist + Guide dock' },
  { label: 'Holdout', activation: '22%', maintQuality: '44%', note: 'Email PDF only' },
] as const

const JOURNEY = [
  {
    day: 'Day 0',
    before: 'Overwhelmed — keys in hand, no idea what matters first.',
    after: 'Welcomed — a short checklist with a clear first step.',
  },
  {
    day: 'Day 2',
    before: 'Drifting — photos still open, emails ignored.',
    after: 'Nudged — a timely SMS/app reminder on the one open step.',
  },
  {
    day: 'Day 5',
    before: 'Anxious — rent and alerts still unfinished.',
    after: 'Closing in — remaining steps called out, easy to finish.',
  },
  {
    day: 'Day 7',
    before: 'Unsettled — no deposit record, no autopay habit.',
    after: 'Settled — unit documented, notifications on, rent drafting.',
  },
] as const

export function MeasurePage() {
  return (
    <div className="space-y-8 animate-soft-rise max-w-2xl">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          How we’d measure
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          <strong className="font-medium text-foreground">Activation</strong> means the Move-In
          Checklist is finished within 7 days of lease start (photos + notifications + autopay).
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-serif text-lg font-semibold">What residents told us</h2>
        <p className="text-xs text-muted-foreground">
          Short illustrative quotes — fictional, labeled like the funnel numbers — that motivated
          leading with a clear first step and timely reminders.
        </p>

        <aside className="rounded-xl border border-primary/25 bg-primary/5 px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-primary/80">
            Resident persona
          </p>
          <p className="mt-1 font-medium text-foreground">Jordan Hale · Apt 4B</p>
          <dl className="mt-2 space-y-1 text-sm text-muted-foreground">
            <div>
              <dt className="inline font-medium text-foreground">Goals: </dt>
              <dd className="inline">Protect the deposit, never miss rent, feel oriented fast.</dd>
            </div>
            <div>
              <dt className="inline font-medium text-foreground">Frustrations: </dt>
              <dd className="inline">
                Dense welcome emails, unclear first step, surprises when something breaks.
              </dd>
            </div>
            <div>
              <dt className="inline font-medium text-foreground">Tech comfort: </dt>
              <dd className="inline">
                Phone-first; fine with apps and SMS, skips long email threads.
              </dd>
            </div>
          </dl>
        </aside>

        <ul className="space-y-3">
          {QUOTES.map((q) => (
            <li
              key={q.who}
              className="rounded-xl border border-border/80 bg-card/90 px-4 py-3 shadow-sm"
            >
              <p className="text-sm leading-relaxed text-foreground">&ldquo;{q.text}&rdquo;</p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {q.who}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-lg font-semibold">Day 0 → 7 with Guide</h2>
        <p className="text-xs text-muted-foreground">
          A compact look at Jordan&apos;s state before and after Guide at each checkpoint.
        </p>
        <ol className="grid gap-2 sm:grid-cols-2">
          {JOURNEY.map((stop) => (
            <li
              key={stop.day}
              className="rounded-xl border border-border/80 bg-card/90 px-3 py-3 shadow-sm"
            >
              <p className="text-[11px] font-medium uppercase tracking-wider text-primary/80">
                {stop.day}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">Before: </span>
                {stop.before}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">After Guide: </span>
                {stop.after}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-lg font-semibold">Funnel</h2>
        <p className="text-xs text-muted-foreground">
          Shows where residents drop off from lease start to “active” at day 7 — so we know which
          step needs the most help. Percentages are illustrative for this exercise.
        </p>
        <ul className="space-y-2">
          {FUNNEL.map((row, i) => (
            <li
              key={row.step}
              className="rounded-lg border border-border/70 bg-card/80 px-3 py-2.5 text-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 font-medium">
                  <span className="flex size-6 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
                    {i + 1}
                  </span>
                  {row.step}
                </span>
                <span className="font-medium tabular-nums text-primary">{row.pct}</span>
              </div>
              <dl className="mt-2 space-y-1 border-t border-border/60 pt-2 text-xs text-muted-foreground">
                <div>
                  <dt className="inline font-medium text-foreground">Why we measure: </dt>
                  <dd className="inline">{row.why}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-foreground">Customer benefit: </dt>
                  <dd className="inline">{row.benefit}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-lg font-semibold">Guide-led vs holdout</h2>
        <p className="text-xs text-muted-foreground">
          Compares residents who got the new Guide flow against those who didn&apos;t, to confirm
          the improvement is real and not coincidence. Numbers are fictional.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {COHORT.map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-border/80 bg-card/90 p-4 shadow-sm space-y-2"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-primary/80">
                {c.label}
              </p>
              <p className="text-sm text-muted-foreground">{c.note}</p>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Finished checklist in 7 days</dt>
                  <dd className="font-medium tabular-nums">{c.activation}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">First maintenance request filed correctly</dt>
                  <dd className="font-medium tabular-nums">{c.maintQuality}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-lg font-semibold">Downstream</h2>
        <p className="text-xs text-muted-foreground">
          Later outcomes we&apos;d watch to see if early activation predicts healthier leases — not
          just checklist completion.
        </p>
        <ul className="space-y-2">
          {DOWNSTREAM.map((row) => (
            <li
              key={row.metric}
              className="rounded-lg border border-border/70 bg-card/80 px-3 py-2.5 text-sm"
            >
              <p className="font-medium text-foreground">{row.metric}</p>
              <dl className="mt-2 space-y-1 border-t border-border/60 pt-2 text-xs text-muted-foreground">
                <div>
                  <dt className="inline font-medium text-foreground">Why we measure: </dt>
                  <dd className="inline">{row.why}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-foreground">Customer benefit: </dt>
                  <dd className="inline">{row.benefit}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-serif text-lg font-semibold">Guardrails</h2>
        <p className="text-xs text-muted-foreground">
          Ways we&apos;d know the program is annoying or confusing people — so we can stop or redesign
          before shipping widely.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Opt-out rate from SMS/push nudge program</li>
          <li>Complaint volume tagged to Guide or nudges</li>
          <li>Support contacts escalated from Guide (“talk to a person”)</li>
        </ul>
      </section>

      <section className="rounded-xl border border-primary/25 bg-primary/5 p-4 space-y-2">
        <h2 className="font-serif text-lg font-semibold">Ship or stop</h2>
        <p className="text-xs text-muted-foreground">
          A simple rule for deciding whether the Guide-led flow is worth rolling out.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          <strong className="font-medium text-foreground">Ship</strong> if Guide-led 7-day
          activation beats holdout by ≥8 pts with no rise in opt-outs or Guide-related complaints
          over 6 weeks. <strong className="font-medium text-foreground">Stop or redesign</strong> if
          activation lift is &lt;3 pts, or opt-outs/complaints rise materially while support load
          increases.
        </p>
      </section>
    </div>
  )
}
