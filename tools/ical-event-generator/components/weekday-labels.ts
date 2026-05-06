const WEEKDAY_REFERENCE_DATES = [
  new Date(Date.UTC(2026, 0, 5)),
  new Date(Date.UTC(2026, 0, 6)),
  new Date(Date.UTC(2026, 0, 7)),
  new Date(Date.UTC(2026, 0, 8)),
  new Date(Date.UTC(2026, 0, 9)),
  new Date(Date.UTC(2026, 0, 10)),
  new Date(Date.UTC(2026, 0, 11)),
] as const

const FALLBACK_WEEKDAY_LABELS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const

function buildWeekdayLabels(language: string) {
  try {
    const formatter = new Intl.DateTimeFormat(language, {
      timeZone: "UTC",
      weekday: "short",
    })

    return WEEKDAY_REFERENCE_DATES.map((date) => formatter.format(date))
  } catch {
    return FALLBACK_WEEKDAY_LABELS
  }
}

export { buildWeekdayLabels }
