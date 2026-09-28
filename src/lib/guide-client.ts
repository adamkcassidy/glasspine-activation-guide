import { getScriptedReply, type GuideScene, type ScriptedReply } from './guide-scripts'

export type GuideResponse = ScriptedReply & {
  source: 'live' | 'scripted'
}

const LIVE_TIMEOUT_MS = 2500

export async function askGuide(
  scene: GuideScene,
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[] = [],
): Promise<GuideResponse> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), LIVE_TIMEOUT_MS)

  try {
    const res = await fetch('/api/guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scene, message, history }),
      signal: controller.signal,
    })

    if (!res.ok) throw new Error(`Guide API ${res.status}`)

    const data = (await res.json()) as { text?: string; chips?: string[] }
    if (!data.text?.trim()) throw new Error('Empty Guide response')

    return {
      text: data.text.trim(),
      chips: data.chips,
      source: 'live',
    }
  } catch {
    const fallback = getScriptedReply(scene, message)
    return { ...fallback, source: 'scripted' }
  } finally {
    window.clearTimeout(timeout)
  }
}

export function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}
