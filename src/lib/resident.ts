export const RESIDENT = {
  firstName: 'Jordan',
  lastName: 'Hale',
  fullName: 'Jordan Hale',
  unit: 'Apt 4B',
  community: 'Oak Street Residences',
  city: 'Oakland, CA',
  /** Static mock weather for the Dashboard hero — not a live API. */
  weather: '72°F, Sunny',
  email: 'jordan.hale@email.com',
  phoneDisplay: '(415) 555-4821',
} as const

/** Static property management contact — Contact page only. */
export const PROPERTY_CONTACT = {
  managerName: 'Maya Chen',
  managerTitle: 'Property Manager',
  phoneDisplay: '(415) 555-0198',
  email: 'maya.chen@oakstreetresidences.com',
  officeHours: 'Mon-Fri, 9am-5pm',
  emergencyLine: '(415) 555-0142',
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
