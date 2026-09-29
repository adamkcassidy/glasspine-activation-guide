export type GuideScene =
  | 'welcome'
  | 'checklist'
  | 'complete'
  | 'maintenance'
  | 'nudges'
  | 'measure'

export type ScriptedReply = {
  text: string
  chips?: string[]
}

const GENERIC_FALLBACK: ScriptedReply = {
  text: "I'm not sure about that—your property manager can confirm. Meanwhile I can help with photos, notifications, autopay, or maintenance.",
  chips: ['Why photos first?', 'How does autopay work?', 'Submit a maintenance request'],
}

/** Exact chip text → reply. Every suggestion chip must appear here. */
const CHIP_REPLIES: Record<string, ScriptedReply> = {
  'Why photos first?': {
    text: "A dated photo record of your unit's condition on move-in day gives you and your property manager the same reference point if questions come up later.",
    chips: ['What rooms should I cover?', 'Start checklist'],
  },
  'How do I take good photos?': {
    text: 'Walk each room once. Capture floors, walls, appliances, and anything already scuffed or stained. Natural light helps.',
    chips: ['What rooms should I cover?', 'Start checklist'],
  },
  'What rooms should I cover?': {
    text: 'Cover kitchen, bathrooms, bedrooms, living area, and entry. Close-ups of existing marks help. Aim for one wide shot per room plus detail shots of issues.',
    chips: ['Why photos first?', 'How does autopay work?'],
  },
  'Start checklist': {
    text: 'Open the Move-In Checklist when you’re ready — photos, notification opt-in, then autopay.',
    chips: ['Why photos first?'],
  },
  'Why turn on notifications?': {
    text: 'Opting into email, SMS, or push is how Glasspine can remind you if a checklist step is still open. Without that opt-in, later nudges have no channel to reach you.',
    chips: ['Why photos first?', 'How does autopay work?'],
  },
  'How does autopay work?': {
    text: 'Connect your bank once — we’ll draft rent on the 1st each month (your lease due date), with a 5-day grace period. You can pause or update anytime in Payments.',
    chips: ['Why photos first?', 'Why turn on notifications?'],
  },
  'Show maintenance tip': {
    text: "When something breaks, describe it in chat — I'll classify emergency vs routine and submit a clear request for you. True emergencies: call 555-0142 first.",
    chips: ['Show me maintenance', 'What counts as emergency?'],
  },
  'Show me maintenance': {
    text: 'Open Maintenance and tell me what’s going on. I’ll ask a couple of clarifying questions, then submit the request for you in this chat.',
    chips: ['What counts as emergency?'],
  },
  'What about renewals?': {
    text: 'Renewal windows usually open 60–90 days before lease end. Your property manager will reach out with options — I can remind you when that window opens.',
    chips: ['Show maintenance tip'],
  },
  'Submit a maintenance request': {
    text: 'Tell me what’s wrong — leak, appliance, HVAC — and whether it feels urgent. I’ll triage and submit a clear request right here.',
    chips: ['Kitchen faucet dripping', 'What counts as emergency?'],
  },
  'Kitchen faucet dripping': {
    text: 'Got it — kitchen faucet drip in Apt 4B. Is this an emergency, or routine?',
    chips: ["It's an emergency", 'Routine — sink is dripping'],
  },
  "It's an emergency": {
    text: 'If there’s active flooding, gas smell, fire, no heat in winter, or sparking outlets, call 555-0142 right away. Don’t wait on a work-order form.',
    chips: ["It's not that urgent", 'What counts as emergency?'],
  },
  'Routine — sink is dripping': {
    text: 'Sounds routine. Is it okay to enter Apt 4B if you’re not home? You can also attach a photo of the issue.',
    chips: ['Yes, you can enter', "I'd rather be home", 'Attach a photo'],
  },
  "It's not that urgent": {
    text: 'Understood — treating it as routine. Is it okay to enter if you’re not home? Optional: attach a photo of the issue.',
    chips: ['Yes, you can enter', "I'd rather be home", 'Attach a photo'],
  },
  'Yes, you can enter': {
    text: 'Permission to enter noted. Filing your request now.',
    chips: ['What counts as emergency?'],
  },
  "I'd rather be home": {
    text: 'Got it — we’ll note that you’d prefer to be home. Filing your request now.',
    chips: ['What counts as emergency?'],
  },
  'Attach a photo': {
    text: 'Photo attached from your kitchen. Still okay if we enter when you’re out?',
    chips: ['Yes, you can enter', "I'd rather be home"],
  },
  'I can shut it off': {
    text: 'Good — shutting it off helps. Is this still routine, or do you need emergency help?',
    chips: ["It's an emergency", 'Routine — sink is dripping'],
  },
  'What counts as emergency?': {
    text: 'Call 555-0142 first for gas smell, fire, active flooding, no heat in freezing weather, or sparking outlets. Everything else is usually routine and I can file it here.',
    chips: ['Kitchen faucet dripping', 'Submit a maintenance request'],
  },
  'Submit as emergency': {
    text: 'For a true emergency, call 555-0142 now. I won’t file a normal work order until you’re safe and the on-call line has been notified.',
    chips: ["It's not that urgent"],
  },
  'Submit a request': {
    text: 'Tell me the issue and whether it’s emergency or routine — I’ll submit it for you in this chat. Routine jobs usually get a response within 1–2 business days.',
    chips: ['Kitchen faucet dripping', 'What counts as emergency?'],
  },
  'Gas smell / emergency': {
    text: 'Leave the unit if it feels unsafe and call 555-0142 immediately. Don’t wait on a work-order form for gas, fire, flooding, or sparking outlets.',
    chips: ["It's not that urgent"],
  },
}

const INTENT_PATTERNS: { intent: string; patterns: RegExp[] }[] = [
  {
    intent: 'why_photos',
    patterns: [/why.*photo/i, /deposit/i, /protect/i, /condition/i, /document/i, /record/i],
  },
  {
    intent: 'how_photos',
    patterns: [/how.*photo/i, /what.*take/i, /which.*room/i, /what rooms/i, /tips?/i],
  },
  {
    intent: 'notifications',
    patterns: [/notification/i, /opt.?in/i, /sms/i, /push/i, /remind/i, /alert/i],
  },
  {
    intent: 'autopay',
    patterns: [/autopay/i, /auto.?pay/i, /payment/i, /rent/i, /bank/i, /draft/i, /account/i, /grace/i, /plaid/i],
  },
  {
    intent: 'emergency',
    patterns: [/emergency/i, /flood/i, /gas/i, /fire/i, /no heat/i, /spark/i, /smoke/i, /555-0142/i],
  },
  {
    intent: 'maintenance',
    patterns: [/maintain/i, /broken/i, /leak/i, /fix/i, /repair/i, /faucet/i, /drain/i, /appliance/i, /dripping/i],
  },
  {
    intent: 'lease',
    patterns: [/lease/i, /policy/i, /allowed/i, /rule/i, /guest/i, /pet/i, /quiet/i, /renewal/i],
  },
  {
    intent: 'checklist_help',
    patterns: [/checklist/i, /what.*next/i, /start/i, /help/i, /how.*work/i],
  },
  {
    intent: 'nudges',
    patterns: [/nudge/i, /email reminder/i],
  },
  {
    intent: 'measure',
    patterns: [/measure/i, /metric/i, /funnel/i, /activation/i, /cohort/i, /holdout/i],
  },
]

const INTENT_REPLIES: Record<GuideScene, Record<string, ScriptedReply>> = {
  welcome: {
    checklist_help: CHIP_REPLIES['Start checklist'],
    why_photos: CHIP_REPLIES['Why photos first?'],
    how_photos: CHIP_REPLIES['How do I take good photos?'],
    default: {
      text: "I'm Guide — here to help you settle into Oak Street Residences. Tap Start move-in checklist whenever you're ready, or ask about move-in or your lease.",
      chips: ['Why photos first?', 'Start checklist'],
    },
  },
  checklist: {
    why_photos: CHIP_REPLIES['Why photos first?'],
    how_photos: CHIP_REPLIES['What rooms should I cover?'],
    notifications: CHIP_REPLIES['Why turn on notifications?'],
    autopay: CHIP_REPLIES['How does autopay work?'],
    lease: {
      text: 'Quiet hours are 10pm–7am, and one small pet is allowed with approval. For anything else, ask your property manager — I won’t guess at policy.',
      chips: ['Why photos first?', 'How does autopay work?'],
    },
    default: {
      text: "You're on the Move-In Checklist. Finish unit photos, turn on notifications, and set up autopay — then I'll confirm your move-in record is saved.",
      chips: ['Why photos first?', 'Why turn on notifications?', 'How does autopay work?'],
    },
  },
  complete: {
    checklist_help: {
      text: "You're set on move-in essentials. From Dashboard you can check rent/autopay or submit a maintenance request.",
      chips: ['Show maintenance tip', 'How does autopay work?'],
    },
    maintenance: CHIP_REPLIES['Show maintenance tip'],
    lease: CHIP_REPLIES['What about renewals?'],
    autopay: CHIP_REPLIES['How does autopay work?'],
    default: {
      text: 'Your move-in record is saved. Nice work, Jordan. Check rent, open a maintenance request, or ask me anything about Oak Street.',
      chips: ['Show maintenance tip', 'How does autopay work?', 'What about renewals?'],
    },
  },
  maintenance: {
    emergency: CHIP_REPLIES["It's an emergency"],
    maintenance: CHIP_REPLIES['Kitchen faucet dripping'],
    lease: {
      text: 'Normal wear is typically covered by the property. When in doubt, report it and your manager will sort responsibility — I won’t give legal advice.',
      chips: ['Submit a request', 'What counts as emergency?'],
    },
    default: {
      text: "Tell me what's going on — leak, appliance, HVAC — or tap a chip. I’ll ask if it’s urgent, then submit the request for you right here in chat.",
      chips: ['Kitchen faucet dripping', 'What counts as emergency?', 'Gas smell / emergency'],
    },
  },
  nudges: {
    nudges: {
      text: 'These frames are mocked reminders — they only go out if Jordan opted into notifications on the checklist. Email on move-in day, then SMS/push if steps are still open. They stop once the item is done. Nothing is actually sent here.',
      chips: ['Why turn on notifications?', 'Why photos first?'],
    },
    notifications: CHIP_REPLIES['Why turn on notifications?'],
    default: {
      text: "You're viewing the nudge timeline. It’s a mocked story of how we’d remind Jordan about unfinished move-in steps — only reachable after notification opt-in. Labeled mocked, no real sends.",
      chips: ['Why turn on notifications?', 'Start checklist'],
    },
  },
  measure: {
    measure: {
      text: 'Activation here means finishing photos, notifications, and autopay within 7 days of lease start. The funnel and cohort numbers on this page are illustrative for the design exercise.',
      chips: ['Why photos first?'],
    },
    default: {
      text: 'This Measure panel is static — resident quotes, funnel, Guide-led vs holdout, downstream metrics, and a ship/stop rule. Ask if you want a plain-language walkthrough.',
      chips: ['Why photos first?'],
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
  const trimmed = message.trim()
  if (CHIP_REPLIES[trimmed]) return CHIP_REPLIES[trimmed]

  const intent = detectIntent(trimmed)
  const sceneReplies = INTENT_REPLIES[scene]
  return sceneReplies[intent] ?? sceneReplies.default ?? GENERIC_FALLBACK
}

export function getSuggestedChips(scene: GuideScene): string[] {
  return INTENT_REPLIES[scene].default.chips ?? GENERIC_FALLBACK.chips ?? []
}

export const WELCOME_SEQUENCE = [
  `Welcome home, Jordan — I'm Guide, your Glasspine assistant for Oak Street Residences.`,
  `I've put together a short Move-In Checklist for Apt 4B. We'll document your unit's condition, turn on notifications, and set up autopay.`,
  `Ready to start whenever you are.`,
] as const

export const COMPLETE_SEED_MESSAGES = [
  'Checklist complete — your move-in record is saved. From Dashboard you can check rent or open a maintenance request anytime.',
] as const

export const MAINTENANCE_PROACTIVE = [
  `Hey Jordan — looks like something might need attention in Apt 4B.`,
  `Tell me what's going on (or tap a chip). For gas, fire, flooding, or sparking outlets, call 555-0142 first — I'll help with everything else right here.`,
] as const

export const MAINTENANCE_READY_PROACTIVE = [
  `Hey Jordan — looks like something might need attention in Apt 4B.`,
  `Your move-in checklist is done, so we can jump straight in. Tell me what's going on (or tap a chip). For gas, fire, flooding, or sparking outlets, call 555-0142 first.`,
] as const

export const NUDGES_SEED_MESSAGES = [
  `This timeline shows mocked nudges we’d send if move-in steps stall — email, SMS, and push. They only reach residents who opted into notifications on the checklist. Nothing is actually sent here.`,
] as const

export const MEASURE_SEED_MESSAGES = [
  `You're on the Measure panel — static, illustrative numbers for how we’d know if Guide-led activation works. Ask me to explain any section.`,
] as const
