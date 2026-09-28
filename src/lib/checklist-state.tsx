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
  WELCOME_SEQUENCE,
} from '@/lib/guide-scripts'
import { BANK_ACCOUNTS, ROOM_LABELS } from '@/lib/resident'

export type UnitPhoto = {
  id: string
  src: string
  label: string
  takenAt: string
}

export type HouseholdMember = {
  id: string
  name: string
  relationship: string
}

export type AutopayInfo = {
  accountId: string
  accountLabel: string
  draftDay: number
}

export type ChatMessage = {
  id: string
  role: 'assistant' | 'user'
  content: string
  source?: 'live' | 'scripted'
}

export type MaintenancePriority = 'emergency' | 'routine' | null

export type ChecklistState = {
  photos: UnitPhoto[]
  household: HouseholdMember[]
  autopay: AutopayInfo | null
  photosDone: boolean
  householdDone: boolean
  autopayDone: boolean
  completedCount: number
  totalCount: number
  allDone: boolean
  addRoomPhotos: () => void
  removePhoto: (id: string) => void
  completePhotos: () => void
  addHouseholdMember: (name: string, relationship: string) => void
  removeHouseholdMember: (id: string) => void
  completeHousehold: () => void
  completeAutopay: (info: AutopayInfo) => void
  // Maintenance scene
  maintenancePriority: MaintenancePriority
  maintenanceSubmitted: boolean
  setMaintenancePriority: (p: MaintenancePriority) => void
  setMaintenanceSubmitted: (v: boolean) => void
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

function buildRoomPhotos(takenAt = new Date().toISOString()): UnitPhoto[] {
  return ROOM_LABELS.map((label, i) => ({
    id: crypto.randomUUID(),
    src: `/rooms/room-${i + 1}.jpg`,
    label,
    takenAt,
  }))
}

function seedHousehold(): HouseholdMember[] {
  return [{ id: crypto.randomUUID(), name: 'Alex Hale', relationship: 'Spouse/Partner' }]
}

function seedAutopay(): AutopayInfo {
  const account = BANK_ACCOUNTS[0]
  return {
    accountId: account.id,
    accountLabel: account.label,
    draftDay: 1,
  }
}

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<UnitPhoto[]>([])
  const [photosDone, setPhotosDone] = useState(false)
  const [household, setHousehold] = useState<HouseholdMember[]>([])
  const [householdDone, setHouseholdDone] = useState(false)
  const [autopay, setAutopay] = useState<AutopayInfo | null>(null)

  const [maintenancePriority, setMaintenancePriority] = useState<MaintenancePriority>(null)
  const [maintenanceSubmitted, setMaintenanceSubmitted] = useState(false)

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

  const addHouseholdMember = useCallback((name: string, relationship: string) => {
    setHousehold((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: name.trim(), relationship: relationship.trim() },
    ])
  }, [])

  const removeHouseholdMember = useCallback((id: string) => {
    setHousehold((prev) => prev.filter((m) => m.id !== id))
    setHouseholdDone(false)
  }, [])

  const completeHousehold = useCallback(() => {
    setHouseholdDone(true)
  }, [])

  const completeAutopay = useCallback((info: AutopayInfo) => {
    setAutopay(info)
  }, [])

  const clearPendingBoot = useCallback(() => {
    setPendingBoot(null)
  }, [])

  const resetDemo = useCallback(() => {
    setPhotos([])
    setPhotosDone(false)
    setHousehold([])
    setHouseholdDone(false)
    setAutopay(null)
    setMaintenancePriority(null)
    setMaintenanceSubmitted(false)
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
    setMaintenancePriority(null)
    setMaintenanceSubmitted(false)

    switch (scene) {
      case 'welcome':
        setPhotos([])
        setPhotosDone(false)
        setHousehold([])
        setHouseholdDone(false)
        setAutopay(null)
        setPendingBoot([...WELCOME_SEQUENCE])
        break
      case 'checklist':
        setPhotos([])
        setPhotosDone(false)
        setHousehold([])
        setHouseholdDone(false)
        setAutopay(null)
        setPendingBoot([
          "I'm here while you work through the checklist. Ask about photos, household, or autopay anytime.",
        ])
        break
      case 'complete': {
        const takenAt = new Date().toISOString()
        setPhotos(buildRoomPhotos(takenAt))
        setPhotosDone(true)
        setHousehold(seedHousehold())
        setHouseholdDone(true)
        setAutopay(seedAutopay())
        setPendingBoot([...COMPLETE_SEED_MESSAGES])
        break
      }
      case 'maintenance':
        setPhotos(buildRoomPhotos())
        setPhotosDone(true)
        setHousehold(seedHousehold())
        setHouseholdDone(true)
        setAutopay(seedAutopay())
        setPendingBoot([...MAINTENANCE_PROACTIVE])
        break
    }
  }, [])

  const autopayDone = autopay !== null
  const completedCount = [photosDone, householdDone, autopayDone].filter(Boolean).length
  const totalCount = 3
  const allDone = completedCount === totalCount

  const value = useMemo(
    () => ({
      photos,
      household,
      autopay,
      photosDone,
      householdDone,
      autopayDone,
      completedCount,
      totalCount,
      allDone,
      addRoomPhotos,
      removePhoto,
      completePhotos,
      addHouseholdMember,
      removeHouseholdMember,
      completeHousehold,
      completeAutopay,
      maintenancePriority,
      maintenanceSubmitted,
      setMaintenancePriority,
      setMaintenanceSubmitted,
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
      household,
      autopay,
      photosDone,
      householdDone,
      autopayDone,
      completedCount,
      allDone,
      addRoomPhotos,
      removePhoto,
      completePhotos,
      addHouseholdMember,
      removeHouseholdMember,
      completeHousehold,
      completeAutopay,
      maintenancePriority,
      maintenanceSubmitted,
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
