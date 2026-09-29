import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { GuideScene } from '@/lib/guide-scripts'
import {
  COMPLETE_SEED_MESSAGES,
  MAINTENANCE_PROACTIVE,
  MEASURE_SEED_MESSAGES,
  NUDGES_SEED_MESSAGES,
  WELCOME_SEQUENCE,
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
  | 'submitted'

export type MaintenanceDraft = {
  issue: string
  location: string
  priority: 'routine' | 'emergency'
  photoSrc: string | null
  permissionToEnter: boolean
  ticketId: string | null
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
  submitMaintenanceRequest: () => string
  resetMaintenance: () => void
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
  seedForScene: (scene: GuideScene) => void
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
}

function buildRoomPhotos(takenAt = new Date().toISOString()): UnitPhoto[] {
  return ROOM_LABELS.map((label, i) => ({
    id: crypto.randomUUID(),
    src: `/rooms/room-${i + 1}.jpg`,
    label,
    takenAt,
  }))
}

function seedNotifications(): NotificationPrefs {
  return { email: true, sms: true, push: true }
}

function seedAutopay(): AutopayInfo {
  return {
    connected: true,
    draftDay: RENT_DUE_DAY,
    accountLabel: 'Checking ••1234 connected',
  }
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

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chips, setChips] = useState<string[]>([])
  const [lastSource, setLastSource] = useState<'live' | 'scripted' | null>(null)
  const [chatCollapsed, setChatCollapsed] = useState(false)
  const [pendingBoot, setPendingBoot] = useState<string[] | null>([...WELCOME_SEQUENCE])

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

  const submitMaintenanceRequest = useCallback(() => {
    const ticketId = `WO-${Math.floor(10000 + Math.random() * 90000)}`
    setMaintenanceDraft((prev) => ({ ...prev, ticketId }))
    setMaintenancePhase('submitted')
    return ticketId
  }, [])

  const resetMaintenance = useCallback(() => {
    setMaintenancePhase('listening')
    setMaintenanceDraft(emptyDraft())
  }, [])

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
    setMessages([])
    setChips([])
    setLastSource(null)
    setChatCollapsed(false)
    setPendingBoot([...WELCOME_SEQUENCE])
  }, [])

  const seedForScene = useCallback((scene: GuideScene) => {
    setMessages([])
    setChips([])
    setLastSource(null)
    setChatCollapsed(false)
    setMaintenancePhase('listening')
    setMaintenanceDraft(emptyDraft())

    switch (scene) {
      case 'welcome':
        setPhotos([])
        setPhotosDone(false)
        setNotifications(EMPTY_NOTIFICATIONS)
        setNotificationsDone(false)
        setAutopay(null)
        setPendingBoot([...WELCOME_SEQUENCE])
        break
      case 'checklist':
        setPhotos([])
        setPhotosDone(false)
        setNotifications(EMPTY_NOTIFICATIONS)
        setNotificationsDone(false)
        setAutopay(null)
        setPendingBoot([
          "I'm here while you work through the checklist. Ask about photos, notifications, or autopay anytime.",
        ])
        break
      case 'complete': {
        setPhotos(buildRoomPhotos())
        setPhotosDone(true)
        setNotifications(seedNotifications())
        setNotificationsDone(true)
        setAutopay(seedAutopay())
        setPendingBoot([...COMPLETE_SEED_MESSAGES])
        break
      }
      case 'maintenance':
        setPhotos(buildRoomPhotos())
        setPhotosDone(true)
        setNotifications(seedNotifications())
        setNotificationsDone(true)
        setAutopay(seedAutopay())
        setMaintenancePhase('listening')
        setMaintenanceDraft(emptyDraft())
        setPendingBoot([...MAINTENANCE_PROACTIVE])
        break
      case 'nudges':
        // Opted in so the nudge sequence can reach them; photos still incomplete
        setPhotos([])
        setPhotosDone(false)
        setNotifications(seedNotifications())
        setNotificationsDone(true)
        setAutopay(null)
        setPendingBoot([...NUDGES_SEED_MESSAGES])
        break
      case 'measure':
        setPhotos(buildRoomPhotos())
        setPhotosDone(true)
        setNotifications(seedNotifications())
        setNotificationsDone(true)
        setAutopay(seedAutopay())
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
      submitMaintenanceRequest,
      resetMaintenance,
      messages,
      chips,
      lastSource,
      chatCollapsed,
      pendingBoot,
      setMessages,
      setChips,
      setLastSource,
      setChatCollapsed,
      clearPendingBoot,
      resetDemo,
      seedForScene,
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
      submitMaintenanceRequest,
      resetMaintenance,
      messages,
      chips,
      lastSource,
      chatCollapsed,
      pendingBoot,
      clearPendingBoot,
      resetDemo,
      seedForScene,
    ],
  )

  return <ChecklistContext.Provider value={value}>{children}</ChecklistContext.Provider>
}

export function useChecklist() {
  const ctx = useContext(ChecklistContext)
  if (!ctx) throw new Error('useChecklist must be used within ChecklistProvider')
  return ctx
}
