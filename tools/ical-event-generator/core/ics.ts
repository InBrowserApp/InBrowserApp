export type IcsDateValue = Readonly<{
  type: "date" | "date-time"
  value: string
  tzid?: string
}>

type IcsAlarm = Readonly<{
  trigger: string
  description?: string
}>

type IcsEvent = Readonly<{
  uid: string
  dtstamp: string
  summary?: string
  description?: string
  location?: string
  url?: string
  dtstart: IcsDateValue
  dtend?: IcsDateValue
  rrule?: string
  alarms?: readonly IcsAlarm[]
}>

type IcsCalendarOptions = Readonly<{
  prodId?: string
  name?: string
  timeZone?: string
}>

type RecurrenceRuleInput = Readonly<{
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
  interval?: number
  byDay?: readonly string[]
  byMonthDay?: number
  byMonth?: number
  count?: number
  until?: string
}>

export type ReminderUnit = "minutes" | "hours" | "days" | "weeks"

export type DateOnlyParts = Readonly<{
  year: number
  month: number
  day: number
}>

export type DateTimeParts = DateOnlyParts &
  Readonly<{
    hour: number
    minute: number
    second: number
    millisecond: number
  }>

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\n|\r/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
}

function foldLine(line: string, limit = 75): string {
  if (line.length <= limit) {
    return line
  }

  const segments = [line.slice(0, limit)]
  let offset = limit
  const continuationLimit = Math.max(limit - 1, 1)

  while (offset < line.length) {
    segments.push(` ${line.slice(offset, offset + continuationLimit)}`)
    offset += continuationLimit
  }

  return segments.join("\r\n")
}

function buildDateLine(name: string, value: IcsDateValue): string {
  if (value.type === "date") {
    return `${name};VALUE=DATE:${value.value}`
  }

  if (value.tzid) {
    return `${name};TZID=${value.tzid}:${value.value}`
  }

  return `${name}:${value.value}`
}

function formatIcsDate(parts: DateOnlyParts): string {
  const year = String(parts.year).padStart(4, "0")
  const month = String(parts.month).padStart(2, "0")
  const day = String(parts.day).padStart(2, "0")

  return `${year}${month}${day}`
}

function formatIcsDateTime(parts: Omit<DateTimeParts, "millisecond">): string {
  const date = formatIcsDate(parts)
  const hour = String(parts.hour).padStart(2, "0")
  const minute = String(parts.minute).padStart(2, "0")
  const second = String(parts.second).padStart(2, "0")

  return `${date}T${hour}${minute}${second}`
}

function formatUtcDateTime(timestampMs: number): string {
  const date = new Date(timestampMs)

  return (
    formatIcsDateTime({
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      hour: date.getUTCHours(),
      minute: date.getUTCMinutes(),
      second: date.getUTCSeconds(),
    }) + "Z"
  )
}

function buildRrule(input: RecurrenceRuleInput): string {
  const parts = [`FREQ=${input.frequency}`]

  if (input.interval && input.interval !== 1) {
    parts.push(`INTERVAL=${input.interval}`)
  }

  if (input.byDay?.length) {
    parts.push(`BYDAY=${input.byDay.join(",")}`)
  }

  if (input.byMonthDay) {
    parts.push(`BYMONTHDAY=${input.byMonthDay}`)
  }

  if (input.byMonth) {
    parts.push(`BYMONTH=${input.byMonth}`)
  }

  if (input.count) {
    parts.push(`COUNT=${input.count}`)
  }

  if (input.until) {
    parts.push(`UNTIL=${input.until}`)
  }

  return parts.join(";")
}

function formatTrigger(amount: number, unit: ReminderUnit): string {
  if (!Number.isFinite(amount) || amount <= 0) {
    return ""
  }

  const rounded = Math.floor(amount)

  switch (unit) {
    case "minutes":
      return `-PT${rounded}M`
    case "hours":
      return `-PT${rounded}H`
    case "days":
      return `-P${rounded}D`
    case "weeks":
      return `-P${rounded}W`
  }
}

function buildIcsCalendar(
  event: IcsEvent,
  options: IcsCalendarOptions = {}
): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${options.prodId ?? "-//inbrowser.app//ical-event-generator//EN"}`,
    "CALSCALE:GREGORIAN",
  ]

  if (options.name) {
    lines.push(`X-WR-CALNAME:${escapeIcsText(options.name)}`)
  }

  if (options.timeZone) {
    lines.push(`X-WR-TIMEZONE:${options.timeZone}`)
  }

  lines.push("BEGIN:VEVENT")
  lines.push(`UID:${event.uid}`)
  lines.push(`DTSTAMP:${event.dtstamp}`)
  lines.push(buildDateLine("DTSTART", event.dtstart))

  if (event.dtend) {
    lines.push(buildDateLine("DTEND", event.dtend))
  }

  if (event.summary) {
    lines.push(`SUMMARY:${escapeIcsText(event.summary)}`)
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeIcsText(event.location)}`)
  }

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`)
  }

  if (event.url) {
    lines.push(`URL:${escapeIcsText(event.url)}`)
  }

  if (event.rrule) {
    lines.push(`RRULE:${event.rrule}`)
  }

  for (const alarm of event.alarms ?? []) {
    lines.push("BEGIN:VALARM")
    lines.push("ACTION:DISPLAY")
    lines.push(`TRIGGER:${alarm.trigger}`)

    if (alarm.description) {
      lines.push(`DESCRIPTION:${escapeIcsText(alarm.description)}`)
    }

    lines.push("END:VALARM")
  }

  lines.push("END:VEVENT", "END:VCALENDAR")

  const folded = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => foldLine(line))
    .join("\r\n")

  return `${folded}\r\n`
}

export {
  buildIcsCalendar,
  buildRrule,
  escapeIcsText,
  foldLine,
  formatIcsDate,
  formatIcsDateTime,
  formatTrigger,
  formatUtcDateTime,
}
