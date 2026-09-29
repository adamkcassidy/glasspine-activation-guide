import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import type { VercelRequest, VercelResponse } from '@vercel/node'

type Scene = 'welcome' | 'checklist' | 'complete' | 'maintenance' | 'nudges' | 'measure'

type ChecklistSnapshot = {
  photosDone?: boolean
  householdDone?: boolean
  autopayDone?: boolean
  photoCount?: number
  householdCount?: number
  completedCount?: number
  totalCount?: number
  maintenancePhase?: string
}

const SCENE_CONTEXT: Record<Scene, string> = {
  welcome:
    'The resident is on move-in day. Introduce the Move-In Checklist: unit-condition photos, household members, and autopay.',
  checklist:
    'The resident is working through the Move-In Checklist. Answer briefly and encourage completing photos, household, and autopay.',
  complete:
    'The resident finished the checklist. Their move-in record is saved. They are on Home — rent, maintenance, and coming-soon actions.',
  maintenance:
    'The resident may have a maintenance issue. Ask 1–2 clarifying questions, triage emergency vs routine. True emergencies: direct them to call 555-0142 first. For routine, help them complete a clear request.',
  nudges:
    'The resident is viewing mocked activation nudges (email/SMS/push). Explain the intent of timely reminders; do not claim messages were actually sent.',
  measure:
    'The resident (or reviewer) is viewing a static measurement panel about activation. Keep answers high-level; numbers on screen are illustrative.',
}

function buildSystemPrompt(scene: Scene, checklist?: ChecklistSnapshot) {
  const checklistLine = checklist
    ? `Checklist state: photos ${checklist.photosDone ? 'done' : 'incomplete'} (${checklist.photoCount ?? 0}), household ${checklist.householdDone ? 'done' : 'incomplete'} (${checklist.householdCount ?? 0} members), autopay ${checklist.autopayDone ? 'done' : 'incomplete'}; ${checklist.completedCount ?? 0}/${checklist.totalCount ?? 3} complete.${checklist.maintenancePhase ? ` Maintenance phase: ${checklist.maintenancePhase}.` : ''}`
    : 'Checklist state: unknown.'

  return `You are Glasspine Guide, a friendly, concise AI assistant in the Glasspine Resident app for Oak Street Residences.

Resident: Jordan Hale, Apt 4B, Oak Street Residences.

Known property facts (fictional, for this demo):
- Rent is due on the 1st with a 5-day grace period.
- One small pet is allowed with prior approval.
- Quiet hours are 10pm–7am.
- Emergency maintenance line: 555-0142.

Scene: ${SCENE_CONTEXT[scene] ?? SCENE_CONTEXT.checklist}
${checklistLine}

Rules:
- Speak warmly in 1–3 short paragraphs (under 80 words).
- Never guess at policy or law. If unsure, say so and point the resident to their property manager.
- For emergencies (gas smell, fire, flooding, no heat in winter, sparking outlets), tell them to call 555-0142 first.
- No legal advice. Do not claim photos provide legal protection.
- Never claim you uploaded files, charged accounts, called anyone, or completed backend actions.
- When explaining move-in photos: a dated photo record of unit condition on move-in day gives the resident and property manager the same reference point if questions come up later.`
}

const GUIDE_MODELS = ['gemini-3.8-flash', 'gemini-2.5-flash-lite'] as const

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'No API key configured' })
  }

  const { scene, message, history, checklistState } = req.body as {
    scene?: Scene
    message?: string
    history?: { role: 'user' | 'assistant'; content: string }[]
    checklistState?: ChecklistSnapshot
  }

  if (!scene || !message?.trim()) {
    return res.status(400).json({ error: 'scene and message are required' })
  }

  const prior = (history ?? [])
    .slice(-8)
    .map((m) => `${m.role === 'user' ? 'Resident' : 'Guide'}: ${m.content}`)
    .join('\n')

  const prompt = `${prior ? `Conversation so far:\n${prior}\n\n` : ''}Resident: ${message}\nGuide:`
  const system = buildSystemPrompt(scene, checklistState)

  let lastError: unknown

  for (const modelId of GUIDE_MODELS) {
    try {
      console.log('[guide] calling generateText', {
        model: modelId,
        scene,
        messageLen: message.trim().length,
        historyLen: history?.length ?? 0,
      })

      const { text } = await generateText({
        model: google(modelId),
        system,
        prompt,
        maxRetries: 2,
      })

      console.log('[guide] generateText done', {
        model: modelId,
        textLen: text?.length ?? 0,
        preview: text?.slice(0, 80) ?? '',
      })

      if (!text?.trim()) {
        lastError = new Error(`Empty model response from ${modelId}`)
        continue
      }

      return res.status(200).json({ text: text.trim() })
    } catch (error) {
      lastError = error
      console.error(`[guide] model ${modelId} failed`, error)
    }
  }

  console.error('[guide] Guide API error — all models failed', lastError)
  const detail =
    lastError instanceof Error
      ? lastError.message
      : typeof lastError === 'string'
        ? lastError
        : 'unknown'
  return res.status(502).json({ error: 'Model call failed', detail })
}
