const UUID_V6_MAX_COUNT = 100
const UUID_V6_MIN_COUNT = 1
const UUID_NODE_BYTE_LENGTH = 6
const UUID_BYTE_LENGTH = 16
const UUID_CLOCK_SEQUENCE_MAX = 0x3fff
const UUID_TIMESTAMP_MAX = (1n << 60n) - 1n
const GREGORIAN_UNIX_EPOCH_OFFSET_100NS = 122_192_928_000_000_000n
const UUID_V6_MIN_UNIX_MILLISECONDS = Number(
  -GREGORIAN_UNIX_EPOCH_OFFSET_100NS / 10_000n
)
const UUID_V6_MAX_UNIX_MILLISECONDS = Number(
  (UUID_TIMESTAMP_MAX - GREGORIAN_UNIX_EPOCH_OFFSET_100NS) / 10_000n
)

type UuidV6NodeMode = "random" | "custom"
type UuidV6ClockSequenceMode = "random" | "custom"

type GenerateUuidV6Options = Readonly<{
  unixMilliseconds: number
  subMillisecondTick?: number
  clockSequence: number
  node: Uint8Array
}>

type GenerateUuidV6BatchOptions = Readonly<{
  count: number
  unixMilliseconds: number
  nodeMode: UuidV6NodeMode
  customNode?: Uint8Array
  clockSequenceMode: UuidV6ClockSequenceMode
  customClockSequence?: number
}>

const HEX_BYTE = Array.from({ length: 256 }, (_, value) =>
  value.toString(16).padStart(2, "0")
)

function normalizeUuidV6Count(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return UUID_V6_MIN_COUNT
  }

  return Math.min(
    Math.max(Math.floor(value), UUID_V6_MIN_COUNT),
    UUID_V6_MAX_COUNT
  )
}

function isValidUuidV6UnixMilliseconds(unixMilliseconds: number) {
  if (!Number.isFinite(unixMilliseconds)) {
    return false
  }

  const floored = Math.floor(unixMilliseconds)

  return (
    floored >= UUID_V6_MIN_UNIX_MILLISECONDS &&
    floored <= UUID_V6_MAX_UNIX_MILLISECONDS
  )
}

function isValidUuidClockSequence(value: number) {
  return (
    Number.isInteger(value) && value >= 0 && value <= UUID_CLOCK_SEQUENCE_MAX
  )
}

function parseUuidNode(value: string) {
  const trimmed = value.trim()
  const normalized = trimmed.replace(/[:-]/gu, "").replace(/\./gu, "")
  const hasValidShape =
    /^[0-9a-f]{12}$/iu.test(trimmed) ||
    /^([0-9a-f]{2}[:-]){5}[0-9a-f]{2}$/iu.test(trimmed) ||
    /^[0-9a-f]{4}\.[0-9a-f]{4}\.[0-9a-f]{4}$/iu.test(trimmed)

  if (!hasValidShape || !/^[0-9a-f]{12}$/iu.test(normalized)) {
    throw new Error("Invalid UUID node ID.")
  }

  return Uint8Array.from({ length: UUID_NODE_BYTE_LENGTH }, (_, index) =>
    Number.parseInt(normalized.slice(index * 2, index * 2 + 2), 16)
  )
}

function formatUuidNode(node: Uint8Array) {
  if (node.length !== UUID_NODE_BYTE_LENGTH) {
    throw new Error("UUID node ID requires 6 bytes.")
  }

  return Array.from(node, (byte) => HEX_BYTE[byte]!.toUpperCase()).join(":")
}

function createRandomUuidNode() {
  const node = crypto.getRandomValues(new Uint8Array(UUID_NODE_BYTE_LENGTH))

  node[0] = (node[0]! & 0xfe) | 0x02

  return node
}

function createRandomUuidClockSequence() {
  const bytes = crypto.getRandomValues(new Uint8Array(2))

  return ((bytes[0]! << 8) | bytes[1]!) & UUID_CLOCK_SEQUENCE_MAX
}

function unixMillisecondsToUuidTimestamp(unixMilliseconds: number) {
  if (!isValidUuidV6UnixMilliseconds(unixMilliseconds)) {
    throw new RangeError("UUID v6 timestamp out of range.")
  }

  return (
    BigInt(Math.floor(unixMilliseconds)) * 10_000n +
    GREGORIAN_UNIX_EPOCH_OFFSET_100NS
  )
}

function bytesToUuid(bytes: Uint8Array) {
  if (bytes.length !== UUID_BYTE_LENGTH) {
    throw new Error("UUID requires 16 bytes.")
  }

  const hex = Array.from(bytes, (byte) => HEX_BYTE[byte]!).join("")

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
    12,
    16
  )}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function createUuidV6Bytes({
  unixMilliseconds,
  subMillisecondTick = 0,
  clockSequence,
  node,
}: GenerateUuidV6Options) {
  if (!Number.isInteger(subMillisecondTick) || subMillisecondTick < 0) {
    throw new RangeError("UUID v6 sub-millisecond tick must be positive.")
  }

  if (!isValidUuidClockSequence(clockSequence)) {
    throw new RangeError("UUID clock sequence out of range.")
  }

  if (node.length !== UUID_NODE_BYTE_LENGTH) {
    throw new Error("UUID node ID requires 6 bytes.")
  }

  const timestamp =
    unixMillisecondsToUuidTimestamp(unixMilliseconds) +
    BigInt(subMillisecondTick)

  if (timestamp > UUID_TIMESTAMP_MAX) {
    throw new RangeError("UUID v6 timestamp out of range.")
  }

  const timeHigh = Number((timestamp >> 28n) & 0xffff_ffffn)
  const timeMid = Number((timestamp >> 12n) & 0xffffn)
  const timeLow = Number(timestamp & 0xfffn)
  const bytes = new Uint8Array(UUID_BYTE_LENGTH)

  bytes[0] = (timeHigh >>> 24) & 0xff
  bytes[1] = (timeHigh >>> 16) & 0xff
  bytes[2] = (timeHigh >>> 8) & 0xff
  bytes[3] = timeHigh & 0xff
  bytes[4] = (timeMid >>> 8) & 0xff
  bytes[5] = timeMid & 0xff
  bytes[6] = 0x60 | ((timeLow >>> 8) & 0x0f)
  bytes[7] = timeLow & 0xff
  bytes[8] = 0x80 | ((clockSequence >>> 8) & 0x3f)
  bytes[9] = clockSequence & 0xff
  bytes.set(node, 10)

  return bytes
}

function generateUuidV6(options: GenerateUuidV6Options) {
  return bytesToUuid(createUuidV6Bytes(options))
}

function generateUuidV6Batch({
  count,
  unixMilliseconds,
  nodeMode,
  customNode,
  clockSequenceMode,
  customClockSequence,
}: GenerateUuidV6BatchOptions) {
  const normalizedCount = normalizeUuidV6Count(count)

  return Array.from({ length: normalizedCount }, (_, index) =>
    generateUuidV6({
      unixMilliseconds,
      subMillisecondTick: index,
      clockSequence:
        clockSequenceMode === "custom"
          ? (customClockSequence ?? 0)
          : createRandomUuidClockSequence(),
      node:
        nodeMode === "custom"
          ? (customNode ?? new Uint8Array(6))
          : createRandomUuidNode(),
    })
  )
}

export {
  UUID_CLOCK_SEQUENCE_MAX,
  UUID_V6_MAX_COUNT,
  UUID_V6_MAX_UNIX_MILLISECONDS,
  UUID_V6_MIN_UNIX_MILLISECONDS,
  bytesToUuid,
  createRandomUuidClockSequence,
  createRandomUuidNode,
  createUuidV6Bytes,
  formatUuidNode,
  generateUuidV6,
  generateUuidV6Batch,
  isValidUuidClockSequence,
  isValidUuidV6UnixMilliseconds,
  normalizeUuidV6Count,
  parseUuidNode,
  unixMillisecondsToUuidTimestamp,
}
export type { UuidV6ClockSequenceMode, UuidV6NodeMode }
