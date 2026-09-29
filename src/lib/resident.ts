export const RESIDENT = {
  firstName: 'Jordan',
  lastName: 'Hale',
  fullName: 'Jordan Hale',
  unit: 'Apt 4B',
  community: 'Oak Street Residences',
  email: 'jordan.hale@email.com',
  phoneDisplay: '(415) 555-4821',
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

/** Lease rent due date — autopay drafts on this day (not a resident choice). */
export const RENT_DUE_DAY = 1 as const
