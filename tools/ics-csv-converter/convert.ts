import {
  isCalendarDate,
  readCalendar,
  shiftDate,
  type CalendarDate,
  type CalendarEvent,
} from "@workspace/icalendar"
import {
  readDuration,
  readRule,
  writeCalendar,
} from "@workspace/icalendar/write"
import {
  CsvRowError,
  readCsv,
  writeCsv,
  type CsvColumn,
} from "@workspace/record-csv"

const outputColumns = [
  ["Title", "Subject", "Summary", "Event", "Event Title"],
  ["Start", "Start Date", "Start DateTime"],
  ["End", "End DateTime"],
  ["Time Zone", "Start Time Zone", "Timezone", "TZID"],
  "End Time Zone",
  "Location",
  ["Description", "Notes"],
  ["Recurrence", "RRULE"],
  "UID",
  "Recurrence ID",
  "Recurrence ID Time Zone",
  "Duration",
  "Time Zone Definitions",
] as const satisfies readonly CsvColumn[]

const inputColumns = [
  ...outputColumns,
  "Start Time",
  "End Date",
  "End Time",
  "All Day Event",
] as const

const headers = outputColumns.map((column) =>
  typeof column === "string" ? column : column[0]
)

function preview(events: CalendarEvent[]) {
  return {
    headers: ["Title", "Start", "End", "Location"],
    rows: events.map(({ title, start, end, location }) => [
      title,
      withZone(start),
      withZone(end),
      location,
    ]),
  }
}

function withZone(date?: CalendarDate) {
  return date ? [date.value, date.zone].filter(Boolean).join(" ") : ""
}

function exportEndZone({ start, end }: CalendarEvent) {
  if (!end || end.zone === start?.zone) return ""
  return end.zone || "Floating"
}

export function icsToCsv(source: string) {
  const events = readCalendar(source)
  const rows = events.map((event) => [
    event.title,
    event.start?.value ?? "",
    event.end?.value ?? "",
    event.start?.zone ?? "",
    exportEndZone(event),
    event.location,
    event.description,
    event.recurrence,
    event.uid,
    event.recurrenceId?.value ?? "",
    event.recurrenceId?.zone ?? "",
    event.duration ?? "",
    event.timeZones?.length ? JSON.stringify(event.timeZones) : "",
  ])
  return { ...preview(events), output: writeCsv(headers, rows) }
}

function readDate(value: string, time: string, zone: string): CalendarDate {
  const localDate = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value)
  let iso = localDate
    ? `${localDate[3]}-${localDate[1]!.padStart(2, "0")}-${localDate[2]!.padStart(2, "0")}`
    : value

  if (time) {
    const clock = /^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*(AM|PM))?$/i.exec(time)
    if (iso.length !== 10 || !clock) throw new Error("Invalid time")
    const [, hours = "", minutes, seconds = "00", meridiem = ""] = clock
    const hour = Number(hours)
    if (meridiem && (hour < 1 || hour > 12)) throw new Error("Invalid hour")
    const hour24 = meridiem
      ? (hour % 12) + (meridiem.toUpperCase() === "PM" ? 12 : 0)
      : hour
    iso += `T${String(hour24).padStart(2, "0")}:${minutes}:${seconds}`
  }

  iso = iso
    .replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})/, "$1T$2")
    .replace(/(T\d{2}:\d{2})(Z?)$/, "$1:00$2")
  if (!isCalendarDate(iso) || /[\r\n]/.test(zone))
    throw new Error("Invalid date")
  if (iso.length === 10 || iso.endsWith("Z") || /^floating$/i.test(zone)) {
    return { value: iso, zone: "" }
  }
  if (/^(utc|gmt)$/i.test(zone)) return { value: iso + "Z", zone: "" }
  return { value: iso, zone }
}

function readTimeZones(source: string): string[] {
  if (!source) return []
  const definitions: unknown = JSON.parse(source)
  if (
    !Array.isArray(definitions) ||
    !definitions.every((value) => typeof value === "string")
  ) {
    throw new Error("Expected a list of time zone definitions")
  }
  return definitions
}

function readEvent(values: string[]): CalendarEvent {
  const [
    title = "",
    begin = "",
    finish = "",
    zone = "",
    endZone = "",
    location = "",
    description = "",
    recurrence = "",
    uid = "",
    occurrence = "",
    occurrenceZone = "",
    duration = "",
    definitions = "",
    startTime = "",
    googleEndDate = "",
    endTime = "",
    allDayFlag = "",
  ] = values

  const allDay = /^(true|yes|1)$/i.test(allDayFlag)
  const start = readDate(begin, allDay ? "" : startTime, zone)
  const endDate =
    finish ||
    googleEndDate ||
    (endTime && !allDay ? start.value.slice(0, 10) : "")
  let end = endDate
    ? readDate(endDate, allDay ? "" : endTime, endZone || zone)
    : undefined

  if (end && allDay && !finish && googleEndDate && end.value.length === 10) {
    end = readDate(shiftDate(end.value, 1), "", "")
  }

  const dateOnly = start.value.length === 10
  if (allDay && !dateOnly) throw new Error("All-day events require a date")
  if (
    end &&
    (dateOnly !== (end.value.length === 10) ||
      (!duration &&
        start.zone === end.zone &&
        start.value.endsWith("Z") === end.value.endsWith("Z") &&
        end.value <= start.value))
  ) {
    throw new Error("The end must follow the start and use the same date type")
  }
  const recurrenceId = occurrence
    ? readDate(occurrence, "", occurrenceZone)
    : undefined
  if (recurrenceId && !uid)
    throw new Error("An edited occurrence requires a UID")
  if (recurrence) readRule(recurrence)
  if (duration) readDuration(duration, dateOnly)
  return {
    title,
    start,
    end,
    location,
    description,
    recurrence,
    uid,
    recurrenceId,
    duration,
    timeZones: readTimeZones(definitions),
  }
}

export function csvToIcs(source: string) {
  const events = readCsv(source, inputColumns).map(({ row, values }) => {
    try {
      return readEvent(values)
    } catch {
      throw new CsvRowError(row)
    }
  })
  return { ...preview(events), output: writeCalendar(events) }
}
