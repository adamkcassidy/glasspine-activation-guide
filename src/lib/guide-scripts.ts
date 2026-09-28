export type GuideScene = 'welcome' | 'checklist' | 'complete' | 'maintenance'

export type ScriptedReply = {
  text: string
  /** Optional follow-up chips after this reply */
  chips?: string[]
}

const INTENT_PATTERNS: { intent: string; patterns: RegExp[] }[] = [
  {
    intent: 'why_photos',
    patterns: [/why.*photo/i, /deposit/i, /protect/i, /condition/i, /document/i, /record/i],
  },
  {
    intent: 'how_photos',
    patterns: [/how.*photo/i, /what.*take/i, /which.*room/i, /tips?/i],
  },
  {
    intent: 'household',
    patterns: [/household/i, /roommate/i, /partner/i, /add.*(member|person)/i, /who.*live/i],
  },
  {
    intent: 'autopay',
    patterns: [/autopay/i, /auto.?pay/i, /payment/i, /rent/i, /bank/i, /draft/i, /account/i],
  },
  {
    intent: 'emergency',
    patterns: [/emergency/i, /flood/i, /gas/i, /no heat/i, /no water/i, /spark/i, /smoke/i],
  },
  {
    intent: 'maintenance',
    patterns: [/maintain/i, /broken/i, /leak/i, /fix/i, /repair/i, /faucet/i, /drain/i, /appliance/i],
  },
  {
    intent: 'lease',
    patterns: [/lease/i, /policy/i, /allowed/i, /rule/i, /guest/i, /pet/i],
  },
  {
    intent: 'checklist_help',
    patterns: [/checklist/i, /what.*next/i, /start/i, /help/i, /how.*work/i],
  },
]

const REPLIES: Record<GuideScene, Record<string, ScriptedReply>> = {
  welcome: {
    checklist_help: {
      text: "Your Move-In Checklist takes about 10 minutes. We'll start with unit photos so you have a dated record of condition, then add household members and set up autopay. Ready when you are.",
      chips: ['Why photos first?', 'Start checklist'],
    },
    why_photos: {
      text: "A dated photo record of your unit's condition on move-in day gives you and your property manager the same reference point if questions come up later.",
      chips: ['How do I take good photos?', 'Start checklist'],
    },
    how_photos: {
      text: 'Walk each room once. Capture floors, walls, appliances, and anything already scuffed or stained. Natural light helps. You can add more later if you miss a spot.',
      chips: ['Start checklist'],
    },
    default: {
      text: "I'm Guide — here to help you settle into Oak Street Residences. Tap Start move-in checklist whenever you're ready, or ask me anything about move-in or your lease.",
      chips: ['Why photos first?', 'Start checklist'],
    },
  },
  checklist: {
    why_photos: {
      text: "A dated photo record of your unit's condition on move-in day gives you and your property manager the same reference point if questions come up later.",
      chips: ['What rooms should I cover?', 'How does autopay work?'],
    },
    how_photos: {
      text: 'Cover kitchen, bathrooms, bedrooms, living area, and entry. Close-ups of existing marks help. Aim for at least one wide shot per room plus detail shots of issues.',
      chips: ['Why photos first?'],
    },
    household: {
      text: 'Add everyone living in the unit — partners, roommates, dependents. This keeps lease records accurate and makes sure notices reach the right people.',
      chips: ['Why photos first?', 'How does autopay work?'],
    },
    autopay: {
      text: 'Autopay drafts rent from your linked bank account on your chosen day so you can avoid late fees. You can pause or update the account anytime in Payments.',
      chips: ['Why photos first?', 'Who counts as household?'],
    },
    lease: {
      text: "Your lease covers guest stays, quiet hours, and what's considered normal wear vs. damage. Ask me a specific question — like pets or subletting — and I'll point you to the right clause.",
      chips: ['Why photos first?', 'How does autopay work?'],
    },
    default: {
      text: "You're on the Move-In Checklist. Finish unit photos, household, and autopay — then I'll confirm your move-in record is saved. Ask me anything as you go.",
      chips: ['Why photos first?', 'Who counts as household?', 'How does autopay work?'],
    },
  },
  complete: {
    checklist_help: {
      text: "You're done with move-in essentials. Next up: a short look at how maintenance requests work, so your first one lands with the right details.",
      chips: ['Show maintenance tip', 'What about renewals?'],
    },
    maintenance: {
      text: "When something breaks, open Glasspine and describe it — I'll help classify emergency vs. routine and gather the details maintenance needs. Want to see how that looks?",
      chips: ['Show me maintenance'],
    },
    lease: {
      text: 'Renewal windows usually open 60–90 days before lease end. Staying active in the app makes renewals smoother — you\'re already on that path.',
      chips: ['Show maintenance tip'],
    },
    default: {
      text: 'Your move-in record is saved. Nice work, Jordan. Explore maintenance basics when you\'re ready — or ask me anything about living at Oak Street.',
      chips: ['Show maintenance tip', 'What about renewals?'],
    },
  },
  maintenance: {
    emergency: {
      text: "That sounds like it could be an emergency — active flooding, gas smell, no heat in freezing weather, or electrical hazards. I'll flag it as urgent so on-call maintenance is notified immediately.",
      chips: ['Submit as emergency', "It's not that urgent"],
    },
    maintenance: {
      text: 'I can help you submit a maintenance request. A clear description, location in the unit, and a photo usually gets the fastest response. Is this an emergency or routine?',
      chips: ["It's an emergency", 'Routine — sink is dripping'],
    },
    lease: {
      text: 'Maintenance for normal wear is typically covered by the property. Damage from misuse may be chargeable — when in doubt, report it and we\'ll sort responsibility with your manager.',
      chips: ['Submit a request', 'What counts as emergency?'],
    },
    default: {
      text: "I noticed you might need maintenance help. Tell me what's going on — leak, appliance, HVAC — and I'll route the right request.",
      chips: ['Kitchen faucet dripping', 'What counts as emergency?'],
    },
  },
}

export function detectIntent(message: string): string {
  for (const { intent, patterns } of INTENT_PATTERNS) {
    if (patterns.some((p) => p.test(message))) return intent
  }
  return 'default'
}

export function getScriptedReply(scene: GuideScene, message: string): ScriptedReply {
  const intent = detectIntent(message)
  const sceneReplies = REPLIES[scene]
  return sceneReplies[intent] ?? sceneReplies.default
}

export function getSuggestedChips(scene: GuideScene): string[] {
  return REPLIES[scene].default.chips ?? []
}

export const WELCOME_SEQUENCE = [
  `Welcome home, Jordan — I'm Guide, your Glasspine assistant for Oak Street Residences.`,
  `I've put together a short Move-In Checklist for Apt 4B. We'll document your unit's condition, add household members, and set up autopay.`,
  `Ready to start whenever you are.`,
] as const

export const COMPLETE_SEED_MESSAGES = [
  'Checklist complete — your move-in record is saved. Want a quick look at how I help when maintenance needs come up?',
] as const

export const MAINTENANCE_PROACTIVE = [
  `Hey Jordan — looks like something might need attention in Apt 4B.`,
  `If it's a leak, appliance issue, or anything broken, I can open a maintenance request with the right priority so your manager gets what they need the first time.`,
] as const
