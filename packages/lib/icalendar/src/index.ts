import ICAL from "ical.js"

export type CalendarDate = { value: string; zone: string }
export type CalendarEvent = {
  title: string
  start?: CalendarDate
  end?: CalendarDate
  location: string
  description: string
  recurrence: string
  duration?: string
  timeZones?: string[]
  recurrenceId?: CalendarDate
  uid: string
}

export function isCalendarDate(value: string): boolean {
  const match = /^(\d{4}-\d{2}-\d{2})(?:T(\d{2}:\d{2}:\d{2})(Z)?)?$/.exec(value)
  if (!match || match[1]!.startsWith("0000")) return false
  const canonical = match[1] + "T" + (match[2] ?? "00:00:00") + ".000Z"
  const parsed = new Date(canonical)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString() === canonical
}

function day(event: typeof ICAL.Component.prototype, name: string) {
  const property = event.getFirstProperty(name)
  if (!property) return undefined
  const value = property.toJSON()[3] as string
  const zone = String(property.getParameter("tzid") ?? "")
  if (!isCalendarDate(value)) throw new Error("Invalid iCalendar date")
  return { value, zone }
}

function durationEnd(
  event: typeof ICAL.Component.prototype,
  start: CalendarDate
) {
  const delta = event.getFirstPropertyValue("duration")
  if (!(delta instanceof ICAL.Duration)) return undefined
  if (
    delta.isNegative ||
    (start.value.length === 10 &&
      (delta.hours || delta.minutes || delta.seconds))
  ) {
    throw new Error("Invalid iCalendar event duration")
  }
  const time = event.getFirstPropertyValue(
    "dtstart"
  ) as typeof ICAL.Time.prototype
  const local = time.clone()
  local.day += delta.weeks * 7 + delta.days
  // An embedded VTIMEZONE lets ical.js account for offset changes in the exact part.
  if (
    start.zone &&
    local.zone === ICAL.Timezone.localTimezone &&
    (delta.hours || delta.minutes || delta.seconds)
  )
    return undefined
  const exact = local.convertToZone(ICAL.Timezone.utcTimezone)
  exact.adjust(0, delta.hours, delta.minutes, delta.seconds)
  const value = exact.convertToZone(local.zone).toString()
  if (!isCalendarDate(value)) throw new Error("Invalid iCalendar duration")
  return { value, zone: start.zone }
}

function readEvent(
  event: typeof ICAL.Component.prototype,
  zones: Map<string, string>
): CalendarEvent {
  const text = (name: string) => String(event.getFirstPropertyValue(name) ?? "")
  const start = day(event, "dtstart")
  const end = day(event, "dtend") ?? (start && durationEnd(event, start))
  if (
    start &&
    end &&
    (start.value.length === 10) !== (end.value.length === 10)
  ) {
    throw new Error("iCalendar start and end must have the same value type")
  }
  const recurrenceId = day(event, "recurrence-id")
  const timeZones = [
    ...new Set([start?.zone, end?.zone, recurrenceId?.zone]),
  ].flatMap((zone) => (zone && zones.has(zone) ? [zones.get(zone)!] : []))
  return {
    title: text("summary"),
    start,
    end,
    location: text("location"),
    description: text("description"),
    recurrence: text("rrule"),
    recurrenceId,
    uid: text("uid"),
    duration: text("duration") || undefined,
    timeZones: timeZones.length ? timeZones : undefined,
  }
}

export function readCalendar(source: string): CalendarEvent[] {
  const parsed = ICAL.parse(source.trim()) as unknown[]
  const entries = (Array.isArray(parsed[0]) ? parsed : [parsed]) as unknown[][]
  const components = entries
    .map((component) => new ICAL.Component(component))
    .filter((component) => component.name === "vcalendar")
  if (!components.length) throw new Error("Expected an iCalendar file")
  return components.flatMap((calendar) => {
    const zones = new Map(
      calendar
        .getAllSubcomponents("vtimezone")
        .map((zone) => [
          String(zone.getFirstPropertyValue("tzid")),
          zone.toString(),
        ])
    )
    return calendar
      .getAllSubcomponents("vevent")
      .map((event) => readEvent(event, zones))
  })
}

export function shiftDate(value: string, days: number): string {
  const date = new Date(value + "T00:00:00Z")
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}
