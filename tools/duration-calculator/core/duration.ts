type DurationParts = Readonly<{
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}>

type ParsedDuration = Readonly<{
  parts: DurationParts
  sign: 1 | -1
}>

const MS_PER_SECOND = 1_000
const MS_PER_MINUTE = 60 * MS_PER_SECOND
const MS_PER_HOUR = 60 * MS_PER_MINUTE
const MS_PER_DAY = 24 * MS_PER_HOUR

function toInteger(value: number) {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.trunc(value)
}

function durationPartsToMilliseconds(parts: DurationParts) {
  return (
    toInteger(parts.days) * MS_PER_DAY +
    toInteger(parts.hours) * MS_PER_HOUR +
    toInteger(parts.minutes) * MS_PER_MINUTE +
    toInteger(parts.seconds) * MS_PER_SECOND +
    toInteger(parts.milliseconds)
  )
}

function millisecondsToDurationParts(totalMs: number): DurationParts {
  let remaining = Math.max(0, Math.trunc(totalMs))
  const days = Math.floor(remaining / MS_PER_DAY)
  remaining -= days * MS_PER_DAY
  const hours = Math.floor(remaining / MS_PER_HOUR)
  remaining -= hours * MS_PER_HOUR
  const minutes = Math.floor(remaining / MS_PER_MINUTE)
  remaining -= minutes * MS_PER_MINUTE
  const seconds = Math.floor(remaining / MS_PER_SECOND)
  remaining -= seconds * MS_PER_SECOND

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds: remaining,
  }
}

function normalizeDurationParts(parts: DurationParts) {
  return millisecondsToDurationParts(
    Math.abs(durationPartsToMilliseconds(parts))
  )
}

function parseIsoDuration(value: string): ParsedDuration | null {
  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const match = trimmed.match(
    /^([+-])?P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:[.,]\d{1,3})?)S)?)?$/i
  )

  if (!match) {
    return null
  }

  const sign: 1 | -1 = match[1] === "-" ? -1 : 1
  const days = match[2] ? Number(match[2]) : 0
  const hours = match[3] ? Number(match[3]) : 0
  const minutes = match[4] ? Number(match[4]) : 0

  let seconds = 0
  let milliseconds = 0

  if (match[5]) {
    const [secondsPart, fractionPart] = match[5].split(/[.,]/)
    seconds = Number(secondsPart)

    if (fractionPart) {
      milliseconds = Number(fractionPart.padEnd(3, "0").slice(0, 3))
    }
  }

  if (!(match[2] || match[3] || match[4] || match[5])) {
    return null
  }

  return {
    sign,
    parts: normalizeDurationParts({
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
    }),
  }
}

function formatIsoDuration(parts: DurationParts, sign: 1 | -1 = 1) {
  const normalized = normalizeDurationParts(parts)
  const dayPart = normalized.days ? `${normalized.days}D` : ""
  const timeParts: string[] = []

  if (normalized.hours) {
    timeParts.push(`${normalized.hours}H`)
  }

  if (normalized.minutes) {
    timeParts.push(`${normalized.minutes}M`)
  }

  if (normalized.seconds || normalized.milliseconds) {
    const secondsValue = normalized.milliseconds
      ? `${normalized.seconds}.${String(normalized.milliseconds).padStart(3, "0")}`
      : String(normalized.seconds)

    timeParts.push(`${secondsValue}S`)
  }

  const timePart = timeParts.length ? `T${timeParts.join("")}` : ""
  const core = dayPart || timePart ? `P${dayPart}${timePart}` : "PT0S"

  return sign < 0 ? `-${core}` : core
}

export {
  durationPartsToMilliseconds,
  formatIsoDuration,
  millisecondsToDurationParts,
  normalizeDurationParts,
  parseIsoDuration,
}
export type { DurationParts }
