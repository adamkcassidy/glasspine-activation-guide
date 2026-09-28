import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import type { VercelRequest, VercelResponse } from '@vercel/node'

type Scene = 'welcome' | 'checklist' | 'complete' | 'maintenance'

const SCENE_CONTEXT: Record<Scene, string> = {
  welcome:
    'The resident is on move-in day. You are introducing the Move-In Checklist focused on unit-condition photos, household members, and autopay.',
  checklist:
    'The resident is completing the Move-In Checklist: unit condition photos, household members, and autopay setup. Answer policy questions briefly and encourage completing items.',
  complete:
    'The resident finished the checklist. Their move-in record is saved. Nudge them toward maintenance literacy as the next milestone.',
  maintenance:
    'The resident may have a maintenance issue. Help triage emergency vs routine and guide them to submit a clear request. Do not invent work orders as completed.',
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_GATEWAY_API_KEY
  if (!apiKey) {
    return res.status(503).json({ error: 'No API key configured' })
  }

  const { scene, message, history } = req.body as {
    scene?: Scene
    message?: string
    history?: { role: 'user' | 'assistant'; content: string }[]
  }

  if (!scene || !message?.trim()) {
    return res.status(400).json({ error: 'scene and message are required' })
  }

  try {
    const openai = createOpenAI({ apiKey })
    const prior = (history ?? [])
      .slice(-8)
      .map((m) => `${m.role === 'user' ? 'Resident' : 'Guide'}: ${m.content}`)
      .join('\n')

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: `You are Glasspine Guide, a helpful AI assistant embedded in the Glasspine Resident app for residential renters in the US.
Speak warmly and clearly in 1–3 short paragraphs (under 80 words total).
Never claim to have uploaded files, charged cards, or completed backend actions.
When explaining unit photos, say: a dated photo record of the unit's condition on move-in day gives the resident and property manager the same reference point if questions come up later. Do not pit residents against managers or claim legal protection.
Resident context: Jordan Hale, Apt 4B, Oak Street Residences.
Scene context: ${SCENE_CONTEXT[scene] ?? SCENE_CONTEXT.checklist}`,
      prompt: `${prior ? `Conversation so far:\n${prior}\n\n` : ''}Resident: ${message}\nGuide:`,
    })

    return res.status(200).json({ text })
  } catch (error) {
    console.error('Guide API error', error)
    return res.status(502).json({ error: 'Model call failed' })
  }
}
