type TimestampUnit = "auto" | "seconds" | "milliseconds" | "nanoseconds"
type ResolvedTimestampUnit = Exclude<TimestampUnit, "auto">

function parseTimestampInput(value: string) {
  const trimmed = value.trim()

  if (trimmed.length === 0) {
    return null
  }

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function countTimestampDigits(value: number) {
  return String(Math.abs(Math.floor(value))).length
}

function detectTimestampUnit(value: number): ResolvedTimestampUnit {
  const digitCount = countTimestampDigits(value)

  if (digitCount <= 10) {
    return "seconds"
  }

  if (digitCount <= 13) {
    return "milliseconds"
  }

  return "nanoseconds"
}

function resolveTimestampUnit(
  unit: TimestampUnit,
  value: number
): ResolvedTimestampUnit {
  return unit === "auto" ? detectTimestampUnit(value) : unit
}

function toMilliseconds(value: number, unit: ResolvedTimestampUnit) {
  switch (unit) {
    case "seconds":
      return value * 1000
    case "milliseconds":
      return value
    case "nanoseconds":
      return Math.floor(value / 1_000_000)
  }
}

function fromMilliseconds(value: number, unit: ResolvedTimestampUnit) {
  switch (unit) {
    case "seconds":
      return Math.floor(value / 1000)
    case "milliseconds":
      return value
    case "nanoseconds":
      return value * 1_000_000
  }
}

function convertTimestampUnit(
  value: number,
  fromUnit: ResolvedTimestampUnit,
  toUnit: ResolvedTimestampUnit
) {
  return fromMilliseconds(toMilliseconds(value, fromUnit), toUnit)
}

export {
  convertTimestampUnit,
  countTimestampDigits,
  detectTimestampUnit,
  fromMilliseconds,
  parseTimestampInput,
  resolveTimestampUnit,
  toMilliseconds,
}
export type { ResolvedTimestampUnit, TimestampUnit }
