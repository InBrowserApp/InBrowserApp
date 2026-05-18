type UuidKind = "standard" | "nil" | "max"
type UuidVariant = "ncs" | "rfc4122" | "microsoft" | "future"
type UuidValidationReason = "empty" | "format" | "version" | "variant" | "valid"

type UuidSegments = Readonly<{
  timeLow: string
  timeMid: string
  timeHighAndVersion: string
  clockSequence: string
  node: string
}>

type UuidValidationResult = Readonly<{
  raw: string
  trimmed: string
  normalized: string
  hex: string
  isEmpty: boolean
  isCanonicalFormat: boolean
  isSupportedVersion: boolean
  isSupportedVariant: boolean
  isValid: boolean
  reason: UuidValidationReason
  kind: UuidKind | null
  version: number | null
  variant: UuidVariant | null
  byteLength: number | null
  segments: UuidSegments | null
}>

const NIL_UUID = "00000000-0000-0000-0000-000000000000"
const MAX_UUID = "ffffffff-ffff-ffff-ffff-ffffffffffff"
const UUID_CANONICAL_PATTERN =
  /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/iu
const MIN_SUPPORTED_VERSION = 1
const MAX_SUPPORTED_VERSION = 8

function classifyUuidVariant(firstClockSequenceNibble: string): UuidVariant {
  const nibble = Number.parseInt(firstClockSequenceNibble, 16)

  if ((nibble & 0b1000) === 0) {
    return "ncs"
  }

  if ((nibble & 0b1100) === 0b1000) {
    return "rfc4122"
  }

  if ((nibble & 0b1110) === 0b1100) {
    return "microsoft"
  }

  return "future"
}

function isSupportedUuidVersion(version: number | null) {
  return (
    version !== null &&
    version >= MIN_SUPPORTED_VERSION &&
    version <= MAX_SUPPORTED_VERSION
  )
}

function validateUuid(input: string): UuidValidationResult {
  const trimmed = input.trim()
  const isEmpty = trimmed.length === 0
  const match = UUID_CANONICAL_PATTERN.exec(trimmed)

  if (isEmpty || match === null) {
    return {
      raw: input,
      trimmed,
      normalized: "",
      hex: "",
      isEmpty,
      isCanonicalFormat: false,
      isSupportedVersion: false,
      isSupportedVariant: false,
      isValid: false,
      reason: isEmpty ? "empty" : "format",
      kind: null,
      version: null,
      variant: null,
      byteLength: null,
      segments: null,
    }
  }

  const segments = {
    timeLow: match[1]!.toLowerCase(),
    timeMid: match[2]!.toLowerCase(),
    timeHighAndVersion: match[3]!.toLowerCase(),
    clockSequence: match[4]!.toLowerCase(),
    node: match[5]!.toLowerCase(),
  } satisfies UuidSegments
  const normalized = [
    segments.timeLow,
    segments.timeMid,
    segments.timeHighAndVersion,
    segments.clockSequence,
    segments.node,
  ].join("-")
  const hex = normalized.replaceAll("-", "")
  const kind =
    normalized === NIL_UUID
      ? "nil"
      : normalized === MAX_UUID
        ? "max"
        : "standard"
  const version =
    kind === "standard"
      ? Number.parseInt(segments.timeHighAndVersion[0]!, 16)
      : null
  const variant =
    kind === "standard" ? classifyUuidVariant(segments.clockSequence[0]!) : null
  const isSupportedVersion =
    kind === "standard" ? isSupportedUuidVersion(version) : true
  const isSupportedVariant = kind === "standard" ? variant === "rfc4122" : true
  const isValid = isSupportedVersion && isSupportedVariant
  const reason: UuidValidationReason = isValid
    ? "valid"
    : !isSupportedVersion
      ? "version"
      : "variant"

  return {
    raw: input,
    trimmed,
    normalized,
    hex,
    isEmpty: false,
    isCanonicalFormat: true,
    isSupportedVersion,
    isSupportedVariant,
    isValid,
    reason,
    kind,
    version,
    variant,
    byteLength: 16,
    segments,
  }
}

export {
  MAX_UUID,
  NIL_UUID,
  classifyUuidVariant,
  validateUuid,
  type UuidValidationResult,
}
