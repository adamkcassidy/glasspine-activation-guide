import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  COMPLETE_SEED_MESSAGES,
  MAINTENANCE_PROACTIVE,
  MAINTENANCE_READY_PROACTIVE,
  MEASURE_SEED_MESSAGES,
  NUDGES_SEED_MESSAGES,
  WELCOME_SEQUENCE,
  type GuideScene,
} from '@/lib/guide-scripts'
import { RENT_DUE_DAY, ROOM_LABELS } from '@/lib/resident'

export type UnitPhoto = {
  id: string
  src: string
  label: string
  takenAt: string
}

export type NotificationPrefs = {
  email: boolean
  sms: boolean
  push: boolean
}

export type AutopayInfo = {
  connected: boolean
  /** Always the lease due day (1st) — not chosen by the resident. */
  draftDay: typeof RENT_DUE_DAY
  accountLabel: string
}

export type ChatCard =
  | {
      kind: 'maintenance_ticket'
      ticketId: string
      issue: string
      location: string
      priority: 'routine' | 'emergency'
      permissionToEnter?: boolean
      photoSrc?: string | null
    }
  | {
      kind: 'emergency_handoff'
    }

export type ChatMessage = {
  id: string
  role: 'assistant' | 'user'
  content: string
  source?: 'live' | 'scripted'
  card?: ChatCard
}

export type MaintenancePhase =
  | 'listening'
  | 'clarifying'
  | 'emergency_handoff'
  | 'drafting'
  | 'confirming'
  | 'submitted'

export type MaintenanceDraft = {
  issue: string
  location: string
  priority: 'routine' | 'emergency'
  photoSrc: string | null
  permissionToEnter: boolean
  ticketId: string | null
  submittedAt: string | null
}

/** Persists on the Maintenance page after chat submit, until a new report starts. */
export type SubmittedMaintenanceRequest = {
  ticketId: string
  issue: string
  priority: 'routine' | 'emergency'
  submittedAt: string
}

export type ChecklistState = {
  photos: UnitPhoto[]
  notifications: NotificationPrefs
  autopay: AutopayInfo | null
  photosDone: boolean
  notificationsDone: boolean
  autopayDone: boolean
  completedCount: number
  totalCount: number
  allDone: boolean
  addRoomPhotos: () => void
  removePhoto: (id: string) => void
  completePhotos: () => void
  setNotificationPrefs: (prefs: NotificationPrefs) => void
  completeNotifications: () => void
  completeAutopay: (accountLabel?: string) => void
  // Maintenance
  maintenancePhase: MaintenancePhase
  maintenanceDraft: MaintenanceDraft
  setMaintenancePhase: (phase: MaintenancePhase) => void
  updateMaintenanceDraft: (patch: Partial<MaintenanceDraft>) => void
  beginMaintenanceClarifying: (issue?: string) => void
  chooseMaintenanceEmergency: () => void
  chooseMaintenanceRoutine: () => void
  prepareMaintenanceConfirm: (permissionToEnter: boolean) => void
  submitMaintenanceRequest: () => string
  resetMaintenance: () => void
  startMaintenanceReport: () => void
  /** Last filed request — survives draft resets so the page confirmation card stays visible. */
  submittedRequest: SubmittedMaintenanceRequest | null
  // Chat / demo session
  messages: ChatMessage[]
  chips: string[]
  lastSource: 'live' | 'scripted' | null
  chatCollapsed: boolean
  pendingBoot: string[] | null
  setMessages: (updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void
  setChips: (chips: string[]) => void
  setLastSource: (source: 'live' | 'scripted' | null) => void
  setChatCollapsed: (collapsed: boolean) => void
  clearPendingBoot: () => void
  resetDemo: () => void
  /** Boots Guide for a route without wiping checklist progress. */
  bootGuideForPath: (pathname: string) => void
  /** True once the resident has opened Guide chat at least once this session. */
  chatOpenedThisSession: boolean
}

const ChecklistContext = createContext<ChecklistState | null>(null)

const EMPTY_NOTIFICATIONS: NotificationPrefs = {
  email: false,
  sms: false,
  push: false,
}

const DEFAULT_DRAFT: MaintenanceDraft = {
  issue: '',
  location: 'Apt 4B kitchen',
  priority: 'routine',
  photoSrc: null,
  permissionToEnter: true,
  ticketId: null,
  submittedAt: null,
}

function buildRoomPhotos(takenAt = new Date().toISOString()): UnitPhoto[] {
  return ROOM_LABELS.map((label, i) => ({
    id: crypto.randomUUID(),
    src: `/rooms/room-${i + 1}.jpg`,
    label,
    takenAt,
  }))
}

function emptyDraft(): MaintenanceDraft {
  return { ...DEFAULT_DRAFT }
}

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<UnitPhoto[]>([])
  const [photosDone, setPhotosDone] = useState(false)
  const [notifications, setNotifications] = useState<NotificationPrefs>(EMPTY_NOTIFICATIONS)
  const [notificationsDone, setNotificationsDone] = useState(false)
  const [autopay, setAutopay] = useState<AutopayInfo | null>(null)

  const [maintenancePhase, setMaintenancePhase] = useState<MaintenancePhase>('listening')
  const [maintenanceDraft, setMaintenanceDraft] = useState<MaintenanceDraft>(emptyDraft)
  const [submittedRequest, setSubmittedRequest] = useState<SubmittedMaintenanceRequest | null>(
    null,
  )

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chips, setChips] = useState<string[]>([])
  const [lastSource, setLastSource] = useState<'live' | 'scripted' | null>(null)
  const [chatCollapsed, setChatCollapsedState] = useState(false)
  const [chatOpenedThisSession, setChatOpenedThisSession] = useState(false)
  const [pendingBoot, setPendingBoot] = useState<string[] | null>(null)

  const setChatCollapsed = useCallback((collapsed: boolean) => {
    if (!collapsed) setChatOpenedThisSession(true)
    setChatCollapsedState(collapsed)
  }, [])

  const checklistRef = useRef({
    photosDone: false,
    notificationsDone: false,
    autopay: null as AutopayInfo | null,
  })
  checklistRef.current = { photosDone, notificationsDone, autopay }

  const draftRef = useRef(maintenanceDraft)
  draftRef.current = maintenanceDraft

  const addRoomPhotos = useCallback(() => {
    setPhotos(buildRoomPhotos())
    setPhotosDone(false)
  }, [])

  const removePhoto = useCallback((id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
    setPhotosDone(false)
  }, [])

  const completePhotos = useCallback(() => {
    setPhotosDone(true)
  }, [])

  const setNotificationPrefs = useCallback((prefs: NotificationPrefs) => {
    setNotifications(prefs)
    setNotificationsDone(false)
  }, [])

  const completeNotifications = useCallback(() => {
    setNotificationsDone(true)
  }, [])

  const completeAutopay = useCallback((accountLabel = 'Checking ••1234 connected') => {
    setAutopay({
      connected: true,
      draftDay: RENT_DUE_DAY,
      accountLabel,
    })
  }, [])

  const updateMaintenanceDraft = useCallback((patch: Partial<MaintenanceDraft>) => {
    setMaintenanceDraft((prev) => ({ ...prev, ...patch }))
  }, [])

  const beginMaintenanceClarifying = useCallback((issue = 'Kitchen faucet dripping') => {
    setMaintenanceDraft({
      ...emptyDraft(),
      issue,
      location: 'Apt 4B kitchen',
      photoSrc: '/rooms/room-1.jpg',
    })
    setMaintenancePhase('clarifying')
  }, [])

  const chooseMaintenanceEmergency = useCallback(() => {
    setMaintenanceDraft((prev) => ({ ...prev, priority: 'emergency' }))
    setMaintenancePhase('emergency_handoff')
  }, [])

  const chooseMaintenanceRoutine = useCallback(() => {
    setMaintenanceDraft((prev) => ({
      ...prev,
      priority: 'routine',
      issue: prev.issue || 'Kitchen faucet dripping',
      photoSrc: prev.photoSrc || '/rooms/room-1.jpg',
    }))
    setMaintenancePhase('drafting')
  }, [])

  const prepareMaintenanceConfirm = useCallback((permissionToEnter: boolean) => {
    setMaintenanceDraft((prev) => {
      const next = {
        ...prev,
        permissionToEnter,
        priority: 'routine' as const,
        issue: prev.issue || 'Kitchen faucet dripping',
        photoSrc: prev.photoSrc || '/rooms/room-1.jpg',
        ticketId: null,
        submittedAt: null,
      }
      draftRef.current = next
      return next
    })
    setMaintenancePhase('confirming')
  }, [])

  const submitMaintenanceRequest = useCallback(() => {
    const prev = draftRef.current
    const ticketId = `WO-${Math.floor(10000 + Math.random() * 90000)}`
    const submittedAt = new Date().toISOString()
    const issue = prev.issue || 'Kitchen faucet dripping'
    const priority = prev.priority || 'routine'
    setMaintenanceDraft({
      ...prev,
      issue,
      priority,
      ticketId,
      submittedAt,
    })
    setSubmittedRequest({ ticketId, issue, priority, submittedAt })
    setMaintenancePhase('submitted')
    return ticketId
  }, [])

  const resetMaintenance = useCallback(() => {
    setMaintenancePhase('listening')
    setMaintenanceDraft(emptyDraft())
  }, [])

  const startMaintenanceReport = useCallback(() => {
    const { photosDone: pd, notificationsDone: nd, autopay: ap } = checklistRef.current
    const checklistComplete = pd && nd && ap !== null

    setSubmittedRequest(null)
    setChatCollapsed(false)
    setMaintenancePhase('listening')
    setMaintenanceDraft(emptyDraft())
    setMessages([])
    setChips([])
    setLastSource(null)
    setPendingBoot(
      checklistComplete ? [...MAINTENANCE_READY_PROACTIVE] : [...MAINTENANCE_PROACTIVE],
    )
  }, [setChatCollapsed])

  const clearPendingBoot = useCallback(() => {
    setPendingBoot(null)
  }, [])

  const resetDemo = useCallback(() => {
    setPhotos([])
    setPhotosDone(false)
    setNotifications(EMPTY_NOTIFICATIONS)
    setNotificationsDone(false)
    setAutopay(null)
    setMaintenancePhase('listening')
    setMaintenanceDraft(emptyDraft())
    setSubmittedRequest(null)
    setMessages([])
    setChips([])
    setLastSource(null)
    setChatOpenedThisSession(false)
    setChatCollapsed(false)
    setPendingBoot([...WELCOME_SEQUENCE])
  }, [setChatCollapsed])

  function sceneFromPath(pathname: string): GuideScene {
    if (pathname.startsWith('/checklist')) return 'checklist'
    if (pathname.startsWith('/complete')) return 'complete'
    if (pathname.startsWith('/maintenance')) return 'maintenance'
    if (pathname.startsWith('/nudges')) return 'nudges'
    if (pathname.startsWith('/measure')) return 'measure'
    return 'welcome'
  }

  /** Boots Guide chat for the current route. Never clears checklist progress. */
  const bootGuideForPath = useCallback((pathname: string) => {
    setMessages([])
    setChips([])
    setLastSource(null)

    if (pathname.startsWith('/write-up')) {
      setPendingBoot([
        'You’re on the Write-up. Ask me about the Guide-led move-in flow anytime.',
      ])
      return
    }

    const scene = sceneFromPath(pathname)

    if (scene === 'maintenance') {
      // Collapse chat so Report an issue starts the flow; keep any filed confirmation card.
      setChatCollapsedState(true)
      setMaintenancePhase((phase) => (phase === 'submitted' ? phase : 'listening'))
      setMaintenanceDraft((draft) =>
        draft.ticketId && draft.submittedAt ? draft : emptyDraft(),
      )
    }

    switch (scene) {
      case 'welcome':
        setPendingBoot([...WELCOME_SEQUENCE])
        break
      case 'checklist':
        setPendingBoot([
          "I'm here while you work through the checklist. Ask about photos, notifications, or autopay anytime.",
        ])
        break
      case 'complete':
        setPendingBoot([...COMPLETE_SEED_MESSAGES])
        break
      case 'maintenance':
        // Flow starts when the resident taps Report an issue.
        setPendingBoot(null)
        break
      case 'nudges':
        setPendingBoot([...NUDGES_SEED_MESSAGES])
        break
      case 'measure':
        setPendingBoot([...MEASURE_SEED_MESSAGES])
        break
    }
  }, [])

  const autopayDone = autopay !== null
  const completedCount = [photosDone, notificationsDone, autopayDone].filter(Boolean).length
  const totalCount = 3
  const allDone = completedCount === totalCount

  const value = useMemo(
    () => ({
      photos,
      notifications,
      autopay,
      photosDone,
      notificationsDone,
      autopayDone,
      completedCount,
      totalCount,
      allDone,
      addRoomPhotos,
      removePhoto,
      completePhotos,
      setNotificationPrefs,
      completeNotifications,
      completeAutopay,
      maintenancePhase,
      maintenanceDraft,
      setMaintenancePhase,
      updateMaintenanceDraft,
      beginMaintenanceClarifying,
      chooseMaintenanceEmergency,
      chooseMaintenanceRoutine,
      prepareMaintenanceConfirm,
      submitMaintenanceRequest,
      resetMaintenance,
      startMaintenanceReport,
      submittedRequest,
      messages,
      chips,
      lastSource,
      chatCollapsed,
      chatOpenedThisSession,
      pendingBoot,
      setMessages,
      setChips,
      setLastSource,
      setChatCollapsed,
      clearPendingBoot,
      resetDemo,
      bootGuideForPath,
    }),
    [
      photos,
      notifications,
      autopay,
      photosDone,
      notificationsDone,
      autopayDone,
      completedCount,
      allDone,
      addRoomPhotos,
      removePhoto,
      completePhotos,
      setNotificationPrefs,
      completeNotifications,
      completeAutopay,
      maintenancePhase,
      maintenanceDraft,
      updateMaintenanceDraft,
      beginMaintenanceClarifying,
      chooseMaintenanceEmergency,
      chooseMaintenanceRoutine,
      prepareMaintenanceConfirm,
      submitMaintenanceRequest,
      resetMaintenance,
      startMaintenanceReport,
      submittedRequest,
      messages,
      chips,
      lastSource,
      chatCollapsed,
      chatOpenedThisSession,
      pendingBoot,
      setChatCollapsed,
      clearPendingBoot,
      resetDemo,
      bootGuideForPath,
    ],
  )

  return <ChecklistContext.Provider value={value}>{children}</ChecklistContext.Provider>
}

export function useChecklist() {
  const ctx = useContext(ChecklistContext)
  if (!ctx) throw new Error('useChecklist must be used within ChecklistProvider')
  return ctx
}
