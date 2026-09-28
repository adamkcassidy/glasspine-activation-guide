import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Loader2, Send, Sparkles } from 'lucide-react'
import { askGuide, delay } from '@/lib/guide-client'
import { getSuggestedChips, type GuideScene } from '@/lib/guide-scripts'
import { useChecklist, type ChatMessage } from '@/lib/checklist-state'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

function sceneFromPath(pathname: string): GuideScene {
  if (pathname.startsWith('/checklist')) return 'checklist'
  if (pathname.startsWith('/complete')) return 'complete'
  if (pathname.startsWith('/maintenance')) return 'maintenance'
  return 'welcome'
}

function GuideAvatar({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <Avatar
      className={cn(
        'shrink-0 border border-primary/20',
        size === 'sm' ? 'size-7' : 'size-8',
      )}
    >
      <AvatarFallback className="bg-primary/10 text-primary">
        <Sparkles className={size === 'sm' ? 'size-3' : 'size-3.5'} />
      </AvatarFallback>
    </Avatar>
  )
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-muted-foreground/50 animate-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}

type GuideChatProps = {
  className?: string
}

export function GuideChat({ className }: GuideChatProps) {
  const location = useLocation()
  const scene = sceneFromPath(location.pathname)
  const {
    messages,
    chips,
    pendingBoot,
    maintenancePriority,
    setMessages,
    setChips,
    setLastSource,
    clearPendingBoot,
    setMaintenancePriority,
    setMaintenanceSubmitted,
  } = useChecklist()

  const [typing, setTyping] = useState(false)
  const [booting, setBooting] = useState(false)
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const bootIdRef = useRef(0)

  // Boot pending intro messages from session context
  useEffect(() => {
    if (!pendingBoot || pendingBoot.length === 0) return

    const bootId = ++bootIdRef.current
    const lines = [...pendingBoot]
    let cancelled = false

    async function boot() {
      setBooting(true)
      setMessages([])
      for (const content of lines) {
        if (cancelled || bootId !== bootIdRef.current) return
        setTyping(true)
        await delay(500 + Math.random() * 300)
        if (cancelled || bootId !== bootIdRef.current) return
        setTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content,
            source: 'scripted',
          } satisfies ChatMessage,
        ])
      }
      if (!cancelled && bootId === bootIdRef.current) {
        setBooting(false)
        setChips(getSuggestedChips(scene))
        setLastSource('scripted')
        clearPendingBoot()
      }
    }

    void boot()
    return () => {
      cancelled = true
    }
  }, [pendingBoot, clearPendingBoot, setMessages, setChips, setLastSource, scene])

  // Scroll only inside the message list — never the page
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, typing])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || typing || booting) return

    // Maintenance scene: chips can drive the left-panel request UI
    if (scene === 'maintenance') {
      if (/emergency/i.test(trimmed) && !/not that urgent/i.test(trimmed)) {
        setMaintenancePriority('emergency')
      } else if (/routine|dripping|not that urgent/i.test(trimmed)) {
        setMaintenancePriority('routine')
      }
      if (/submit/i.test(trimmed)) {
        if (!maintenancePriority) setMaintenancePriority('routine')
        setMaintenanceSubmitted(true)
        setInput('')
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'user', content: trimmed },
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: 'Request submitted. Maintenance will follow up with next steps.',
            source: 'scripted',
          },
        ])
        setChips([])
        return
      }
    }

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    const history = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }))

    const reply = await askGuide(scene, trimmed, history)
    await delay(400 + Math.random() * 300)
    setTyping(false)
    setLastSource(reply.source)
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply.text,
        source: reply.source,
      },
    ])
    if (reply.chips?.length) setChips(reply.chips)
  }

  return (
    <div
      className={cn(
        'flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border/80 bg-card/80 shadow-sm backdrop-blur-sm',
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-border/70 px-3 py-2.5">
        <GuideAvatar />
        <div className="flex items-center gap-1.5 leading-tight">
          <p className="text-sm font-medium">Glasspine Guide</p>
          <Badge
            variant="secondary"
            className="h-4 rounded-md px-1.5 text-[9px] font-semibold tracking-wide uppercase"
          >
            AI
          </Badge>
        </div>
      </div>

      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-3">
        <div className="flex flex-col gap-3 py-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                'animate-message-in flex gap-2',
                m.role === 'user' ? 'justify-end' : 'justify-start',
              )}
            >
              {m.role === 'assistant' && <GuideAvatar size="sm" />}
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                  m.role === 'user'
                    ? 'rounded-br-md bg-primary text-primary-foreground'
                    : 'rounded-bl-md bg-muted/80 text-foreground',
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-2">
              <GuideAvatar size="sm" />
              <div className="rounded-2xl rounded-bl-md bg-muted/80 px-3 py-2">
                <TypingDots />
              </div>
            </div>
          )}
        </div>
      </div>

      {chips.length > 0 && !typing && !booting && (
        <div className="flex shrink-0 flex-wrap gap-1.5 border-t border-border/50 px-3 py-2">
          {chips.map((chip) => {
            const isStart = /start checklist/i.test(chip)
            const isMaint = /maintenance|show me maintenance/i.test(chip)
            if (isStart) {
              return (
                <Button key={chip} asChild size="sm" variant="secondary" className="h-7 text-xs">
                  <Link to="/checklist">{chip}</Link>
                </Button>
              )
            }
            if (isMaint) {
              return (
                <Button key={chip} asChild size="sm" variant="secondary" className="h-7 text-xs">
                  <Link to="/maintenance">{chip}</Link>
                </Button>
              )
            }
            return (
              <Button
                key={chip}
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => void send(chip)}
              >
                {chip}
              </Button>
            )
          })}
        </div>
      )}

      <form
        className="flex shrink-0 items-center gap-2 border-t border-border/70 p-2.5"
        onSubmit={(e) => {
          e.preventDefault()
          void send(input)
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Guide anything…"
          disabled={typing || booting}
          className="bg-background"
        />
        <Button type="submit" size="icon" disabled={!input.trim() || typing || booting}>
          {typing ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </form>
    </div>
  )
}
