import { MAX_CALENDAR_DAY_OFFSET } from "@workspace/calendar-date"

export function parseDayCount(value: string) {
  if (!/^\d+$/.test(value)) return null

  const days = Number(value)
  return days <= MAX_CALENDAR_DAY_OFFSET ? days : null
}

export function ageInFullYears(birthDate: Date, today: Date) {
  if (birthDate > today) return null

  const years = today.getUTCFullYear() - birthDate.getUTCFullYear()
  const anniversary = new Date(birthDate)
  anniversary.setUTCFullYear(today.getUTCFullYear())

  if (anniversary.getUTCMonth() !== birthDate.getUTCMonth()) {
    anniversary.setUTCDate(0)
  }

  return years - Number(today < anniversary)
}
