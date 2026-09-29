import type { ChatCard, MaintenanceDraft } from '@/lib/checklist-state'

/** Normalize dashes/apostrophes so chip matching works across scripted + typed input. */
export function normalizeMaintenanceText(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[’’]/g, "'")
    .replace(/[—–−-]+/g, '-')
    .replace(/\s+/g, ' ')
}

export type MaintenanceActions = {
  beginMaintenanceClarifying: (issue?: string) => void
  chooseMaintenanceEmergency: () => void
  chooseMaintenanceRoutine: () => void
  prepareMaintenanceConfirm: (permissionToEnter: boolean) => void
  submitMaintenanceRequest: () => string
  updateMaintenanceDraft: (patch: Partial<MaintenanceDraft>) => void
}

export type MaintenanceTurnResult = {
  text: string
  chips: string[]
  card?: ChatCard
}

/**
 * Scripted maintenance state machine. Known chips/phrases update shared app state
 * (confirm → submit → submittedRequest) so the Maintenance page card stays in sync
 * even when Guide never hits the live API.
 */
export function resolveMaintenanceTurn(
  message: string,
  draft: MaintenanceDraft,
  actions: MaintenanceActions,
): MaintenanceTurnResult | null {
  const n = normalizeMaintenanceText(message)

  const isEmergency =
    n.includes('gas smell') ||
    n.includes('submit as emergency') ||
    n === "it's an emergency" ||
    n === 'its an emergency' ||
    (/^(gas|fire|flood|spark)/.test(n) && n.includes('emergency')) ||
    n === 'gas smell / emergency'

  const isRoutine =
    n.includes('routine - sink is dripping') ||
    n.includes('not that urgent')

  const isEntryYes = n === 'yes, you can enter'
  const isEntryNo = n === "i'd rather be home" || n === 'id rather be home'
  const isAttachPhoto = n === 'attach a photo'
  const isConfirmSubmit =
    n === 'yes, submit it' || n === 'submit this' || n === 'submit this?' || n === 'submit'
  const isEditSomething = n === 'edit something'
  const isKitchenFaucet =
    n === 'kitchen faucet dripping' ||
    (n.includes('faucet') && n.includes('drip')) ||
    n.includes('kitchen faucet')

  if (isEmergency) {
    if ((n.includes('gas') || n.includes('fire') || n.includes('flood') || n.includes('spark')) &&
      n !== "it's an emergency" &&
      n !== 'its an emergency') {
      actions.beginMaintenanceClarifying(n.includes('gas') ? 'Possible gas smell' : message.trim())
    }
    actions.chooseMaintenanceEmergency()
    return {
      text: 'This sounds like an emergency. Leave the unit if it feels unsafe and call 555-0142 immediately — I won’t file a normal work order until you’re safe.',
      chips: ["It's not that urgent", 'What counts as emergency?'],
      card: { kind: 'emergency_handoff' },
    }
  }

  if (isRoutine) {
    const issue = draft.issue || 'Kitchen faucet dripping'
    actions.beginMaintenanceClarifying(issue)
    actions.chooseMaintenanceRoutine()
    return {
      text: 'Sounds routine. Is it okay to enter Apt 4B if you’re not home? You can also attach a photo of the issue.',
      chips: ['Yes, you can enter', "I'd rather be home", 'Attach a photo'],
    }
  }

  if (isAttachPhoto) {
    actions.updateMaintenanceDraft({ photoSrc: '/rooms/room-1.jpg' })
    return {
      text: 'Photo attached from your kitchen. Still okay if we enter when you’re out?',
      chips: ['Yes, you can enter', "I'd rather be home"],
    }
  }

  if (isEntryYes || isEntryNo) {
    const permissionToEnter = isEntryYes
    actions.prepareMaintenanceConfirm(permissionToEnter)
    const issue = draft.issue || 'Kitchen faucet dripping'
    const entryLine = permissionToEnter
      ? 'OK to enter if you’re not home'
      : 'Prefer you be home before entry'
    return {
      text: `Here’s what I’m about to submit:\n• ${issue}\n• Priority: routine\n• ${entryLine}\n\nSubmit this?`,
      chips: ['Yes, submit it', 'Edit something'],
    }
  }

  if (isConfirmSubmit) {
    const issue = draft.issue || 'Kitchen faucet dripping'
    const location = draft.location || 'Apt 4B kitchen'
    const photoSrc = draft.photoSrc
    const permissionToEnter = draft.permissionToEnter
    const ticketId = actions.submitMaintenanceRequest()
    return {
      text: 'Filed as routine. Here’s your confirmation — you can track it on this page anytime, and you’ll get email and SMS updates on this request.',
      chips: ['What counts as emergency?', 'Kitchen faucet dripping'],
      card: {
        kind: 'maintenance_ticket',
        ticketId,
        issue,
        location,
        priority: 'routine',
        permissionToEnter,
        photoSrc,
      },
    }
  }

  if (isEditSomething) {
    actions.chooseMaintenanceRoutine()
    return {
      text: 'No problem — what should we change? We can adjust urgency, entry permission, or start over with the issue.',
      chips: [
        "It's an emergency",
        'Routine — sink is dripping',
        'Yes, you can enter',
        "I'd rather be home",
      ],
    }
  }

  if (isKitchenFaucet) {
    actions.beginMaintenanceClarifying('Kitchen faucet dripping')
    return {
      text: 'Got it — kitchen faucet drip in Apt 4B. Is this an emergency, or routine?',
      chips: ["It's an emergency", 'Routine — sink is dripping'],
    }
  }

  if (n === 'what counts as emergency?') {
    return {
      text: 'Call 555-0142 first for gas smell, fire, active flooding, no heat in freezing weather, or sparking outlets. Everything else is usually routine and I can file it here.',
      chips: ['Kitchen faucet dripping', 'Submit a maintenance request'],
    }
  }

  if (n === 'submit a request' || n === 'submit a maintenance request') {
    return {
      text: 'Tell me what’s wrong — leak, appliance, HVAC — and whether it feels urgent. I’ll triage and submit a clear request right here.',
      chips: ['Kitchen faucet dripping', 'What counts as emergency?'],
    }
  }

  return null
}
