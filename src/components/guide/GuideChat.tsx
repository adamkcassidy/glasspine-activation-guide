import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2, ChevronDown, Loader2, Phone, Send, Sparkles } from 'lucide-react'
import { askGuide, delay } from '@/lib/guide-client'
import { getSuggestedChips, type GuideScene } from '@/lib/guide-scripts'
import {
  useChecklist,
  type ChatCard,
  type ChatMessage,
} from '@/lib/checklist-state'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

function sceneFromPath(pathname: string): GuideScene {
  if (pathname.startsWith('/checklist')) return 'checklist'
  if (pathname.startsWith('/complete')) return 'complete'
  if (pathname.startsWith('/maintenance')) return 'maintenance'
  if (pathname.startsWith('/nudges')) return 'nudges'
  if (pathname.startsWith('/measure')) return 'measure'
  return 'welcome'
}

function GuideAvatar() {
  return (
    <Avatar className="size-8 shrink-0 border border-primary/20">
      <AvatarFallback className="bg-primary/10 text-primary">
        <Sparkles className="size-3.5" />
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

function MessageCard({ card }: { card: ChatCard }) {
  if (card.kind === 'emergency_handoff') {
    return (
      <div className="mt-2 space-y-2 rounded-xl border border-destructive/30 bg-background/80 p-3 text-sm">
        <div className="flex items-start gap-2">
          <Phone className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div>
            <p className="font-medium">Call 555-0142 now</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              Gas, fire, flooding, no heat in winter, or sparking outlets — contact on-call
              maintenance before filing a normal request.
            </p>
          </div>
        </div>
        <Button type="button" size="sm" asChild className="w-full sm:w-auto">
          <a href="tel:5550142">
            <Phone className="size-3.5" />
            Call 555-0142
          </a>
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-2 space-y-2 rounded-xl border border-primary/25 bg-background/80 p-3 text-sm">
      <div className="flex items-start gap-2">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="font-medium">Request submitted · {card.ticketId}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {card.issue} · {card.location} · {card.priority}
            {card.permissionToEnter != null &&
              ` · ${card.permissionToEnter ? 'entry OK if out' : 'prefer resident home'}`}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Expected response within 1–2 business days for routine jobs.
          </p>
        </div>
      </div>
      {card.photoSrc && (
        <div className="overflow-hidden rounded-lg border border-border/70">
          <img
            src={card.photoSrc}
            alt="Issue photo"
            className="aspect-video w-full object-cover"
          />
        </div>
      )}
    </div>
  )
}

type GuideChatProps = {
  className?: string
  onCollapse?: () => void
}

export function GuideChat({ className, onCollapse }: GuideChatProps) {
  const location = useLocation()
  const scene = sceneFromPath(location.pathname)
  const {
    messages,
    chips,
    pendingBoot,
    photosDone,
    notificationsDone,
    autopayDone,
    photos,
    completedCount,
    totalCount,
    maintenancePhase,
    maintenanceDraft,
    beginMaintenanceClarifying,
    chooseMaintenanceEmergency,
    chooseMaintenanceRoutine,
    prepareMaintenanceConfirm,
    submitMaintenanceRequest,
    updateMaintenanceDraft,
    setMessages,
    setChips,
    setLastSource,
    clearPendingBoot,
  } = useChecklist()

  const [typing, setTyping] = useState(false)
  const [booting, setBooting] = useState(false)
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const bootIdRef = useRef(0)

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

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, typing])

  function pushAssistant(content: string, card?: ChatCard, chipsNext?: string[]) {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content,
        source: 'scripted',
        card,
      },
    ])
    setLastSource('scripted')
    if (chipsNext) setChips(chipsNext)
  }

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || typing || booting) return

    if (scene === 'maintenance') {
      const isEmergencyPhrase =
        /gas smell|fire|flood|spark|no heat/i.test(trimmed) ||
        /gas smell \/ emergency/i.test(trimmed) ||
        /it'?s an emergency|submit as emergency/i.test(trimmed)

      const isRoutinePhrase =
        /routine — sink is dripping/i.test(trimmed) ||
        /not that urgent/i.test(trimmed)

      const isEntryYes = /yes, you can enter/i.test(trimmed)
      const isEntryNo = /i'?d rather be home/i.test(trimmed)
      const isAttachPhoto = /attach a photo/i.test(trimmed)
      const isConfirmSubmit =
        /yes, submit it/i.test(trimmed) ||
        /submit this\??/i.test(trimmed) ||
        /^submit$/i.test(trimmed)
      const isEditSomething = /edit something/i.test(trimmed)

      if (isEmergencyPhrase) {
        if (/gas|fire|flood|spark|no heat/i.test(trimmed) && !/it'?s an emergency/i.test(trimmed)) {
          beginMaintenanceClarifying(/gas/i.test(trimmed) ? 'Possible gas smell' : trimmed)
        }
        chooseMaintenanceEmergency()
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'user', content: trimmed },
        ])
        setInput('')
        setTyping(true)
        await delay(400)
        setTyping(false)
        pushAssistant(
          'This sounds like an emergency. Leave the unit if it feels unsafe and call 555-0142 immediately — I won’t file a normal work order until you’re safe.',
          { kind: 'emergency_handoff' },
          ["It's not that urgent", 'What counts as emergency?'],
        )
        return
      }

      if (isRoutinePhrase) {
        const issue = maintenanceDraft.issue || 'Kitchen faucet dripping'
        beginMaintenanceClarifying(issue)
        chooseMaintenanceRoutine()
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'user', content: trimmed },
        ])
        setInput('')
        setTyping(true)
        await delay(400)
        setTyping(false)
        pushAssistant(
          'Sounds routine. Is it okay to enter Apt 4B if you’re not home? You can also attach a photo of the issue.',
          undefined,
          ['Yes, you can enter', "I'd rather be home", 'Attach a photo'],
        )
        return
      }

      if (isAttachPhoto) {
        updateMaintenanceDraft({ photoSrc: '/rooms/room-1.jpg' })
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'user', content: trimmed },
        ])
        setInput('')
        setTyping(true)
        await delay(350)
        setTyping(false)
        pushAssistant(
          'Photo attached from your kitchen. Still okay if we enter when you’re out?',
          undefined,
          ['Yes, you can enter', "I'd rather be home"],
        )
        return
      }

      if (isEntryYes || isEntryNo) {
        const permissionToEnter = isEntryYes
        prepareMaintenanceConfirm(permissionToEnter)
        const issue = maintenanceDraft.issue || 'Kitchen faucet dripping'
        const entryLine = permissionToEnter
          ? 'OK to enter if you’re not home'
          : 'Prefer you be home before entry'
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'user', content: trimmed },
        ])
        setInput('')
        setTyping(true)
        await delay(400)
        setTyping(false)
        pushAssistant(
          `Here’s what I’m about to submit:\n• ${issue}\n• Priority: routine\n• ${entryLine}\n\nSubmit this?`,
          undefined,
          ['Yes, submit it', 'Edit something'],
        )
        return
      }

      if (isConfirmSubmit) {
        const issue = maintenanceDraft.issue || 'Kitchen faucet dripping'
        const location = maintenanceDraft.location || 'Apt 4B kitchen'
        const photoSrc = maintenanceDraft.photoSrc
        const permissionToEnter = maintenanceDraft.permissionToEnter
        const ticketId = submitMaintenanceRequest()
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'user', content: trimmed },
        ])
        setInput('')
        setTyping(true)
        await delay(450)
        setTyping(false)
        pushAssistant(
          'Filed as routine. Here’s your confirmation — you can track it anytime from this ticket.',
          {
            kind: 'maintenance_ticket',
            ticketId,
            issue,
            location,
            priority: 'routine',
            permissionToEnter,
            photoSrc,
          },
          ['What counts as emergency?', 'Kitchen faucet dripping'],
        )
        return
      }

      if (isEditSomething) {
        chooseMaintenanceRoutine()
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'user', content: trimmed },
        ])
        setInput('')
        setTyping(true)
        await delay(350)
        setTyping(false)
        pushAssistant(
          'No problem — what should we change? We can adjust urgency, entry permission, or start over with the issue.',
          undefined,
          [
            "It's an emergency",
            'Routine — sink is dripping',
            'Yes, you can enter',
            "I'd rather be home",
          ],
        )
        return
      }

      if (/kitchen faucet|dripping|leak|broken|appliance/i.test(trimmed)) {
        beginMaintenanceClarifying(
          /faucet|drip/i.test(trimmed) ? 'Kitchen faucet dripping' : trimmed,
        )
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

    const checklistState = {
      photosDone,
      notificationsDone,
      autopayDone,
      photoCount: photos.length,
      completedCount,
      totalCount,
      maintenancePhase,
    }

    const reply = await askGuide(scene, trimmed, history, checklistState)
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

  const busy = typing || booting

  return (
    <div
      className={cn(
        'flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border/80 bg-card/80 shadow-sm backdrop-blur-sm',
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-border/70 px-3 py-2.5">
        <GuideAvatar />
        <div className="min-w-0 flex-1 leading-tight">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-sm font-medium">Glasspine Guide</p>
            <Badge
              variant="secondary"
              className="h-4 rounded-md px-1.5 text-[9px] font-semibold tracking-wide uppercase"
            >
              AI
            </Badge>
          </div>
        </div>
        {onCollapse && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 rounded-full text-muted-foreground"
            onClick={onCollapse}
            aria-label="Collapse Guide"
          >
            <ChevronDown className="size-4" />
          </Button>
        )}
      </div>

      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-3">
        <div className="flex min-h-full flex-col justify-end gap-3 py-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                'animate-message-in flex',
                m.role === 'user' ? 'justify-end' : 'justify-start',
              )}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                  m.role === 'user'
                    ? 'rounded-br-md bg-primary text-primary-foreground'
                    : 'rounded-bl-md bg-muted/80 text-foreground',
                )}
              >
                {m.content}
                {m.card && <MessageCard card={m.card} />}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-muted/80 px-3 py-2">
                <TypingDots />
              </div>
            </div>
          )}
        </div>
      </div>

      {chips.length > 0 && !busy && (
        <div className="flex shrink-0 flex-wrap gap-1.5 border-t border-border/50 px-3 py-2">
          {chips.map((chip) => {
            const isStart = /start checklist/i.test(chip)
            const isMaint =
              /show me maintenance|submit a maintenance request/i.test(chip) &&
              scene !== 'maintenance'
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
          disabled={busy}
          className="bg-background"
        />
        <Button type="submit" size="icon" disabled={!input.trim() || busy}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </form>
    </div>
  )
}
