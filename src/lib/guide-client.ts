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

const LIVE_TIMEOUT_MS = 8000

export type StreamGuideHandlers = {
  onToken: (chunk: string) => void
}

/**
 * Streams a live Guide reply. Calls onToken for each text chunk.
 * Falls back to scripted replies on timeout, error, or missing key (503).
 */
export async function askGuideStreaming(
  scene: GuideScene,
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[] = [],
  checklistState?: ChecklistSnapshot,
  handlers?: StreamGuideHandlers,
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
    if (!res.body) throw new Error('No response body')

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let text = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      if (!chunk) continue
      text += chunk
      handlers?.onToken(chunk)
    }

    const finalText = text.trim()
    if (!finalText) throw new Error('Empty Guide response')

    return {
      text: finalText,
      chips: getScriptedReply(scene, message).chips,
      source: 'live',
    }
  } catch {
    const fallback = getScriptedReply(scene, message)
    return { ...fallback, source: 'scripted' }
  } finally {
    window.clearTimeout(timeout)
  }
}

/** Non-streaming helper (scripts / tests). Prefer askGuideStreaming in the UI. */
export async function askGuide(
  scene: GuideScene,
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[] = [],
  checklistState?: ChecklistSnapshot,
): Promise<GuideResponse> {
  return askGuideStreaming(scene, message, history, checklistState)
}

export function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
