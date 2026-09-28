export const RESIDENT = {
  firstName: 'Jordan',
  lastName: 'Hale',
  fullName: 'Jordan Hale',
  unit: 'Apt 4B',
  community: 'Oak Street Residences',
} as const

export const ROOM_LABELS = [
  'Kitchen',
  'Living room',
  'Bedroom',
  'Bathroom',
  'Entry',
  'Hallway',
  'Dining area',
  'Balcony',
] as const

export const BANK_ACCOUNTS = [
  { id: 'chk-4821', label: 'Checking ··4821', bank: 'First Oak Bank' },
  { id: 'sav-0193', label: 'Savings ··0193', bank: 'First Oak Bank' },
] as const

export const DRAFT_DAYS = [1, 5, 15] as const
