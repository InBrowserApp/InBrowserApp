const DATE_TIME_LOCAL_PATTERN =
  /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})T(?<hour>\d{2}):(?<minute>\d{2})(?::(?<second>\d{2})(?:\.(?<millisecond>\d{1,3}))?)?$/u

const RELATIVE_TIME_STEPS = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["week", 7 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
  ["second", 1000],
] as const

function padNumber(value: number, length: number) {
  return String(value).padStart(length, "0")
}

function formatDateTimeLocalInput(valueMs: number) {
  const value = new Date(valueMs)

  return `${padNumber(value.getFullYear(), 4)}-${padNumber(value.getMonth() + 1, 2)}-${padNumber(value.getDate(), 2)}T${padNumber(value.getHours(), 2)}:${padNumber(value.getMinutes(), 2)}:${padNumber(value.getSeconds(), 2)}.${padNumber(value.getMilliseconds(), 3)}`
}

function parseDateTimeLocalInput(value: string) {
  const match = DATE_TIME_LOCAL_PATTERN.exec(value)

  if (!match?.groups) {
    return null
  }

  const year = Number.parseInt(match.groups.year!, 10)
  const month = Number.parseInt(match.groups.month!, 10)
  const day = Number.parseInt(match.groups.day!, 10)
  const hour = Number.parseInt(match.groups.hour!, 10)
  const minute = Number.parseInt(match.groups.minute!, 10)
  const second = Number.parseInt(match.groups.second ?? "0", 10)
  const millisecond = Number.parseInt(
    (match.groups.millisecond ?? "0").padEnd(3, "0"),
    10
  )
  const parsed = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    millisecond
  )

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hour ||
    parsed.getMinutes() !== minute ||
    parsed.getSeconds() !== second ||
    parsed.getMilliseconds() !== millisecond
  ) {
    return null
  }

  return parsed.getTime()
}

function formatLocalDateTimeDisplay(valueMs: number, language: string) {
  return new Date(valueMs).toLocaleString(language, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function formatRelativeTime(targetMs: number, nowMs: number, language: string) {
  const diffMs = targetMs - nowMs
  const formatter = new Intl.RelativeTimeFormat(language, { numeric: "auto" })

  for (const [unit, sizeMs] of RELATIVE_TIME_STEPS) {
    if (Math.abs(diffMs) >= sizeMs || unit === "second") {
      return formatter.format(Math.round(diffMs / sizeMs), unit)
    }
  }

  return formatter.format(0, "second")
}

export {
  formatDateTimeLocalInput,
  formatLocalDateTimeDisplay,
  formatRelativeTime,
  parseDateTimeLocalInput,
}
