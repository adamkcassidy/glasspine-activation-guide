# Rationale — Glasspine Guide Move-In Checklist

**Problem slice.** New residents who get active early stick around and behave better long-term — fewer support headaches, more renewals, more referrals. But a lot of residents never really start. We didn't agree internally on why, so I picked one moment to focus on: day 0, when a resident actually cares the most, since their security deposit is on the line.

**Why this.** Instead of a generic "look around the app" onboarding, Guide leads with something residents actually want: documenting unit condition so their deposit's protected. Activating in the app is really just a side effect. Notifications and autopay round out a short, real checklist. A fourth scene shows Guide handling an actual maintenance issue too, so this isn't only an onboarding story.

**Assumptions.** Residents will pay attention on day 0 if the ask is quick and actually matters to them. Photos can be tied to the lease for later reference. Property managers already handle the real maintenance work — Guide's job is making sure the first request is accurate, not doing the dispatch itself.

**Tradeoffs.** Scoped to the resident + Guide experience, not manager tooling or full analytics. Guide can use a live model but falls back to scripted replies, so the demo never depends on an API key working live. Visual design is coherent, not exhaustive.

**How we'd know.** Main metric: % of new residents finishing the deposit-photo checklist within 7 days. Second: whether their first maintenance request is correctly categorized within 30 days. Longer term: renewal and referral differences between early activators and everyone else.
