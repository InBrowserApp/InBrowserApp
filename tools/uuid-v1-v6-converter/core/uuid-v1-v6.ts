const UUID_CANONICAL_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const UUID_COMPACT_PATTERN = /^[0-9a-f]{32}$/i
const UUID_VARIANT_PATTERN = /^[89ab]$/i

type UuidVersion = "v1" | "v6"
type UuidConversionDirection = "v1-to-v6" | "v6-to-v1"
type UuidParseError = "empty" | "format" | "version" | "variant"

type UuidParseResult =
  | Readonly<{ kind: "invalid"; error: UuidParseError }>
  | Readonly<{ kind: "valid"; compact: string; uuid: string }>

type UuidConversionResult =
  | Readonly<{ kind: "empty" }>
  | Readonly<{ kind: "invalid"; error: Exclude<UuidParseError, "empty"> }>
  | Readonly<{ kind: "valid"; input: string; output: string }>

function stripUuidDecorators(value: string) {
  let normalized = value.trim()

  if (normalized.startsWith("{") && normalized.endsWith("}")) {
    normalized = normalized.slice(1, -1).trim()
  }

  if (normalized.toLowerCase().startsWith("urn:uuid:")) {
    normalized = normalized.slice("urn:uuid:".length).trim()
  }

  return normalized
}

function hyphenateUuid(compact: string) {
  return [
    compact.slice(0, 8),
    compact.slice(8, 12),
    compact.slice(12, 16),
    compact.slice(16, 20),
    compact.slice(20),
  ].join("-")
}

function compactUuid(uuid: string) {
  return uuid.replaceAll("-", "")
}

function parseUuid(value: string, version: UuidVersion): UuidParseResult {
  const decorated = stripUuidDecorators(value)

  if (decorated.length === 0) {
    return { kind: "invalid", error: "empty" }
  }

  const lowerValue = decorated.toLowerCase()
  const compact = UUID_COMPACT_PATTERN.test(lowerValue)
    ? lowerValue
    : UUID_CANONICAL_PATTERN.test(lowerValue)
      ? compactUuid(lowerValue)
      : null

  if (compact === null) {
    return { kind: "invalid", error: "format" }
  }

  const expectedVersion = version === "v1" ? "1" : "6"

  if (compact[12] !== expectedVersion) {
    return { kind: "invalid", error: "version" }
  }

  if (!UUID_VARIANT_PATTERN.test(compact[16]!)) {
    return { kind: "invalid", error: "variant" }
  }

  return {
    compact,
    kind: "valid",
    uuid: hyphenateUuid(compact),
  }
}

function convertV1CompactToV6(compact: string) {
  const timeLow = compact.slice(0, 8)
  const timeMid = compact.slice(8, 12)
  const timeHigh = compact.slice(13, 16)
  const timestamp = `${timeHigh}${timeMid}${timeLow}`
  const reordered = `${timestamp.slice(0, 12)}6${timestamp.slice(12)}`

  return hyphenateUuid(`${reordered}${compact.slice(16)}`)
}

function convertV6CompactToV1(compact: string) {
  const timestamp = `${compact.slice(0, 12)}${compact.slice(13, 16)}`
  const reordered = `${timestamp.slice(7)}${timestamp.slice(
    3,
    7
  )}1${timestamp.slice(0, 3)}`

  return hyphenateUuid(`${reordered}${compact.slice(16)}`)
}

function convertUuid(
  direction: UuidConversionDirection,
  value: string
): UuidConversionResult {
  const sourceVersion = direction === "v1-to-v6" ? "v1" : "v6"
  const parsed = parseUuid(value, sourceVersion)

  if (parsed.kind === "invalid") {
    return parsed.error === "empty"
      ? { kind: "empty" }
      : { kind: "invalid", error: parsed.error }
  }

  return {
    input: parsed.uuid,
    kind: "valid",
    output:
      direction === "v1-to-v6"
        ? convertV1CompactToV6(parsed.compact)
        : convertV6CompactToV1(parsed.compact),
  }
}

export { convertUuid, parseUuid }
export type { UuidConversionResult, UuidParseError }
