/** Mirrors root RATIONALE.md for the Write-up deliverable page. */
export const RATIONALE_SECTIONS = [
  {
    title: 'Problem slice',
    body: 'New residents who activate early behave better long-term, but many never start. Internal opinions diverge; I chose one high-leverage moment: day 0, when personal stakes (security deposit) are highest.',
  },
  {
    title: 'Why this',
    body: 'A Guide-led Move-In Checklist leads with unit-condition photos—not generic “explore the app.” Deposit protection is a real resident goal; platform activation becomes a side effect. Notification opt-in (so later nudges can reach them) + autopay complete a short, concrete loop. A fourth scene shows Guide at a real need (maintenance triage), so the story isn’t only onboarding.',
  },
  {
    title: 'Assumptions',
    body: 'Day-0 attention exists if the ask is short and personally valuable. Photos can be stored against the lease. Managers already handle work orders; Guide improves first-request quality, not dispatch itself.',
  },
  {
    title: 'Tradeoffs',
    body: 'Scoped to Resident + Guide, not Manager tooling or full activation analytics. Guide uses an optional live model with scripted fallback so the panel demo never depends on a key. Visual polish is coherent, not exhaustive.',
  },
  {
    title: 'How we’d know',
    body: 'Primary: % of new residents completing deposit photo checklist within 7 days. Secondary: first correctly classified maintenance request within 30 days; later, renewal and referral deltas vs. non-completers.',
  },
] as const
