import { getScriptedReply, type GuideScene, type ScriptedReply } from './guide-scripts'

export type ChecklistSnapshot = {
  photosDone: boolean
  householdDone: boolean
  autopayDone: boolean
  photoCount: number
  householdCount: number
  completedCount: number
  totalCount: number
  maintenancePhase?: string
}

export type GuideResponse = ScriptedReply & {
  source: 'live' | 'scripted'
}

const LIVE_TIMEOUT_MS = 15000

/**
 * Asks Guide via /api/guide (JSON). Falls back to scripted replies on
 * timeout, error, empty body, or missing key (503).
 */
export async function askGuide(
  scene: GuideScene,
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[] = [],
  checklistState?: ChecklistSnapshot,
): Promise<GuideResponse> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), LIVE_TIMEOUT_MS)

  try {
    const res = await fetch('/api/guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scene, message, history, checklistState }),
      signal: controller.signal,
    })

    if (!res.ok) throw new Error(`Guide API ${res.status}`)

    const data = (await res.json()) as { text?: string }
    if (!data.text?.trim()) throw new Error('Empty Guide response')

    return {
      text: data.text.trim(),
      chips: getScriptedReply(scene, message).chips,
      source: 'live',
    }
  } catch (err) {
    console.error('[guide-client] askGuide failed', err)
    const fallback = getScriptedReply(scene, message)
    return { ...fallback, source: 'scripted' }
  } finally {
    window.clearTimeout(timeout)
  }
}

/** @deprecated Use askGuide — streaming removed for reliability on Vercel Node. */
export async function askGuideStreaming(
  scene: GuideScene,
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[] = [],
  checklistState?: ChecklistSnapshot,
  _handlers?: { onToken: (chunk: string) => void },
): Promise<GuideResponse> {
  return askGuide(scene, message, history, checklistState)
}

export function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
