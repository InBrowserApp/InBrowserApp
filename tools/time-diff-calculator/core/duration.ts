type DurationParts = Readonly<{
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
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

function formatDurationLabel(parts: DurationParts) {
  const normalized = normalizeDurationParts(parts)
  const hours = String(normalized.hours).padStart(2, "0")
  const minutes = String(normalized.minutes).padStart(2, "0")
  const seconds = String(normalized.seconds).padStart(2, "0")
  const milliseconds = String(normalized.milliseconds).padStart(3, "0")

  return `${normalized.days}d ${hours}:${minutes}:${seconds}.${milliseconds}`
}

function formatFraction(value: number, digits: number) {
  if (!Number.isFinite(value)) {
    return ""
  }

  const fixed = value.toFixed(digits)

  return fixed.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1")
}

export {
  formatDurationLabel,
  formatFraction,
  formatIsoDuration,
  millisecondsToDurationParts,
}
