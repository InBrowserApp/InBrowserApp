import ICAL from "ical.js"
import type { CalendarDate, CalendarEvent } from "./index"

export function readRule(value: string) {
  if (!value || /[\r\n]/.test(value)) throw new Error("Invalid recurrence rule")
  for (const [, amount] of value.matchAll(
    /(?:^|;)(?:COUNT|INTERVAL)=(-?\d+)(?=;|$)/gi
  )) {
    if (Number(amount) <= 0) throw new Error("Invalid recurrence rule")
  }
  const rule = ICAL.Recur.fromString(value)
  if (!rule.freq) throw new Error("Recurrence rule requires FREQ")
  return rule
}

export function readDuration(value: string, dateOnly: boolean) {
  if (
    !/^\+?P(?:\d+W|\d+D|(?:\d+D)?T(?=\d)(?:\d+H)?(?:\d+M)?(?:\d+S)?)$/.test(
      value
    ) ||
    (dateOnly && value.includes("T"))
  ) {
    throw new Error("Invalid event duration")
  }
  const duration = ICAL.Duration.fromString(value)
  const seconds = duration.toSeconds()
  if (!Number.isFinite(seconds) || seconds <= 0) {
    throw new Error("An event duration must be positive")
  }
  return duration
}

function addTimeZones(
  calendar: InstanceType<typeof ICAL.Component>,
  events: CalendarEvent[]
) {
  const definitions = new Set(events.flatMap((event) => event.timeZones ?? []))
  const zones = new Map<string, string>()
  for (const definition of definitions) {
    const zone = new ICAL.Component(ICAL.parse(definition))
    const id = zone.getFirstPropertyValue("tzid")
    if (zone.name !== "vtimezone" || typeof id !== "string" || !id) {
      throw new Error("Invalid VTIMEZONE definition")
    }
    const canonical = zone.toString()
    const previous = zones.get(id)
    if (previous === canonical) continue
    if (previous) throw new Error("Conflicting VTIMEZONE definitions")
    zones.set(id, canonical)
    calendar.addSubcomponent(zone)
  }
}

export function writeCalendar(
  events: CalendarEvent[],
  now = new Date()
): string {
  const calendar = new ICAL.Component("vcalendar")
  calendar.addPropertyWithValue("version", "2.0")
  calendar.addPropertyWithValue(
    "prodid",
    "-//InBrowser.App//ICS CSV Converter//EN"
  )
  addTimeZones(calendar, events)
  const timestamp = ICAL.Time.fromString(
    now.toISOString().replace(/\.\d+Z$/, "Z"),
    undefined
  )

  for (const event of events) {
    const component = new ICAL.Component("vevent")
    const date = (name: string, date?: CalendarDate) => {
      if (!date) return
      const property = component.addPropertyWithValue(
        name,
        ICAL.Time.fromString(date.value, undefined)
      )
      if (date.zone) property.setParameter("tzid", date.zone)
    }
    component.addPropertyWithValue(
      "uid",
      (event.uid || globalThis.crypto.randomUUID() + "@inbrowser.app").replace(
        /[\r\n]/g,
        ""
      )
    )
    component.addPropertyWithValue("dtstamp", timestamp)
    date("dtstart", event.start)
    if (event.duration) {
      component.addPropertyWithValue(
        "duration",
        readDuration(event.duration, event.start?.value.length === 10)
      )
    } else {
      date("dtend", event.end)
    }
    date("recurrence-id", event.recurrenceId)
    for (const [name, text] of [
      ["summary", event.title],
      ["location", event.location],
      ["description", event.description],
    ] as const) {
      if (text)
        component.addPropertyWithValue(name, text.replace(/\r\n?/g, "\n"))
    }
    if (event.recurrence)
      component.addPropertyWithValue("rrule", readRule(event.recurrence))
    calendar.addSubcomponent(component)
  }
  return ICAL.stringify(calendar.toJSON())
}
