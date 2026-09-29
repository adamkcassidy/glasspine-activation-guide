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

/** Client abort — keep under function maxDuration (30s) with a small buffer. */
const LIVE_TIMEOUT_MS = 28000

function classifyGuideError(err: unknown): {
  kind: 'timeout' | 'api' | 'empty' | 'parse' | 'other'
  name: string
  message: string
} {
  const name = err instanceof Error ? err.name : typeof err
  const message = err instanceof Error ? err.message : String(err)
  const isAbort =
    name === 'AbortError' ||
    (typeof DOMException !== 'undefined' && err instanceof DOMException && err.name === 'AbortError')

  if (isAbort) return { kind: 'timeout', name, message }
  if (/Empty Guide response/i.test(message)) return { kind: 'empty', name, message }
  if (/Guide API \d+/i.test(message)) return { kind: 'api', name, message }
  if (err instanceof SyntaxError) return { kind: 'parse', name, message }
  return { kind: 'other', name, message }
}

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

    const raw = await res.text()
    let data: { text?: string; error?: string } = {}
    try {
      data = raw ? (JSON.parse(raw) as { text?: string; error?: string }) : {}
    } catch {
      throw new Error(
        `Guide API ${res.status}: non-JSON body (${raw.slice(0, 120) || 'empty'})`,
      )
    }

    if (!res.ok) {
      throw new Error(
        `Guide API ${res.status}${data.error ? `: ${data.error}` : ''}${raw ? ` | body=${raw.slice(0, 200)}` : ''}`,
      )
    }

    if (!data.text?.trim()) {
      throw new Error(
        `Empty Guide response | status=${res.status} | body=${raw.slice(0, 200) || '(empty)'}`,
      )
    }

    return {
      text: data.text.trim(),
      chips: getScriptedReply(scene, message).chips,
      source: 'live',
    }
  } catch (err) {
    const classified = classifyGuideError(err)
    console.error('[guide-client] askGuide failed', classified, err)
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
